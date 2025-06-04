import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sanmemik2000:9dX2yUpRzso2A0MU@cluster0.aism76i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;
  
  try {
    // Создаем подключение с настройками для Vercel
    client = new MongoClient(MONGODB_URI, {
      tls: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 1,
      retryWrites: true
    });

    // Подключаемся к MongoDB
    await client.connect();
    
    // Тестируем подключение
    const db = client.db('textures_app');
    const collections = await db.listCollections().toArray();
    
    // Пробуем получить несколько текстур
    const texturesCollection = db.collection('textures');
    const textureCount = await texturesCollection.countDocuments();
    
    return res.status(200).json({
      status: 'success',
      message: 'MongoDB connection successful',
      database: 'textures_app',
      collections: collections.map(c => c.name),
      textureCount: textureCount
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error.message,
      type: error.constructor.name
    });
    
  } finally {
    if (client) {
      await client.close();
    }
  }
} 