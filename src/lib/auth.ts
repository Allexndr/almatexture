import { NextApiRequest } from 'next';

export function getToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  return token || null;
}

export function verifyToken(token: string): boolean {
  // Простая проверка токена (в продакшене должна быть более надежная)
  return token === 'admin-token' || token === process.env.ADMIN_TOKEN;
}

export function requireAuth(req: NextApiRequest): boolean {
  const token = getToken(req);
  if (!token) return false;
  
  return verifyToken(token);
} 