import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - fetch districts
    if (req.method === 'GET') {
      const { id, slug, includeTextures } = req.query;
      
      if (id) {
        // Get a single district by ID
        const district = await prisma.district.findUnique({
          where: {
            id: Number(id)
          },
          include: {
            textures: includeTextures === 'true'
          }
        });
        
        if (!district) {
          return res.status(404).json({ message: 'District not found' });
        }
        
        return res.status(200).json(district);
      }
      
      if (slug) {
        // Get a single district by slug
        const district = await prisma.district.findUnique({
          where: {
            slug: slug as string
          },
          include: {
            textures: includeTextures === 'true'
          }
        });
        
        if (!district) {
          return res.status(404).json({ message: 'District not found' });
        }
        
        return res.status(200).json(district);
      }
      
      // Get all districts
      const districts = await prisma.district.findMany({
        include: {
          textures: includeTextures === 'true'
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      return res.status(200).json(districts);
    }
    
    // POST - create a new district
    if (req.method === 'POST') {
      const { name, slug, description, color, coordinates } = req.body;
      
      // Check if slug is already taken
      const existingDistrict = await prisma.district.findUnique({
        where: {
          slug
        }
      });
      
      if (existingDistrict) {
        return res.status(400).json({ message: 'Slug is already in use' });
      }
      
      const district = await prisma.district.create({
        data: {
          name,
          slug,
          description,
          color,
          // If coordinates are provided as GeoJSON, you'd need to handle conversion here
          // or use a raw query to insert the geometry type
        }
      });
      
      return res.status(201).json(district);
    }
    
    // PUT - update a district
    if (req.method === 'PUT') {
      const { id, name, slug, description, color } = req.body;
      
      if (!id) {
        return res.status(400).json({ message: 'District ID is required' });
      }
      
      // Check if the new slug is already taken by another district
      if (slug) {
        const existingDistrict = await prisma.district.findFirst({
          where: {
            slug,
            id: {
              not: Number(id)
            }
          }
        });
        
        if (existingDistrict) {
          return res.status(400).json({ message: 'Slug is already in use by another district' });
        }
      }
      
      const district = await prisma.district.update({
        where: {
          id: Number(id)
        },
        data: {
          name,
          slug,
          description,
          color
        }
      });
      
      return res.status(200).json(district);
    }
    
    // DELETE - delete a district
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ message: 'District ID is required' });
      }
      
      // Check if district has associated textures
      const textureCount = await prisma.texture.count({
        where: {
          districtId: Number(id)
        }
      });
      
      if (textureCount > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete district with associated textures',
          textureCount
        });
      }
      
      await prisma.district.delete({
        where: {
          id: Number(id)
        }
      });
      
      return res.status(204).send('');
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
} 
 