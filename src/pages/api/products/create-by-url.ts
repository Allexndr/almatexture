import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import cloudinary from '../../../config/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const { 
      name, 
      price, 
      description, 
      category, 
      stock, 
      imageUrl,
      district,
      texture,
      clothingType,
      material,
      collection,
      season,
      printTechnique,
      designStyle,
      isEco,
      isOnSale,
      discountPrice,
      timePeriod,
      colors,
      sizes
    } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Название товара обязательно' });
    }
    
    if (!price || price <= 0) {
      return res.status(400).json({ error: 'Цена должна быть больше 0' });
    }
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL изображения обязателен' });
    }
    
    // Проверяем, что URL от Cloudinary
    if (!imageUrl.includes('res.cloudinary.com/dm9fwh2oq/')) {
      return res.status(400).json({ error: 'URL должен быть от вашего Cloudinary аккаунта' });
    }
    
    // Извлекаем public_id из URL
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
    
    // Создаем новый товар
    const newProduct = {
      name,
      price: parseFloat(price),
      description: description || '',
      category: category || '',
      stock: parseInt(stock) || 1,
      imageUrl: cloudinaryInfo.secure_url,
      cloudinaryPublicId: cloudinaryInfo.public_id,
      district: district || '',
      texture: texture || '',
      clothingType: clothingType || '',
      material: material || '',
      collection: collection || '',
      season: season || '',
      printTechnique: printTechnique || '',
      designStyle: designStyle || '',
      isEco: isEco === true,
      isOnSale: isOnSale === true,
      discountPrice: isOnSale && discountPrice ? parseFloat(discountPrice) : null,
      timePeriod: timePeriod || '',
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const productResult = await db.collection('products').insertOne(newProduct);
    
    // Возвращаем созданный товар
    const createdProduct = {
      id: productResult.insertedId.toString(),
      ...newProduct,
      createdAt: newProduct.createdAt.toISOString(),
      updatedAt: newProduct.updatedAt.toISOString()
    };
    
    res.status(201).json({ 
      success: true, 
      product: createdProduct,
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
    console.error('Error creating product by URL:', err);
    return res.status(500).json({ error: 'Ошибка создания товара' });
  }
} 