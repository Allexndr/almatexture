// Этот файл используется для инициализации Sentry на клиенте
// Подробнее: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from '@sentry/nextjs';

// Получаем DSN из переменных окружения или используем заглушку
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://your-sentry-dsn.ingest.sentry.io/project';

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Настраиваем частоту сбора данных о производительности
  tracesSampleRate: 1.0,
  
  // Включаем отладку в режиме разработки
  debug: process.env.NODE_ENV === 'development',
  
  // Среда для группировки событий
  environment: process.env.NODE_ENV,
  
  // Отправляем имя и версию приложения
  release: process.env.npm_package_name + '@' + process.env.npm_package_version,
  
  beforeBreadcrumb(breadcrumb) {
    // Пропускаем лишние breadcrumbs для меньшего шума
    if (breadcrumb.category === 'console' && breadcrumb.level === 'info') {
      return null;
    }
    return breadcrumb;
  },
  
  // Увеличиваем частоту сбора данных о воспроизведении сессии при ошибках
  replaysOnErrorSampleRate: 1.0
}); 