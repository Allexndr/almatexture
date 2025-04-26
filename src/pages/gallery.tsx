import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MapViewer from '../components/MapViewer';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Типы
interface Texture {
  id: number;
  title: string;
  description: string;
  district: string;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tags: string[];
}

// Районы для фильтрации
const districts = [
  { id: 'all', name: 'Все районы' },
  { id: 'medeu', name: 'Медеуский' },
  { id: 'almaly', name: 'Алмалинский' },
  { id: 'bostandyk', name: 'Бостандыкский' },
  { id: 'alatau', name: 'Алатауский' },
  { id: 'auezov', name: 'Ауэзовский' },
  { id: 'turksib', name: 'Турксибский' },
  { id: 'nauryzbay', name: 'Наурызбайский' },
  { id: 'zhetysu', name: 'Жетысуский' },
];

// Моковые данные о текстурах
const textures: Texture[] = [
  {
    id: 1,
    title: 'Брусчатка Арбата',
    description: 'Историческая брусчатка пешеходной улицы Жибек Жолы (Арбат)',
    district: 'almaly',
    imageUrl: '/images/textures/arbat-pavement.jpg',
    coordinates: { lat: 43.257, lng: 76.945 },
    tags: ['брусчатка', 'пешеходная зона', 'исторический центр']
  },
  {
    id: 2,
    title: 'Кора сосны в Медеу',
    description: 'Текстура коры сосны в высокогорном курорте Медеу',
    district: 'medeu',
    imageUrl: '/images/textures/medeu-pine-bark.jpg',
    coordinates: { lat: 43.157, lng: 77.058 },
    tags: ['природа', 'дерево', 'горы']
  },
  {
    id: 3,
    title: 'Мрамор Казахконцерта',
    description: 'Текстура мраморной отделки здания Казахконцерта',
    district: 'medeu',
    imageUrl: '/images/textures/kazakh-concert-marble.jpg',
    coordinates: { lat: 43.238, lng: 76.957 },
    tags: ['архитектура', 'камень', 'советский модернизм']
  },
  {
    id: 4,
    title: 'Асфальт проспекта Аль-Фараби',
    description: 'Текстура асфальта на одной из главных магистралей города',
    district: 'bostandyk',
    imageUrl: '/images/textures/al-farabi-asphalt.jpg',
    coordinates: { lat: 43.207, lng: 76.928 },
    tags: ['дорога', 'урбанизм', 'современность']
  },
  {
    id: 5,
    title: 'Гранит у монумента Независимости',
    description: 'Текстура гранитной плитки площади Республики',
    district: 'almaly',
    imageUrl: '/images/textures/independence-granite.jpg',
    coordinates: { lat: 43.238, lng: 76.945 },
    tags: ['камень', 'площадь', 'монумент']
  },
  {
    id: 6,
    title: 'Кирпичная кладка старого города',
    description: 'Текстура исторической кирпичной кладки в старой части Алматы',
    district: 'auezov',
    imageUrl: '/images/textures/old-city-brickwork.jpg',
    coordinates: { lat: 43.252, lng: 76.907 },
    tags: ['кирпич', 'история', 'архитектура']
  },
  {
    id: 7,
    title: 'Мозаика в подземном переходе',
    description: 'Советская мозаика в подземном переходе на ул. Абая',
    district: 'bostandyk',
    imageUrl: '/images/textures/abay-mosaic.jpg',
    coordinates: { lat: 43.238, lng: 76.922 },
    tags: ['мозаика', 'советское искусство', 'переход']
  },
  {
    id: 8,
    title: 'Алюминиевая облицовка ТРЦ Мега',
    description: 'Современная текстура облицовки торгового центра',
    district: 'bostandyk',
    imageUrl: '/images/textures/mega-aluminum.jpg',
    coordinates: { lat: 43.225, lng: 76.928 },
    tags: ['металл', 'современность', 'ТРЦ']
  },
  {
    id: 9,
    title: 'Деревянная резьба Вознесенского собора',
    description: 'Уникальная текстура резьбы по дереву исторического собора',
    district: 'medeu',
    imageUrl: '/images/textures/voznesensky-woodcarving.jpg',
    coordinates: { lat: 43.256, lng: 76.962 },
    tags: ['дерево', 'резьба', 'историческое наследие']
  },
  {
    id: 10,
    title: 'Каменистая текстура русла Большой Алматинки',
    description: 'Природная текстура камней в русле горной реки',
    district: 'nauryzbay',
    imageUrl: '/images/textures/big-almaty-river-stones.jpg',
    coordinates: { lat: 43.201, lng: 76.872 },
    tags: ['природа', 'камни', 'вода']
  },
  {
    id: 11,
    title: 'Кованый забор Центрального парка',
    description: 'Текстура художественной ковки ограждения парка',
    district: 'almaly',
    imageUrl: '/images/textures/central-park-fence.jpg',
    coordinates: { lat: 43.244, lng: 76.947 },
    tags: ['металл', 'ковка', 'парк']
  },
  {
    id: 12,
    title: 'Плитка у фонтана "Неделька"',
    description: 'Текстура плитки вокруг одного из символов Алматы',
    district: 'almaly',
    imageUrl: '/images/textures/nedelka-tiles.jpg',
    coordinates: { lat: 43.246, lng: 76.945 },
    tags: ['камень', 'фонтан', 'советская архитектура']
  }
];

