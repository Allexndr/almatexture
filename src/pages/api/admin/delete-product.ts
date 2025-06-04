import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    // Get the product ID from body or query
    const id = req.method === 'POST' 
      ? (req.body?.id ? String(req.body.id) : null)
      : (req.query?.id ? String(req.query.id) : null);
      
    if (!id) {
      return res.status(400).json({ error: 'ID товара обязателен' });
    }
    
    // Path to JSON file with products
    const productsPath = path.join(process.cwd(), 'public/products.json');
    
    // Check file existence
    if (!fs.existsSync(productsPath)) {
      return res.status(404).json({ error: 'Файл с товарами не найден' });
    }
    
    // Read current product list
    const fileData = fs.readFileSync(productsPath, 'utf8');
    let products = JSON.parse(fileData);
    
    // Find the product to delete
    const productIndex = products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Get the product before removing it
    const deletedProduct = products[productIndex];
    
    // Remove from the products array
    products.splice(productIndex, 1);
    
    // Save the updated product list
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    
    // Optional: Remove the product image file if it exists
    if (deletedProduct.imageUrl || deletedProduct.image) {
      const imagePath = deletedProduct.imageUrl || deletedProduct.image;
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      
      // Only try to delete if file exists and is in the products folder
      if (fs.existsSync(fullPath) && fullPath.includes('/images/products/')) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error('Error deleting product image file:', err);
          // Continue even if the image deletion fails
        }
      }
    }
    
    return res.status(200).json({ success: true, message: 'Товар успешно удален' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Ошибка при удалении товара', details: error.message });
  }
} 