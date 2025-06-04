import React, { useState, useRef, useEffect } from 'react';

interface District {
  id: string;
  name: string;
  description: string;
  features: string[];
  color: string;
  hoverColor: string;
  path: string;
  labelPosition: {
    x: number;
    y: number;
  };
  fullName: string;
  shortName: string;
  characteristics: string;
  keyFeatures: string[];
  infrastructure: string[];
  recommendation: string;
}

interface DistrictMapProps {
  className?: string;
}

const DistrictMap: React.FC<DistrictMapProps> = ({ className }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);
  
  const districts: District[] = [
    {
      id: 'medeu',
      name: 'Медеуский',
      shortName: 'Мед',
      fullName: 'Медеуский район',
      description: 'Престижный район, сочетающий в себе историческое наследие и природные красоты',
      features: ['Высокогорный каток «Медеу»', 'Горнолыжный курорт «Шымбулак»', 'Дворец Республики'],
      color: '#64B5F6',
      hoverColor: '#42A5F5',
      path: 'M580,120 L670,170 L650,230 L620,260 L570,340 L520,370 L490,380 L450,380 L420,350 L390,320 L440,180 L490,110 L530,110 L580,120',
      labelPosition: { x: 530, y: 230 },
      characteristics: 'Престижный район, сочетающий в себе историческое наследие и природные красоты',
      keyFeatures: [
        'Расположен в предгорьях Заилийского Алатау',
        'Здесь находятся знаменитые достопримечательности: высокогорный каток «Медеу», горнолыжный курорт «Шымбулак» и плотина на реке Малая Алматинка',
        'Район славится своими зелёными зонами и чистым воздухом'
      ],
      infrastructure: [
        'Развитая сеть образовательных и медицинских учреждений',
        'Многочисленные культурные объекты: театры, музеи, концертные залы'
      ],
      recommendation: 'Поклонникам исторического центра, бизнесменам, эстетам'
    },
    {
      id: 'almaly',
      name: 'Алмалинский',
      shortName: 'Алм',
      fullName: 'Алмалинский район',
      description: 'Исторический центр города, сочетающий в себе культурное наследие и современную жизнь',
      features: ['Театры им. Ауэзова, Лермонтова, Оперный им. Абая', 'Арбат', 'Уличные музыканты'],
      color: '#81C784',
      hoverColor: '#66BB6A',
      path: 'M390,180 L440,180 L440,280 L420,320 L390,320 L350,340 L300,330 L270,320 L290,230 L350,190 L390,180',
      labelPosition: { x: 370, y: 260 },
      characteristics: 'Исторический центр города, сочетающий в себе культурное наследие и современную жизнь',
      keyFeatures: [
        'Здесь находятся главные театры, музеи и университеты города',
        'Район известен своими архитектурными памятниками и уютными улицами',
        'Арбат, уличные музыканты, кафе и атмосфера «старого города»'
      ],
      infrastructure: [
        'Развитая сеть общественного транспорта',
        'Многочисленные кафе, рестораны и бутики'
      ],
      recommendation: 'Активным, креативным и тем, кто хочет жить «в движении»'
    },
    {
      id: 'bostandyk',
      name: 'Бостандыкский',
      shortName: 'Бос',
      fullName: 'Бостандыкский район',
      description: 'Современный район с развитой инфраструктурой и деловой активностью',
      features: ['Esentai Mall', 'Mega Alma-Ata', 'Цирк'],
      color: '#FFF176',
      hoverColor: '#FFEE58',
      path: 'M490,380 L520,370 L570,340 L620,400 L600,460 L530,510 L490,520 L420,490 L380,450 L350,340 L390,320 L420,350 L450,380 L490,380',
      labelPosition: { x: 490, y: 420 },
      characteristics: 'Современный район с развитой инфраструктурой и деловой активностью',
      keyFeatures: [
        'Здесь расположены крупные бизнес-центры и торгово-развлекательные комплексы, такие как «Esentai Mall» и «Mega Alma-Ata»',
        'Район активно застраивается современными жилыми комплексами',
        '4 станции метро и толпы студентов: более 70 тысяч!'
      ],
      infrastructure: [
        'Развитая транспортная сеть, включая станции метро',
        'Наличие престижных образовательных учреждений и медицинских центров'
      ],
      recommendation: 'Молодым специалистам, студентам, семьям, ценящим комфорт'
    },
    {
      id: 'alatau',
      name: 'Алатауский',
      shortName: 'Ала',
      fullName: 'Алатауский район',
      description: 'Один из новых районов города, активно развивающийся и застраивающийся',
      features: ['Алматы Арена', 'Спортивная деревня', 'Alatau Creative Hub'],
      color: '#EF9A9A',
      hoverColor: '#EF5350',
      path: 'M50,100 L150,120 L230,160 L290,230 L270,320 L230,400 L150,420 L80,430 L50,300 L20,200 L50,100',
      labelPosition: { x: 150, y: 260 },
      characteristics: 'Один из новых районов города, активно развивающийся и застраивающийся',
      keyFeatures: [
        'Здесь расположены крупные спортивные объекты, такие как «Алматы Арена»',
        'Район привлекает молодых семей благодаря доступному жилью',
        'Нуркент развивается как культурно-молодёжный анклав с коворкингами, кружками и арт-площадками'
      ],
      infrastructure: [
        'Строительство новых школ, детских садов и медицинских учреждений',
        'Развитие транспортной сети и дорожной инфраструктуры'
      ],
      recommendation: 'Семьям, которые ищут баланс между ценой и инфраструктурой'
    },
    {
      id: 'auezov',
      name: 'Ауэзовский',
      shortName: 'Ауэ',
      fullName: 'Ауэзовский район',
      description: 'Спальный, удобный, без излишеств',
      features: ['Grand Park', 'ТРЦ «Москва»', 'Автовокзал «Сайран»'],
      color: '#AED581',
      hoverColor: '#9CCC65',
      path: 'M270,320 L300,330 L350,340 L380,450 L330,520 L270,540 L210,535 L190,520 L150,420 L230,400 L270,320',
      labelPosition: { x: 280, y: 420 },
      characteristics: 'Спальный, удобный, без излишеств',
      keyFeatures: [
        'Преобладает многоэтажная застройка советского периода',
        'Район отличается высокой плотностью населения',
        'Центров развлечений здесь меньше, но есть Grand Park, ТРЦ «Москва» и автовокзал «Сайран»'
      ],
      infrastructure: [
        'Наличие школ, детских садов, поликлиник и торговых центров',
        'Метро есть, инфраструктура выстроена',
        'Основу экономики составляет малый и средний бизнес'
      ],
      recommendation: 'Семьям, пенсионерам, и тем, кто просто хочет стабильности'
    },
    {
      id: 'turksib',
      name: 'Турксибский',
      shortName: 'Тур',
      fullName: 'Турксибский район',
      description: 'Промышленный район с развитой транспортной инфраструктурой',
      features: ['Международный аэропорт Алматы', 'Железнодорожный вокзал'],
      color: '#F48FB1',
      hoverColor: '#F06292',
      path: 'M150,120 L230,160 L290,230 L350,190 L390,180 L440,180 L380,100 L150,120',
      labelPosition: { x: 270, y: 160 },
      characteristics: 'Промышленный район с развитой транспортной инфраструктурой',
      keyFeatures: [
        'Здесь расположен международный аэропорт Алматы',
        'Район известен своими промышленными предприятиями и логистическими центрами',
        'Здесь нет сейсмических разломов - аргумент, который мало кто обсуждает, но все ценят'
      ],
      infrastructure: [
        'Развитая сеть железнодорожных и автомобильных дорог',
        'Наличие образовательных учреждений и жилых кварталов',
        'Аэропорт, вокзал «Алматы-1», рынки, спортивные залы'
      ],
      recommendation: 'Тем, кому важна доступность транспорта и разумная цена'
    },
    {
      id: 'nauryzbay',
      name: 'Наурызбайский',
      shortName: 'Нау',
      fullName: 'Наурызбайский район',
      description: 'Самый молодой район Алматы, образованный в 2014 году, с экологически чистой средой',
      features: ['Экологически чистая зона', 'Новостройки', 'Доступные цены'],
      color: '#9575CD',
      hoverColor: '#7E57C2',
      path: 'M80,430 L150,420 L190,520 L210,535 L180,570 L120,600 L50,580 L20,520 L60,460 L80,430',
      labelPosition: { x: 120, y: 520 },
      characteristics: 'Самый молодой район Алматы, образованный в 2014 году, с экологически чистой средой',
      keyFeatures: [
        'Район активно застраивается новыми жилыми комплексами',
        'Привлекает жителей своей близостью к природе и чистым воздухом',
        'Цены на жилье пока ещё доступны'
      ],
      infrastructure: [
        'Строительство новых образовательных и медицинских учреждений',
        'Развитие дорожной сети и общественного транспорта',
        'Повсюду стройки, появляются школы, дороги, медучреждения'
      ],
      recommendation: 'Тем, кто ищет недорогое жильё и не боится быть первопроходцем'
    },
    {
      id: 'zhetysu',
      name: 'Жетысуский',
      shortName: 'Жет',
      fullName: 'Жетысуский район',
      description: 'Один из старейших районов города с богатой историей и культурным наследием',
      features: ['Вокзал «Алматы-2»', 'Ипподром', 'Оптовые базы'],
      color: '#4FC3F7',
      hoverColor: '#29B6F6',
      path: 'M20,200 L50,100 L50,300 L80,430 L60,460 L20,520 L20,200',
      labelPosition: { x: 40, y: 320 },
      characteristics: 'Один из старейших районов города с богатой историей и культурным наследием',
      keyFeatures: [
        'Здесь находятся исторические здания и памятники архитектуры',
        'Район известен своими рынками и торговыми улицами',
        'Более 900 предприятий, оптовые базы, вокзал «Алматы-2», ипподром'
      ],
      infrastructure: [
        'Развитая сеть общественного транспорта',
        'Наличие образовательных учреждений и медицинских центров',
        'Логистика отличная, но воздух не такой чистый, как в Медеу'
      ],
      recommendation: 'Практичным и деловым, кто не боится заводского антуража'
    }
  ];
  
  const tooltipStyles = {
    position: 'absolute' as const,
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
    maxWidth: '250px',
    zIndex: 1000,
    opacity: 0,
    transform: 'translateY(10px)',
    pointerEvents: 'none' as const,
    transition: 'opacity 0.8s ease, transform 0.8s ease',
    transitionDelay: '0.5s',
  };

  const districtPathStyles = (fill: string) => ({
    fill,
    fillOpacity: 0.8,
    stroke: '#333',
    strokeWidth: 1,
    cursor: 'pointer',
    transition: 'fill 0.6s ease, transform 0.6s ease',
    transitionDelay: '0.3s',
  });

  const handleDistrictMouseEnter = (district: District, e: React.MouseEvent<SVGPathElement>) => {
    // Clear any existing timeouts
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    // Set a timeout to prevent rapid flickering - increase delay from 50ms to 300ms
    hoverTimeoutRef.current = setTimeout(() => {
      setSelectedDistrict(district);
      
      // Get the position for the tooltip
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        const offsetX = 15; // Offset from cursor to prevent flickering
        const offsetY = 15;
        
        setTooltipPosition({
          x: e.clientX - svgRect.left + offsetX,
          y: e.clientY - svgRect.top + offsetY,
        });
      }

      // Show tooltip with longer delay to ensure smooth transitions
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = setTimeout(() => {
        setTooltipVisible(true);
      }, 150);
    }, 300);
  };
  
  const handleDistrictMouseLeave = () => {
    // Clear hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Hide tooltip with delay
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    
    // Delay hiding the tooltip to prevent flickering
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipVisible(false);
      
      // Only clear the selected district if modal is not open
      if (!isModalOpen) {
        setTimeout(() => {
          setSelectedDistrict(null);
        }, 500); // Increased delay for clearing selected district
      }
    }, 300); // Increased delay before tooltip disappears
  };
  
  const handleDistrictClick = (district: District) => {
    // Очищаем таймер при клике
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    setSelectedDistrict(district);
    setTooltipVisible(false);
    setIsModalOpen(true);
    
    // Блокировка прокрутки страницы
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    
    // Восстановление прокрутки страницы
    document.body.style.overflow = '';
  };
  
  return (
    <div className={`district-map ${className || ''}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg 
        viewBox="0 0 800 600" 
        style={{ 
          width: '100%', 
          height: '100%',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
        }}
        ref={svgRef}
      >
        {/* Фон карты */}
        <defs>
          <linearGradient id="cityBackground" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9f9f9" />
            <stop offset="100%" stopColor="#f0f0f0" />
          </linearGradient>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="cityPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#f9f9f9" />
            <circle cx="10" cy="10" r="1" fill="#e0e0e0" />
          </pattern>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9E9E9E" />
            <stop offset="60%" stopColor="#757575" />
          </linearGradient>
          <linearGradient id="snowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
        
        {/* Базовый фон карты */}
        <rect 
          x="0" y="0" width="800" height="700" 
          fill="url(#cityPattern)"
        />
        
        {/* Горы на юге */}
        <path
          d="M190,520 L240,490 L270,540 L310,520 L330,540 L380,500 L420,530 L460,500 L490,520 L530,510 L570,530 L600,460"
          fill="url(#mountainGradient)"
          stroke="#757575"
          strokeWidth="1"
        />
        <path
          d="M240,490 L255,455 L270,490 L295,470 L310,520"
          fill="url(#snowGradient)"
          stroke="#E0E0E0"
          strokeWidth="0.5"
        />
        <path
          d="M330,540 L345,480 L360,490 L380,500"
          fill="url(#snowGradient)"
          stroke="#E0E0E0"
          strokeWidth="0.5"
        />
        <path
          d="M460,500 L475,460 L490,480 L500,460 L520,490 L530,510"
          fill="url(#snowGradient)"
          stroke="#E0E0E0"
          strokeWidth="0.5"
        />
        
        {/* Границы города */}
        <path 
          d="M20,200 L50,100 L150,120 L230,160 L380,100 L490,110 L530,110 L580,120 L670,170 L650,230 L620,260 L570,340 L620,400 L600,460 L570,530 L530,510 L490,520 L420,490 L380,450 L330,520 L270,540 L210,535 L180,570 L120,600 L50,580 L20,520 L20,200"
          fill="none"
          stroke="#888"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Основные дороги */}
        <g stroke="#bbb" strokeWidth="2.5" fill="none">
          <path d="M300,330 L380,450" />
          <path d="M270,320 L390,320" />
          <path d="M150,120 L380,100" />
          <path d="M150,420 L380,450" />
          <path d="M290,230 L390,320" />
          <path d="M350,340 L490,380" />
          <path d="M80,430 L50,300" />
        </g>
        
        {/* Второстепенные дороги */}
        <g stroke="#ccc" strokeWidth="1.5" fill="none">
          <path d="M230,160 L290,230" />
          <path d="M150,120 L290,230" />
          <path d="M290,230 L440,180" />
          <path d="M270,320 L230,400" />
          <path d="M350,340 L420,350" />
          <path d="M490,380 L570,340" />
          <path d="M390,180 L440,180" />
        </g>
        
        {/* Реки */}
        <path 
          d="M440,180 L420,350 L380,450" 
          fill="none"
          stroke="#90CAF9"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1, 3"
        />
        
        <path 
          d="M570,340 L490,380 L350,340 L270,320" 
          fill="none"
          stroke="#90CAF9"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1, 2"
        />
        
        {/* Районы */}
        {districts.map((district) => (
          <path
            key={district.id}
            d={district.path}
            fill={selectedDistrict?.id === district.id ? district.hoverColor : district.color}
            stroke={selectedDistrict?.id === district.id ? '#333' : '#555'}
            strokeWidth={selectedDistrict?.id === district.id ? 1.5 : 1}
            onMouseEnter={(e) => handleDistrictMouseEnter(district, e)}
            onMouseLeave={handleDistrictMouseLeave}
            onClick={() => handleDistrictClick(district)}
            style={districtPathStyles(selectedDistrict?.id === district.id ? district.hoverColor : district.color)}
          />
        ))}
        
        {/* Добавляем надписи районов с полными названиями */}
        {districts.map((district) => (
          <g key={`label-${district.id}`}>
            <circle 
              cx={district.labelPosition.x} 
              cy={district.labelPosition.y} 
              r={12}
              fill="white"
              stroke="#333"
              strokeWidth="1"
              opacity="0.8"
            />
            <text
              x={district.labelPosition.x}
              y={district.labelPosition.y + 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#333"
            >
              {district.name}
            </text>
          </g>
        ))}
        
        {/* Символы города */}
        <g>
          {/* Центр города */}
          <circle
            cx="370"
            cy="320"
            r="6"
            fill="#333"
            stroke="#fff"
            strokeWidth="2"
          />
          <text
            x="370"
            y="345"
            fontSize="12"
            fill="#333"
            fontWeight="bold"
            textAnchor="middle"
          >
            Центр
          </text>
          
          {/* Аэропорт */}
          <g transform="translate(220, 130)">
            <rect x="-8" y="-8" width="16" height="16" fill="white" stroke="#555" strokeWidth="1" />
            <path d="M-6,-2 L6,-2 L0,-6 Z" fill="#555" />
            <rect x="-1" y="-2" width="2" height="8" fill="#555" />
          </g>
          <text x="220" y="115" fontSize="10" fill="#555" textAnchor="middle">Аэропорт</text>
          
          {/* Метро */}
          <g>
            <circle cx="370" cy="390" r="4" fill="red" stroke="white" strokeWidth="1" />
            <circle cx="440" cy="410" r="4" fill="red" stroke="white" strokeWidth="1" />
            <circle cx="330" cy="450" r="4" fill="red" stroke="white" strokeWidth="1" />
            <circle cx="290" cy="280" r="4" fill="red" stroke="white" strokeWidth="1" />
          </g>
        </g>
        
        {/* Компас */}
        <g transform="translate(740, 60)">
          <circle cx="0" cy="0" r="25" fill="white" fillOpacity="0.8" stroke="#888" strokeWidth="1" />
          {/* Север (С) - Красный указатель */}
          <path d="M0,-20 L6,-5 H-6 Z" fill="#C62828" />
          <path d="M0,-20 L0,0" stroke="#C62828" strokeWidth="1.5" />
          {/* Юг (Ю) */}
          <path d="M0,20 L6,5 H-6 Z" fill="#333" />
          {/* Запад (З) */}
          <path d="M-20,0 L-5,6 V-6 Z" fill="#333" />
          {/* Восток (В) */}
          <path d="M20,0 L5,6 V-6 Z" fill="#333" />
          {/* Центральный круг */}
          <circle cx="0" cy="0" r="3" fill="#555" />
          {/* Буквы */}
          <text x="0" y="-28" fontSize="10" fill="#C62828" textAnchor="middle" fontWeight="bold">С</text>
          <text x="0" y="33" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">Ю</text>
          <text x="-28" y="4" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">З</text>
          <text x="28" y="4" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">В</text>
        </g>
      </svg>
      
      {/* Всплывающая подсказка при наведении */}
      {selectedDistrict && !isModalOpen && (
        <div 
          className="district-tooltip"
          style={tooltipStyles}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{selectedDistrict.name} район</h3>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#555' }}>{selectedDistrict.description}</p>
          <div style={{ fontSize: '0.8rem', color: '#777' }}>Нажмите для подробной информации</div>
        </div>
      )}
      
      {/* Модальное окно с полной информацией при клике */}
      {isModalOpen && selectedDistrict && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflow: 'hidden'
          }}
          onClick={closeModal}
        >
          <div 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '1rem', 
              maxWidth: '700px', 
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              overscrollBehavior: 'contain',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              height: '12px', 
              backgroundColor: selectedDistrict.color, 
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem'
            }}></div>
            
            <button 
              onClick={closeModal}
              style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px',
                background: 'none', 
                border: 'none', 
                fontSize: '1.5rem', 
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s',
                color: '#333',
                backgroundColor: 'rgba(0, 0, 0, 0.05)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            >
              ×
            </button>
            
            <div style={{ padding: '1.5rem 2rem 2rem' }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                color: '#333', 
                marginTop: '0.5rem',
                marginBottom: '1.5rem',
                borderBottom: `2px solid ${selectedDistrict.color}`,
                paddingBottom: '0.5rem',
                display: 'inline-block'
              }}>
                {selectedDistrict.fullName}
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '0.5rem' }}>Характеристика</h3>
                <p style={{ lineHeight: '1.6', color: '#333' }}>{selectedDistrict.characteristics}</p>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '0.5rem' }}>Ключевые особенности</h3>
                <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                  {selectedDistrict.keyFeatures.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', color: '#333' }}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '0.5rem' }}>Инфраструктура</h3>
                <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                  {selectedDistrict.infrastructure.map((item, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', color: '#333' }}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ 
                backgroundColor: selectedDistrict.color + '20',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                marginTop: '2rem'
              }}>
                <h3 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '0.5rem' }}>Кому подойдёт</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#333' }}>{selectedDistrict.recommendation}</p>
              </div>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2rem'
              }}>
                <button 
                  onClick={closeModal}
                  style={{ 
                    backgroundColor: selectedDistrict.color,
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = selectedDistrict.hoverColor}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = selectedDistrict.color}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Легенда карты внизу */}
      <div style={{ 
        position: 'absolute', 
        bottom: '15px', 
        left: '15px', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <span style={{ color: '#333', fontWeight: 'bold' }}>Алматы</span>
          <span style={{ color: '#555' }}>• Административные районы</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
            <div style={{ width: '8px', height: '3px', backgroundColor: '#90CAF9', marginRight: '3px' }}></div>
            <span>Реки</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#757575', marginRight: '3px' }}></div>
            <span>Горы</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'red', marginRight: '3px' }}></div>
            <span>Метро</span>
          </div>
        </div>
      </div>
      
      {/* Update the CSS in the return statement for district paths and tooltips */}
      <style jsx>{`
        :global(.district-tooltip) {
          transition: opacity 0.8s ease, transform 0.8s ease;
          transition-delay: 0.5s;
          will-change: opacity, transform;
          pointer-events: none;
        }
        
        :global(.district-path) {
          transition: fill 0.6s ease, transform 0.6s ease;
          transition-delay: 0.3s;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default DistrictMap; 