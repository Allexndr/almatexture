import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('textures_app');
    
    // Получаем все товары из коллекции products
    const products = await db.collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    // Форматируем товары для ответа
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountPrice: product.discountPrice || null,
      category: product.category || '',
      stock: product.stock || 0,
      imageUrl: product.imageUrl || '',
      district: product.district || '',
      texture: product.texture || '',
      clothingType: product.clothingType || '',
      material: product.material || '',
      collection: product.collection || '',
      season: product.season || '',
      printTechnique: product.printTechnique || '',
      designStyle: product.designStyle || '',
      isEco: product.isEco || false,
      isOnSale: product.isOnSale || false,
      timePeriod: product.timePeriod || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: product.updatedAt?.toISOString() || new Date().toISOString()
    }));
    
    res.status(200).json({ 
      success: true, 
      products: formattedProducts,
      count: formattedProducts.length
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Ошибка получения товаров' });
  }
} 