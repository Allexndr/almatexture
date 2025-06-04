import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  hasColorOptions: boolean;
  hasSizeOptions: boolean;
  colors?: string[];
  sizes?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Простая обработка CORS для локальной разработки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { method } = req;
  console.log(`API: ${method} запрос к /api/admin/products`);

  try {
    const client = await clientPromise;
    const db = client.db('textures_app');

    // Получение списка товаров
    if (method === 'GET') {
      // Прямое обращение к MongoDB
      const products = await db.collection('products')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      // Преобразуем данные в нужный формат для админки
      const formattedProducts = products.map((product: any) => ({
        id: product._id.toString(),
        title: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock,
        hasColorOptions: product.colors && product.colors.length > 0,
        hasSizeOptions: product.sizes && product.sizes.length > 0,
        colors: product.colors || [],
        sizes: product.sizes || []
      }));
      
      console.log(`API GET: Возвращаем ${formattedProducts.length} товаров из MongoDB`);
      return res.status(200).json(formattedProducts);
    }

    // Добавление нового товара
    if (method === 'POST') {
      try {
        console.log('API POST: Начинаем добавление товара');
        
        const productData = req.body;
        
        if (!productData || typeof productData !== 'object') {
          console.error('API POST: Некорректные данные товара');
          return res.status(400).json({ error: 'Некорректные данные товара' });
        }
        
        // Проверяем обязательные поля
        if (!productData.title || !productData.imageUrl || !productData.price) {
          return res.status(400).json({ error: 'Не заполнены обязательные поля' });
        }
        
        // Создаем новый товар для MongoDB
        const newProduct = {
          name: productData.title,
          description: productData.description || '',
          price: parseFloat(productData.price),
          category: productData.category || '',
          stock: parseInt(productData.stock) || 1,
          imageUrl: productData.imageUrl,
          colors: productData.colors || [],
          sizes: productData.sizes || [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        console.log('API POST: Сохраняем товар в MongoDB:', newProduct);
        
        // Вставляем товар в MongoDB
        const result = await db.collection('products').insertOne(newProduct);
        
        // Преобразуем ответ обратно в формат админки
        const adminProduct = {
          id: result.insertedId.toString(),
          title: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          category: newProduct.category,
          imageUrl: newProduct.imageUrl,
          stock: newProduct.stock,
          hasColorOptions: newProduct.colors && newProduct.colors.length > 0,
          hasSizeOptions: newProduct.sizes && newProduct.sizes.length > 0,
          colors: newProduct.colors,
          sizes: newProduct.sizes
        };
        
        console.log('API POST: Товар успешно добавлен в MongoDB');
        return res.status(201).json({ success: true, product: adminProduct });
      } catch (error: any) {
        console.error('API POST: Ошибка:', error);
        return res.status(500).json({ error: `Серверная ошибка: ${error.message}` });
      }
    }

    // Обновление товара
    if (method === 'PUT') {
      // TODO: Реализовать обновление через MongoDB API
      return res.status(501).json({ error: 'Обновление товаров пока не реализовано' });
    }

    // Удаление товара
    if (method === 'DELETE') {
      // TODO: Реализовать удаление через MongoDB API
      return res.status(501).json({ error: 'Удаление товаров пока не реализовано' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API: Ошибка подключения к MongoDB:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 