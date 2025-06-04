import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MapViewer from '../components/MapViewer';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Обновленная структура для текстур, соответствующая /api/admin/textures
interface Texture {
  id: string;
  title: string;
  description: string;
  district: string;
  imageUrl: string;
  tags: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

// Районы для фильтрации
const districts = [
  { id: 'all', name: 'Все районы' },
  { id: 'Медеуский', name: 'Медеуский' },
  { id: 'Алмалинский', name: 'Алмалинский' },
  { id: 'Бостандыкский', name: 'Бостандыкский' },
  { id: 'Алатауский', name: 'Алатауский' },
  { id: 'Ауэзовский', name: 'Ауэзовский' },
  { id: 'Турксибский', name: 'Турксибский' },
  { id: 'Наурызбайский', name: 'Наурызбайский' },
  { id: 'Жетысуский', name: 'Жетысуский' },
];

// Константа для изображения-заглушки
const FALLBACK_IMAGE = 'https://via.placeholder.com/600x400/7f8c8d/ffffff?text=Текстура+не+найдена';

// Обновленная функция для фолбека изображений с несколькими источниками
const getFallbackImage = (districtId: string, textureId: string) => {
  const colors: Record<string, string> = {
    'Алмалинский': '3498db',
    'Медеуский': '2ecc71',
    'Бостандыкский': 'e74c3c',
    'Алатауский': 'f39c12',
    'Ауэзовский': '9b59b6',
    'Турксибский': 'e67e22',
    'Наурызбайский': '16a085',
    'Жетысуский': '2980b9'
  };
  
  const color = colors[districtId] || '7f8c8d';
  const districtName = districtId || 'Алматы';
  
  // Попробуем несколько вариантов путей к изображениям
  const fallbackOptions = [
    textureId ? `/textures/texture${textureId}.jpg` : FALLBACK_IMAGE,
    textureId ? `/textures/texture${textureId}.png` : FALLBACK_IMAGE,
    `https://placehold.co/600x400/${color}/ffffff?text=Текстура+${encodeURIComponent(districtName)}`,
    FALLBACK_IMAGE
  ];
  
  return fallbackOptions;
};

// Обработчик ошибок загрузки изображений
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, district: string, id: string) => {
  const fallbackImages = getFallbackImage(district, id);
  const img = e.target as HTMLImageElement;
  const currentSrc = img.src;
  
  // Находим следующее изображение в списке фолбеков
  const currentIndex = fallbackImages.findIndex(src => src === currentSrc);
  const nextIndex = (currentIndex + 1) % fallbackImages.length;
  
  // Устанавливаем следующее изображение
  img.src = fallbackImages[nextIndex];
  
  // Если перепробовали все варианты, останавливаемся на последнем
  if (nextIndex === fallbackImages.length - 1) {
    img.onerror = null; // Предотвращаем бесконечный цикл
  }
};

const GalleryPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [textures, setTextures] = useState<Texture[]>([]);
  const [filteredTextures, setFilteredTextures] = useState<Texture[]>([]);
  const [selectedTexture, setSelectedTexture] = useState<Texture | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [districts, setDistricts] = useState<{id: string, name: string, color?: string | null}[]>([
    { id: 'all', name: 'Все районы' }
  ]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [easterEggActive, setEasterEggActive] = useState(false);

  // Set client state and fetch textures on mount
  useEffect(() => {
    setIsClient(true);
    fetchTextures();
    
    // Пасхалка: секретная комбинация клавиш "алматы"
    let keys: string[] = [];
    const konami = ['а', 'л', 'м', 'а', 'т', 'ы'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.push(e.key.toLowerCase());
      if (keys.length > konami.length) {
        keys.shift();
      }
      
      if (keys.join('') === konami.join('')) {
        setEasterEggActive(prev => !prev);
        if (!easterEggActive) {
          alert('🎉 Режим "Аутентичный Алматы" активирован! Теперь вы видите город во всей красе.');
        } else {
          alert('Режим "Аутентичный Алматы" деактивирован. Возвращаемся к обычной версии.');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [easterEggActive]);

  // Fetch textures from API
  const fetchTextures = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/textures');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setTextures(data.textures || []);
      setFilteredTextures(data.textures || []);
      setDistricts(data.districts || [{ id: 'all', name: 'Все районы' }]);
      setPopularTags(data.tags || []);
    } catch (error) {
      console.error('Error fetching textures:', error);
      setError('Не удалось загрузить данные текстур');
    } finally {
      setIsLoading(false);
    }
  };

  // Фильтрация текстур при изменении района или поискового запроса
  useEffect(() => {
    setIsLoading(true);
    
    const fetchFilteredTextures = async () => {
      try {
        // Формируем URL с параметрами для фильтрации
        const params = new URLSearchParams();
        if (selectedDistrict !== 'all') {
          params.append('district', selectedDistrict);
        }
        if (searchTerm.trim()) {
          params.append('search', searchTerm.trim());
        }
        
        const response = await fetch(`/api/textures?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        setFilteredTextures(data.textures || []);
      } catch (error) {
        console.error('Error fetching filtered textures:', error);
        // Фильтруем локально, если API вернул ошибку
    let filtered = textures;
    
    // Фильтрация по району
    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(texture => texture.district === selectedDistrict);
    }
    
    // Фильтрация по поисковому запросу
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(texture => 
        texture.title.toLowerCase().includes(term) || 
        texture.description.toLowerCase().includes(term) || 
            (texture.tags && texture.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    setFilteredTextures(filtered);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Устанавливаем таймаут для дебаунса запроса при изменении поискового запроса
    const timeoutId = setTimeout(() => {
      fetchFilteredTextures();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [selectedDistrict, searchTerm]);

  // Обработчик открытия модального окна с деталями текстуры
  const handleTextureClick = async (texture: Texture) => {
    try {
      const response = await fetch(`/api/textures/${texture.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedTexture(data.texture);
      } else {
        setSelectedTexture(texture);
      }
    } catch (error) {
      console.error('Error fetching texture details:', error);
    setSelectedTexture(texture);
    }
    setIsModalOpen(true);
  };

  // Обработчик закрытия модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>{easterEggActive ? 'Ақысыз текстуралар! | АлмаТекстура' : 'Текстуры города | AlmaTexture'}</title>
        <meta name="description" content="Галерея уникальных городских текстур Алматы, запечатленных в проекте." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Хедер */}
      <Header />

      <main style={easterEggActive ? {background: 'linear-gradient(135deg, #6ab7ff 0%, #ffca6a 100%)'} : {}}>
        <section className="section" style={{ paddingTop: '8rem' }}>
          <div className="container">
            <h1 className="section-title">Текстуры города</h1>
            
            <div style={{ maxWidth: '800px', margin: '0 auto 3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                Исследуйте уникальные текстуры Алматы, собранные из разных районов города.
                Каждая текстура имеет свою историю и координаты места, где она была сфотографирована.
              </p>
            </div>
            
            {/* Фильтры и поиск */}
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '1.5rem', 
              boxShadow: 'var(--shadow)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Район города:
                  </label>
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      borderRadius: '0.5rem', 
                      border: '1px solid #ddd',
                      background: 'white'
                    }}
                  >
                    {districts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={{ flex: '2', minWidth: '300px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Поиск текстур:
                  </label>
                  <input 
                    type="text"
                    placeholder="Введите название, описание или тег..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      borderRadius: '0.5rem', 
                      border: '1px solid #ddd' 
                    }}
                  />
                </div>
              </div>
              
              {/* Популярные теги */}
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: '0.7', marginRight: '0.5rem' }}>
                  Популярные теги:
                </span>
                {popularTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    style={{ 
                      border: 'none', 
                      background: 'rgba(52, 152, 219, 0.1)', 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '2rem',
                      fontSize: '0.8rem',
                      color: 'var(--primary-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(52, 152, 219, 0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(52, 152, 219, 0.1)'}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Результаты */}
            <div style={{ marginBottom: '1rem', color: 'var(--text-color)', opacity: '0.7' }}>
              Найдено текстур: {filteredTextures.length}
            </div>
            
            {/* Галерея текстур */}
            {filteredTextures.length > 0 ? (
              <div className="gallery">
                {filteredTextures.map(texture => (
                  <div key={texture.id} className="gallery-item">
                    {isClient ? (
                      <div
                        style={{
                          background: 'white',
                          borderRadius: '1rem',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          height: '100%',
                          minHeight: '380px'
                        }}
                        onMouseOver={(e) => {
                          if (window.innerWidth > 768) {  // Только для десктопов
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.12)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (window.innerWidth > 768) {  // Только для десктопов
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                          }
                        }}
                        onClick={() => handleTextureClick(texture)}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <div style={{ position: 'relative', width: '100%', paddingTop: '65%' }}>
                            <img 
                              src={texture.imageUrl} 
                              alt={texture.title}
                              style={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                transition: 'opacity 0.3s ease'
                              }}
                              onError={(e) => handleImageError(e, texture.district, texture.id)}
                            />
                          </div>
                          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ 
                                margin: '0 0 0.75rem', 
                                fontSize: '1.1rem', 
                                fontWeight: '600',
                                lineHeight: '1.4',
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '3.6rem'
                              }}>{texture.title}</h3>
                              <p style={{ 
                                margin: '0 0 1rem', 
                                fontSize: '0.9rem', 
                                opacity: 0.7, 
                                lineHeight: '1.5',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis',
                                minHeight: '2.7rem'
                              }}>
                                {texture.description}
                              </p>
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-end',
                              gap: '0.5rem',
                              marginTop: 'auto'
                            }}>
                              <div 
                                className="district-badge"
                                style={{ 
                                  background: 'rgba(52, 152, 219, 0.1)', 
                                  padding: '0.4rem 0.8rem', 
                                  borderRadius: '0.5rem',
                                  fontSize: '0.8rem',
                                  color: 'var(--primary-color)',
                                  fontWeight: '500',
                                  maxWidth: '70%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {districts.find(d => d.id === texture.district)?.name || texture.district}
                              </div>
                              <div 
                                className="texture-id"
                                style={{ fontSize: '0.75rem', opacity: 0.5, flexShrink: 0 }}
                              >
                                ID: {texture.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          background: 'white',
                          borderRadius: '1rem',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          height: '100%',
                          minHeight: '380px'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <div style={{ position: 'relative', width: '100%', paddingTop: '65%' }}>
                            <img 
                              src={texture.imageUrl} 
                              alt={texture.title}
                              style={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover'
                              }}
                              onError={(e) => handleImageError(e, texture.district, texture.id)}
                            />
                          </div>
                          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ 
                                margin: '0 0 0.75rem', 
                                fontSize: '1.1rem', 
                                fontWeight: '600',
                                lineHeight: '1.4',
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '3.6rem'
                              }}>{texture.title}</h3>
                              <p style={{ 
                                margin: '0 0 1rem', 
                                fontSize: '0.9rem', 
                                opacity: 0.7, 
                                lineHeight: '1.5',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis',
                                minHeight: '2.7rem'
                              }}>
                                {texture.description}
                              </p>
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-end',
                              gap: '0.5rem',
                              marginTop: 'auto'
                            }}>
                              <div 
                                className="district-badge"
                                style={{ 
                                  background: 'rgba(52, 152, 219, 0.1)', 
                                  padding: '0.4rem 0.8rem', 
                                  borderRadius: '0.5rem',
                                  fontSize: '0.8rem',
                                  color: 'var(--primary-color)',
                                  fontWeight: '500',
                                  maxWidth: '70%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {districts.find(d => d.id === texture.district)?.name || texture.district}
                              </div>
                              <div 
                                className="texture-id"
                                style={{ fontSize: '0.8rem', opacity: 0.5, flexShrink: 0 }}
                              >
                                ID: {texture.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                padding: '3rem', 
                textAlign: 'center', 
                background: 'white', 
                borderRadius: '1rem',
                boxShadow: 'var(--shadow)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.2' }}>🔍</div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
                  Текстуры не найдены
                </h3>
                <p style={{ opacity: '0.7', maxWidth: '400px', margin: '0 auto' }}>
                  Попробуйте изменить параметры поиска или выбрать другой район города
                </p>
                <button 
                  onClick={() => { setSelectedDistrict('all'); setSearchTerm(''); }}
                  className="btn btn-primary"
                  style={{ marginTop: '1.5rem' }}
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </section>
        
        {/* Модальное окно с детальной информацией */}
        {isModalOpen && selectedTexture && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem'
          }}
          onClick={closeModal}
          >
            <div 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '1rem', 
                maxWidth: '900px', 
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: '1.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 'calc(100% - 40px)' 
                  }}>{selectedTexture.title}</h2>
                  <button 
                    onClick={closeModal}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '1.5rem', 
                      cursor: 'pointer',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                  >
                    ×
                  </button>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: '1'
                }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ 
                      width: '100%', 
                      height: '250px', 
                      position: 'relative',
                      '@media (min-width: 768px)': {
                        height: '400px'
                      }
                    }}>
                      <img 
                        src={selectedTexture.imageUrl}
                        alt={selectedTexture.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => handleImageError(e, selectedTexture.district, selectedTexture.id)}
                      />
                    </div>
                  </div>
                  
                  <div style={{ 
                    width: '100%',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '0.9rem', opacity: '0.7', marginBottom: '0.25rem' }}>Описание</h3>
                      <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{selectedTexture.description}</p>
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '0.9rem', opacity: '0.7', marginBottom: '0.25rem' }}>Район</h3>
                      <p style={{ fontSize: '0.95rem' }}>{districts.find(d => d.id === selectedTexture.district)?.name}</p>
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '0.9rem', opacity: '0.7', marginBottom: '0.25rem' }}>Координаты</h3>
                      <p style={{ fontSize: '0.95rem' }}>{selectedTexture.coordinates?.lat.toFixed(6)}, {selectedTexture.coordinates?.lng.toFixed(6)}</p>
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '0.9rem', opacity: '0.7', marginBottom: '0.25rem' }}>Теги</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedTexture.tags.map(tag => (
                          <span 
                            key={tag}
                            style={{ 
                              background: 'rgba(52, 152, 219, 0.1)', 
                              padding: '0.25rem 0.6rem', 
                              borderRadius: '2rem',
                              fontSize: '0.8rem',
                              color: 'var(--primary-color)'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '0.5rem' }}>
                      <Link 
                        href={`/custom?texture=${selectedTexture.id}`}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.95rem', padding: '0.75rem' }}
                      >
                        Создать футболку с этой текстурой
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Replace the existing footer with our Footer component */}
      <Footer />
    </>
  );
};

export default GalleryPage; 