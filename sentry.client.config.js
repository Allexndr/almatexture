// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || 'https://your-sentry-dsn.ingest.sentry.io/project';

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',
  
  // The environment used for grouping events
  environment: process.env.NODE_ENV,
  
  // Send the name and version of your application
  release: process.env.npm_package_name + '@' + process.env.npm_package_version,
  
  beforeBreadcrumb(breadcrumb) {
    // Пропускаем лишние breadcrumbs для меньшего шума
    if (breadcrumb.category === 'console' && breadcrumb.level === 'info') {
      return null;
    }
    return breadcrumb;
  },
  
  beforeSend(event) {
    // Игнорируем ошибки hydration, связанные с несоответствием контента
    const hydrationErrors = [
      'Warning: Text content did not match',
      'Warning: Expected server HTML to contain a matching',
      'Hydration failed because the initial UI does not match'
    ];
    
    // Проверка на наличие ошибок hydration в сообщении
    if (event.exception && event.exception.values) {
      const isHydrationError = event.exception.values.some(exception => 
        hydrationErrors.some(errorMsg => 
          exception.value && exception.value.includes(errorMsg)
        )
      );
      
      if (isHydrationError) {
        return null; // Не отправлять ошибку в Sentry
      }
    }
    
    return event;
  },
  
  replaysOnErrorSampleRate: 1.0
}); 