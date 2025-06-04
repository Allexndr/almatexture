import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MountainSvg from '../components/svg/MountainSvg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/router';
import ProductDetailsModal from '../components/Modals/ProductDetailsModal';

const Shop = () => {
  const router = useRouter();
  const { product } = router.query;
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDistrict, setActiveDistrict] = useState('all');
  const [activeTexture, setActiveTexture] = useState('all');
  const [activeClothingType, setActiveClothingType] = useState('all');
  const [activeColor, setActiveColor] = useState('all');
  const [activeSize, setActiveSize] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Product details overlay state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Новые состояния для фильтров
  const [activeMaterial, setActiveMaterial] = useState('all');
  const [activeCollection, setActiveCollection] = useState('all');
  const [activeSeason, setActiveSeason] = useState('all');
  const [activePrintTechnique, setActivePrintTechnique] = useState('all');
  const [activeDesignStyle, setActiveDesignStyle] = useState('all');
  const [activeTimePeriod, setActiveTimePeriod] = useState('all');
  const [isEcoOnly, setIsEcoOnly] = useState(false);
  const [isOnSaleOnly, setIsOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortOrder, setSortOrder] = useState('default');
  const [isNewOnly, setIsNewOnly] = useState(false);
  
  // Добавляем определения состояний для districts и textures
  const [districts, setDistricts] = useState([
    { id: 'all', name: 'Все районы' },
    { id: 'medeu', name: 'Медеуский' },
    { id: 'almaly', name: 'Алмалинский' },
    { id: 'bostandyk', name: 'Бостандыкский' },
    { id: 'auezov', name: 'Ауэзовский' },
    { id: 'turksib', name: 'Турксибский' },
    { id: 'jetysu', name: 'Жетысуский' },
    { id: 'nauryzbay', name: 'Наурызбайский' },
    { id: 'alatau', name: 'Алатауский' }
  ]);
  const [textures, setTextures] = useState([
    { id: 'all', name: 'Все текстуры' }
  ]);
  
  // Используем useRef вместо useState для отслеживания монтирования, чтобы избежать лишних ререндеров
  const isMountedRef = React.useRef(false);
  
  // Обновляем хук useEffect для предотвращения ошибки навигации
  useEffect(() => {
    // Отметим компонент как смонтированный
    isMountedRef.current = true;
    
    // Загружаем товары только на клиенте и только один раз
    if (typeof window !== 'undefined') {
      setLoading(true);
      setError(null);
      
      console.log('Отправляем запрос к API /api/products/simple');
      
      fetch('/api/products/simple')
        .then(res => {
          console.log('Получен ответ от API:', res.status, res.statusText);
          if (!res.ok) {
            throw new Error(`HTTP ошибка! Статус: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          // Проверяем, что компонент все еще смонтирован
          if (!isMountedRef.current) return;
          
          if (!data || data.error) {
            throw new Error(data?.error || 'Ошибка при получении данных');
          }
          
          console.log('Получены данные из MongoDB:', data);
          
          if (data.success && data.products && Array.isArray(data.products)) {
            const processedProducts = data.products.map((item: any) => ({
              ...item,
              title: item.title || item.name || '',
              imageUrl: item.imageUrl || item.image || '',
              price: item.price || 0,
              category: item.category || 'other',
              description: item.description || '',
              stock: item.stock || 1,
              id: item.id || String(Date.now()),
              currency: '₸',
              featured: item.featured || false,
              createdAt: item.createdAt || new Date().toISOString(),
              colors: item.colors || [],
              sizes: item.sizes || [],
              district: item.district || 'undefined',
              texture: item.texture || 'undefined',
              clothingType: item.clothingType || '',
              material: item.material || '',
              collection: item.collection || '',
              season: item.season || '',
              printTechnique: item.printTechnique || '',
              designStyle: item.designStyle || '',
              isEco: item.isEco || false,
              isOnSale: item.isOnSale || false,
              timePeriod: item.timePeriod || ''
            }));
            
            setProducts(processedProducts);
            console.log('Товары успешно загружены из MongoDB:', processedProducts.length);
            
            // Создаем данные о районах из товаров
            const uniqueDistricts = [...new Set(processedProducts
              .map((p: any) => p.district)
              .filter(Boolean)
            )];
            
            const districts = uniqueDistricts.map(name => ({
              id: name,
              name,
              color: '#' + Math.floor(Math.random() * 16777215).toString(16)
            }));
            
            setDistricts([
              { id: 'all', name: 'Все районы' },
              ...districts
            ]);
            
            // Создаем данные о текстурах из товаров
            const uniqueTextures = [...new Set(processedProducts
              .map((p: any) => p.texture)
              .filter(Boolean)
            )];
            
            const textures = uniqueTextures.map((texture, index) => ({
              id: index + 1,
              title: texture
            }));
            
            setTextures([
              { id: 'all', name: 'Все текстуры' },
              ...textures
            ]);
          } else {
            throw new Error('Неизвестный формат данных от API');
          }
          
          setLoading(false);
        })
        .catch(error => {
          // Проверяем, что компонент все еще смонтирован
          if (!isMountedRef.current) return;
          
          console.error('Ошибка при загрузке товаров из MongoDB:', error);
          setLoading(false);
          setError(error.message || 'Не удалось загрузить товары');
          
          // Fallback - пробуем загрузить из старого API
          console.log('Пробуем fallback к /api/shop');
          fetch('/api/shop')
            .then(res => res.json())
            .then(data => {
              if (!isMountedRef.current) return;
              
              if (data.products && Array.isArray(data.products)) {
                const processedProducts = data.products.map((item: any) => ({
                  ...item,
                  title: item.title || item.name || '',
                  imageUrl: item.imageUrl || item.image || '',
                  price: item.price || 0,
                  category: item.category || 'other',
                  description: item.description || '',
                  stock: item.stock || 1,
                  id: item.id || String(Date.now()),
                  currency: item.currency || '₸',
                  featured: item.featured || false,
                  createdAt: item.createdAt || new Date().toISOString(),
                  colors: item.colors || [],
                  sizes: item.sizes || [],
                  district: item.district || 'undefined',
                  texture: item.texture || 'undefined'
                }));
                
                setProducts(processedProducts);
                console.log('Fallback: товары загружены из /api/shop');
                
                // Если API вернула метаданные с районами и текстурами, используем их
                if (data.metadata) {
                  if (data.metadata.districts && Array.isArray(data.metadata.districts)) {
                    setDistricts(data.metadata.districts);
                  }
                  
                  if (data.metadata.textures && Array.isArray(data.metadata.textures)) {
                    setTextures(data.metadata.textures);
                  }
                }
              }
              setLoading(false);
            })
            .catch(fallbackError => {
              if (!isMountedRef.current) return;
              console.error('Fallback также не удался:', fallbackError);
              
              // Добавляем заглушки для отладки
              console.log('Загружаем заглушки товаров для отладки');
              const debugProducts = [
                {
                  id: "debug-1",
                  title: "Тестовый товар 1",
                  description: "Это тестовый товар для отладки",
                  price: 1000,
                  category: "poster",
                  imageUrl: "/pictures/almaty_wibe.jpg",
                  stock: 10,
                  currency: "₸",
                  colors: ["Белый", "Черный"],
                  sizes: ["S", "M", "L"]
                },
                {
                  id: "debug-2",
                  title: "Тестовый товар 2",
                  description: "Это еще один тестовый товар для отладки",
                  price: 2000,
                  category: "tshirt",
                  imageUrl: "/pictures/almaty_wibe.jpg",
                  stock: 5,
                  currency: "₸",
                  colors: ["Красный", "Синий"],
                  sizes: ["M", "L", "XL"]
                }
              ];
              
              setProducts(debugProducts);
              setLoading(false);
            });
        });
    }
    
    // Очистка при размонтировании компонента
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'poster', name: 'Постеры' },
    { id: 'tote', name: 'Шопперы' },
    { id: 'caps', name: 'Кепки' },
    { id: 'bandanas', name: 'Банданы' },
    { id: 'tshirt', name: 'Футболки' },
    { id: 'hoodie', name: 'Толстовки' },
    { id: 'tablecloth', name: 'Скатерти' },
    { id: 'apron', name: 'Фартуки' },
    { id: 'stickers', name: 'Стикеры' },
    { id: 'decals', name: 'Наклейки' }
  ];
  
  const clothingTypes = [
    { id: 'all', name: 'Все типы' },
    { id: 'tshirt', name: 'Футболки' },
    { id: 'hoodie', name: 'Толстовки' },
    { id: 'longsleeve', name: 'Лонгсливы' },
    { id: 'sweater', name: 'Свитера' },
    { id: 'sweatshirt', name: 'Свитшоты' },
    { id: 'polo', name: 'Поло' },
    { id: 'jacket', name: 'Куртки' },
    { id: 'pants', name: 'Штаны' },
    { id: 'shorts', name: 'Шорты' },
    { id: 'hat', name: 'Головные уборы' },
    { id: 'accessory', name: 'Аксессуары' }
  ];
  
  const colors = [
    { id: 'all', name: 'Все цвета' },
    { id: 'white', name: 'Белый' },
    { id: 'black', name: 'Черный' },
    { id: 'gray', name: 'Серый' },
    { id: 'blue', name: 'Синий' },
    { id: 'red', name: 'Красный' },
    { id: 'green', name: 'Зеленый' },
    { id: 'yellow', name: 'Желтый' },
    { id: 'beige', name: 'Бежевый' },
    { id: 'multicolor', name: 'Мультиколор' }
  ];
  
  const sizes = [
    { id: 'all', name: 'Все размеры' },
    { id: 'XS', name: 'XS' },
    { id: 'S', name: 'S' },
    { id: 'M', name: 'M' },
    { id: 'L', name: 'L' },
    { id: 'XL', name: 'XL' },
    { id: 'XXL', name: 'XXL' },
    { id: 'XXXL', name: 'XXXL' }
  ];
  
  const fallbackImage = "/pictures/almaty_wibe.jpg";
  
  // Добавить новые константы для фильтров
  const materials = [
    { id: 'all', name: 'Все материалы' },
    { id: 'cotton', name: 'Хлопок' },
    { id: 'linen', name: 'Лен' },
    { id: 'synthetic', name: 'Синтетика' },
    { id: 'mixed', name: 'Смесовые ткани' },
    { id: 'recycled', name: 'Переработанные материалы' },
    { id: 'paper', name: 'Бумага' },
    { id: 'canvas', name: 'Холст' },
    { id: 'wood', name: 'Дерево' }
  ];
  
  const collections = [
    { id: 'all', name: 'Все коллекции' },
    { id: 'historic-center', name: 'Исторический центр' },
    { id: 'new-buildings', name: 'Новостройки' },
    { id: 'parks', name: 'Парки' },
    { id: 'streets', name: 'Улицы' },
    { id: 'mountains', name: 'Горы Алматы' },
    { id: 'bazaars', name: 'Базары' }
  ];
  
  const seasons = [
    { id: 'all', name: 'Все сезоны' },
    { id: 'spring-summer', name: 'Весна-Лето' },
    { id: 'fall-winter', name: 'Осень-Зима' },
    { id: 'all-season', name: 'Всесезонное' }
  ];
  
  const printTechniques = [
    { id: 'all', name: 'Все техники' },
    { id: 'embroidery', name: 'Вышивка' },
    { id: 'screen-printing', name: 'Шелкография' },
    { id: 'digital-printing', name: 'Цифровая печать' },
    { id: 'embossing', name: 'Тиснение' },
    { id: 'hand-painted', name: 'Ручная роспись' },
    { id: 'sublimation', name: 'Сублимация' }
  ];
  
  const designStyles = [
    { id: 'all', name: 'Все стили' },
    { id: 'minimalism', name: 'Минимализм' },
    { id: 'vintage', name: 'Винтаж' },
    { id: 'abstract', name: 'Абстракция' },
    { id: 'ethnic', name: 'Этнический' },
    { id: 'geometric', name: 'Геометрический' },
    { id: 'postmodernism', name: 'Постмодернизм' }
  ];
  
  const timePeriods = [
    { id: 'all', name: 'Все периоды' },
    { id: 'pre-soviet', name: 'Досоветский' },
    { id: 'soviet', name: 'Советский' },
    { id: 'independence', name: 'Период независимости' },
    { id: 'modern', name: 'Современность' },
    { id: 'future', name: 'Будущее' }
  ];
  
  const sortOptions = [
    { id: 'default', name: 'По умолчанию' },
    { id: 'price-asc', name: 'Цена: по возрастанию' },
    { id: 'price-desc', name: 'Цена: по убыванию' },
    { id: 'newest', name: 'Сначала новые' },
    { id: 'popular', name: 'По популярности' }
  ];
  
  const priceRanges = [
    { id: 'all', name: 'Любая цена', min: 0, max: 100000 },
    { id: 'under-5000', name: 'До 5 000 ₸', min: 0, max: 5000 },
    { id: '5000-10000', name: '5 000 - 10 000 ₸', min: 5000, max: 10000 },
    { id: '10000-20000', name: '10 000 - 20 000 ₸', min: 10000, max: 20000 },
    { id: 'over-20000', name: 'Свыше 20 000 ₸', min: 20000, max: 100000 }
  ];
  
  // Фильтрация элементов по всем критериям
  const filteredItems = products.filter(item => {
    // Базовые фильтры из существующей версии
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    const districtMatch = activeDistrict === 'all' || item.district === activeDistrict;
    const textureMatch = activeTexture === 'all' || item.texture === activeTexture;
    const clothingTypeMatch = activeClothingType === 'all' || item.clothingType === activeClothingType;
    const colorMatch = activeColor === 'all' || (item.colors && item.colors.includes(activeColor));
    const sizeMatch = activeSize === 'all' || (item.sizes && item.sizes.includes(activeSize));
    
    // Новые фильтры
    const materialMatch = activeMaterial === 'all' || item.material === activeMaterial;
    const collectionMatch = activeCollection === 'all' || item.collection === activeCollection;
    const seasonMatch = activeSeason === 'all' || item.season === activeSeason;
    const printTechniqueMatch = activePrintTechnique === 'all' || item.printTechnique === activePrintTechnique;
    const designStyleMatch = activeDesignStyle === 'all' || item.designStyle === activeDesignStyle;
    const timePeriodMatch = activeTimePeriod === 'all' || item.timePeriod === activeTimePeriod;
    
    // Специальные фильтры
    const ecoMatch = !isEcoOnly || item.isEco === true;
    const saleMatch = !isOnSaleOnly || item.isOnSale === true;
    const stockMatch = !inStockOnly || (item.stock && item.stock > 0);
    
    // Ценовой диапазон
    const price = item.isOnSale && item.discountPrice ? item.discountPrice : item.price;
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    
    // Новинки (за последние 30 дней)
    const isNew = new Date(item.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newMatch = !isNewOnly || isNew;
    
    return categoryMatch && districtMatch && textureMatch && 
           clothingTypeMatch && colorMatch && sizeMatch && 
           materialMatch && collectionMatch && seasonMatch && 
           printTechniqueMatch && designStyleMatch && timePeriodMatch && 
           ecoMatch && saleMatch && stockMatch && priceMatch && newMatch;
  }).sort((a, b) => {
    // Сортировка товаров
    switch (sortOrder) {
      case 'price-asc':
        const priceA = a.isOnSale && a.discountPrice ? a.discountPrice : a.price;
        const priceB = b.isOnSale && b.discountPrice ? b.discountPrice : b.price;
        return priceA - priceB;
      case 'price-desc':
        const priceDescA = a.isOnSale && a.discountPrice ? a.discountPrice : a.price;
        const priceDescB = b.isOnSale && b.discountPrice ? b.discountPrice : b.price;
        return priceDescB - priceDescA;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      default:
        return 0;
    }
  });
  
  // Добавление в корзину
  const handleAddToCart = (item: any) => {
    const cartItem = {
      id: item.id,
      name: item.title,
      price: item.price,
      quantity: quantity || 1,
      image: item.imageUrl,
      size: selectedSize || (item.sizes ? item.sizes[0] : ''),
      color: selectedColor || (item.colors ? item.colors[0] : ''),
    };

    addToCart(cartItem);
    alert('Товар добавлен в корзину!');
    // Close overlay after adding to cart
    setShowOverlay(false);
  };

  const navigation = [
    { name: 'Галерея', href: '/gallery' },
    { name: 'Районы', href: '/districts' },
    { name: 'Магазин', href: '/shop' },
    { name: 'О проекте', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];
  
  // Handle showing product details
  const handleShowDetails = (item: any) => {
    setSelectedProduct(item);
    setSelectedColor(item.colors?.[0] || null);
    setSelectedSize(item.sizes?.[0] || null);
    setQuantity(1);
    setShowOverlay(true);
    
    // Disable body scroll when overlay is shown
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  // Handle closing product details
  const handleCloseDetails = () => {
    setShowOverlay(false);
    
    // Re-enable body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  // Handle click outside to close overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseDetails();
    }
  };

  // Render color boxes
  const renderColorBoxes = (colors: string[]) => {
    return colors.map((color, idx) => (
      <div 
        key={idx} 
        onClick={() => setSelectedColor(color)}
        style={{
          width: '24px',
          height: '24px',
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
          boxShadow: color === selectedColor ? '0 0 0 2px #000' : '0 1px 3px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      />
    ));
  };

  // Добавить сброс всех фильтров
  const resetAllFilters = () => {
    setActiveCategory('all');
    setActiveDistrict('all');
    setActiveTexture('all');
    setActiveClothingType('all');
    setActiveColor('all');
    setActiveSize('all');
    setActiveMaterial('all');
    setActiveCollection('all');
    setActiveSeason('all');
    setActivePrintTechnique('all');
    setActiveDesignStyle('all');
    setActiveTimePeriod('all');
    setPriceRange([0, 100000]);
    setIsEcoOnly(false);
    setIsOnSaleOnly(false);
    setInStockOnly(false);
    setIsNewOnly(false);
    setSortOrder('default');
  };

  // Обновим компонент для отображения фильтров
  const renderFilters = () => (
    <div className="filters-container">
      <div className="filters-header d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Фильтры</h5>
        <button 
          type="button" 
          className="btn btn-link text-decoration-none p-0" 
          onClick={resetAllFilters}
        >
          Сбросить все
        </button>
      </div>

      {/* Фильтр по категории */}
      <div className="filter-section mb-3">
        <h6 className="filter-title">Категория</h6>
        <div className="filter-options">
          <div className="d-flex flex-wrap">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                className={`filter-button m-1 ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Фильтр по району */}
      <div className="filter-section mb-3">
        <h6 className="filter-title">Район</h6>
        <div className="filter-options">
          <div className="d-flex flex-wrap">
            {districts.map(district => (
              <button 
                key={district.id} 
                className={`filter-button m-1 ${activeDistrict === district.id ? 'active' : ''}`}
                onClick={() => setActiveDistrict(district.id)}
              >
                {district.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Фильтр по текстуре */}
      <div className="filter-section mb-3">
        <h6 className="filter-title">Текстура</h6>
        <div className="filter-options">
          <select
            className="form-select"
            value={activeTexture}
            onChange={(e) => setActiveTexture(e.target.value)}
          >
            {textures.map(texture => (
              <option key={texture.id} value={texture.id}>
                {texture.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Фильтр по типу одежды */}
      <div className="filter-section mb-3">
        <h6 className="filter-title">Тип одежды/предмета</h6>
        <div className="filter-options">
          <div className="d-flex flex-wrap">
            {clothingTypes.map(type => (
              <button 
                key={type.id} 
                className={`filter-button m-1 ${activeClothingType === type.id ? 'active' : ''}`}
                onClick={() => setActiveClothingType(type.id)}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Фильтр по цвету */}
      <div className="filter-section mb-3">
        <h6 className="filter-title">Цвет</h6>
        <div className="filter-options">
          <div className="d-flex flex-wrap">
            {colors.map(color => (
              <button 
                key={color.id} 
                className={`filter-button color-button m-1 ${activeColor === color.id ? 'active' : ''}`}
                onClick={() => setActiveColor(color.id)}
                style={{
                  backgroundColor: color.id !== 'all' ? color.id : 'transparent',
                  color: ['white', 'yellow', 'beige'].includes(color.id) ? '#333' : (color.id === 'all' ? '#333' : '#fff'),
                  borderColor: color.id === 'all' ? '#ddd' : color.id
                }}
              >
                {color.id === 'all' ? color.name : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Фильтр по размеру */}
      <div className="filter-section mb-3">
        <h6 className="filter-title">Размер</h6>
        <div className="filter-options">
          <div className="d-flex flex-wrap">
            {sizes.map(size => (
              <button 
                key={size.id} 
                className={`filter-button m-1 ${activeSize === size.id ? 'active' : ''}`}
                onClick={() => setActiveSize(size.id)}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Дополнительные фильтры (можно сделать раскрывающимися) */}
      <div className="filter-section mb-3">
        <button 
          className="btn btn-link p-0 text-decoration-none d-flex justify-content-between align-items-center w-100"
          onClick={() => setShowFilters(!showFilters)}
        >
          <h6 className="filter-title mb-0">Дополнительные фильтры</h6>
          <span>{showFilters ? '▲' : '▼'}</span>
        </button>
        
        {showFilters && (
          <div className="mt-3">
            {/* Фильтр по материалу */}
            <div className="mb-3">
              <h6 className="filter-subtitle">Материал</h6>
              <select 
                className="form-select" 
                value={activeMaterial} 
                onChange={(e) => setActiveMaterial(e.target.value)}
              >
                {materials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Фильтр по коллекции */}
            <div className="mb-3">
              <h6 className="filter-subtitle">Коллекция</h6>
              <select 
                className="form-select" 
                value={activeCollection} 
                onChange={(e) => setActiveCollection(e.target.value)}
              >
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Фильтр по сезону */}
            <div className="mb-3">
              <h6 className="filter-subtitle">Сезон</h6>
              <select 
                className="form-select" 
                value={activeSeason} 
                onChange={(e) => setActiveSeason(e.target.value)}
              >
                {seasons.map(season => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Фильтр по технике печати */}
            <div className="mb-3">
              <h6 className="filter-subtitle">Техника печати</h6>
              <select 
                className="form-select" 
                value={activePrintTechnique} 
                onChange={(e) => setActivePrintTechnique(e.target.value)}
              >
                {printTechniques.map(technique => (
                  <option key={technique.id} value={technique.id}>
                    {technique.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Фильтр по стилю дизайна */}
            <div className="mb-3">
              <h6 className="filter-subtitle">Стиль дизайна</h6>
              <select 
                className="form-select" 
                value={activeDesignStyle} 
                onChange={(e) => setActiveDesignStyle(e.target.value)}
              >
                {designStyles.map(style => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Фильтр по временному периоду */}
            <div className="mb-3">
              <h6 className="filter-subtitle">Исторический период</h6>
              <select 
                className="form-select" 
                value={activeTimePeriod} 
                onChange={(e) => setActiveTimePeriod(e.target.value)}
              >
                {timePeriods.map(period => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Фильтр по диапазону цен */}
            <div className="mb-3">
              <h6 className="filter-subtitle">Диапазон цен</h6>
              <div className="d-flex">
                <input 
                  type="number" 
                  className="form-control me-2" 
                  placeholder="От" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} 
                />
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="До" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])} 
                />
              </div>
            </div>
            
            {/* Фильтр по сортировке */}
            <div className="mb-3">
              <h6 className="filter-subtitle">Сортировка</h6>
              <select 
                className="form-select" 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Дополнительные чекбоксы */}
            <div className="mb-3">
              <div className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="isEcoOnly" 
                  checked={isEcoOnly} 
                  onChange={() => setIsEcoOnly(!isEcoOnly)} 
                />
                <label className="form-check-label" htmlFor="isEcoOnly">
                  Только эко-продукты
                </label>
              </div>
              
              <div className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="isOnSaleOnly" 
                  checked={isOnSaleOnly} 
                  onChange={() => setIsOnSaleOnly(!isOnSaleOnly)} 
                />
                <label className="form-check-label" htmlFor="isOnSaleOnly">
                  Только со скидкой
                </label>
              </div>
              
              <div className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="inStockOnly" 
                  checked={inStockOnly} 
                  onChange={() => setInStockOnly(!inStockOnly)} 
                />
                <label className="form-check-label" htmlFor="inStockOnly">
                  Только в наличии
                </label>
              </div>
              
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="isNewOnly" 
                  checked={isNewOnly} 
                  onChange={() => setIsNewOnly(!isNewOnly)} 
                />
                <label className="form-check-label" htmlFor="isNewOnly">
                  Только новинки
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
        
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка товаров...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 border-l-4 border-red-500 p-4">
            <h3 className="text-red-700 font-bold mb-2">Ошибка загрузки товаров:</h3>
            <p className="text-red-600">{error}</p>
            
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <MountainSvg className="mx-auto h-24 w-24 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">По заданным фильтрам товаров не найдено</h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры фильтрации или выбрать другую категорию
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                onClick={resetAllFilters}
              >
                Сбросить все фильтры
              </button>
            </div>
          </div>
        ) : (
        <>
        {/* Кнопка показать/скрыть расширенные фильтры */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '2rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {showFilters ? 'Скрыть фильтры' : 'Расширенные фильтры'}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              <path d="M8 12L2 6L3.4 4.6L8 9.2L12.6 4.6L14 6L8 12Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        {/* Расширенные фильтры */}
        {showFilters && (
          <div className="extended-filters" style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            {renderFilters()}
          </div>
        )}
        
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
        
        {/* Результаты фильтрации */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', opacity: 0.7 }}>
            Найдено товаров: <span style={{ fontWeight: 'bold' }}>{filteredItems.length}</span>
          </p>
        </div>
        
        {/* Сетка товаров магазина */}
        <div className="shop-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="shop-item" style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => handleShowDetails(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}>
                <div style={{ 
                  position: 'relative', 
                  paddingTop: '100%', 
                  overflow: 'hidden'
                }}>
                  <img
                    src={item.imageUrl || fallbackImage}
                    alt={item.title}
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
                    background: item.isOnSale ? '#e74c3c' : 'var(--primary-color)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    zIndex: 2
                  }}>
                    {item.isOnSale ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', opacity: 0.8 }}>
                          {item.price.toLocaleString('ru-RU')} {item.currency}
                        </span>
                        <span>{item.discountPrice.toLocaleString('ru-RU')} {item.currency}</span>
                      </div>
                    ) : (
                      <span>{item.price.toLocaleString('ru-RU')} {item.currency}</span>
                    )}
                  </div>
                  
                  {/* Бирки с дополнительной информацией */}
                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    zIndex: 2
                  }}>
                    {/* Бирка с районом */}
                    {item.district && item.district !== 'undefined' && districts.find(d => d.id === item.district) && (
                      <div style={{
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '2rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        whiteSpace: 'nowrap'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                        </svg>
                        {districts.find(d => d.id === item.district)?.name}
                      </div>
                    )}
                    
                    {/* Новинка */}
                    {new Date(item.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 && (
                      <div style={{
                        background: '#27ae60',
                        color: 'white',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '2rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 5.5V12.5L15 14.5L16 13L13 11.5V5.5H11ZM12 1.5C6.5 1.5 2 6 2 11.5C2 17 6.5 21.5 12 21.5C17.5 21.5 22 17 22 11.5C22 6 17.5 1.5 12 1.5Z" fill="currentColor"/>
                        </svg>
                        Новинка
                      </div>
                    )}
                    
                    {/* Эко-товар */}
                    {item.isEco && (
                      <div style={{
                        background: '#16a085',
                        color: 'white',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '2rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2 22 6.5 22 12 17.5 22 12 22M8 7L7 8 10 11 7 14 8 15 12 11 8 7M16 7L12 11 16 15 17 14 14 11 17 8 16 7Z" fill="currentColor"/>
                        </svg>
                        Эко
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
                  <div style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '0.5rem', flexGrow: 1 }}>
                    {item.description?.slice(0, 60)}...
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}>
                    {/* Доступные цвета */}
                    {item.colors && item.colors.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
                          Цвета:
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {renderColorBoxes(item.colors)}
                        </div>
                      </div>
                    )}
                    
                    {/* Доступные размеры */}
                    {item.sizes && item.sizes.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
                          Размеры:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {item.sizes.map((size, idx) => (
                            <div key={idx} style={{
                              fontSize: '0.8rem',
                              padding: '0.25rem 0.5rem',
                              background: '#f8f8f8',
                              border: '1px solid #eee',
                              borderRadius: '2px'
                            }}>
                              {size}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button 
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetails(item);
                      }}
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '3rem', 
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>По заданным фильтрам товаров не найдено</p>
              <button 
                onClick={resetAllFilters}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Сбросить все фильтры
              </button>
            </div>
          )}
        </div>
        </>
        )}
        
        {/* Дополнительная секция */}
        <div id="additional-info" style={{ textAlign: 'center', maxWidth: '800px', margin: '4rem auto 2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>Уникальные предметы с духом города</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
            Каждое изделие создано вручную и несет в себе характер определенного района или локации Алматы. 
            Выбирая нашу продукцию, вы поддерживаете локальное искусство и культурные проекты.
          </p>
          
          <Link 
            href="/custom"
            className="inline-block px-8 py-4 bg-[var(--secondary-color)] text-white rounded-full font-bold no-underline transition-transform hover:scale-105"
          >
            Создать свой дизайн
          </Link>
        </div>

        <ProductDetailsModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={modalProduct}
          onAddToCart={(product, quantity, options) => handleAddToCart(product)}
        />
      </div>
      
      {/* Product details overlay */}
      {showOverlay && selectedProduct && (
        <div 
          className="product-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
          }}
          onClick={handleOverlayClick}
        >
          <div 
            className="product-details-card"
            style={{
              background: 'white',
              borderRadius: '1rem',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: 0,
              position: 'relative',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                zIndex: 10
              }}
              onClick={handleCloseDetails}
            >
              ×
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                alignItems: 'flex-start'
              }}>
                {/* Product image */}
                <div style={{ 
                  flex: window.innerWidth < 768 ? '0 0 auto' : '0 0 50%',
                  position: 'relative'
                }}>
                  <img
                    src={selectedProduct.imageUrl || fallbackImage}
                    alt={selectedProduct.title}
                    style={{
                      width: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: '1rem',
                      borderTopRightRadius: window.innerWidth < 768 ? '1rem' : '0',
                      borderBottomLeftRadius: window.innerWidth < 768 ? '0' : '1rem',
                      maxHeight: window.innerWidth < 768 ? '300px' : 'none'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                </div>
                
                {/* Product details */}
                <div style={{ 
                  flex: window.innerWidth < 768 ? '0 0 auto' : '0 0 50%',
                  padding: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {selectedProduct.title}
                  </h2>
                  
                  <div style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 'bold',
                    color: 'var(--primary-color)',
                    marginBottom: '1rem'
                  }}>
                    {selectedProduct.price.toLocaleString('ru-RU')} {selectedProduct.currency}
                  </div>
                  
                  <div style={{ 
                    marginBottom: '1.5rem',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#444'
                  }}>
                    {selectedProduct.description}
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      Категория:
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: '#f0f0f0',
                      borderRadius: '2rem',
                      fontSize: '0.9rem'
                    }}>
                      {categories.find(c => c.id === selectedProduct.category)?.name || 'Другое'}
                    </div>
                  </div>
                  
                  {/* Color selection */}
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ 
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                      }}>
                        Выберите цвет:
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {renderColorBoxes(selectedProduct.colors)}
                      </div>
                    </div>
                  )}
                  
                  {/* Size selection */}
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ 
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                      }}>
                        Выберите размер:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedProduct.sizes.map((size: string) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: '2px solid',
                              borderColor: selectedSize === size ? 'var(--primary-color)' : '#ddd',
                              background: selectedSize === size ? 'var(--primary-color)' : 'white',
                              color: selectedSize === size ? 'white' : '#333',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              fontWeight: selectedSize === size ? 'bold' : 'normal',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Quantity */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ 
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      Количество:
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        style={{
                          width: '36px',
                          height: '36px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '4px 0 0 4px',
                          fontSize: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={selectedProduct.stock || 10}
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0 && val <= (selectedProduct.stock || 10)) {
                            setQuantity(val);
                          }
                        }}
                        style={{
                          width: '50px',
                          height: '36px',
                          border: '1px solid #ddd',
                          borderLeft: 'none',
                          borderRight: 'none',
                          textAlign: 'center',
                          fontSize: '1rem'
                        }}
                      />
                      <button
                        onClick={() => quantity < (selectedProduct.stock || 10) && setQuantity(quantity + 1)}
                        style={{
                          width: '36px',
                          height: '36px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '0 4px 4px 0',
                          fontSize: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to cart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(selectedProduct);
                    }}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    Добавить в корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Секция с социальными сетями */}
      <div id="social-section" className="social-section" style={{
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
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img src="/images/social/instagram.svg" alt="Instagram" width={60} height={60} />
            <span style={{ marginTop: '0.75rem', fontWeight: 'bold' }}>Instagram</span>
          </a>
        </div>
      </div>
      
      {/* Добавляем футер */}
      <Footer />
    </div>
  );
};

export default Shop; 