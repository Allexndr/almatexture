import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable';
import { uploadImage } from '../../../lib/uploadImage';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    
    // Получаем данные из полей формы
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const district = Array.isArray(fields.district) ? fields.district[0] : fields.district;
    const tags = Array.isArray(fields.tags) ? fields.tags[0] : fields.tags;
    const coordinates = Array.isArray(fields.coordinates) ? fields.coordinates[0] : fields.coordinates;
    const isFeatured = Array.isArray(fields.isFeatured) ? fields.isFeatured[0] : fields.isFeatured;
    
    if (!title) {
      return res.status(400).json({ error: 'Название текстуры обязательно' });
    }
    
    // Проверяем наличие изображения
    const imageFile = files.image;
    if (!imageFile || imageFile.length === 0) {
      return res.status(400).json({ error: 'Изображение обязательно' });
    }
    
    const file = imageFile[0];
    
    // Читаем файл в буфер
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Загружаем в Cloudinary
    const uploadResult = await uploadImage(fileBuffer);
    
    // Удаляем временный файл
    fs.unlinkSync(file.filepath);
    
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
      imageUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.public_id,
      coordinates: coordinates || null,
      isFeatured: isFeatured === 'true',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const textureResult = await db.collection('textures').insertOne(newTexture);
    
    // Обрабатываем теги
    if (tags) {
      const tagNames = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      
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
      imageUrl: uploadResult.url,
      coordinates: coordinates ? JSON.parse(coordinates) : null,
      isFeatured: isFeatured === 'true',
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({ 
      success: true, 
      texture: createdTexture,
      cloudinary: {
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format
      }
    });
  } catch (err) {
    console.error('Error creating texture:', err);
    return res.status(500).json({ error: 'Ошибка создания текстуры' });
  }
} 