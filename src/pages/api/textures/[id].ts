import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Разрешаем только GET запросы для публичного API
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Некорректный ID текстуры' });
  }

  try {
    // Получаем текстуру по ID
    const texture = await prisma.texture.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        district: true,
        tags: {
          include: {
            tag: true
          }
        },
        products: {
          where: {
            isAvailable: true
          },
          take: 6,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!texture) {
      return res.status(404).json({ error: 'Текстура не найдена' });
    }
    
    // Обновляем счетчик просмотров
    await prisma.texture.update({
      where: { id: parseInt(id) },
      data: {
        viewsCount: (texture.viewsCount || 0) + 1
      }
    });
    
    // Парсим координаты из строки JSON
    let coordinates;
    try {
      coordinates = texture.coordinates ? JSON.parse(texture.coordinates) : null;
    } catch (e) {
      coordinates = null;
    }
    
    // Получаем похожие текстуры (с тем же районом или тегами)
    const tagIds = texture.tags.map(t => t.tagId);
    const similarTextures = await prisma.texture.findMany({
      where: {
        AND: [
          { id: { not: parseInt(id) } }, // Исключаем текущую текстуру
          {
            OR: [
              { districtId: texture.districtId }, // Тот же район
              { 
                tags: {
                  some: {
                    tagId: { in: tagIds }  // Те же теги
                  }
                }
              }
            ]
          }
        ]
      },
      include: {
        district: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      take: 4,
      orderBy: [
        { isFeatured: 'desc' },
        { viewsCount: 'desc' }
      ]
    });
    
    // Форматируем детали текстуры
    const formattedTexture = {
      id: texture.id,
      title: texture.title,
      description: texture.description || '',
      district: texture.district?.name || 'Не указан',
      districtColor: texture.district?.color || null,
      imageUrl: texture.imageUrl || '',
      tags: texture.tags.map(t => t.tag.name),
      coordinates,
      createdAt: texture.createdAt?.toISOString() || new Date().toISOString(),
      isFeatured: texture.isFeatured || false,
      viewsCount: texture.viewsCount || 0,
      products: texture.products.map(product => ({
        id: product.id,
        name: product.name,
        type: product.type,
        price: product.price,
        discountPrice: product.discountPrice,
        isAvailable: product.isAvailable
      }))
    };
    
    // Форматируем похожие текстуры
    const formattedSimilarTextures = similarTextures.map(texture => {
      let coords;
      try {
        coords = texture.coordinates ? JSON.parse(texture.coordinates) : null;
      } catch (e) {
        coords = null;
      }
      
      return {
        id: texture.id,
        title: texture.title,
        description: texture.description || '',
        district: texture.district?.name || 'Не указан',
        imageUrl: texture.imageUrl || '',
        tags: texture.tags.map(t => t.tag.name),
        coordinates: coords,
        isFeatured: texture.isFeatured || false
      };
    });
    
    return res.status(200).json({
      texture: formattedTexture,
      similarTextures: formattedSimilarTextures
    });
  } catch (error) {
    console.error('Ошибка при получении текстуры:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    await prisma.$disconnect();
  }
} 