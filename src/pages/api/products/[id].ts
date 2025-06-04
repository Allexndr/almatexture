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
    return res.status(400).json({ error: 'Некорректный ID продукта' });
  }

  try {
    // Получаем продукт по ID
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        texture: {
          include: {
            district: true,
            tags: {
              include: {
                tag: true
              }
            }
          }
        },
        variants: true
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }
    
    // Парсим метаданные
    let metaData = {};
    try {
      metaData = product.metaData ? JSON.parse(product.metaData) : {};
    } catch (e) {
      metaData = {};
    }
    
    // Получаем доступные цвета и размеры из вариантов
    const availableColors = product.variants
      .filter(v => v.color)
      .map(v => v.color)
      .filter((color, index, self) => color && self.indexOf(color) === index);
    
    const availableSizes = product.variants
      .filter(v => v.size)
      .map(v => v.size)
      .filter((size, index, self) => size && self.indexOf(size) === index);
    
    // Получаем похожие продукты (с той же текстурой или типом)
    const similarProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: parseInt(id) } }, // Исключаем текущий продукт
          { isAvailable: true },
          {
            OR: [
              { textureId: product.textureId },  // Та же текстура
              { type: product.type }  // Тот же тип
            ]
          }
        ]
      },
      include: {
        texture: true,
        variants: true
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Форматируем детали продукта
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountPrice: product.discountPrice,
      type: product.type || 'other',
      stockQuantity: product.stockQuantity || 0,
      isAvailable: product.isAvailable,
      texture: product.texture ? {
        id: product.texture.id,
        title: product.texture.title,
        description: product.texture.description || '',
        district: product.texture.district?.name || 'Не указан',
        imageUrl: product.texture.imageUrl || '',
        tags: product.texture.tags.map(t => t.tag.name)
      } : null,
      variants: product.variants.map(v => ({
        id: v.id,
        color: v.color,
        size: v.size,
        priceAdjustment: v.priceAdjustment,
        stockQuantity: v.stockQuantity,
        isAvailable: v.isAvailable
      })),
      availableColors,
      availableSizes,
      metaData
    };
    
    // Форматируем похожие продукты
    const formattedSimilarProducts = similarProducts.map(product => {
      let metaData = {};
      try {
        metaData = product.metaData ? JSON.parse(product.metaData) : {};
      } catch (e) {
        metaData = {};
      }
      
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        type: product.type,
        imageUrl: product.texture?.imageUrl || '',
        textureName: product.texture?.title || '',
        district: product.texture?.district?.name || ''
      };
    });
    
    return res.status(200).json({
      product: formattedProduct,
      similarProducts: formattedSimilarProducts
    });
  } catch (error) {
    console.error('Ошибка при получении продукта:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    await prisma.$disconnect();
  }
} 