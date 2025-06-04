import '../styles/globals.css';
import '../styles/advanced.css';
import '../styles/advanced-demo.css';
import type { AppProps } from 'next/app';
import { Inter, Montserrat } from 'next/font/google';
import '../styles/custom.css';
import { CartProvider } from '../contexts/CartContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';

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
          args[0].includes('Warning: Hydration failed because')
        )
      ) {
        return;
      }
      originalConsoleError(...args);
    };

    // Initialize bootstrap JS properly
    const importBootstrap = async () => {
      try {
        // Force load the Bootstrap JS bundle
        const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        console.log('Bootstrap JS initialized successfully');
        
        // Make it available globally for any component that needs it
        if (typeof window !== 'undefined') {
          window.bootstrap = bootstrap;
        }
      } catch (err) {
        console.error('Failed to load Bootstrap JS:', err);
      }
    };
    
    importBootstrap();
    
    // Ensure products.json file exists
    fetch('/api/ensure-products-json')
      .then(res => res.json())
      .then(data => {
        console.log('Products initialization status:', data);
      })
      .catch(err => {
        console.error('Failed to initialize products:', err);
      });

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
      <CartProvider>
        <div className={`${inter.className} ${montserrat.className}`}>
          <Component {...pageProps} />
        </div>
      </CartProvider>
      </ThemeProvider>
    </Provider>
  );
} 