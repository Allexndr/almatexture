import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Разрешаем только GET запросы для публичного API
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const { district, texture, type, search, minPrice, maxPrice } = req.query;
    
    const client = await clientPromise;
    const db = client.db('textures_app');
    
    // Формируем условия поиска для MongoDB
    const filter: any = {
      isAvailable: true  // По умолчанию показываем только доступные продукты
    };
    
    // Фильтр по району текстуры
    if (district && district !== 'all') {
      const districtDoc = await db.collection('districts').findOne({ name: district });
      if (districtDoc) {
        const textures = await db.collection('textures')
          .find({ districtId: districtDoc._id })
          .toArray();
        
        filter.textureId = { $in: textures.map(t => t._id) };
      }
    }
    
    // Фильтр по текстуре
    if (texture && texture !== 'all') {
      filter.textureId = texture;
    }
    
    // Фильтр по типу продукта
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    // Фильтр по цене
    if (minPrice || maxPrice) {
      filter.price = {};
      
      if (minPrice) {
        const min = parseFloat(minPrice as string);
        if (!isNaN(min)) {
          filter.price.$gte = min;
        }
      }
      
      if (maxPrice) {
        const max = parseFloat(maxPrice as string);
        if (!isNaN(max)) {
          filter.price.$lte = max;
        }
      }
    }
    
    // Поиск по названию или описанию
    if (search) {
      const searchRegex = { $regex: search as string, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ];
    }
    
    // Получаем продукты из базы данных
    const products = await db.collection('products')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Получаем связанные данные
    const textureIds = products
      .map(p => p.textureId)
      .filter(id => id != null);
    
    const textures = await db.collection('textures')
      .find({ _id: { $in: textureIds } })
      .toArray();
    
    const textureMap = textures.reduce((map, t) => {
      map[t._id.toString()] = t;
      return map;
    }, {});
    
    // Получаем районы для текстур
    const districtIds = textures
      .map(t => t.districtId)
      .filter(id => id != null);
    
    const districts = await db.collection('districts')
      .find({ _id: { $in: districtIds } })
      .toArray();
    
    const districtMap = districts.reduce((map, d) => {
      map[d._id.toString()] = d;
      return map;
    }, {});
    
    // Получаем теги для текстур
    const textureTags = await db.collection('texture_tags')
      .find({ textureId: { $in: textureIds } })
      .toArray();
    
    const tagIds = textureTags.map(tt => tt.tagId);
    const tags = await db.collection('tags')
      .find({ _id: { $in: tagIds } })
      .toArray();
    
    const tagMap = tags.reduce((map, t) => {
      map[t._id.toString()] = t;
      return map;
    }, {});
    
    // Получаем варианты продуктов
    const productVariants = await db.collection('product_variants')
      .find({ productId: { $in: products.map(p => p._id) } })
      .toArray();
    
    // Форматируем продукты для ответа
    const formattedProducts = products.map(product => {
      // Парсим метаданные
      let metaData = {};
      try {
        metaData = product.metaData || {};
      } catch (e) {
        metaData = {};
      }
      
      // Получаем варианты для продукта
      const variants = productVariants.filter(v => 
        v.productId.toString() === product._id.toString()
      );
      
      // Получаем доступные цвета и размеры из вариантов
      const availableColors = variants
        .filter(v => v.color)
        .map(v => v.color)
        .filter((color, index, self) => color && self.indexOf(color) === index);
      
      const availableSizes = variants
        .filter(v => v.size)
        .map(v => v.size)
        .filter((size, index, self) => size && self.indexOf(size) === index);
      
      // Получаем информацию о текстуре
      const texture = product.textureId ? textureMap[product.textureId.toString()] : null;
      const textureDistrict = texture?.districtId ? 
        districtMap[texture.districtId.toString()]?.name : 'Не указан';
      
      // Получаем теги текстуры
      const textureTagDocs = texture ? 
        textureTags.filter(tt => tt.textureId.toString() === texture._id.toString()) : [];
      const textureTags = textureTagDocs
        .map(tt => tagMap[tt.tagId.toString()]?.name)
        .filter(Boolean);
      
      return {
        id: product._id.toString(),
        name: product.name,
        description: product.description || '',
        price: product.price,
        discountPrice: product.discountPrice,
        type: product.type || 'other',
        stockQuantity: product.stockQuantity || 0,
        isAvailable: product.isAvailable,
        texture: texture ? {
          id: texture._id.toString(),
          title: texture.title,
          district: textureDistrict,
          imageUrl: texture.imageUrl || '',
          tags: textureTags
        } : null,
        variants: variants.map(v => ({
          id: v._id.toString(),
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
    });
    
    // Получаем все типы продуктов для фильтрации
    const productTypes = await db.collection('products').distinct('type');
    
    // Получаем диапазон цен
    const priceRange = await db.collection('products').aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: null,
          min_price: { $min: '$price' },
          max_price: { $max: '$price' }
        }
      }
    ]).toArray();
    
    // Форматируем типы продуктов
    const types = [
      { id: 'all', name: 'Все типы' },
      ...productTypes.map(pt => ({
        id: pt || 'other',
        name: formatProductType(pt || 'other')
      }))
    ];
    
    return res.status(200).json({
      products: formattedProducts,
      types,
      priceRange: priceRange[0] || { min_price: 0, max_price: 0 },
      totalCount: formattedProducts.length
    });
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

// Функция для форматирования типа продукта
function formatProductType(type: string): string {
  const typeMap: Record<string, string> = {
    'tshirt': 'Футболки',
    't-shirt': 'Футболки',
    'shirt': 'Рубашки',
    'hoodie': 'Худи',
    'sweatshirt': 'Свитшоты',
    'pants': 'Брюки',
    'jeans': 'Джинсы',
    'jacket': 'Куртки',
    'accessory': 'Аксессуары',
    'bag': 'Сумки',
    'print': 'Принты',
    'poster': 'Постеры',
    'sticker': 'Стикеры',
    'other': 'Другое'
  };
  
  return typeMap[type.toLowerCase()] || type;
} 