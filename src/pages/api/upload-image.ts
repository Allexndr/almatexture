import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    
    const imageFile = files.image;
    if (!imageFile || imageFile.length === 0) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    
    const file = imageFile[0];
    const fileName = path.basename(file.filepath);
    const imageUrl = `/images/products/${fileName}`;
    
    res.status(200).json({ success: true, imageUrl });
  } catch (err) {
    console.error('Error uploading image:', err);
    return res.status(500).json({ error: 'Ошибка загрузки' });
  }
} 