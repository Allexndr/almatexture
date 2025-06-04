import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MountainSvg from '../components/svg/MountainSvg';

const About = () => {
  const navigation = [
    { name: 'Галерея', href: '/gallery' },
    { name: 'Коллекция', href: '/collection' },
    { name: 'Районы', href: '/districts' },
    { name: 'Магазин', href: '/shop' },
    { name: 'О проекте', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];
  
  const teamMembers = [
    {
      name: 'Александр Ким',
      role: 'Основатель проекта',
      bio: 'Архитектор и дизайнер, увлечённый текстурами и материалами городской среды Алматы.',
      imgSrc: '/images/team/founder.jpg'
    },
    {
      name: 'Мария Иванова',
      role: 'Арт-директор',
      bio: 'Специалист по визуальным коммуникациям с опытом работы в ведущих креативных агентствах Казахстана.',
      imgSrc: '/images/team/art-director.jpg'
    },
    {
      name: 'Азамат Нурланов',
      role: 'Координатор проекта',
      bio: 'Исследователь городской среды, эксперт по районам Алматы и их культурному наследию.',
      imgSrc: '/images/team/coordinator.jpg'
    }
  ];
  
  const partners = [
    { name: 'Культурный центр "Арман"', logo: '/images/partners/partner1.jpg' },
    { name: 'Алматы Креатив', logo: '/images/partners/partner2.jpg' },
    { name: 'Музей города Алматы', logo: '/images/partners/partner3.jpg' },
    { name: 'Центр урбанистики', logo: '/images/partners/partner4.jpg' }
  ];

  const fallbackImage = "/pictures/almaty_wibe.jpg";
  
  return (
    <div className="about-page" style={{
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.98))',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Фоновое изображение гор Алматы с эффектом "мыла" */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: `url('/pictures/almaty_mountains.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
          opacity: 0.15
        }} />
      </div>
      
      {/* Фоновое SVG изображение гор */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.08,
        overflow: 'hidden'
      }}>
        <MountainSvg width="100%" height="100%" />
      </div>
      
      <Head>
        <title>О проекте | AlmaTexture</title>
        <meta name="description" content="Узнайте больше о проекте AlmaTexture - исследовании городских текстур Алматы, их цифровизации и воплощении в уникальных предметах." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Хедер */}
      <Header />
      
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">О проекте AlmaTexture</h1>
        
        {/* Основное описание проекта */}
        <section className="about-section" style={{ 
          background: 'white',
          borderRadius: '1rem',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '2rem',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>AlmaTexture</span> - это уникальный проект, 
                который исследует и документирует городские текстуры Алматы, превращая их в цифровые 
                арт-объекты и предметы повседневного использования. Наша цель - показать красоту и 
                уникальность города через его материальные поверхности, которые отражают его историю, 
                культуру и повседневную жизнь.
              </p>
              
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-color)' }}>
                Проект был основан в 2023 году группой энтузиастов, увлеченных городским дизайном, 
                архитектурой и культурным наследием Алматы. Мы верим, что каждый район, каждая улица 
                и каждый исторический объект имеет свой уникальный характер, который можно передать 
                через текстуры.
              </p>
            </div>
            
            <div style={{ width: '100%', maxWidth: '900px', height: '400px', position: 'relative', margin: '1rem 0' }}>
              <img 
                src="/pictures/almaty_wibe.jpg" 
                alt="Проект AlmaTexture" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '2rem 1.5rem 1.5rem',
                color: 'white',
                borderRadius: '0 0 0.75rem 0.75rem',
                textAlign: 'left'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem' }}>Миссия проекта AlmaTexture</h3>
                <p style={{ margin: 0, opacity: 0.9, maxWidth: '80%' }}>
                  Исследовать, сохранять и передавать уникальные текстуры города через искусство и дизайн
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Процесс работы с дополнительными пунктами */}
        <section className="process-section" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Как мы работаем</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem'
          }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                1
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Исследование</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                Наша команда исследует различные районы Алматы, фотографируя и документируя интересные 
                текстуры - от исторической брусчатки до современных архитектурных поверхностей. 
                Каждая текстура связана с конкретным местом и имеет свои GPS-координаты.
              </p>
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                2
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Оцифровка</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                С помощью специального оборудования и программного обеспечения мы преобразуем физические 
                текстуры в высококачественные цифровые модели с сохранением всех деталей, включая 
                цвет, рельеф и фактуру материала.
              </p>
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                3
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Креативное применение</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                На основе собранных текстур мы создаем уникальные дизайнерские предметы - футболки, 
                постеры, сувениры и элементы декора, которые позволяют людям носить и использовать 
                частицу Алматы в повседневной жизни.
              </p>
            </div>
          </div>
        </section>
        
        {/* Наши партнеры - изменено на приглашение к сотрудничеству */}
        <section className="partners-section" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Наши партнеры</h2>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            padding: '2.5rem', 
            boxShadow: 'var(--shadow)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Станьте нашим партнером</h3>
            
            <p style={{ color: 'var(--text-color)', maxWidth: '700px', margin: '0 auto 1.5rem', fontSize: '1.1rem' }}>
              В настоящее время мы активно ищем новых партнеров и спонсоров для развития проекта. 
              Если вы заинтересованы в сотрудничестве с AlmaTexture, пожалуйста, свяжитесь с нами.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ 
                background: 'var(--bg-light)', 
                padding: '1.25rem', 
                borderRadius: '0.75rem',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                  <i className="fas fa-envelope"></i>
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>Email</h4>
                <p style={{ opacity: 0.8 }}>almatexture@yandex.kz</p>
              </div>
              
              <div style={{ 
                background: 'var(--bg-light)', 
                padding: '1.25rem', 
                borderRadius: '0.75rem',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                  <i className="fas fa-phone-alt"></i>
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>Телефон</h4>
                <p style={{ opacity: 0.8 }}>+7 (727) 123-45-67</p>
              </div>
              
              <div style={{ 
                background: 'var(--bg-light)', 
                padding: '1.25rem', 
                borderRadius: '0.75rem',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                  <i className="fab fa-instagram"></i>
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>Instagram</h4>
                <p style={{ opacity: 0.8 }}>@almatexture</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Участие в проекте */}
        <section className="join-section" style={{ 
          background: 'white',
          borderRadius: '1rem',
          padding: '3rem 2rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow)',
          textAlign: 'center'
        }}>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Присоединяйтесь к нам</h2>
          
          <p style={{ maxWidth: '800px', margin: '0 auto 2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            У вас есть интересные текстуры Алматы? Или вы знаете места с уникальными поверхностями? 
            Поделитесь ими с нами! Мы всегда ищем новые текстуры и истории для нашей коллекции.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contacts" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Связаться с нами
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </Link>
            <Link href="/gallery" className="btn btn-secondary" style={{ display: 'inline-flex' }}>
              Изучить галерею
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </section>
      </div>
      
      {/* Футер */}
      <Footer />
    </div>
  );
};

export default About; 