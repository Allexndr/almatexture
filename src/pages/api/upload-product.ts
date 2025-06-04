import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Align Product interface with the one used in dataSlice.ts
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  stock: number;
  colors?: string[];
  sizes?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  const uploadDir = path.join(process.cwd(), 'public/images/products');
  
  // Создаем директорию, если ее нет
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024 // 5MB
  });

  try {
    const [fields, files] = await form.parse(req);
    
    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ error: 'Изображение не загружено' });
    }
    
    const productName = fields.name?.[0] || '';
    const productPrice = parseFloat(fields.price?.[0] || '0');
    const productDescription = fields.description?.[0] || '';
    const productCategory = fields.category?.[0] || '';
    const productStock = parseInt(fields.stock?.[0] || '1', 10);
    
    // Process colors field if available
    let colors: string[] = [];
    if (fields.colors?.[0]) {
      try {
        colors = JSON.parse(fields.colors[0]);
      } catch (e) {
        console.error('Error parsing colors:', e);
      }
    }
    
    // Process sizes field if available
    let sizes: string[] = [];
    if (fields.sizes?.[0]) {
      try {
        sizes = JSON.parse(fields.sizes[0]);
      } catch (e) {
        console.error('Error parsing sizes:', e);
      }
    }
    
    // Имя файла относительно public директории
    const fileName = path.basename(imageFile.filepath);
    const imageUrl = `/images/products/${fileName}`;
    
    // Создаем новый продукт
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName,
      price: productPrice,
      imageUrl,
      description: productDescription,
      category: productCategory,
      stock: productStock,
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined
    };
    
    // Сохраняем в products.json
    const productsPath = path.join(process.cwd(), 'public/products.json');
    let products: Product[] = [];
    
    if (fs.existsSync(productsPath)) {
      const productsData = fs.readFileSync(productsPath, 'utf8');
      try {
        products = JSON.parse(productsData);
      } catch (e) {
        console.error('Error parsing products.json:', e);
      }
    }
    
    products.push(newProduct);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    
    return res.status(200).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Ошибка при загрузке товара:', error);
    return res.status(500).json({ error: 'Ошибка при загрузке товара' });
  }
} 