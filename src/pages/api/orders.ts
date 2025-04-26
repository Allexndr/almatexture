import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - fetch orders
    if (req.method === 'GET') {
      const { id, userId, status, limit = '10', offset = '0' } = req.query;
      
      if (id) {
        // Get a single order by ID
        const order = await prisma.order.findUnique({
          where: {
            id: Number(id)
          },
          include: {
            items: {
              include: {
                product: true,
                productVariant: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        });
        
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        
        return res.status(200).json(order);
      }
      
      // Get orders with optional filtering
      const orders = await prisma.order.findMany({
        where: {
          ...(userId ? { userId: Number(userId) } : {}),
          ...(status ? { status: status as string } : {})
        },
        include: {
          items: {
            include: {
              product: true,
              productVariant: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      const total = await prisma.order.count({
        where: {
          ...(userId ? { userId: Number(userId) } : {}),
          ...(status ? { status: status as string } : {})
        }
      });
      
      return res.status(200).json({
        data: orders,
        meta: {
          total,
          limit: Number(limit),
          offset: Number(offset)
        }
      });
    }
    
    // POST - create a new order
    if (req.method === 'POST') {
      const { 
        userId, 
        items, 
        totalAmount, 
        shippingAddress, 
        contactInfo,
        paymentInfo,
        notes 
      } = req.body;
      
      if (!items || !items.length) {
        return res.status(400).json({ message: 'Order must contain at least one item' });
      }
      
      if (!totalAmount) {
        return res.status(400).json({ message: 'Total amount is required' });
      }
      
      // Create the order with associated items
      const order = await prisma.order.create({
        data: {
          userId: userId ? Number(userId) : undefined,
          totalAmount: typeof totalAmount === 'string' ? parseFloat(totalAmount) : totalAmount,
          status: 'pending',
          shippingAddress: shippingAddress || {},
          contactInfo: contactInfo || {},
          paymentInfo: paymentInfo || {},
          notes,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId ? Number(item.productId) : undefined,
              productVariantId: item.productVariantId ? Number(item.productVariantId) : undefined,
              quantity: Number(item.quantity),
              price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
              customDesign: item.customDesign || {}
            }))
          }
        },
        include: {
          items: true
        }
      });
      
      return res.status(201).json(order);
    }
    
    // PUT - update an order (e.g., change status)
    if (req.method === 'PUT') {
      const { id, status, shippingAddress, contactInfo, paymentInfo, notes } = req.body;
      
      if (!id) {
        return res.status(400).json({ message: 'Order ID is required' });
      }
      
      const order = await prisma.order.update({
        where: {
          id: Number(id)
        },
        data: {
          status,
          shippingAddress: shippingAddress || undefined,
          contactInfo: contactInfo || undefined,
          paymentInfo: paymentInfo || undefined,
          notes
        }
      });
      
      return res.status(200).json(order);
    }
    
    // DELETE - cancel an order (we don't actually delete, just set status to cancelled)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ message: 'Order ID is required' });
      }
      
      const order = await prisma.order.update({
        where: {
          id: Number(id)
        },
        data: {
          status: 'cancelled'
        }
      });
      
      return res.status(200).json(order);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
} 
 