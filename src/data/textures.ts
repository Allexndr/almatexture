export interface Texture {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  imageThumbnailUrl?: string;
  district: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  tags: string[];
  featured: boolean;
  createdAt: string;
}

// Пример данных о текстурах
const textures: Texture[] = [
  {
    id: '1',
    title: 'Кирпичная стена, Алмалинский район',
    description: 'Историческая кирпичная кладка на фасаде здания 1960-х годов в центре города. Характерный образец советской архитектуры.',
    imagePath: '/images/textures/brick-wall-almaly.jpg',
    imageThumbnailUrl: '/images/textures/thumbs/brick-wall-almaly.jpg',
    district: 'Алмалинский',
    location: {
      lat: 43.25,
      lng: 76.95,
      address: 'ул. Фурманова, 174'
    },
    tags: ['кирпич', 'стена', 'советская архитектура'],
    featured: true,
    createdAt: '2023-01-15T12:00:00Z'
  },
  {
    id: '2',
    title: 'Мозаика, Медеуский район',
    description: 'Фрагмент мозаичного панно у подножия гор Медеу. Яркое сочетание цветов и геометрических форм.',
    imagePath: '/images/textures/mosaic-medeu.jpg',
    imageThumbnailUrl: '/images/textures/thumbs/mosaic-medeu.jpg',
    district: 'Медеуский',
    location: {
      lat: 43.18,
      lng: 77.05,
      address: 'Горная долина Медеу'
    },
    tags: ['мозаика', 'панно', 'геометрия'],
    featured: true,
    createdAt: '2023-02-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Деревянный узор, Бостандыкский район',
    description: 'Традиционная резьба по дереву на фасаде частного дома в стиле казахских орнаментов.',
    imagePath: '/images/textures/wooden-pattern-bostandyk.jpg',
    imageThumbnailUrl: '/images/textures/thumbs/wooden-pattern-bostandyk.jpg',
    district: 'Бостандыкский',
    location: {
      lat: 43.22,
      lng: 76.87,
      address: 'мкр. Орбита-2, 11'
    },
    tags: ['дерево', 'резьба', 'орнамент', 'традиции'],
    featured: false,
    createdAt: '2023-03-10T09:15:00Z'
  },
  {
    id: '4',
    title: 'Металлическая решетка, Ауэзовский район',
    description: 'Кованая металлическая решетка с геометрическим узором, характерная для архитектуры района.',
    imagePath: '/images/textures/metal-grid-auezov.jpg',
    imageThumbnailUrl: '/images/textures/thumbs/metal-grid-auezov.jpg',
    district: 'Ауэзовский',
    location: {
      lat: 43.24,
      lng: 76.85,
      address: 'просп. Абая, 109'
    },
    tags: ['металл', 'ковка', 'решетка', 'геометрия'],
    featured: true,
    createdAt: '2023-04-05T16:45:00Z'
  },
  {
    id: '5',
    title: 'Каменная кладка, Турксибский район',
    description: 'Природный камень в обрамлении здания старой постройки. Уникальный образец использования локальных материалов.',
    imagePath: '/images/textures/stone-wall-turksib.jpg',
    imageThumbnailUrl: '/images/textures/thumbs/stone-wall-turksib.jpg',
    district: 'Турксибский',
    location: {
      lat: 43.33,
      lng: 76.94,
      address: 'ул. Майлина, 55'
    },
    tags: ['камень', 'кладка', 'фасад'],
    featured: false,
    createdAt: '2023-05-12T11:20:00Z'
  },
  {
    id: '6',
    title: 'Бетонные формы, Алатауский район',
    description: 'Брутализм в архитектуре нового района. Бетонные элементы с интересной фактурой и формой.',
    imagePath: '/images/textures/concrete-alatau.jpg',
    imageThumbnailUrl: '/images/textures/thumbs/concrete-alatau.jpg',
    district: 'Алатауский',
    location: {
      lat: 43.34,
      lng: 76.91,
      address: 'мкр. Акбулак, 10а'
    },
    tags: ['бетон', 'брутализм', 'фактура'],
    featured: true,
    createdAt: '2023-06-18T13:40:00Z'
  }
];

export default textures; 