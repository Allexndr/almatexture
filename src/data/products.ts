export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'tshirt' | 'poster' | 'postcard' | 'album' | 'other';
  options?: {
    colors?: Array<{
      name: string;
      value: string;
      hex: string;
    }>;
    sizes?: string[];
  };
  stock: number;
  relatedTextureId?: string;
  featured: boolean;
  createdAt: string;
}

const products: Product[] = [
  {
    id: '1',
    title: 'Футболка "Кирпичная стена"',
    description: 'Стильная футболка с принтом исторической кирпичной кладки из Алмалинского района.',
    price: 7500,
    currency: '₸',
    imageUrl: '/images/products/tshirt-brick-wall.jpg',
    thumbnailUrl: '/images/products/thumbs/tshirt-brick-wall.jpg',
    category: 'tshirt',
    options: {
      colors: [
        { name: 'Белый', value: 'white', hex: '#FFFFFF' },
        { name: 'Черный', value: 'black', hex: '#000000' },
        { name: 'Серый', value: 'gray', hex: '#808080' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    stock: 25,
    relatedTextureId: '1',
    featured: true,
    createdAt: '2023-01-20T14:30:00Z'
  },
  {
    id: '2',
    title: 'Постер "Мозаика"',
    description: 'Высококачественная печать мозаичного панно из Медеуского района на плотной бумаге формата А2.',
    price: 5000,
    currency: '₸',
    imageUrl: '/images/products/poster-mosaic.jpg',
    thumbnailUrl: '/images/products/thumbs/poster-mosaic.jpg',
    category: 'poster',
    stock: 40,
    relatedTextureId: '2',
    featured: true,
    createdAt: '2023-02-25T10:15:00Z'
  },
  {
    id: '3',
    title: 'Набор открыток "Текстуры Алматы"',
    description: 'Набор из 10 открыток с различными текстурами города. Идеально для коллекции или подарка.',
    price: 3000,
    currency: '₸',
    imageUrl: '/images/products/postcards-set.jpg',
    thumbnailUrl: '/images/products/thumbs/postcards-set.jpg',
    category: 'postcard',
    stock: 100,
    featured: true,
    createdAt: '2023-03-15T09:45:00Z'
  },
  {
    id: '4',
    title: 'Фотоальбом "Текстуры Алматы"',
    description: 'Полный фотоальбом с текстурами всех районов города и описанием их исторического и культурного значения.',
    price: 12000,
    currency: '₸',
    imageUrl: '/images/products/album-textures.jpg',
    thumbnailUrl: '/images/products/thumbs/album-textures.jpg',
    category: 'album',
    stock: 15,
    featured: true,
    createdAt: '2023-04-10T15:20:00Z'
  },
  {
    id: '5',
    title: 'Футболка "Металлическая решетка"',
    description: 'Футболка с принтом кованой металлической решетки из Ауэзовского района.',
    price: 7500,
    currency: '₸',
    imageUrl: '/images/products/tshirt-metal-grid.jpg',
    thumbnailUrl: '/images/products/thumbs/tshirt-metal-grid.jpg',
    category: 'tshirt',
    options: {
      colors: [
        { name: 'Белый', value: 'white', hex: '#FFFFFF' },
        { name: 'Черный', value: 'black', hex: '#000000' },
        { name: 'Серый', value: 'gray', hex: '#808080' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    stock: 20,
    relatedTextureId: '4',
    featured: false,
    createdAt: '2023-05-05T11:35:00Z'
  },
  {
    id: '6',
    title: 'Постер "Бетонные формы"',
    description: 'Художественный постер с изображением брутальных бетонных форм из Алатауского района.',
    price: 5000,
    currency: '₸',
    imageUrl: '/images/products/poster-concrete.jpg',
    thumbnailUrl: '/images/products/thumbs/poster-concrete.jpg',
    category: 'poster',
    stock: 35,
    relatedTextureId: '6',
    featured: false,
    createdAt: '2023-06-20T13:50:00Z'
  }
];

export default products; 