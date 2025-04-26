import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Принудительно принимаем только POST-запросы
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }
    
    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    
    // Для безопасности не сообщаем, есть ли такой пользователь в системе
    if (!user || !user.passwordHash) {
      return res.json({ 
        success: false,
        message: 'Проверка не пройдена',
        reason: 'Пользователь не найден'
      });
    }
    
    // Проверяем пароль
    const isPasswordValid = await compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.json({ 
        success: false,
        message: 'Проверка не пройдена',
        reason: 'Пароль неверный' 
      });
    }
    
    // Если всё правильно
    return res.json({
      success: true,
      message: 'Учетные данные верны',
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Ошибка проверки:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: String(error)
    });
  } finally {
    await prisma.$disconnect();
  }
} 