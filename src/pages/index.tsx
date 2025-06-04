import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MapViewer from '../components/MapViewer';
import DistrictMap from '../components/DistrictMap';
import MountainSvg from '../components/svg/MountainSvg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x300/f0f0f0/999999?text=Текстура+не+найдена';

export default function Home() {
  const [randomQuote, setRandomQuote] = useState<number>(0);
  const { theme } = useTheme();
  
  const almatyQuotes = [
    { text: "Алматы заключает в себе совершенно разные миры. Приехать в другой район - все равно что приехать в другой город. Разное в этих мирах абсолютно все - архитектура, запах воздуха, лица людей, речь, мода.", author: "Юлия Колмогорова, дизайнер" },
    { text: "Атмосферу создают горы, видимые из любой точки города, каждый день разные. Любое место на улице сопровождается этими сумасшедше прекрасными изменчивыми каждую минуту декорациями.", author: "Юлия Колмогорова, дизайнер" },
    { text: "Алматинский вайб для меня - это забитые летники по Панфилова и Калинина, блогеры, снимающие контент в 'Есентае', 'спортики', с раннего утра спешащие на Медео и Горельник.", author: "Айгерим Кайназарова, редактор" },
    { text: "Это город-сад, город-любовь. Мне нравится, что Алматы такой разный, поездка в другой район - все равно, что поездка в другой город.", author: "Гульнар Рахимжанова, врач" },
    { text: "Особую атмосферу Алматы создают люди - открытые, яркие, теплые. В других городах невозможно сегодня познакомиться, а завтра уже вместе тусить.", author: "Асель Акопян, эксперт по коммуникациям" },
    { text: "Для меня алматинский вайб - это, конечно же, горы, полные людей летние террасы, гостеприимство и творческая атмосфера, которой буквально пропитана каждая улочка.", author: "Маржан Шарипова, стилист" },
    { text: "Алматинский вайб – ухоженные палисадники в микрорайонах, недовольные соседи на Фурманова, деловые фрилансеры на летниках, бесконечные фестивали и тусовки, город 'успешного успеха'.", author: "Екатерина Лейман, редактор" },
    { text: "В Алматы можно с утра подняться в горы, в обед вернуться к рабочим делам, а вечером отправиться на вечеринку, это и есть алматинский стиль жизни и тот самый вайб.", author: "Асель Акопян, эксперт по коммуникациям" }
  ];
  
  const parallaxRef = useRef<HTMLDivElement>(null);
  const mountainsRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLElement>(null);
  
  const router = useRouter();
  
  useEffect(() => {
    // Random quote on mount
    setRandomQuote(Math.floor(Math.random() * almatyQuotes.length));
  }, []);
  
  // Scroll to next section function
  const scrollToNextSection = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Обработка параллакс-эффекта
  useEffect(() => {
    const handleScroll = () => {
      if (mountainsRef.current && skylineRef.current) {
        const scrollY = window.scrollY;
        mountainsRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
        skylineRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Обработка движения мыши для эффекта движения фона
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (parallaxRef.current && mountainsRef.current && skylineRef.current) {
        const x = (window.innerWidth - e.pageX) / 100;
        const y = (window.innerHeight - e.pageY) / 100;
        
        mountainsRef.current.style.transform = `translateX(${x}px) translateY(${y}px)`;
        skylineRef.current.style.transform = `translateX(${x * 0.5}px) translateY(${y * 0.5}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navigation = [
    { name: 'Галерея', href: '/gallery' },
    { name: 'Коллекция', href: '/collection' },
    { name: 'Районы', href: '/districts' },
    { name: 'Магазин', href: '/shop' },
    { name: 'О проекте', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];

  const districts = [
    { 
      name: 'Медеуский', 
      description: 'Исторический центр и горные маршруты',
      features: ['Медео', 'Парк 28 панфиловцев', 'Зеленый базар']
    },
    { 
      name: 'Алмалинский', 
      description: 'Бизнес-район с творческой атмосферой',
      features: ['Улица Панфилова', 'Площадь Республики', 'Арбат']
    },
    { 
      name: 'Бостандыкский', 
      description: 'Современный центр деловой активности',
      features: ['Mega Center', 'Ботанический сад', 'Атакент']
    },
  ];

  const onError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = event.currentTarget;
    if (!imgElement) return; // Защита от null
    
    // Получим текущий URL изображения
    const currentSrc = imgElement.src;
    if (!currentSrc) {
      console.error('Current src is empty for image');
      imgElement.src = FALLBACK_IMAGE;
      return;
    }
    
    // Создадим альтернативные варианты URL
    const imgSrc = currentSrc;
    const fallbackOptions = [
      imgSrc.endsWith('.jpg') ? imgSrc.replace('.jpg', '.png') : imgSrc.replace('.png', '.jpg'),
      `https://source.unsplash.com/featured/?texture,city`,
      FALLBACK_IMAGE
    ];
    
    const currentIndex = fallbackOptions.indexOf(currentSrc);
    const nextFallback = currentIndex < fallbackOptions.length - 1 
      ? fallbackOptions[currentIndex + 1] 
      : FALLBACK_IMAGE;
    
    if (imgElement && imgElement.style) {
      try {
        // Set opacity to 0 first
        imgElement.style.opacity = '0';
        
        // Сохраняем ссылку на элемент перед таймаутом
        const imageElement = imgElement;
        
        // Change source
        imgElement.src = nextFallback;
        
        // Once loaded, fade back in
        imgElement.onload = () => {
          try {
            if (imageElement && imageElement.style) {
              imageElement.style.opacity = '1';
            }
          } catch (e) {
            console.error('Ошибка при изменении прозрачности после загрузки:', e);
          }
        };
      } catch (e) {
        console.error('Ошибка при обработке загрузки изображения:', e);
        // Last resort
        try {
          imgElement.src = FALLBACK_IMAGE;
        } catch (e) {
          console.error('Не удалось установить заглушку:', e);
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>AlmaTexture - погрузись в алматинский вайб</title>
        <meta
          name="description"
          content="Исследуйте уникальные городские текстуры Алматы с проектом AlmaTexture. Откройте для себя коллекции, созданные на основе реальных поверхностей города."
        />
        {/* Добавление иконки */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Хедер */}
      <Header />
      
      {/* Секция "Герой" с фотографией на фоне (день/ночь) */}
      <section className="hero" ref={parallaxRef} style={{
        backgroundImage: theme === 'dark' 
          ? 'url(/pictures/night_almaty.jpg)' 
          : 'url(/pictures/almaty_mountains.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        transition: 'background-image 0.8s ease'
      }}>
        {/* Затемнение для лучшей читаемости текста */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: theme === 'dark' 
            ? 'rgba(0, 0, 0, 0.4)' 
            : 'rgba(0, 0, 0, 0.4)',
          zIndex: 0
        }}></div>
        
        <div className="hero-bg">
          <div 
            ref={mountainsRef} 
            className="mountains-bg parallax-slow"
          >
            <MountainSvg width="100%" height="100%" />
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title" style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', position: 'relative' }}>
            AlmaTextur
            <span style={{ position: 'relative' }}>
              e
              <span className="apple-icon" style={{ 
                position: 'absolute', 
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-65%) translateY(-10px)',
                width: '3rem',
                height: '3rem',
                zIndex: 20
              }}>
                <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                  <path d="M350,350 Q270,450 190,350 Q110,250 190,150 Q270,50 350,150 Q430,250 350,350 Z" fill="#3498db" opacity="0.8"/>
                  <path d="M330,100 Q340,70 320,60 Q300,50 290,80 Z" fill="#3498db" opacity="0.8"/>
                </svg>
              </span>
            </span>
          </h1>
          <p className="hero-desc" style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Погрузись в алматинский вайб через уникальные текстуры города.
            Каждый район, каждая улочка и каждый уголок хранит свою историю и атмосферу.
          </p>
          <div className="btn-group" style={{ position: 'relative', zIndex: 10 }}>
            <Link href="/gallery" className="btn btn-primary" style={{ display: 'inline-flex', position: 'relative', zIndex: 5, minWidth: '200px' }}>
              Исследовать текстуры
            </Link>
            <Link href="/custom" className="btn btn-secondary" style={{ display: 'inline-flex', position: 'relative', zIndex: 5, minWidth: '200px' }}>
              Создать свою футболку
            </Link>
          </div>
        </div>

        <div className="bounce-slow" style={{ 
          zIndex: 10, 
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50px',
          height: '50px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }} 
        onClick={scrollToNextSection}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>
        
      {/* Секция "Что такое вайб" с второй фотографией на фоне */}
      <section className="section" ref={secondSectionRef} style={{
        backgroundImage: 'url(/pictures/almaty_mountains.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        padding: '7rem 0'
      }}>
        {/* Осветление для лучшей читаемости текста */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 0
        }}></div>
      
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title">Что такое AlmaTexture?</h2>
            
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <blockquote style={{ 
              fontSize: '1.25rem', 
              fontStyle: 'italic', 
              margin: '2rem 0',
              padding: '2rem',
              borderRadius: '1rem',
              backgroundColor: 'rgba(52, 152, 219, 0.05)',
              position: 'relative'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" style={{ position: 'absolute', top: '1rem', left: '1rem', opacity: 0.2 }}>
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" fill="#3498db"/>
              </svg>
              <p style={{ position: 'relative', zIndex: 1 }}>
                "{almatyQuotes[randomQuote].text}"
              </p>
              <footer style={{ marginTop: '1rem', fontWeight: 'bold', color: '#3498db' }}>
                - {almatyQuotes[randomQuote].author}
              </footer>
            </blockquote>
            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
              <a 
                href="https://tengrinews.kz/handsomely/osobaya-atmosfera-ili-vyidumki-chto-takoe-almatinskiy-vayb-503987/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                Цитаты из статьи Tengri Life «Особая атмосфера или выдумки? Что такое "алматинский вайб"»
              </a>
            </div>
          </div>

          <div className="features-grid" style={{ marginTop: '3rem' }}>
            {[
              {
                title: 'Горы и природа',
                description: 'Алматы окружен величественными горами, создающими неповторимый фон для городской жизни.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3L1 13 8 13 13 21 16 13 23 13z"></path>
                  </svg>
                ),
              },
              {
                title: 'Многообразие районов',
                description: 'Каждый район города имеет свой неповторимый характер и атмосферу, как будто это разные города.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect>
                    <rect x="3" y="16" width="7" height="5"></rect>
                  </svg>
                ),
              },
              {
                title: 'Городская культура',
                description: 'Уникальное сочетание истории и современности, традиций и инноваций в одном городе.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div key={index} className="feature-card scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
        
      {/* Секция "Районы Алматы" */}
      <section className="section" style={{ backgroundColor: 'rgba(52, 152, 219, 0.05)' }}>
        <div className="container">
          <h2 className="section-title">Районы города</h2>
            
          <div style={{ maxWidth: '900px', margin: '0 auto 2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              Алматы разделен на 8 административных районов, каждый со своим характером, атмосферой и достопримечательностями.
              Исследуйте районы и найдите свои любимые места.
            </p>
          </div>
            
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            padding: '2rem', 
            boxShadow: 'var(--shadow)', 
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: '150px', height: '150px', opacity: 0.05, zIndex: 0 }}>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" fill="#3498db" />
              </svg>
            </div>
            
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '200px', height: '200px', opacity: 0.05, zIndex: 0 }}>
              <svg viewBox="0 0 100 100">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="#2ecc71" />
              </svg>
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <style jsx>{`
                :global(.district-tooltip) {
                  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
                  transition-delay: 0.5s;
                  will-change: opacity, transform;
                  pointer-events: none;
                }
                
                :global(.district-path) {
                  transition: fill 0.6s ease-in-out;
                  transition-delay: 0.3s;
                }
              `}</style>
              <DistrictMap />
            </div>
          </div>
          
          <div className="features-grid" style={{ marginTop: '2rem' }}>
            {districts.map((district, index) => (
              <div key={district.name} className="feature-card">
                <h3 className="feature-title">{district.name} район</h3>
                <p className="feature-desc">{district.description}</p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                  {district.features.map((feature, featureIndex) => (
                    <li key={featureIndex} style={{ marginBottom: '0.5rem', color: 'var(--text-color)', opacity: 0.8 }}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/gallery" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Исследовать текстуры по районам
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Секция "Текстуры" */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Текстуры города</h2>
          
          <div className="gallery" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              { id: 1, name: 'Брусчатка на Арбате', desc: 'Исторический центр города', img: '/textures/texture1.jpg' },
              { id: 2, name: 'Стены Зеленого Базара', desc: 'Текстуры торговых рядов', img: '/textures/texture2.jpg' },
              { id: 3, name: 'Кора яблоневых садов', desc: 'Природная текстура городской среды', img: '/textures/texture3.jpg' },
              { id: 4, name: 'Мозаика на фасаде', desc: 'Советское архитектурное наследие', img: '/textures/texture4.jpg' },
              { id: 5, name: 'Горные породы Медео', desc: 'Текстуры горного ландшафта', img: '/textures/texture5.jpg' },
              { id: 6, name: 'Плитка на площади Республики', desc: 'Современная городская среда', img: '/textures/texture6.jpg' },
            ].map((item) => (
              <div key={item.id} className="gallery-item-container">
                <Link href={`/gallery/textures/${item.id}`} className="gallery-item-link">
                  <article className="gallery-item scale-in" style={{ 
                    animationDelay: `${(item.id - 1) * 0.1}s`,
                    background: 'white',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}>
                    <div style={{ position: 'relative', width: '100%', paddingTop: '70%' }}>
                      <img 
                        src={item.img} 
                        alt={item.name}
                        style={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'opacity 0.3s ease'
                        }}
                        loading="lazy" 
                        onError={onError}
                      />
                    </div>
                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h3>
                      <p style={{ 
                        margin: '0 0 0.5rem', 
                        fontSize: '0.85rem', 
                        opacity: 0.8, 
                        flex: 1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                      }}>{item.desc}</p>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem', position: 'relative', zIndex: 10 }}>
            <Link href="/gallery" className="btn btn-primary" style={{ display: 'inline-flex', position: 'relative', zIndex: 5 }}>
              Смотреть все текстуры
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Секция "О проекте" */}
      <section className="section" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="container">
          <h2 className="section-title">О проекте</h2>
          
          <div style={{ maxWidth: '800px', margin: '0 auto 3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              TexturesAlmaty - это проект, который исследует городские текстуры Алматы,
              превращая их в цифровые арт-объекты и предметы одежды.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                🔍
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Исследование</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                Мы исследуем город и находим уникальные текстуры, которые отражают его характер и историю.
                Каждая текстура связана с конкретным местом и имеет свои координаты.
              </p>
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                🖥️
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Цифровизация</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                С помощью современных технологий мы превращаем реальные текстуры в цифровые объекты,
                сохраняя их уникальность и детали.
              </p>
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                👕
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Воплощение</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                Мы создаем уникальные предметы одежды и аксессуары, которые позволяют
                носить частичку Алматы с собой, где бы вы ни находились.
              </p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/about" className="btn btn-secondary" style={{ display: 'inline-flex' }}>
              Узнать больше о проекте
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Футер */}
      <Footer />
    </>
  );
} 