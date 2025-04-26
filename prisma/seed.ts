import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Начало seed процесса...');
    
    // Проверяем, существует ли уже пользователь admin
    const adminEmail = 'admin@almatexture.kz';
    const adminPassword = 'almaty2023'; // Use a secure password
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      console.log('Создаю администратора...');
      
      // Хеширование пароля
      const hashedPassword = await hash(adminPassword, 10);
      
      // Создание администратора
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
          name: 'Admin User',
          role: 'admin',
        },
      });
      
      console.log('Администратор создан:', admin.email);
    } else {
      console.log('Администратор уже существует:', existingAdmin.email);
    }
    
    // Создаем районы
    console.log('Создание районов...');
    const districts = [
      { name: 'Медеуский', slug: 'medeusky', color: '#4285F4', description: 'Исторический центр и горные маршруты' },
      { name: 'Алмалинский', slug: 'almaly', color: '#34A853', description: 'Бизнес-район с творческой атмосферой' },
      { name: 'Бостандыкский', slug: 'bostandyk', color: '#FBBC05', description: 'Современный центр деловой активности' },
    ];

    for (const districtData of districts) {
      const existingDistrict = await prisma.district.findUnique({
        where: { slug: districtData.slug },
      });

      if (!existingDistrict) {
        await prisma.district.create({
          data: districtData,
        });
        console.log(`Создан район: ${districtData.name}`);
      } else {
        console.log(`Район ${districtData.name} уже существует`);
      }
    }

    // Получаем созданные районы
    const medeuDistrict = await prisma.district.findUnique({ where: { slug: 'medeusky' } });
    const almalyDistrict = await prisma.district.findUnique({ where: { slug: 'almaly' } });

    if (medeuDistrict && almalyDistrict) {
      // Создаем текстуры
      console.log('Создание текстур...');
      const textures = [
        {
          title: 'Брусчатка на Арбате',
          description: 'Историческая брусчатка в центре города',
          imageUrl: '/textures/texture1.jpg',
          imageThumbnailUrl: '/textures/texture1.jpg',
          districtId: medeuDistrict.id,
          isFeatured: true,
          viewsCount: 127
        },
        {
          title: 'Стены Зеленого Базара',
          description: 'Текстура стен исторического рынка',
          imageUrl: '/textures/texture2.jpg',
          imageThumbnailUrl: '/textures/texture2.jpg',
          districtId: medeuDistrict.id,
          isFeatured: true,
          viewsCount: 98
        },
        {
          title: 'Мозаика на фасаде',
          description: 'Советское архитектурное наследие',
          imageUrl: '/textures/texture4.jpg',
          imageThumbnailUrl: '/textures/texture4.jpg',
          districtId: almalyDistrict.id,
          isFeatured: true,
          viewsCount: 112
        }
      ];

      for (const textureData of textures) {
        const existingTexture = await prisma.texture.findFirst({
          where: { 
            title: textureData.title,
            districtId: textureData.districtId
          },
        });

        if (!existingTexture) {
          await prisma.texture.create({
            data: textureData,
          });
          console.log(`Создана текстура: ${textureData.title}`);
        } else {
          console.log(`Текстура ${textureData.title} уже существует`);
        }
      }
    }
    
    console.log('Seed процесс завершен успешно.');
  } catch (error) {
    console.error('Ошибка при выполнении seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 