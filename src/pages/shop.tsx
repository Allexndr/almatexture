import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MountainSvg from '../components/svg/MountainSvg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/router';

// Определение типов для товара
interface ShopItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
}

const Shop = () => {
  const router = useRouter();
  const { product } = router.query;
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();
  
  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'tshirts', name: 'Футболки' },
    { id: 'accessories', name: 'Аксессуары' },
    { id: 'posters', name: 'Постеры' },
  ];
  
  const shopItems = [
    {
      id: 1,
      name: 'Футболка "Медеу"',
      category: 'tshirts',
      price: 5500,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Футболка с текстурой катка Медеу и его GPS-координатами.',
      colors: ['white', 'black', 'gray'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 2,
      name: 'Футболка "Панфилова"',
      category: 'tshirts',
      price: 5500,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Футболка с текстурой брусчатки улицы Панфилова.',
      colors: ['white', 'blue', 'gray'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 3,
      name: 'Футболка "Кок-Тобе"',
      category: 'tshirts',
      price: 5500,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Футболка с текстурой горы Кок-Тобе и координатами смотровой площадки.',
      colors: ['white', 'black', 'red'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 4,
      name: 'Сумка "Зеленый Базар"',
      category: 'accessories',
      price: 3900,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Тканевая сумка с текстурой стен Зеленого Базара.',
      colors: ['beige', 'black'],
      sizes: ['One Size']
    },
    {
      id: 5,
      name: 'Чехол для телефона "Горы Алматы"',
      category: 'accessories',
      price: 2500,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Чехол для телефона с текстурой гор, окружающих Алматы.',
      colors: ['transparent', 'black'],
      sizes: ['iPhone 13/14', 'iPhone 13/14 Pro', 'Samsung S21/S22']
    },
    {
      id: 6,
      name: 'Постер "Арбат"',
      category: 'posters',
      price: 3000,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Постер с текстурой пешеходной улицы Жибек Жолы (Арбат).',
      colors: ['multicolor'],
      sizes: ['A3', 'A2', 'A1']
    },
    {
      id: 7,
      name: 'Постер "Абая"',
      category: 'posters',
      price: 3000,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Постер с текстурой проспекта Абая и его архитектурными элементами.',
      colors: ['multicolor'],
      sizes: ['A3', 'A2', 'A1']
    },
    {
      id: 8,
      name: 'Подушка "Алматинская плитка"',
      category: 'decor',
      price: 4500,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Декоративная подушка с текстурой плитки, характерной для Алматы 80-х годов.',
      colors: ['blue', 'terracotta'],
      sizes: ['40x40 см', '50x50 см']
    },
    {
      id: 9,
      name: 'Керамическая ваза "Алма-Ата"',
      category: 'decor',
      price: 12000,
      image: '/pictures/almaty_mountains.jpg',
      description: 'Ваза с текстурой, вдохновленной советской архитектурой Алма-Аты.',
      colors: ['white', 'terracotta'],
      sizes: ['Small', 'Medium', 'Large']
    }
  ];
  
  const fallbackImage = "/pictures/almaty_wibe.jpg";
  
  // Фильтрация элементов по категории
  const filteredItems = activeCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === activeCategory);
  
  // Добавление в корзину
  const handleAddToCart = (item: ShopItem, size: string) => {
    const cartItem = {
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      size: size || item.sizes[0],
      color: item.colors[0],
    };

    addToCart(cartItem);
    alert('Товар добавлен в корзину!');
  };

  const navigation = [
    { name: 'Галерея', href: '/gallery' },
    { name: 'Районы', href: '/districts' },
    { name: 'Магазин', href: '/shop' },
    { name: 'О проекте', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];
  
  return (
    <div className="shop-page" style={{
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
        <title>Магазин | AlmaTexture</title>
        <meta name="description" content="Купите уникальные товары, созданные на основе текстур Алматы, в официальном магазине проекта." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Хедер */}
      <Header />
      
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">Магазин AlmaTexture</h1>
        
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
            Откройте для себя коллекцию уникальных предметов, которые воплощают текстуры Алматы в повседневных вещах. 
            Каждый предмет хранит частичку города и его истории.
          </p>
        </div>
        
        {/* Фильтры категорий */}
        <div className="category-filters" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap'
        }}>
          {categories.map(category => (
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
        
        {/* Сетка товаров магазина */}
        <div className="shop-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {filteredItems.map(item => (
            <div key={item.id} className="shop-item" style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}>
              <div style={{ position: 'relative', paddingTop: '100%' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {item.price.toLocaleString('ru-RU')} ₸
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem' }}>{item.name}</h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#666', flex: 1 }}>
                  {item.description}
                </p>
                
                <div style={{ marginTop: 'auto' }}>
                  {/* Доступные цвета */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.5rem' }}>
                      Цвета:
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {item.colors.map((color, idx) => (
                        <div 
                          key={idx} 
                          title={color}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: color === 'white' ? '#fff' : 
                              color === 'black' ? '#000' : 
                              color === 'gray' ? '#777' :
                              color === 'blue' ? '#3498db' :
                              color === 'red' ? '#e74c3c' :
                              color === 'beige' ? '#f5f5dc' :
                              color === 'terracotta' ? '#e2725b' :
                              color === 'transparent' ? 'transparent' : 
                              color === 'multicolor' ? 'linear-gradient(45deg, #3498db, #2ecc71, #f1c40f, #e74c3c)' : color,
                            border: color === 'white' || color === 'transparent' ? '1px solid #ddd' : 'none',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Доступные размеры */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.5rem' }}>
                      Размеры:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {item.sizes.map((size, idx) => (
                        <div 
                          key={idx}
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.25rem 0.5rem',
                            background: '#f8f8f8',
                            border: '1px solid #eee',
                            borderRadius: '2px'
                          }}
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(item, item.sizes[0])}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                      padding: '0.75rem',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    Приобрести
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Секция с социальными сетями */}
      <div className="social-section" style={{
        margin: '4rem auto',
        textAlign: 'center',
        maxWidth: '800px',
        padding: '2rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Присоединяйтесь к нам в социальных сетях</h2>
        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
          Следите за нашими новинками, акциями и событиями. Делитесь своими находками с хэштегом #almatexture
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href="https://instagram.com/almatexture" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s ease',
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img src="/images/social/instagram.svg" alt="Instagram" width={60} height={60} />
            <span style={{ marginTop: '0.75rem', fontWeight: 'bold' }}>Instagram</span>
          </a>
          
          {/* Removed Facebook, Telegram, WhatsApp */}
          
        </div>
      </div>
      
      {/* Добавляем футер */}
      <Footer />
    </div>
  );
};

export default Shop; 