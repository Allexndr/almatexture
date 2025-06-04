import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { formidable } from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
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
    maxFileSize: 10 * 1024 * 1024 // 10MB
  });

  try {
    const [fields, files] = await form.parse(req);

    const id = fields.id ? String(fields.id[0]) : '';
    if (!id) {
      return res.status(400).json({ error: 'ID товара обязателен' });
    }

    try {
      // Путь к JSON файлу с товарами
      const productsPath = path.join(process.cwd(), 'public/products.json');
      
      // Проверяем существование файла
      if (!fs.existsSync(productsPath)) {
        return res.status(404).json({ error: 'Файл с товарами не найден' });
      }
      
      // Читаем текущий список товаров
      const fileData = fs.readFileSync(productsPath, 'utf8');
      let products = JSON.parse(fileData);
      
      // Находим индекс товара для обновления
      const productIndex = products.findIndex((p: any) => p.id === id);
      
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
      }
      
      // Получаем существующие данные товара
      const existingProduct = products[productIndex];
      
      // Обрабатываем загрузку нового изображения, если оно есть
      let imageUrl = existingProduct.imageUrl || existingProduct.image;
      
      const imageFile = files.image;
      if (imageFile && imageFile.length > 0) {
        const file = imageFile[0];
        const fileName = path.basename(file.filepath);
        imageUrl = `/images/products/${fileName}`;
      }
      
      // Валидация и преобразование полей
      const name = fields.name ? String(fields.name[0]) : existingProduct.name || existingProduct.title;
      const price = fields.price ? Number(fields.price[0]) : existingProduct.price;
      const description = fields.description ? String(fields.description[0]) : existingProduct.description;
      const category = fields.category ? String(fields.category[0]) : existingProduct.category;
      const stock = fields.stock ? Number(fields.stock[0]) : existingProduct.stock;
      
      if (!name || price <= 0) {
        return res.status(400).json({ error: 'Название и цена (больше 0) обязательны' });
      }
      
      // Обновляем данные товара
      const updatedProduct = {
        ...existingProduct,
        name, // Используем name согласно dataSlice.ts
        title: name, // Сохраняем оба поля для совместимости
        price,
        description,
        category,
        stock,
        imageUrl, // Используем imageUrl согласно dataSlice.ts
        image: imageUrl // Сохраняем оба поля для совместимости
      };
      
      // Заменяем товар в массиве
      products[productIndex] = updatedProduct;
      
      // Записываем обновленный список товаров
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      
      return res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Ошибка при обновлении товара', details: error.message });
    }
  } catch (err) {
    console.error('Formidable parsing error:', err);
    return res.status(500).json({ error: 'Ошибка обработки формы' });
  }
} 