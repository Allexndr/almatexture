import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface CustomDesignRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  productType: string;
  size: string;
  color: string;
  description: string;
  designType: string;
  textureId?: string;
  referenceImageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  // Ensure upload directories exist
  const uploadDir = path.join(process.cwd(), 'public/images/custom-designs');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Configure formidable
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024 // 5MB
  });

  try {
    // Parse the form
    const [fields, files] = await form.parse(req);
    
    // Get form data
    const name = fields.name?.[0] || '';
    const email = fields.email?.[0] || '';
    const phone = fields.phone?.[0];
    const productType = fields.productType?.[0] || 'tshirt';
    const size = fields.size?.[0] || 'M';
    const color = fields.color?.[0] || 'white';
    const description = fields.description?.[0] || '';
    const designType = fields.designType?.[0] || 'texture';
    const textureId = fields.textureId?.[0];
    
    // Validate required fields
    if (!name || !email || !description) {
      return res.status(400).json({ 
        error: 'Пожалуйста, заполните все обязательные поля' 
      });
    }
    
    // Process reference image if it exists
    let referenceImageUrl: string | undefined;
    const referenceImage = files.referenceImage?.[0];
    if (referenceImage) {
      const fileName = path.basename(referenceImage.filepath);
      referenceImageUrl = `/images/custom-designs/${fileName}`;
    }
    
    // Create new custom design request
    const newRequest: CustomDesignRequest = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      productType,
      size,
      color,
      description,
      designType,
      textureId,
      referenceImageUrl,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Save to custom-designs.json
    const requestsPath = path.join(process.cwd(), 'public/custom-designs.json');
    let requests: CustomDesignRequest[] = [];
    
    if (fs.existsSync(requestsPath)) {
      try {
        const data = fs.readFileSync(requestsPath, 'utf8');
        requests = JSON.parse(data);
      } catch (e) {
        console.error('Error reading custom-designs.json:', e);
      }
    }
    
    // Add new request
    requests.push(newRequest);
    
    // Save to file
    fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2));
    
    // Return success
    return res.status(200).json({ 
      success: true, 
      message: 'Ваша заявка успешно отправлена!',
      request: newRequest
    });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return res.status(500).json({ error: 'Произошла ошибка при обработке запроса' });
  }
} 