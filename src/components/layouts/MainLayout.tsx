import { ReactNode } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-1 w-full pt-16">
        <div className="relative">
          {/* Фоновый градиент */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/40" />
          
          {/* Основной контент */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 