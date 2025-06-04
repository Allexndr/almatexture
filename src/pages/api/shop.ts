import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'public', 'products.json');

// Вспомогательная функция для чтения файла товаров
const readProductsFile = () => {
  try {
    // Если файл не существует, возвращаем пустой массив
    if (!fs.existsSync(PRODUCTS_FILE)) {
      console.error('Файл products.json не найден');
      return [];
    }
    
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(fileContent);
    console.log('Прочитано товаров из файла:', products.length);
    return products;
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем данные о товарах из файла
    const products = readProductsFile();
    console.log(`API shop: Возвращаем ${products.length} товаров`);
    
    // Создаем данные о районах из товаров
    const uniqueDistricts = [...new Set(products
      .map((p: any) => p.district)
      .filter(Boolean)
    )];
    
    const districts = uniqueDistricts.map(name => ({
      id: name,
      name,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16) // случайный цвет
    }));
    
    // Создаем данные о текстурах из товаров
    const uniqueTextures = [...new Set(products
      .map((p: any) => p.texture)
      .filter(Boolean)
    )];
    
    const textures = uniqueTextures.map((texture, index) => ({
      id: index + 1,
      title: texture
    }));
    
    // Возвращаем успешный ответ с товарами
    return res.status(200).json({
      products: products,
      metadata: {
        districts: [
          { id: 'all', name: 'Все районы' },
          ...districts
        ],
        textures: [
          { id: 'all', name: 'Все текстуры' },
          ...textures
        ],
        totalCount: products.length
      }
    });
  } catch (error: any) {
    console.error('Error loading products:', error);
    return res.status(500).json({ error: error.message || 'Ошибка загрузки товаров' });
  }
} 