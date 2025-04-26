import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - fetch products
    if (req.method === 'GET') {
      const { id, textureId, type, limit = '10', offset = '0' } = req.query;
      
      if (id) {
        // Get a single product by ID
        const product = await prisma.product.findUnique({
          where: {
            id: Number(id)
          },
          include: {
            texture: true,
            variants: true
          }
        });
        
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        
        return res.status(200).json(product);
      }
      
      // Get multiple products with optional filtering
      const products = await prisma.product.findMany({
        where: {
          ...(textureId ? { textureId: Number(textureId) } : {}),
          ...(type ? { type: type as string } : {})
        },
        include: {
          texture: true,
          variants: true
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      const total = await prisma.product.count({
        where: {
          ...(textureId ? { textureId: Number(textureId) } : {}),
          ...(type ? { type: type as string } : {})
        }
      });
      
      return res.status(200).json({
        data: products,
        meta: {
          total,
          limit: Number(limit),
          offset: Number(offset)
        }
      });
    }
    
    // POST - create a new product
    if (req.method === 'POST') {
      const { 
        textureId, 
        type, 
        name, 
        description, 
        price, 
        discountPrice, 
        stockQuantity, 
        isAvailable,
        variants
      } = req.body;
      
      const product = await prisma.product.create({
        data: {
          textureId: textureId ? Number(textureId) : undefined,
          type,
          name,
          description,
          price: typeof price === 'string' ? parseFloat(price) : price,
          discountPrice: discountPrice ? (typeof discountPrice === 'string' ? parseFloat(discountPrice) : discountPrice) : undefined,
          stockQuantity: stockQuantity ? Number(stockQuantity) : undefined,
          isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
          ...(variants && variants.length > 0 ? {
            variants: {
              create: variants.map((variant: any) => ({
                color: variant.color,
                size: variant.size,
                priceAdjustment: variant.priceAdjustment ? parseFloat(variant.priceAdjustment) : 0,
                stockQuantity: variant.stockQuantity ? Number(variant.stockQuantity) : 0,
                isAvailable: variant.isAvailable !== undefined ? Boolean(variant.isAvailable) : true
              }))
            }
          } : {})
        },
        include: {
          variants: true
        }
      });
      
      return res.status(201).json(product);
    }
    
    // PUT - update a product
    if (req.method === 'PUT') {
      const { 
        id,
        textureId, 
        type, 
        name, 
        description, 
        price, 
        discountPrice, 
        stockQuantity, 
        isAvailable
      } = req.body;
      
      if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
      }
      
      const product = await prisma.product.update({
        where: {
          id: Number(id)
        },
        data: {
          textureId: textureId ? Number(textureId) : undefined,
          type,
          name,
          description,
          price: price ? (typeof price === 'string' ? parseFloat(price) : price) : undefined,
          discountPrice: discountPrice ? (typeof discountPrice === 'string' ? parseFloat(discountPrice) : discountPrice) : undefined,
          stockQuantity: stockQuantity ? Number(stockQuantity) : undefined,
          isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
        }
      });
      
      return res.status(200).json(product);
    }
    
    // DELETE - delete a product
    if (req.method === 'DELETE') {
      const { id } = req.query;
      const productId = Number(id);

      if (!id || isNaN(productId)) {
        return res.status(400).json({ message: 'Product ID is required and must be a valid number' });
      }
      
      // Check for related OrderItems before deleting
      const orderItemCount = await prisma.orderItem.count({
        where: {
          productId: productId,
        },
      });

      if (orderItemCount > 0) {
        return res.status(400).json({
          message: `Cannot delete product because it is associated with ${orderItemCount} order item(s). Please remove it from orders first.`,
        });
      }
      
      // Proceed with deletion if no related order items found
      await prisma.product.delete({
        where: {
          id: productId
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
 