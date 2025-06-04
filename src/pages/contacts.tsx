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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке сообщения');
      }
      
      // Сброс формы и отображение сообщения об успехе
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setSubject('Общие вопросы');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
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
                <div style={{ color: 'var(--primary-color)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Phone Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                  </svg>
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
                <div style={{ color: 'var(--primary-color)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Email Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
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
                <div style={{ color: 'var(--primary-color)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Clock Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
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
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', textDecoration:'none' }}
                  >
                    {social.name === 'Instagram' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
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