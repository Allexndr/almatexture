import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MountainSvg from '../components/svg/MountainSvg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);

  // Проверка валидности формы
  React.useEffect(() => {
    setIsFormValid(name !== '' && email !== '' && phone !== '' && address !== '');
  }, [name, email, phone, address]);

  // Обработчик оформления заказа
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Здесь в реальном приложении отправляли бы данные на сервер
      alert(`
        Ваш заказ успешно отправлен!
        
        Детали заказа:
        - Имя: ${name}
        - Email: ${email}
        - Телефон: ${phone}
        - Адрес доставки: ${address}
        - Количество товаров: ${cart.totalItems}
        - Итоговая сумма: ${cart.totalPrice.toLocaleString()} ₸
        
        Мы свяжемся с вами в ближайшее время для подтверждения заказа.
      `);
      
      // Очистка корзины и перенаправление на главную страницу
      clearCart();
      router.push('/');
    }
  };

  return (
    <div className="cart-page" style={{
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
        <title>Корзина | AlmaTexture</title>
        <meta name="description" content="Ваша корзина с выбранными товарами AlmaTexture" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Хедер */}
      <Header />
      
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">Корзина</h1>

        {cart.items.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            padding: '2.5rem', 
            textAlign: 'center',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.2 }}>🛒</div>
            <h2 style={{ marginBottom: '1.5rem' }}>Ваша корзина пуста</h2>
            <p style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Посетите нашу коллекцию или создайте свою уникальную футболку с текстурами Алматы.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                href="/collection" 
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '0.25rem',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Перейти в коллекцию
              </Link>
              <Link 
                href="/shop" 
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: 'var(--primary-color)',
                  border: '1px solid var(--primary-color)',
                  borderRadius: '0.25rem',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Создать свой дизайн
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Список товаров в корзине */}
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '2rem', 
              boxShadow: 'var(--shadow)'
            }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Товары в корзине</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {cart.items.map(item => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      borderBottom: '1px solid #eee',
                      paddingBottom: '1.5rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      flexShrink: 0, 
                      marginRight: '1.5rem',
                      borderRadius: '0.5rem',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/pictures/almaty_wibe.jpg";
                        }}
                      />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{item.name}</h3>
                      
                      {item.size && (
                        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                          Размер: {item.size}
                        </div>
                      )}
                      
                      {item.color && (
                        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                          Цвет: {item.color}
                        </div>
                      )}
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1rem'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.25rem',
                              border: '1px solid #ddd',
                              background: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >-</button>
                          <div style={{
                            padding: '0.25rem 0.75rem',
                            minWidth: '40px',
                            textAlign: 'center'
                          }}>
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.25rem',
                              border: '1px solid #ddd',
                              background: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >+</button>
                        </div>
                        
                        <div style={{ 
                          fontSize: '1.1rem', 
                          fontWeight: 'bold', 
                          color: 'var(--primary-color)'
                        }}>
                          {(item.price * item.quantity).toLocaleString()} ₸
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '32px',
                        height: '32px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        opacity: 0.5,
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.opacity = '0.5';
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '2rem', 
                padding: '1rem',
                background: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '0.5rem',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem' }}>Итого:</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {cart.totalPrice.toLocaleString()} ₸
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsCheckoutMode(true)}
                  style={{
                    padding: '0.875rem 2rem',
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Оформить заказ
                </button>
              </div>
            </div>
            
            {/* Форма оформления заказа */}
            {isCheckoutMode && (
              <div style={{ 
                background: 'white', 
                borderRadius: '1rem', 
                padding: '2rem', 
                boxShadow: 'var(--shadow)'
              }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Оформление заказа</h2>
                
                <form onSubmit={handleCheckout}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Ваше имя:</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
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
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
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
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Телефон:</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        border: '1px solid #ddd',
                        borderRadius: '0.25rem'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Адрес доставки:</label>
                    <textarea 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        border: '1px solid #ddd',
                        borderRadius: '0.25rem',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <button 
                      type="button"
                      onClick={() => setIsCheckoutMode(false)}
                      style={{
                        padding: '0.875rem 2rem',
                        background: '#f1f1f1',
                        color: '#333',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      Назад
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={!isFormValid}
                      style={{
                        padding: '0.875rem 2rem',
                        background: isFormValid ? 'var(--primary-color)' : '#cccccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        fontSize: '1rem'
                      }}
                    >
                      Подтвердить заказ
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Футер */}
      <Footer />
    </div>
  );
};

export default CartPage; 