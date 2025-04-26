import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productsPath = path.join(process.cwd(), 'public', 'admin-data', 'products.json');
    const ordersPath = path.join(process.cwd(), 'public', 'admin-data', 'orders.json');
    const settingsPath = path.join(process.cwd(), 'public', 'admin-data', 'settings.json');
    
    // Check if files exist
    if (!fs.existsSync(productsPath) || !fs.existsSync(ordersPath) || !fs.existsSync(settingsPath)) {
      return res.status(404).json({ 
        error: 'Admin data not found. Please run npm run setup-env to initialize admin data.'
      });
    }
    
    // Read the files
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    
    // Calculate summary
    const totalProducts = productsData.length;
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum: number, order: any) => sum + order.total, 0);
    const pendingOrders = ordersData.filter((order: any) => order.status === 'pending').length;
    
    // Get the most recent orders
    const recentOrders = ordersData
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    // Return the summary
    return res.status(200).json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders,
      settings: settingsData
    });
  } catch (error) {
    console.error('Error generating admin summary:', error);
    return res.status(500).json({ error: 'Error generating admin summary' });
  }
} 