/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  
  // Отключаем строгие проверки для продакшен сборки
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  experimental: {
    instrumentationHook: true,
  },
  
  images: {
    // Включаем WebP и AVIF форматы для оптимизации загрузки изображений
    formats: ['image/webp', 'image/avif'],
    // Добавляем домены, с которых можно загружать изображения
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
    // Настраиваем кэширование изображений
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 неделя
    // Качество устанавливается через loader параметры,
    // а не напрямую в настройках images
    domains: [
      'res.cloudinary.com',
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dm9fwh2oq/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  
  // Конфигурация для работы с MongoDB и внешними API
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  
  // Настройки для оптимизации
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },

  // Настраиваем HTTP заголовки
  async headers() {
    return [
      {
        // Применяем ко всем путям
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Настраиваем кэширование для статических ресурсов
        source: '/(images|textures)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Настраиваем кэширование для шрифтов
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Игнорируем определенные модули при сборке
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });
    return config;
  },
};

// Добавляем конфигурацию Sentry
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses source map upload logs during build
  org: "personal-jkz",
  project: "javascript-nextjs",
};

const sentryOptions = {
  // Для других настроек Sentry см. https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions); 