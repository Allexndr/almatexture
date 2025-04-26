import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Import Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for fetching data
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Fetch products from the database using Prisma
    const products = await prisma.product.findMany({
      // Select specific fields if needed, or include relations
      // include: { texture: true, variants: true },
      orderBy: {
        createdAt: 'desc', // Example ordering
      },
    });

    // Return the data from the database
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error loading products from database:', error);
    return res.status(500).json({ error: 'Error loading products data from database' });
  }
} 