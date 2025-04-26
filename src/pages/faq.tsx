import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MountainSvg from '../components/svg/MountainSvg';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FAQ = () => {
  // Состояние для текущей активной категории FAQ
  const [activeCategory, setActiveCategory] = useState('general');
  
  const navigation = [
    { name: 'Галерея', href: '/gallery' },
    { name: 'Коллекция', href: '/collection' },
    { name: 'Районы', href: '/districts' },
    { name: 'Магазин', href: '/shop' },
    { name: 'О проекте', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
    { name: 'FAQ', href: '/faq' },
  ];
  
  const faqCategories = [
    { id: 'general', name: 'Общие вопросы' },
    { id: 'shop', name: 'Покупки и заказы' },
    { id: 'delivery', name: 'Доставка' },
    { id: 'textures', name: 'О текстурах' },
    { id: 'contribution', name: 'Сотрудничество' }
  ];
  
  const faqItems = {
    general: [
      {
        question: 'Что такое AlmaTexture?',
        answer: 'AlmaTexture — это проект, который исследует и документирует уникальные городские текстуры Алматы, превращая их в цифровые арт-объекты и различные предметы (футболки, постеры, аксессуары и т.д.). Каждая текстура рассказывает свою историю, и мы хотим поделиться этими историями с вами.'
      },
      {
        question: 'Кто стоит за проектом?',
        answer: 'Проект был основан в 2023 году группой энтузиастов, увлеченных городским дизайном, архитектурой и культурным наследием Алматы. Наша команда включает дизайнеров, архитекторов, фотографов и специалистов по цифровому моделированию.'
      },
      {
        question: 'Как связаться с вами?',
        answer: 'Вы можете связаться с нами по электронной почте almatexture@yandex.kz, по телефону +7 (700) 257-90-04 или через форму обратной связи на странице "Контакты".'
      },
      {
        question: 'Есть ли у вас физический магазин или шоурум?',
        answer: 'В настоящее время у нас нет физического магазина или шоурума. Все товары доступны для заказа онлайн на нашем сайте. Следите за новостями, возможно, в будущем мы откроем офлайн-точку.'
      }
    ],
    shop: [
      {
        question: 'Как сделать заказ на сайте?',
        answer: 'Чтобы сделать заказ, выберите интересующий вас товар в разделе "Коллекция" или создайте свой дизайн в разделе "Магазин". Добавьте товар в корзину, заполните необходимую информацию для доставки и оплаты, подтвердите заказ.'
      },
      {
        question: 'Какие способы оплаты вы принимаете?',
        answer: 'Мы принимаем оплату банковскими картами (Visa, MasterCard, American Express), через электронные кошельки (PayPal, WebMoney, QIWI), банковским переводом, а также наличными при получении (только для Алматы).'
      },
      {
        question: 'Можно ли вернуть или обменять товар?',
        answer: 'Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в использовании и сохранил товарный вид. Для обмена или возврата обратитесь к нам по электронной почте almatexture@yandex.kz или по телефону +7 (700) 257-90-04.'
      },
      {
        question: 'Как создать футболку со своим дизайном?',
        answer: 'В разделе "Магазин" вы можете воспользоваться нашим онлайн-конструктором. Загрузите свою текстуру или выберите из нашей коллекции, укажите координаты (при желании), выберите цвет и размер футболки, разместите изображение. После этого оформите заказ, и мы изготовим вашу уникальную футболку.'
      },
      {
        question: 'Сколько времени занимает изготовление индивидуального заказа?',
        answer: 'Стандартное время изготовления индивидуального заказа составляет 3-5 рабочих дней. В периоды повышенного спроса время изготовления может увеличиться до 7-10 рабочих дней.'
      }
    ],
    delivery: [
      {
        question: 'Сколько стоит доставка?',
        answer: 'Доставка по Алматы — бесплатно при заказе от 10 000 ₸. Доставка по Казахстану — от 1000 ₸ в зависимости от региона. Международная доставка — от 3000 ₸ в зависимости от страны.'
      },
      {
        question: 'Как долго идет доставка?',
        answer: 'Доставка по Алматы — 1-2 рабочих дня. Доставка по Казахстану — 3-7 рабочих дней. Международная доставка — 7-21 рабочий день в зависимости от страны.'
      },
      {
        question: 'Какие способы доставки вы предлагаете?',
        answer: 'По Алматы мы доставляем собственной курьерской службой или через курьерские службы-партнеры. По Казахстану — Казпочтой или курьерскими службами. Международная доставка осуществляется через DHL, FedEx или национальные почтовые службы.'
      },
      {
        question: 'Можно ли отслеживать заказ?',
        answer: 'Да, после оформления заказа вы получите трек-номер, по которому можно отслеживать статус доставки на сайте соответствующей службы доставки или в личном кабинете на нашем сайте.'
      }
    ],
    textures: [
      {
        question: 'Как вы создаете текстуры?',
        answer: 'Мы используем специальное оборудование для 3D-сканирования поверхностей с высоким разрешением. Затем текстуры обрабатываются и оптимизируются нашими дизайнерами для различных применений. Каждая текстура географически привязана к конкретному месту в Алматы.'
      },
      {
        question: 'Все ли текстуры реально существуют в Алматы?',
        answer: 'Да, все наши текстуры — это реальные поверхности, которые можно найти в Алматы. Каждая текстура имеет свои GPS-координаты, и вы можете посетить место, где она была отсканирована.'
      },
      {
        question: 'Можно ли предложить свою текстуру для проекта?',
        answer: 'Конечно! Мы всегда ищем интересные текстуры для нашей коллекции. Если вы нашли интересную поверхность в Алматы, сфотографируйте ее, запишите GPS-координаты и отправьте нам через форму на странице контактов или по электронной почте almatexture@yandex.kz.'
      },
      {
        question: 'Как выбираются места для сканирования текстур?',
        answer: 'Мы выбираем места, которые имеют культурное, историческое или архитектурное значение для города. Также мы ищем необычные и интересные поверхности, которые характерны для определенных районов или эпох развития Алматы.'
      }
    ],
    contribution: [
      {
        question: 'Как я могу присоединиться к команде проекта?',
        answer: 'Мы всегда ищем талантливых людей, увлеченных Алматы и его текстурами. Если вы дизайнер, фотограф, архитектор, историк или просто любите свой город, напишите нам на almatexture@yandex.kz (с пометкой \'Работа\') с рассказом о себе и своей мотивации.'
      },
      {
        question: 'Возможно ли сотрудничество с другими брендами или организациями?',
        answer: 'Да, мы открыты для сотрудничества с брендами, организациями, музеями и образовательными учреждениями. Мы можем создать специальную коллекцию текстур или продуктов для вашего бренда или мероприятия. Для обсуждения деталей напишите нам на almatexture@yandex.kz (с пометкой \'Сотрудничество\').'
      },
      {
        question: 'Проводите ли вы экскурсии или мастер-классы?',
        answer: 'Да, мы регулярно проводим пешеходные экскурсии по местам с интересными текстурами, а также мастер-классы по 3D-сканированию и дизайну. Информация о ближайших мероприятиях публикуется на нашем сайте и в социальных сетях.'
      },
      {
        question: 'Можно ли использовать ваши текстуры в своих проектах?',
        answer: 'Наши текстуры защищены авторским правом, но мы предлагаем лицензии для коммерческого и некоммерческого использования. Для образовательных и исследовательских проектов мы можем предоставить текстуры бесплатно. Для обсуждения условий напишите нам на almatexture@yandex.kz (с пометкой \'Лицензия\').'
      }
    ]
  };
  
  // Получение текущих категорий для отображения
  const currentFaqItems = faqItems[activeCategory as keyof typeof faqItems];
  
  return (
    <div style={{ position: 'relative' }}>
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
        <title>Часто задаваемые вопросы | AlmaTexture</title>
        <meta name="description" content="Ответы на часто задаваемые вопросы о проекте AlmaTexture, наших продуктах, доставке и многом другом." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Хедер */}
      <Header />
      
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">Часто задаваемые вопросы</h1>
        
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
            Здесь вы найдете ответы на самые распространенные вопросы о нашем проекте, 
            процессе заказа, доставке и текстурах.
          </p>
        </div>
        
        {/* Навигация по категориям FAQ */}
        <div className="faq-categories" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap'
        }}>
          {faqCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeCategory === category.id ? 'var(--primary-color)' : 'white',
                color: activeCategory === category.id ? 'white' : 'var(--text-color)',
                border: '1px solid',
                borderColor: activeCategory === category.id ? 'var(--primary-color)' : '#ddd',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontWeight: activeCategory === category.id ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Список вопросов и ответов */}
        <div className="faq-list" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {currentFaqItems.map((item, index) => (
            <div 
              key={index} 
              className="faq-item"
              style={{ 
                background: 'white',
                borderRadius: '1rem',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow)',
                overflow: 'hidden'
              }}
            >
              <details style={{ width: '100%' }}>
                <summary style={{ 
                  padding: '1.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  listStyle: 'none'
                }}>
                  {item.question}
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ transition: 'transform 0.3s ease' }}
                    className="faq-icon"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div style={{ 
                  padding: '0 1.5rem 1.5rem 1.5rem',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  <p>{item.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
        
        {/* Дополнительный вопрос */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem',
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: 'var(--shadow)',
          maxWidth: '900px',
          margin: '3rem auto 0'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Не нашли ответ на свой вопрос?</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Свяжитесь с нами любым удобным способом, и мы с радостью ответим на все ваши вопросы.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contacts" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Написать нам
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </Link>
            <a 
              href="tel:+77002579004" 
              className="btn btn-secondary"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'white',
                color: 'var(--primary-color)',
                border: '1px solid var(--primary-color)',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
            >
              Позвонить
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Стили для деталей FAQ */}
        <style jsx>{`
          details summary::-webkit-details-marker {
            display: none;
          }
          
          details[open] summary .faq-icon {
            transform: rotate(180deg);
          }
          
          details summary {
            transition: background-color 0.3s ease;
          }
          
          details summary:hover {
            background-color: rgba(52, 152, 219, 0.05);
          }
        `}</style>
      </div>
      
      {/* Футер */}
      <Footer />
    </div>
  );
};

export default FAQ; 