import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { featured, limit, district } = req.query;
  
  try {
    // Fallback textures when database is not available
    const fallbackTextures = [
      {
        id: 1,
        title: 'Брусчатка на Арбате',
        description: 'Историческая брусчатка в центре города',
        districtId: 1,
        district: {
          id: 1,
          name: 'Медеуский',
          slug: 'medeusky',
          color: '#4285F4'
        },
        imageUrl: '/textures/texture1.jpg',
        imageThumbnailUrl: '/textures/texture1.jpg',
        coordinates: JSON.stringify({
          type: 'Point',
          coordinates: [76.9452, 43.2584]
        }),
        isFeatured: true,
        viewsCount: 127,
        createdAt: new Date().toISOString(),
        tags: []
      },
      {
        id: 2,
        title: 'Стены Зеленого Базара',
        description: 'Текстура стен исторического рынка',
        districtId: 1,
        district: {
          id: 1,
          name: 'Медеуский',
          slug: 'medeusky',
          color: '#4285F4'
        },
        imageUrl: '/textures/texture2.jpg',
        imageThumbnailUrl: '/textures/texture2.jpg',
        coordinates: JSON.stringify({
          type: 'Point',
          coordinates: [76.9422, 43.2573]
        }),
        isFeatured: true,
        viewsCount: 98,
        createdAt: new Date().toISOString(),
        tags: []
      },
      {
        id: 3,
        title: 'Кора деревьев в городском парке',
        description: 'Природная текстура городской среды',
        districtId: 2,
        district: {
          id: 2,
          name: 'Алмалинский',
          slug: 'almalinsky',
          color: '#34A853'
        },
        imageUrl: '/textures/texture3.jpg',
        imageThumbnailUrl: '/textures/texture3.jpg',
        coordinates: JSON.stringify({
          type: 'Point',
          coordinates: [76.9384, 43.2482]
        }),
        isFeatured: false,
        viewsCount: 64,
        createdAt: new Date().toISOString(),
        tags: []
      },
      {
        id: 4,
        title: 'Мозаика на фасаде',
        description: 'Советское архитектурное наследие',
        districtId: 2,
        district: {
          id: 2,
          name: 'Алмалинский',
          slug: 'almalinsky',
          color: '#34A853'
        },
        imageUrl: '/textures/texture4.jpg',
        imageThumbnailUrl: '/textures/texture4.jpg',
        coordinates: JSON.stringify({
          type: 'Point',
          coordinates: [76.9322, 43.2532]
        }),
        isFeatured: true,
        viewsCount: 112,
        createdAt: new Date().toISOString(),
        tags: []
      }
    ];
    
    try {
      let textures;
      
      // Try to get textures from database
      if (featured === 'true') {
        textures = await prisma.texture.findMany({
          where: {
            isFeatured: true,
            ...(district ? { districtId: parseInt(district as string) } : {})
          },
          include: {
            district: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          take: limit ? parseInt(limit as string) : undefined
        });
      } else {
        textures = await prisma.texture.findMany({
          where: {
            ...(district ? { districtId: parseInt(district as string) } : {})
          },
          include: {
            district: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          take: limit ? parseInt(limit as string) : undefined
        });
      }
      
      if (textures && textures.length > 0) {
        return res.status(200).json(textures);
      } else {
        console.log('No textures in database, using fallback data');
        // Используем fallback данные вместо выбрасывания ошибки
        let result = fallbackTextures;
        
        if (featured === 'true') {
          result = fallbackTextures.filter(t => t.isFeatured);
        }
        
        if (district) {
          result = result.filter(t => t.districtId === parseInt(district as string));
        }
        
        if (limit) {
          result = result.slice(0, parseInt(limit as string));
        }
        
        return res.status(200).json(result);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return fallback textures
      let result = fallbackTextures;
      
      if (featured === 'true') {
        result = fallbackTextures.filter(t => t.isFeatured);
      }
      
      if (district) {
        result = result.filter(t => t.districtId === parseInt(district as string));
      }
      
      if (limit) {
        result = result.slice(0, parseInt(limit as string));
      }
      
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 