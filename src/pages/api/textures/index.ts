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
    const { district, tag, search } = req.query;
    
    const client = await clientPromise;
    const db = client.db('textures_app');
    
    // Формируем условия поиска для MongoDB
    const filter: any = {};
    
    // Фильтр по району
    if (district && district !== 'all') {
      const districtDoc = await db.collection('districts').findOne({ name: district });
      if (districtDoc) {
        filter.districtId = districtDoc._id;
      }
    }
    
    // Поиск по названию или описанию
    if (search) {
      const searchRegex = { $regex: search as string, $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }
    
    // Получаем текстуры из базы данных
    const textures = await db.collection('textures')
      .find(filter)
      .sort({ _id: 1 })
      .toArray();
    
    // Получаем дополнительные данные для текстур
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
    const textureTagRelations = await db.collection('texture_tags')
      .find({ textureId: { $in: textures.map(t => t._id) } })
      .toArray();
    
    const tagIds = textureTagRelations.map(tt => tt.tagId);
    const tags = await db.collection('tags')
      .find({ _id: { $in: tagIds } })
      .toArray();
    
    const tagMap = tags.reduce((map, t) => {
      map[t._id.toString()] = t;
      return map;
    }, {});
    
    // Формируем ответ с текстурами, районами и тегами
    const formattedTextures = textures.map(texture => {
      // Получаем теги для текстуры
      const textureTagDocs = textureTagRelations.filter(tt => 
        tt.textureId.toString() === texture._id.toString()
      );
      const textureTagNames = textureTagDocs
        .map(tt => tagMap[tt.tagId.toString()]?.name)
        .filter(Boolean);
      
      // Парсим координаты
      let coordinates;
      try {
        coordinates = texture.coordinates ? JSON.parse(texture.coordinates) : null;
      } catch (e) {
        coordinates = null;
      }
      
      const district = texture.districtId ? 
        districtMap[texture.districtId.toString()]?.name : 'Не указан';
      
      return {
        id: texture._id.toString(),
        title: texture.title,
        description: texture.description || '',
        district,
        imageUrl: texture.imageUrl || '',
        tags: textureTagNames,
        coordinates,
        createdAt: texture.createdAt?.toISOString() || new Date().toISOString()
      };
    });
    
    // Получаем список всех районов для фильтрации
    const allDistricts = await db.collection('districts')
      .find()
      .sort({ name: 1 })
      .toArray();
    
    // Форматируем районы для использования на фронтенде
    const formattedDistricts = [
      { id: 'all', name: 'Все районы' },
      ...allDistricts.map(district => ({
        id: district.name,
        name: district.name,
        color: district.color || null
      }))
    ];
    
    // Получаем популярные теги
    const popularTags = await db.collection('tags')
      .find()
      .limit(10)
      .toArray();
    
    return res.status(200).json({
      textures: formattedTextures,
      districts: formattedDistricts,
      tags: popularTags.map(tag => tag.name),
      totalCount: formattedTextures.length
    });
  } catch (error) {
    console.error('Ошибка при получении текстур:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
} 