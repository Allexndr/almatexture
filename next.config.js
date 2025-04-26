/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
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
  webpack: (config) => {
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
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions); 