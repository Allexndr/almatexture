import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithQuality from './ImageWithQuality';

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string | null;
}

interface District {
  id: number;
  name: string;
  slug: string;
  color: string | null;
}

interface TextureTag {
  tagId: number;
  textureId: number;
  tag: Tag;
}

interface Texture {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageThumbnailUrl: string | null;
  districtId: number | null;
  isFeatured: boolean | null;
  viewsCount: number | null;
  district: District | null;
  tags: TextureTag[];
}

export default function FeaturedTextures() {
  // Используем статические данные вместо загрузки из API
  const staticTextures: Texture[] = [
    {
      id: 1,
      title: 'Брусчатка на Арбате',
      description: 'Историческая брусчатка в центре города',
      imageUrl: '/textures/texture1.jpg',
      imageThumbnailUrl: '/textures/texture1.jpg',
      districtId: 1,
      district: {
        id: 1,
        name: 'Медеуский',
        slug: 'medeusky',
        color: '#4285F4'
      },
      isFeatured: true,
      viewsCount: 127,
      tags: []
    },
    {
      id: 2,
      title: 'Стены Зеленого Базара',
      description: 'Текстура стен исторического рынка',
      imageUrl: '/textures/texture2.jpg',
      imageThumbnailUrl: '/textures/texture2.jpg',
      districtId: 1,
      district: {
        id: 1,
        name: 'Медеуский',
        slug: 'medeusky',
        color: '#4285F4'
      },
      isFeatured: true,
      viewsCount: 98,
      tags: []
    },
    {
      id: 4,
      title: 'Мозаика на фасаде',
      description: 'Советское архитектурное наследие',
      imageUrl: '/textures/texture4.jpg',
      imageThumbnailUrl: '/textures/texture4.jpg',
      districtId: 2,
      district: {
        id: 2,
        name: 'Алмалинский',
        slug: 'almalinsky',
        color: '#34A853'
      },
      isFeatured: true,
      viewsCount: 112,
      tags: []
    }
  ];
  
  const [textures] = useState<Texture[]>(staticTextures);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Set client-side flag after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6">Избранные текстуры</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6">Избранные текстуры</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Избранные текстуры</h2>
      
      {textures.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Нет доступных текстур</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {textures.map((texture) => (
            <div key={texture.id} className="block group">
              <Link 
                href={`/gallery/${texture.id}`}
                legacyBehavior
              >
                <a className="block">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-48">
                      {texture.imageUrl ? (
                        <ImageWithQuality 
                          src={texture.imageUrl}
                          alt={texture.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={`object-cover ${isClient ? "transition-transform duration-300 group-hover:scale-105" : ""}`}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-400">Нет изображения</p>
                        </div>
                      )}
                      
                      {texture.district && (
                        <span 
                          className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: texture.district.color || '#6b7280' }}
                        >
                          {texture.district.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`text-lg font-semibold mb-2 ${isClient ? "group-hover:text-blue-600" : ""}`}>
                        {texture.title}
                      </h3>
                      
                      {texture.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {texture.description}
                        </p>
                      )}
                      
                      {texture.tags && texture.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {texture.tags.map(({ tag }) => (
                            <span 
                              key={tag.id}
                              className="text-xs px-2 py-1 rounded-full bg-gray-100"
                              style={{ 
                                backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
                                color: tag.color || '#4b5563'
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 