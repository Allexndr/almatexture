import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join, parse } from 'path'
import * as crypto from 'crypto'

// Disable default body parsing, we'll handle the multipart form data manually
export const config = {
  api: {
    bodyParser: false,
  },
};

type ProcessedFile = {
  filepath: string;
  originalFilename: string;
  newFilename: string;
  mimetype: string | null;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

// Create directory if it doesn't exist
const ensureDirectoryExists = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

// Process upload and return file info
const processFile = async (req: NextApiRequest): Promise<ProcessedFile[]> => {
  return new Promise((resolve, reject) => {
    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    ensureDirectoryExists(uploadDir);
    
    const form = new IncomingForm({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      uploadDir,
      keepExtensions: true,
    });
    
    const files: ProcessedFile[] = [];
    
    form.parse(req, async (err, fields, formFiles) => {
      if (err) {
        return reject(err);
      }
      
      // Handle files
      const fileArr = formFiles.file;
      if (!fileArr) {
        return resolve([]);
      }
      
      // Convert to array if single file
      const filesArray = Array.isArray(fileArr) ? fileArr : [fileArr];
      
      for (const file of filesArray) {
        try {
          // Generate a unique filename
          const { ext, name } = parse(file.originalFilename || 'unknown');
          const randomStr = crypto.randomBytes(8).toString('hex');
          const newFilename = `${Date.now()}-${randomStr}${ext}`;
          const newPath = join(uploadDir, newFilename);
          
          // Save the file
          const stream = createWriteStream(newPath);
          stream.write(await file.toBuffer());
          
          // Add to processed files
          files.push({
            filepath: newPath,
            originalFilename: file.originalFilename || 'unknown',
            newFilename,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${newFilename}`
          });
        } catch (error) {
          console.error('Error processing file:', error);
        }
      }
      
      resolve(files);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow POST method
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    // Check authorization (should be done via middleware)
    // This is a basic check, use proper auth middleware in production
    if (req.headers['x-user-role'] !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Process the uploaded files
    const files = await processFile(req);
    
    if (files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }
    
    // Return the file URLs
    return res.status(200).json({
      files: files.map(file => ({
        originalName: file.originalFilename,
        fileName: file.newFilename,
        url: file.url,
        size: file.size,
        mimetype: file.mimetype
      }))
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Error uploading file', error });
  }
} 
 