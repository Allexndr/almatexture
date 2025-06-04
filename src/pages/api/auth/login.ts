import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import * as Sentry from '@sentry/nextjs' // Temporarily comment out Sentry

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@almatexture.kz'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key'; // Use a strong, unique secret from env variables!

// Log loaded credentials during server startup (or first request)
console.log('[API Login] Loaded ADMIN_USERNAME:', ADMIN_USERNAME)
console.log('[API Login] Loaded ADMIN_PASSWORD_HASH first 15 chars:', ADMIN_PASSWORD_HASH?.substring(0, 15) + '...')

type ResponseData = {
  success: boolean;
  message?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const requestId = req.headers['x-request-id'] as string || 'unknown'
  
  try {
    // --- Simplified Core Logic with Enhanced Debugging ---
    console.log(`[API Login Request ${requestId}] Processing... Method: ${req.method}`)

    if (req.method !== 'POST') {
      console.warn(`[API Login Request ${requestId}] Method Not Allowed: ${req.method}`)
      res.setHeader('Allow', ['POST'])
      return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` })
    }
    
    const { email, password } = req.body
    
    console.log(`[API Login Request ${requestId}] Received credentials - Email: ${email}, Password length: ${password?.length || 0}`)
    console.log(`[API Login Request ${requestId}] Expected ADMIN_USERNAME: ${ADMIN_USERNAME}`)
    
    if (!email || !password) {
      console.warn(`[API Login Request ${requestId}] Missing credentials.`)
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    // Check email match separately
    const emailMatches = email === ADMIN_USERNAME;
    console.log(`[API Login Request ${requestId}] Email match: ${emailMatches}`)

    // TEMPORARY FOR DEBUGGING: Skip bcrypt check if email is correct and password is 'almaty2023'
    if (emailMatches && password === 'almaty2023') {
      console.log(`[API Login Request ${requestId}] Using temporary direct password check - SUCCESS`)
      return res.status(200).json({ success: true })
    }
    
    // Regular validation with bcrypt
    if (emailMatches && ADMIN_PASSWORD_HASH) {
      try {
        const passwordMatches = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
        console.log(`[API Login Request ${requestId}] Password bcrypt check: ${passwordMatches}`)
        
        if (passwordMatches) {
          console.log(`[API Login Request ${requestId}] Successful login attempt for: ${email}`)
          return res.status(200).json({ success: true })
        }
      } catch (bcryptError) {
        console.error(`[API Login Request ${requestId}] Bcrypt error:`, bcryptError)
        return res.status(500).json({ success: false, message: 'Error during password verification' })
      }
    }
    
    console.warn(`[API Login Request ${requestId}] Failed login attempt for: ${email}`)
    return res.status(401).json({ success: false, message: 'Invalid email or password' })

  } catch (outerError) {
    // Catch errors outside the main logic
    console.error(`[API Login Request ${requestId}] Outer error:`, outerError)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }
} 
 