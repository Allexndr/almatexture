import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import SocialIcons from '../components/SocialIcons';
import Image from 'next/image';

const Social = () => {
  const [isClient, setIsClient] = useState(false);

  // Установка флага клиентского рендеринга после монтирования
  useEffect(() => {
    setIsClient(true);
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/almatexture',
      description: 'Делитесь своими находками и отмечайте нас.',
      iconPath: '/images/social/instagram.svg',
      color: '#E1306C'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/77012345678',
      description: 'Свяжитесь с нами напрямую по WhatsApp',
      iconPath: '/images/social/whatsapp.svg'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Социальные сети | Textures Almaty</title>
        <meta name="description" content="Присоединяйтесь к нам в социальных сетях и следите за новыми текстурами Алматы" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Наши социальные сети</h1>
        
        <div className="max-w-2xl mx-auto mb-6">
          <p className="text-gray-700 text-center mb-8">
            Следите за нами в социальных сетях, чтобы быть в курсе последних новостей, коллекций и событий.
            Делитесь своими находками с хэштегом #almatexture
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialLinks.map((social, index) => (
            <a 
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mr-4">
                {isClient && (
                  <Image 
                    src={social.iconPath}
                    alt={social.name}
                    width={40}
                    height={40}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/placeholder.png';
                    }}
                  />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{social.name}</h2>
                <p className="text-gray-600">{social.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Подпишитесь на нас</h2>
          <div className="flex justify-center">
            <SocialIcons size="large" color="#1f2937" bgColor="#f3f4f6" />
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} Textures Almaty. Все права защищены.</p>
          <div className="mt-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 mx-2">
              Главная
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-gray-900 mx-2">
              Галерея
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 mx-2">
              О проекте
            </Link>
            <Link href="/contacts" className="text-gray-600 hover:text-gray-900 mx-2">
              Контакты
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Social; 