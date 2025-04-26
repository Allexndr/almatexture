import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  // Проверяем, что id является строкой и преобразуем в число
  const districtId = id && !Array.isArray(id) ? parseInt(id, 10) : null;
  
  if (!districtId || isNaN(districtId)) {
    return res.status(400).json({ error: 'Неверный ID района' });
  }

  // GET запрос для получения конкретного района
  if (req.method === 'GET') {
    try {
      const district = await prisma.district.findUnique({
        where: { id: districtId },
        include: {
          textures: true,
        },
      });

      if (!district) {
        return res.status(404).json({ error: 'Район не найден' });
      }

      return res.status(200).json(district);
    } catch (error) {
      console.error('Ошибка при получении района:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  } 
  
  // PUT запрос для обновления района
  else if (req.method === 'PUT') {
    try {
      // Проверка авторизации
      const user = await verifyToken(req);
      if (!user || user.role !== 'ADMIN') {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const { name, description, slug, imageUrl, coordinates } = req.body;

      // Проверка обязательных полей
      if (!name || !slug) {
        return res.status(400).json({ error: 'Имя и slug обязательны' });
      }

      // Проверка уникальности slug
      const existingDistrict = await prisma.district.findUnique({
        where: { 
          slug,
          NOT: {
            id: districtId
          }
        },
      });

      if (existingDistrict) {
        return res.status(400).json({ error: 'Район с таким slug уже существует' });
      }

      // Обновление района
      const district = await prisma.district.update({
        where: { id: districtId },
        data: {
          name,
          description: description || '',
          slug,
          imageUrl: imageUrl || '',
          coordinates: coordinates || {},
        },
      });

      return res.status(200).json(district);
    } catch (error) {
      console.error('Ошибка при обновлении района:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  } 
  
  // DELETE запрос для удаления района
  else if (req.method === 'DELETE') {
    try {
      // Проверка авторизации
      const user = await verifyToken(req);
      if (!user || user.role !== 'ADMIN') {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      // Проверка, есть ли связанные текстуры
      const district = await prisma.district.findUnique({
        where: { id: districtId },
        include: {
          _count: {
            select: { textures: true },
          },
        },
      });

      if (!district) {
        return res.status(404).json({ error: 'Район не найден' });
      }

      if (district._count.textures > 0) {
        return res.status(400).json({ 
          error: 'Невозможно удалить район с текстурами. Сначала удалите текстуры или переместите их в другой район.' 
        });
      }

      // Удаление района
      await prisma.district.delete({
        where: { id: districtId },
      });

      return res.status(204).send(null);
    } catch (error) {
      console.error('Ошибка при удалении района:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // Если метод не GET, PUT или DELETE
  return res.status(405).json({ error: 'Метод не разрешен' });
} 