// Константа для изображения-заглушки
const FALLBACK_IMAGE = 'https://via.placeholder.com/600x400/7f8c8d/ffffff?text=Текстура+не+найдена';

// Обновленная функция для фолбека изображений с несколькими источниками
const getFallbackImage = (districtId: string, textureId: number) => {
  const colors: Record<string, string> = {
    'almaly': '3498db',
    'medeu': '2ecc71',
    'bostandyk': 'e74c3c',
    'alatau': 'f39c12',
    'auezov': '9b59b6',
    'turksib': 'e67e22',
    'nauryzbay': '16a085',
    'zhetysu': '2980b9'
  };
  
  const color = colors[districtId] || '7f8c8d';
  const districtName = districts.find(d => d.id === districtId)?.name || 'Алматы';
  
  // Попробуем несколько вариантов путей к изображениям
  const fallbackOptions = [
    `/textures/texture${textureId}.jpg`,
    `/textures/${districtId}/texture${textureId}.jpg`,
    `/images/textures/texture${textureId}.jpg`,
    `https://source.unsplash.com/featured/?texture,${encodeURIComponent(districtName)}`,
    `https://placehold.co/600x400/${color}/ffffff?text=Текстура+${encodeURIComponent(districtName)}`,
    FALLBACK_IMAGE
  ];
  
  return fallbackOptions;
};

const GalleryPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [filteredTextures, setFilteredTextures] = useState<Texture[]>(textures);
  const [selectedTexture, setSelectedTexture] = useState<Texture | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Add useEffect to set client state 
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Фильтрация текстур при изменении района или поискового запроса
  useEffect(() => {
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
        texture.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredTextures(filtered);
  }, [selectedDistrict, searchTerm]);

  // Обработчик открытия модального окна с деталями текстуры
  const handleTextureClick = (texture: Texture) => {
    setSelectedTexture(texture);
    setIsModalOpen(true);
  };

  // Обработчик закрытия модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Обработчик ошибок загрузки изображений с множественными фолбеками
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, district: string, textureId: number) => {
    const imgElement = e.currentTarget; // Сохраняем ссылку на элемент
    if (!imgElement) return; // Защита от null
    
    const fallbackUrls = getFallbackImage(district, textureId);
    const currentSrc = imgElement.src;
    
    // Проверка, что у нас есть действительный currentSrc
    if (!currentSrc) {
      console.error('Current src is empty for texture', textureId);
      imgElement.src = FALLBACK_IMAGE;
      return;
    }
    
    // Найдем индекс текущего URL в массиве фолбеков
    const currentIndex = fallbackUrls.findIndex(url => url === currentSrc);
    
    // Если текущий URL не найден или это последний URL в массиве, используем последний фолбек
    if (currentIndex === -1 || currentIndex >= fallbackUrls.length - 1) {
      console.log(`Using final fallback for texture ${textureId}`);
      imgElement.src = FALLBACK_IMAGE;
    } else {
      // Иначе пробуем следующий URL
      const nextSrc = fallbackUrls[currentIndex + 1];
      console.log(`Trying next fallback for texture ${textureId}: ${nextSrc}`);
      
      if (nextSrc) {
        imgElement.src = nextSrc;
      } else {
        // Если nextSrc почему-то undefined, используем заглушку
        console.error('Next src is undefined for texture', textureId);
        imgElement.src = FALLBACK_IMAGE;
      }
    }
    
    // Применим безопасную анимацию появления
    // Сначала проверим, что стиль доступен
    if (imgElement && imgElement.style) {
      try {
        imgElement.style.opacity = '0';
        
        // Сохраняем ссылку на элемент перед setTimeout
        const imageElement = imgElement;
        
        setTimeout(() => {
          try {
            // Дополнительная проверка безопасности
            if (imageElement && imageElement.style) {
              imageElement.style.opacity = '1';
            }
          } catch (err) {
            console.error('Error setting opacity back to 1:', err);
          }
        }, 100);
      } catch (err) {
        console.error('Error setting initial opacity:', err);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Текстуры города | AlmaTexture</title>
        <meta name="description" content="Галерея уникальных городских текстур Алматы, запечатленных в проекте." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Хедер */}
      <Header />

      <main>
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
              
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: '0.7', marginRight: '0.5rem' }}>
                  Популярные теги:
                </span>
                {['архитектура', 'природа', 'камень', 'история', 'металл', 'дерево'].map(tag => (
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
              <div className="gallery" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {filteredTextures.map(texture => (
                  <div key={texture.id} className="gallery-item">
                    {isClient ? (
                      <div
                        style={{
                          background: 'white',
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          height: '100%'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.12)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                        }}
                        onClick={() => handleTextureClick(texture)}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <div style={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
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
                          <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{texture.title}</h3>
                            <p style={{ 
                              margin: '0 0 1rem', 
                              fontSize: '0.9rem', 
                              opacity: 0.8, 
                              flex: 1,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              textOverflow: 'ellipsis'
                            }}>
                              {texture.description}
                            </p>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center'
                            }}>
                              <div style={{ 
                                background: 'rgba(52, 152, 219, 0.1)', 
                                padding: '0.3rem 0.8rem', 
                                borderRadius: '0.25rem',
                                fontSize: '0.8rem',
                                color: 'var(--primary-color)'
                              }}>
                                {districts.find(d => d.id === texture.district)?.name}
                              </div>
                              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
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
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          height: '100%'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <div style={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
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
                          <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{texture.title}</h3>
                            <p style={{ 
                              margin: '0 0 1rem', 
                              fontSize: '0.9rem', 
                              opacity: 0.8, 
                              flex: 1,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              textOverflow: 'ellipsis'
                            }}>
                              {texture.description}
                            </p>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center'
                            }}>
                              <div style={{ 
                                background: 'rgba(52, 152, 219, 0.1)', 
                                padding: '0.3rem 0.8rem', 
                                borderRadius: '0.25rem',
                                fontSize: '0.8rem',
                                color: 'var(--primary-color)'
                              }}>
                                {districts.find(d => d.id === texture.district)?.name}
                              </div>
                              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
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
            padding: '1rem'
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
                  padding: '1.5rem', 
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedTexture.title}</h2>
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
                  flexDirection: 'row', 
                  flexWrap: 'wrap',
                  flex: '1'
                }}>
                  <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ 
                      width: '100%', 
                      height: '400px', 
                      position: 'relative'
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
                    flex: '1', 
                    minWidth: '300px', 
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', opacity: '0.7', marginBottom: '0.5rem' }}>Описание</h3>
                      <p>{selectedTexture.description}</p>
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '1rem', opacity: '0.7', marginBottom: '0.5rem' }}>Район</h3>
                      <p>{districts.find(d => d.id === selectedTexture.district)?.name}</p>
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '1rem', opacity: '0.7', marginBottom: '0.5rem' }}>Координаты</h3>
                      <p>{selectedTexture.coordinates.lat.toFixed(6)}, {selectedTexture.coordinates.lng.toFixed(6)}</p>
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '1rem', opacity: '0.7', marginBottom: '0.5rem' }}>Теги</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedTexture.tags.map(tag => (
                          <span 
                            key={tag}
                            style={{ 
                              background: 'rgba(52, 152, 219, 0.1)', 
                              padding: '0.3rem 0.8rem', 
                              borderRadius: '2rem',
                              fontSize: '0.9rem',
                              color: 'var(--primary-color)'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 'auto' }}>
                      <Link 
                        href={`/shop?texture=${selectedTexture.id}`}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
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