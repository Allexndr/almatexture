// Этот файл используется для инициализации Sentry на сервере
// Подробнее: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const SENTRY_DSN = process.env.SENTRY_DSN || 'https://your-sentry-dsn.ingest.sentry.io/project';

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
    });
  }
} 