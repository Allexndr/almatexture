import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter, Montserrat } from 'next/font/google';
import '../styles/custom.css';
import { CartProvider } from '../contexts/CartContext';
import { useEffect } from 'react';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  // Подавление ошибок гидратации в режиме разработки
  useEffect(() => {
    // Эта функция будет вызвана только на клиентской стороне после первого рендера
    // Основная цель - скрыть ошибки гидратации в режиме разработки
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' && (
          args[0].includes('Warning: Text content did not match') ||
          args[0].includes('Warning: Expected server HTML to contain a matching') ||
          args[0].includes('Hydration failed because')
        )
      ) {
        return;
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <CartProvider>
      <div className={`${inter.className} ${montserrat.className}`}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  );
} 