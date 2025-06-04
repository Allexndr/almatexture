import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import cloudinary from '../../../config/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const { title, description, district, tags, coordinates, isFeatured, imageUrl } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Название текстуры обязательно' });
    }
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL изображения обязателен' });
    }
    
    // Проверяем, что URL от Cloudinary
    if (!imageUrl.includes('res.cloudinary.com/dm9fwh2oq/')) {
      return res.status(400).json({ error: 'URL должен быть от вашего Cloudinary аккаунта' });
    }
    
    // Извлекаем public_id из URL более точно
    // URL format: https://res.cloudinary.com/dm9fwh2oq/image/upload/v1749009968/Park_of_first_president_plitka_s0enmh.jpg
    const urlMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (!urlMatch) {
      return res.status(400).json({ error: 'Неверный формат URL Cloudinary' });
    }
    
    const publicId = urlMatch[1];
    console.log('Extracted public_id:', publicId);
    
    // Получаем информацию об изображении из Cloudinary
    let cloudinaryInfo;
    try {
      cloudinaryInfo = await cloudinary.api.resource(publicId);
    } catch (error) {
      console.error('Cloudinary API error:', error);
      // Если не получилось через API, создаем фейковую информацию
      cloudinaryInfo = {
        public_id: publicId,
        secure_url: imageUrl,
        width: 800,
        height: 600,
        format: 'jpg',
        resource_type: 'image'
      };
      console.log('Using fallback cloudinary info:', cloudinaryInfo);
    }
    
    // Подключаемся к базе данных
    const client = await clientPromise;
    const db = client.db('textures_app');
    
    // Находим или создаем район
    let districtId = null;
    if (district && district !== 'Не указан') {
      let districtDoc = await db.collection('districts').findOne({ name: district });
      if (!districtDoc) {
        const insertResult = await db.collection('districts').insertOne({
          name: district,
          color: null,
          createdAt: new Date()
        });
        districtId = insertResult.insertedId;
      } else {
        districtId = districtDoc._id;
      }
    }
    
    // Создаем новую текстуру
    const newTexture = {
      title,
      description: description || '',
      districtId,
      imageUrl: cloudinaryInfo.secure_url,
      cloudinaryPublicId: cloudinaryInfo.public_id,
      coordinates: coordinates || null,
      isFeatured: isFeatured === true || isFeatured === 'true',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const textureResult = await db.collection('textures').insertOne(newTexture);
    
    // Обрабатываем теги
    if (tags) {
      const tagNames = Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      
      for (const tagName of tagNames) {
        // Находим или создаем тег
        let tagDoc = await db.collection('tags').findOne({ name: tagName });
        if (!tagDoc) {
          const tagResult = await db.collection('tags').insertOne({
            name: tagName,
            createdAt: new Date()
          });
          tagDoc = { _id: tagResult.insertedId, name: tagName };
        }
        
        // Связываем тег с текстурой
        await db.collection('texture_tags').insertOne({
          textureId: textureResult.insertedId,
          tagId: tagDoc._id,
          createdAt: new Date()
        });
      }
    }
    
    // Возвращаем созданную текстуру
    const createdTexture = {
      id: textureResult.insertedId.toString(),
      title,
      description: description || '',
      district: district || 'Не указан',
      imageUrl: cloudinaryInfo.secure_url,
      coordinates: coordinates ? (typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates) : null,
      isFeatured: isFeatured === true || isFeatured === 'true',
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({ 
      success: true, 
      texture: createdTexture,
      cloudinary: {
        public_id: cloudinaryInfo.public_id,
        width: cloudinaryInfo.width,
        height: cloudinaryInfo.height,
        format: cloudinaryInfo.format,
        resource_type: cloudinaryInfo.resource_type,
        url: cloudinaryInfo.secure_url
      }
    });
  } catch (err) {
    console.error('Error creating texture by URL:', err);
    return res.status(500).json({ error: 'Ошибка создания текстуры' });
  }
} 