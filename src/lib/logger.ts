import * as Sentry from '@sentry/nextjs';

// Типы уровней логирования
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Интерфейс для дополнительного контекста лога
interface LogContext {
  [key: string]: any;
}

class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  // Форматирование сообщения лога в JSON
  private formatLogMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...context
    };
    
    return JSON.stringify(logData);
  }

  // Добавление контекста в Sentry
  private addSentryContext(context?: LogContext): void {
    if (!context) return;

    Object.entries(context).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Sentry.setContext(key, value);
      } else {
        Sentry.setTag(key, String(value));
      }
    });
  }

  // Базовый метод логирования
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const formattedMessage = this.formatLogMessage(level, message, context);
    
    // В production выводим только info и выше
    if (process.env.NODE_ENV === 'development' || level !== 'debug') {
      switch (level) {
        case 'debug':
          console.debug(formattedMessage);
          break;
        case 'info':
          console.info(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'error':
        case 'fatal':
          console.error(formattedMessage);
          
          // Для ошибок и фатальных ошибок отправляем в Sentry
          if (context?.error instanceof Error) {
            this.addSentryContext(context);
            Sentry.captureException(context.error);
          } else if (level === 'fatal') {
            this.addSentryContext(context);
            Sentry.captureMessage(message, 'fatal');
          } else {
            this.addSentryContext(context);
            Sentry.captureMessage(message, 'error');
          }
          break;
      }
    }
  }

  // Публичные методы для разных уровней логирования
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, { ...context, error });
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    this.log('fatal', message, { ...context, error });
  }

  // Отслеживание производительности с помощью Sentry
  startTransaction(name: string, op: string): Sentry.Transaction {
    const transaction = Sentry.startTransaction({
      name,
      op,
    });
    
    Sentry.configureScope(scope => {
      scope.setSpan(transaction);
    });
    
    return transaction;
  }
}

// Основной логгер приложения
export const appLogger = new Logger('textures-almaty-app');

// Логгер для API
export const apiLogger = new Logger('textures-almaty-api');

// Логгер для базы данных
export const dbLogger = new Logger('textures-almaty-db');

// Функция создания логгера с указанным именем
export function createLogger(serviceName: string): Logger {
  return new Logger(serviceName);
}

export default Logger; 