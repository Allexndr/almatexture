import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import clientPromise from '../../../lib/mongodb';

// Helper function to update the textures.json file
async function saveTexturesToFile(textures: any[]) {
  try {
    const texturesPath = path.join(process.cwd(), 'public', 'textures.json');
    fs.writeFileSync(texturesPath, JSON.stringify(textures, null, 2));
    console.log(`Saved ${textures.length} textures to file`);
    return true;
  } catch (error) {
    console.error('Error saving textures to file:', error);
    return false;
  }
}

// Helper function to read textures from file
async function readTexturesFromFile() {
  try {
    const texturesPath = path.join(process.cwd(), 'public', 'textures.json');
    const fileContent = fs.readFileSync(texturesPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading textures from file:', error);
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Обработка GET запроса для получения всех текстур
  if (req.method === 'GET') {
    try {
      let formattedTextures = [];
      
      try {
        // Подключаемся к MongoDB
        const client = await clientPromise;
        const db = client.db('textures_app');
        
        // Получаем текстуры из базы данных
        const textures = await db.collection('textures')
          .find({})
          .sort({ _id: 1 })
          .toArray();
        
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
        
        // Преобразуем в формат, совместимый с фронтендом
        formattedTextures = textures.map(texture => {
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
            id: parseInt(texture._id.toString().slice(-8), 16), // Создаем числовой ID из ObjectId
            title: texture.title,
            description: texture.description || '',
            district,
            imageUrl: texture.imageUrl || '',
            tags: textureTagNames,
            coordinates,
            createdAt: texture.createdAt?.toISOString() || new Date().toISOString()
          };
        });
      } catch (dbError) {
        console.error('MongoDB Error, falling back to JSON file:', dbError);
        
        // Если подключение к MongoDB не удалось, используем файл textures.json
        try {
          const textures = await readTexturesFromFile();
          formattedTextures = textures;
          console.log(`Loaded ${formattedTextures.length} textures from file`);
        } catch (fileError) {
          console.error('Error reading textures.json:', fileError);
          throw new Error('Не удалось загрузить данные текстур ни из MongoDB, ни из файла');
        }
      }
      
      return res.status(200).json(formattedTextures);
    } catch (error) {
      console.error('Error reading textures:', error);
      return res.status(500).json({ error: 'Ошибка при получении текстур' });
    }
  }
  
  // Обработка POST запроса для добавления новой текстуры
  if (req.method === 'POST') {
    try {
      // Получаем данные из JSON body вместо FormData
      const { title, description, district, tags, imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'URL изображения обязателен' });
      }
      
      // Форматируем объект текстуры
      const tagNames = tags ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];
      let coordinates = null;
      
      try {
        // Подключаемся к MongoDB
        const client = await clientPromise;
        const db = client.db('textures_app');
        
        // Находим или создаем район
        let districtDoc = await db.collection('districts').findOne({ name: district });
        if (!districtDoc) {
          const districtResult = await db.collection('districts').insertOne({
            name: district,
            slug: district.toLowerCase().replace(/\s+/g, '-'),
            createdAt: new Date()
          });
          districtDoc = { _id: districtResult.insertedId, name: district };
        }
        
        // Создаем текстуру
        const textureResult = await db.collection('textures').insertOne({
          title,
          description: description || '',
          districtId: districtDoc._id,
          imageUrl,
          coordinates: coordinates ? JSON.stringify(coordinates) : null,
          createdAt: new Date()
        });
        
        // Обрабатываем теги
        if (tagNames.length > 0) {
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
          id: parseInt(textureResult.insertedId.toString().slice(-8), 16),
          title,
          description: description || '',
          district: district,
          imageUrl,
          coordinates,
          tags: tagNames,
          createdAt: new Date().toISOString()
        };
        
        return res.status(200).json({ success: true, texture: createdTexture });
      } catch (dbError) {
        console.error('MongoDB error, falling back to file system', dbError);
        
        // Fallback to using JSON file
        try {
          // Read current textures
          const textures = await readTexturesFromFile();
          
          // Generate a new ID
          const maxId = textures.length > 0 ? Math.max(...textures.map((t: any) => t.id)) : 0;
          const newId = maxId + 1;
          
          // Create new texture object
          const newTexture = {
            id: newId,
            title,
            description,
            district: district,
            imageUrl,
            tags: tagNames,
            coordinates,
            createdAt: new Date().toISOString()
          };
          
          // Add to textures array and save to file
          textures.push(newTexture);
          await saveTexturesToFile(textures);
          
          return res.status(200).json({ success: true, texture: newTexture });
        } catch (fileError) {
          console.error('Error saving to JSON file:', fileError);
          throw new Error('Не удалось сохранить текстуру');
        }
      }
    } catch (error) {
      console.error('Error uploading texture:', error);
      return res.status(500).json({ error: 'Ошибка при загрузке текстуры' });
    }
  }
  
  // Обработка DELETE запроса для удаления текстуры
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID текстуры не указан' });
      }

      try {
        // Подключаемся к MongoDB
        const client = await clientPromise;
        const db = client.db('textures_app');
        
        // Находим текстуру по ID (будем искать по числовому ID из строки запроса)
        // Сначала попробуем найти по различным критериям
        let textureToDelete = null;
        
        // Попытка 1: прямой поиск по _id если это ObjectId
        try {
          const { ObjectId } = require('mongodb');
          if (ObjectId.isValid(id)) {
            textureToDelete = await db.collection('textures').findOne({ _id: new ObjectId(id) });
          }
        } catch (e) {
          // Игнорируем ошибку ObjectId
        }
        
        // Попытка 2: поиск по всем записям и сравнение с числовым ID
        if (!textureToDelete) {
          const allTextures = await db.collection('textures').find({}).toArray();
          textureToDelete = allTextures.find(texture => {
            const numericId = parseInt(texture._id.toString().slice(-8), 16);
            return numericId.toString() === id.toString();
          });
        }
        
        if (!textureToDelete) {
          return res.status(404).json({ error: 'Текстура не найдена' });
        }
        
        // Удаляем связи с тегами
        await db.collection('texture_tags').deleteMany({
          textureId: textureToDelete._id
        });
        
        // Удаляем саму текстуру
        await db.collection('textures').deleteOne({
          _id: textureToDelete._id
        });
        
      } catch (dbError) {
        console.error('MongoDB error on DELETE, falling back to file', dbError);
        
        // Fallback to using JSON file
        try {
          // Read current textures
          const textures = await readTexturesFromFile();
          
          // Filter out the deleted texture
          const filteredTextures = textures.filter((texture: any) => texture.id !== Number(id));
          
          if (textures.length === filteredTextures.length) {
            return res.status(404).json({ error: 'Текстура не найдена' });
          }
          
          // Save filtered textures back to file
          await saveTexturesToFile(filteredTextures);
        } catch (fileError) {
          console.error('Error handling file-based delete:', fileError);
          throw new Error('Не удалось удалить текстуру');
        }
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting texture:', error);
      return res.status(500).json({ error: 'Ошибка при удалении текстуры' });
    }
  }
  
  // Обработка PUT запроса для обновления текстуры
  if (req.method === 'PUT') {
    try {
      // Получаем данные из JSON body вместо FormData
      const { id, title, description, district, tags, imageUrl } = req.body;
      
      // Проверяем ID текстуры
      if (!id) {
        return res.status(400).json({ error: 'ID текстуры не указан' });
      }

      // Данные для обновления
      const tagNames = tags ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];
      let coordinates = null;

      try {
        // Подключаемся к MongoDB
        const client = await clientPromise;
        const db = client.db('textures_app');
        
        // Находим текстуру по условию (здесь нужно будет найти правильный способ поиска)
        // Поскольку у нас числовой ID из ObjectId, нам нужно найти текстуру другим способом
        const existingTexture = await db.collection('textures').findOne({ title }); // Временно ищем по названию
        
        if (!existingTexture) {
          return res.status(404).json({ error: 'Текстура не найдена' });
        }

        // Находим или создаем район
        let districtDoc = await db.collection('districts').findOne({ name: district });
        if (!districtDoc) {
          const districtResult = await db.collection('districts').insertOne({
            name: district,
            slug: district.toLowerCase().replace(/\s+/g, '-'),
            createdAt: new Date()
          });
          districtDoc = { _id: districtResult.insertedId, name: district };
        }

        // Обновляем текстуру
        const updateData: any = {
          title,
          description,
          districtId: districtDoc._id,
          coordinates: coordinates ? JSON.stringify(coordinates) : null
        };

        // Добавляем URL изображения, если он указан
        if (imageUrl) {
          updateData.imageUrl = imageUrl;
        }

        // Обновляем текстуру в базе данных
        await db.collection('textures').updateOne(
          { _id: existingTexture._id },
          { $set: updateData }
        );

        // Обновляем теги
        // Сначала удаляем все существующие связи
        await db.collection('texture_tags').deleteMany({
          textureId: existingTexture._id
        });

        // Затем добавляем новые теги
        if (tagNames.length > 0) {
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

            // Создаем связь между текстурой и тегом
            await db.collection('texture_tags').insertOne({
              textureId: existingTexture._id,
              tagId: tagDoc._id,
              createdAt: new Date()
            });
          }
        }

        const updatedTexture = {
          id: parseInt(existingTexture._id.toString().slice(-8), 16),
          title,
          description,
          district,
          imageUrl: imageUrl || existingTexture.imageUrl,
          coordinates,
          tags: tagNames,
          createdAt: existingTexture.createdAt?.toISOString() || new Date().toISOString()
        };

        return res.status(200).json({ success: true, texture: updatedTexture });
      } catch (dbError) {
        console.error('MongoDB error on UPDATE, falling back to file', dbError);
        
        // Fallback to using JSON file
        try {
          // Read current textures
          const textures = await readTexturesFromFile();
          
          // Find the texture to update
          const textureIndex = textures.findIndex((t: any) => t.id === Number(id));
          
          if (textureIndex === -1) {
            return res.status(404).json({ error: 'Текстура не найдена' });
          }
          
          // Update the texture
          const existingTexture = textures[textureIndex];
          const updatedTexture = {
            ...existingTexture,
            title,
            description,
            district,
            tags: tagNames
          };
          
          // Add new image if provided
          if (imageUrl) {
            updatedTexture.imageUrl = imageUrl;
          }
          
          // Update the texture in the array
          textures[textureIndex] = updatedTexture;
          
          // Save updated textures back to file
          await saveTexturesToFile(textures);
          
          return res.status(200).json({ success: true, texture: updatedTexture });
        } catch (fileError) {
          console.error('Error updating texture in file:', fileError);
          throw new Error('Не удалось обновить текстуру');
        }
      }
    } catch (error) {
      console.error('Error updating texture:', error);
      return res.status(500).json({ error: 'Ошибка при обновлении текстуры' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

interface Texture {
  id: number;
  title: string;
  description: string;
  district: string;
  imageUrl: string;
  tags: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
} 