import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Разрешаем только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  const { districtId, slug } = req.query;

  try {
    let district;

    // Поиск района по ID или slug
    if (districtId) {
      const id = parseInt(districtId as string, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID района должен быть числом' });
      }
      
      district = await prisma.district.findUnique({
        where: { id },
      });
    } else if (slug) {
      district = await prisma.district.findUnique({
        where: { slug: slug as string },
      });
    } else {
      return res.status(400).json({ error: 'Необходимо указать districtId или slug района' });
    }

    if (!district) {
      return res.status(404).json({ error: 'Район не найден' });
    }

    // Получение текстур для найденного района
    const textures = await prisma.texture.findMany({
      where: {
        districtId: district.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(textures);
  } catch (error) {
    console.error('Ошибка при получении текстур района:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
} 