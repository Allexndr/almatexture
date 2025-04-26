import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dataFilePath = path.join(process.cwd(), 'public', 'admin-data', 'settings.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      return res.status(404).json({ 
        error: 'Settings data not found. Please run npm run setup-env to initialize admin data.'
      });
    }
    
    // Read the file
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const settings = JSON.parse(fileContents);
    
    // Return the data
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error loading settings:', error);
    return res.status(500).json({ error: 'Error loading settings data' });
  }
} 