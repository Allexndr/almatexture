import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable';
import { uploadImage } from '../../lib/uploadImage';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    
    const imageFile = files.image;
    if (!imageFile || imageFile.length === 0) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    
    const file = imageFile[0];
    
    // Читаем файл в буфер
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Загружаем в Cloudinary
    const uploadResult = await uploadImage(fileBuffer);
    
    // Удаляем временный файл
    fs.unlinkSync(file.filepath);
    
    res.status(200).json({ 
      success: true, 
      imageUrl: uploadResult.url,
      originalUrl: uploadResult.original_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format
    });
  } catch (err) {
    console.error('Error uploading image to Cloudinary:', err);
    return res.status(500).json({ error: 'Ошибка загрузки в Cloudinary' });
  }
} 