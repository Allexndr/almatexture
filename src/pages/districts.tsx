import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DistrictMap from '../components/DistrictMap';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DistrictsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Head>
        <title>Районы Алматы | AlmaTexture</title>
        <meta name="description" content="Исследуйте различные районы Алматы и их уникальные текстуры." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />

      <main className="flex-grow">
        <section className="section" style={{ paddingTop: '8rem' }}>
          <div className="container">
            <h1 className="section-title">Интерактивная карта районов Алматы</h1>
            
            <div style={{ maxWidth: '800px', margin: '0 auto 3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                Изучите районы Алматы, наведите курсор или нажмите на район,
                чтобы узнать больше о его особенностях и инфраструктуре.
              </p>
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)',
              marginBottom: '3rem'
            }}>
              <DistrictMap className="districts-map" />
              
              <div style={{ 
                marginTop: '2rem', 
                padding: '1.5rem', 
                backgroundColor: 'rgba(52, 152, 219, 0.05)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(52, 152, 219, 0.2)'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                  Как пользоваться картой:
                </h3>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '0' }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <b>Наведите курсор</b> на район, чтобы увидеть краткую информацию
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <b>Нажмите на район</b>, чтобы открыть подробное описание, включающее характеристики, 
                    ключевые особенности, инфраструктуру и рекомендации
                  </li>
                </ul>
              </div>
            </div>
            
            <div style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                О районах Алматы
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Алматы - крупнейший город Казахстана, разделённый на 8 административных районов, каждый из 
                которых обладает уникальными особенностями, историей и инфраструктурой. От престижного Медеуского 
                района с горными склонами до промышленного Турксибского района - каждая часть города 
                имеет свой характер и предлагает разные условия для жизни.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Используйте интерактивную карту выше, чтобы изучить каждый район детально и найти тот, 
                который наилучшим образом соответствует вашим предпочтениям и образу жизни.
              </p>
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
                Изучайте текстуры города по районам
              </h3>
              <p style={{ maxWidth: '700px', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                Каждый район Алматы имеет свои уникальные архитектурные и природные текстуры. 
                Изучите нашу коллекцию текстур, отфильтрованную по районам города.
              </p>
              <Link 
                href="/gallery" 
                className="btn btn-primary"
                style={{ 
                  display: 'inline-block',
                  padding: '0.875rem 2rem',
                  borderRadius: '2rem',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(52, 152, 219, 0.25)'
                }}
              >
                Перейти в галерею текстур
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DistrictsPage; 