import { PrismaClient } from '../../prisma/generated/client'
import * as Sentry from '@sentry/nextjs'

// Настройки пула соединений
const prismaClientOptions = {
  // Добавляем логирование запросов в режиме разработки
  log: process.env.NODE_ENV === 'development' 
    ? [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ]
    : ['error', 'warn'],
  // Настройки пула соединений для более эффективного использования ресурсов
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}

const prismaClientSingleton = () => {
  const prisma = new PrismaClient(prismaClientOptions);
  
  // Настройка хуков для логирования и мониторинга в Sentry
  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
      console.debug('Prisma Query', {
        query: e.query,
        params: e.params,
        duration: e.duration,
        timestamp: e.timestamp,
      });
    });
  }
  
  // Логирование ошибок
  prisma.$on('error', (e) => {
    console.error('Prisma Error', e);
    
    // Отправка ошибки в Sentry
    Sentry.captureException(e);
  });
  
  // Логирование предупреждений
  prisma.$on('warn', (e) => {
    console.warn('Prisma Warning', {
      message: e.message,
      timestamp: new Date().toISOString(),
    });
  });
  
  return prisma;
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Функция для отказоустойчивого выполнения запросов с повторными попытками
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  retryDelay = 500
): Promise<T> {
  let lastError: any;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Проверяем, является ли ошибка временной
      const isTransientError = 
        error.code === 'P1008' || // Временная ошибка операции
        error.code === 'P1001' || // Ошибка подключения к БД
        error.code === 'P1002';   // Таймаут запроса
      
      if (!isTransientError) {
        throw error; // Для постоянных ошибок не делаем повторных попыток
      }
      
      retryCount++;
      console.warn(`Prisma query failed (attempt ${retryCount}/${maxRetries})`, {
        error: error.message,
        code: error.code,
        retry: retryCount,
      });
      
      // Экспоненциальная задержка перед повторной попыткой
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retryCount - 1)));
    }
  }
  
  // Логируем окончательную ошибку после всех попыток
  console.error(`Prisma query failed after ${maxRetries} retries`, lastError);
  throw lastError;
}

// Создаем экземпляр Prisma или используем существующий
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Добавляем функцию для выполнения запросов с повторными попытками
export const resilientPrisma = {
  ...prisma,
  // Функция обертка для выполнения запросов с повторными попытками
  withRetry: async <T>(fn: () => Promise<T>): Promise<T> => {
    return withRetry(fn);
  }
};

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 