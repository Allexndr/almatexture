import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import cookie from 'cookie'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Auth check API called');
    
    // Only allow GET method
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    // Get the token from cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.auth;
    
    if (!token) {
      console.log('No auth token found in cookies');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      console.log('Verifying token');
      // Verify the token
      const secret = process.env.JWT_SECRET || 'your-jwt-secret-key-here';
      const decoded = verify(token, secret);
      console.log('Token verified successfully');
      
      // Return user info
      return res.status(200).json({
        user: {
          id: (decoded as any).id,
          email: (decoded as any).email,
          name: (decoded as any).name,
          role: (decoded as any).role
        }
      });
    } catch (error) {
      // Token is invalid or expired
      console.log('Token verification failed:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 
 