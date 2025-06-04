import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import products from '../../data/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productsJsonPath = path.join(process.cwd(), 'public/products.json');
    
    // Проверяем существование директории
    const dir = path.dirname(productsJsonPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Проверяем существование файла
    if (!fs.existsSync(productsJsonPath)) {
      console.log('products.json not found, creating with default data');
      
      // Преобразуем товары из data/products.ts в формат для JSON
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.title,
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        image: product.imageUrl,
        category: product.category,
        stock: product.stock
      }));
      
      // Записываем начальные данные в файл
      fs.writeFileSync(productsJsonPath, JSON.stringify(formattedProducts, null, 2));
      
      return res.status(201).json({
        success: true,
        message: 'products.json created with default data',
        count: formattedProducts.length
      });
    }
    
    // Если файл существует, просто возвращаем информацию о нем
    const fileContent = fs.readFileSync(productsJsonPath, 'utf8');
    const products = JSON.parse(fileContent);
    
    return res.status(200).json({
      success: true,
      message: 'products.json already exists',
      count: products.length
    });
  } catch (error) {
    console.error('Error ensuring products.json:', error);
    return res.status(500).json({ error: 'Error ensuring products.json file', details: error.message });
  }
} 