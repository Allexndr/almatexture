import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MountainSvg from '../components/svg/MountainSvg';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contacts: React.FC = () => {
  // Состояния для формы
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Общие вопросы');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const navigation = [
    { name: 'Галерея', href: '/gallery' },
    { name: 'Коллекция', href: '/collection' },
    { name: 'Районы', href: '/districts' },
    { name: 'Магазин', href: '/shop' },
    { name: 'О проекте', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];
  
  const subjectOptions = [
    'Общие вопросы',
    'Сотрудничество',
    'Предложение текстуры',
    'Вопросы по заказу',
    'Техническая поддержка'
  ];
  
  const faqItems = [
    {
      question: 'Как я могу предложить свою текстуру для проекта?',
      answer: 'Вы можете отправить фотографию текстуры с указанием местоположения через форму на этой странице, выбрав тему "Предложение текстуры". Наша команда рассмотрит ваше предложение и свяжется с вами в случае заинтересованности.'
    },
    {
      question: 'Как долго изготавливается футболка с выбранной текстурой?',
      answer: 'Стандартное время изготовления футболки составляет 3-5 рабочих дней. Доставка по Алматы занимает 1-2 дня, доставка в другие города Казахстана – 3-7 дней в зависимости от удаленности.'
    },
    {
      question: 'Можно ли вернуть или обменять товар?',
      answer: 'Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в использовании и сохранил товарный вид. Для обмена или возврата обратитесь по указанным контактным данным.'
    },
    {
      question: 'Как происходит оплата заказа?',
      answer: 'Мы принимаем оплату банковскими картами через защищенный сервис, а также наличными при получении (только для Алматы) или банковским переводом.'
    },
    {
      question: 'Проводите ли вы мастер-классы или экскурсии?',
      answer: 'Да, мы регулярно проводим мастер-классы по текстурам города и тематические экскурсии по Алматы. Информация о ближайших мероприятиях публикуется в нашем Instagram и на главной странице сайта.'
    }
  ];
  
  const fallbackImage = "/pictures/almaty_wibe.jpg";

  // Social links data without icons
  const socialLinksData = [
    { name: 'Instagram', url: 'https://instagram.com/almatexture' },
    // Removed Facebook and Telegram
  ];

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация полей
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Имитация отправки данных на сервер
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Сброс формы и отображение сообщения об успехе
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setSubject('Общие вопросы');
      setMessage('');
    } catch (err) {
      setError('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Закрытие сообщения об успешной отправке
  const handleCloseSuccess = () => {
    setIsSubmitted(false);
  };
  
  return (
    <div className="contacts-page" style={{
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
        <title>Контакты | AlmaTexture</title>
        <meta name="description" content="Свяжитесь с нами по вопросам сотрудничества, заказов или предложения текстур для проекта AlmaTexture." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Хедер */}
      <Header />
      
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">Контакты</h1>
        
        <div className="contact-wrapper" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Контактная информация */}
          <div className="contact-info" style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Наши контакты</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-color)' }}>
                  {/* Phone Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Телефон</h3>
                  <p style={{ margin: '0', opacity: '0.8' }}>
                    <a href="tel:+77002579004" style={{ color: 'var(--text-color)' }}>+7 (700) 257-90-04</a>
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-color)' }}>
                  {/* Email Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Email</h3>
                  <p style={{ margin: '0', opacity: '0.8' }}>
                    <a href="mailto:almatexture@yandex.kz" style={{ color: 'var(--text-color)' }}>almatexture@yandex.kz</a>
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-color)' }}>
                  {/* Clock Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Часы работы</h3>
                  <p style={{ margin: '0', opacity: '0.8' }}>
                    Пн - Пт: 10:00 - 19:00<br />
                    Сб: 11:00 - 17:00<br />
                    Вс: Выходной
                  </p>
                </div>
              </div>
            </div>
            
            {/* Social Links within Contact Info block */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-color)' }}>Мы в социальных сетях</h3>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {socialLinksData.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    style={{ color: 'var(--primary-color)', textDecoration:'none' }}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Форма контактов */}
          <div className="contact-form" style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Написать нам</h2>
            
            {isSubmitted ? (
              <div style={{
                padding: '2rem',
                background: 'rgba(46, 204, 113, 0.1)',
                borderRadius: '0.5rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#2ecc71' }}>Сообщение отправлено!</h3>
                <p style={{ marginBottom: '1.5rem' }}>
                  Спасибо за ваше сообщение. Мы свяжемся с вами как можно скорее.
                </p>
                <button 
                  onClick={handleCloseSuccess}
                  style={{
                    background: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Отправить ещё
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(231, 76, 60, 0.1)',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    color: '#e74c3c'
                  }}>
                    {error}
                  </div>
                )}
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                    Ваше имя <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введите ваше имя"
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '0.25rem'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                    Email <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введите ваш email"
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '0.25rem'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                    Тема обращения
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '0.25rem',
                      background: 'white'
                    }}
                  >
                    {subjectOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                    Сообщение <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введите ваше сообщение"
                    required
                    rows={6}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '0.25rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                      Отправка...
                    </>
                  ) : (
                    <>
                      Отправить сообщение
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* FAQ */}
        <div className="faq-section" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Часто задаваемые вопросы</h2>
          
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  boxShadow: 'var(--shadow)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  const content = target.querySelector('.faq-content') as HTMLElement;
                  
                  if (content) {
                    content.style.display = content.style.display === 'block' ? 'none' : 'block';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-color)' }}>{item.question}</h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div className="faq-content" style={{ display: 'none', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                  <p style={{ margin: 0, opacity: 0.8 }}>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Футер */}
      <Footer />
    </div>
  );
};

export default Contacts; 