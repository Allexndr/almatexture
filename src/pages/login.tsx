import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { from } = router.query;
  
  // Check if user is already logged in
  useEffect(() => {
    // Добавляем переменную для отслеживания, был ли размонтирован компонент
    let isMounted = true;
    
    // Дебаунсинг для предотвращения частых перенаправлений
    const checkAuthStatus = async () => {
      try {
        // Проверяем, не произошло ли размонтирование компонента во время ожидания
        if (!isMounted) return;
        
        console.log('Checking auth status...');
        const response = await fetch('/api/auth/me');
        
        // Проверяем, не произошло ли размонтирование компонента после получения ответа
        if (!isMounted) return;
        
        if (response.ok) {
          // User is already logged in, redirect
          console.log('User is authenticated, redirecting...');
          const redirectPath = from ? String(from) : '/admin';
          router.push(redirectPath);
        }
      } catch (error) {
        // Not logged in, do nothing (stay on login page)
        console.log('Auth check error or not logged in');
      }
    };
    
    // Задержка перед проверкой аутентификации
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 500); // Добавляем задержку 500мс
    
    // Очистка эффекта при размонтировании компонента
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [from, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, введите email и пароль');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Создаем AbortController для таймаута
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 секунд таймаут
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Ошибка авторизации');
        setIsLoading(false);
        return;
      }
      
      // Redirect to admin or the page user was trying to access
      const redirectPath = from ? String(from) : '/admin';
      router.push(redirectPath);
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.name === 'AbortError') {
        setError('Время ожидания истекло. Пожалуйста, попробуйте позже.');
      } else {
        setError('Ошибка при попытке авторизации: ' + (err.message || 'Неизвестная ошибка'));
      }
      
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <>
      <Head>
        <title>Вход в панель администратора | AlmaTexture</title>
        <meta name="description" content="Вход в административную панель для управления сайтом AlmaTexture" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f7',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
        position: 'relative'
      }}>
        {/* Фоновое изображение гор Алматы с эффектом "мыла" */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
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
            opacity: 0.1
          }} />
        </div>
        
        <div style={{ 
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              margin: '0 0 0.5rem',
              color: '#333'
            }}>
              AlmaTexture
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              color: '#666',
              marginTop: '0.5rem'
            }}>
              Вход в панель администратора
            </p>
          </div>
          
          {/* Optional: Add a subtle logo or branding element */}
          <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#aaa' }}>
            AlmaTexture
          </div>
          
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#444'
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                suppressHydrationWarning
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#444'
                }}
              >
                Пароль
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите ваш пароль"
                  suppressHydrationWarning
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '40px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#3498db',
                    fontSize: '0.9rem',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s ease'
                  }}
                  title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? 
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg> : 
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  }
                </button>
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#666', 
                marginTop: '6px', 
                textAlign: 'right' 
              }}>
                Нажмите на иконку справа для отображения пароля
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {isLoading ? (
                <>
                  <span style={{ 
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    borderTopColor: 'white',
                    animation: 'spin 1s linear infinite',
                    marginRight: '10px'
                  }}></span>
                  Вход...
                </>
              ) : 'Вход'}
            </button>
          </form>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: '24px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <Link href="/" style={{ 
              color: '#3498db', 
              textDecoration: 'none' 
            }}>
              Вернуться на главную страницу
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Login; 
 