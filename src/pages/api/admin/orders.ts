import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dataFilePath = path.join(process.cwd(), 'public', 'admin-data', 'orders.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      return res.status(404).json({ 
        error: 'Orders data not found. Please run npm run setup-env to initialize admin data.'
      });
    }
    
    // Read the file
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const orders = JSON.parse(fileContents);
    
    // Return the data
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error loading orders:', error);
    return res.status(500).json({ error: 'Error loading orders data' });
  }
} 