import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import * as Sentry from '@sentry/nextjs' // Temporarily comment out Sentry

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@almatexture.kz'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key'; // Use a strong, unique secret from env variables!

// Log loaded credentials during server startup (or first request)
console.log('[API Login] Loaded ADMIN_USERNAME:', ADMIN_USERNAME ? '******' : 'MISSING')
console.log('[API Login] Loaded ADMIN_PASSWORD_HASH:', ADMIN_PASSWORD_HASH ? '******' : 'MISSING')

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
    // --- Sentry Code Temporarily Commented Out ---
    /*
    Sentry.withScope(scope => {
      scope.setTag('request_id', requestId)
      scope.setTag('api_route', '/api/auth/login')

      const transaction = Sentry.startTransaction({
        name: 'API: /api/auth/login',
        op: 'api.auth.login'
      })
      scope.setSpan(transaction)

      try {
        // Log request info (consider using a more structured logger if available)
        console.log(`[API Login Request ${requestId}] Method: ${req.method}, Email: ${req.body?.email}`)

        if (req.method !== 'POST') {
          console.warn(`[API Login Request ${requestId}] Method Not Allowed: ${req.method}`)
          res.setHeader('Allow', ['POST'])
          res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` })
          transaction?.finish()
          return
        }
        
        const { email, password } = req.body
        
        if (!email || !password) {
          console.warn(`[API Login Request ${requestId}] Missing credentials.`)
          res.status(400).json({ success: false, message: 'Email and password are required' })
          transaction?.finish()
          return
        }
        
        // Validate credentials
        if (email === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
          console.log(`[API Login Request ${requestId}] Successful login attempt for: ${email}`)
          scope.setUser({ email: email, role: 'admin' }) // Set user context in Sentry
          res.status(200).json({ success: true })
        } else {
          console.warn(`[API Login Request ${requestId}] Failed login attempt for: ${email}`)
          res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

      } catch (innerError) {
        console.error(`[API Login Request ${requestId}] Inner error:`, innerError)
        Sentry.captureException(innerError)
        // Ensure response is sent even if inner logic fails
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Internal server error during processing' })
        }
      } finally {
        transaction?.finish() // Finish transaction
      }
    })
    */
    // --- End Sentry Code ---

    // --- Simplified Core Logic ---
    console.log(`[API Login Request ${requestId}] Processing... Method: ${req.method}`)

    if (req.method !== 'POST') {
      console.warn(`[API Login Request ${requestId}] Method Not Allowed: ${req.method}`)
      res.setHeader('Allow', ['POST'])
      return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` })
    }
    
    const { email, password } = req.body
    
    if (!email || !password) {
      console.warn(`[API Login Request ${requestId}] Missing credentials.`)
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }
    
    // Validate credentials
    if (email === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
      console.log(`[API Login Request ${requestId}] Successful login attempt for: ${email}`)
      // Optional: Set user context in Sentry if re-enabled
      // Sentry.setUser({ email: email, role: 'admin' })
      return res.status(200).json({ success: true })
    } else {
      console.warn(`[API Login Request ${requestId}] Failed login attempt for: ${email}`)
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }
    // --- End Simplified Core Logic ---

  } catch (outerError) {
    // Catch errors outside the main logic (e.g., during request parsing? unlikely here)
    console.error(`[API Login Request ${requestId}] Outer error:`, outerError)
    // Sentry.captureException(outerError) // Temporarily commented out
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }
} 
 