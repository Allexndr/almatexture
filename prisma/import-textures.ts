import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function findOrCreateTags(tagNames: string[]) {
  const tags = [];
  
  for (const tagName of tagNames) {
    // Нормализуем имя тега и создаем slug
    const normalizedName = tagName.trim().toLowerCase();
    const slug = normalizedName
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
      
    if (!normalizedName) continue;
    
    // Ищем существующий тег или создаем новый
    let tag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: normalizedName },
          { slug: slug }
        ]
      }
    });
    
    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: normalizedName,
          slug: slug,
          color: generateRandomColor()
        }
      });
      console.log(`Создан новый тег: ${normalizedName}`);
    }
    
    tags.push(tag);
  }
  
  return tags;
}

function generateRandomColor() {
  const colors = [
    '#4285F4', '#34A853', '#FBBC05', '#EA4335', // Google colors
    '#1877F2', '#E1306C', '#2867B2', '#1DA1F2', // Social media colors
    '#6441A4', '#FF5700', '#25D366', '#0088CC'  // More bright colors
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Функция для транслитерации кириллицы в латиницу
const transliterate = (text: string): string => {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return text.replace(/[а-яё]/gi, (match: string) => {
    const lowerCaseMatch = match.toLowerCase();
    return cyrillicToLatin[lowerCaseMatch] || match;
  });
};

async function importTextures() {
  try {
    console.log('Начинаю импорт текстур из JSON...');
    
    // Загружаем данные из JSON-файла
    const jsonPath = path.join(process.cwd(), 'public', 'textures.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('Файл textures.json не найден!');
      return;
    }
    
    const texturesData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Загружено ${texturesData.length} текстур из JSON-файла`);
    
    let importedCount = 0;
    let updatedCount = 0;
    
    for (const textureData of texturesData) {
      // Получаем район или создаем новый, если не существует
      const districtName = textureData.district;
      let district = await prisma.district.findFirst({
        where: { name: districtName }
      });
      
      if (!district) {
        // Создаем slug из названия района
        const slug = transliterate(districtName.toLowerCase())
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
        
        district = await prisma.district.create({
          data: {
            name: districtName,
            slug: slug,
            color: generateRandomColor(),
            description: `Район ${districtName} города Алматы`
          }
        });
        console.log(`Создан новый район: ${districtName}`);
      }
      
      // Проверяем, существует ли текстура с таким ID
      const existingTexture = await prisma.texture.findFirst({
        where: {
          OR: [
            { id: textureData.id },
            { 
              title: textureData.title,
              districtId: district.id
            }
          ]
        },
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      });
      
      // Подготавливаем данные координат
      let parsedCoordinates = undefined;
      if (textureData.coordinates) {
        parsedCoordinates = JSON.stringify(textureData.coordinates);
      }
      
      // Находим или создаем теги
      const tags = await findOrCreateTags(textureData.tags || []);
      
      if (existingTexture) {
        // Обновляем существующую текстуру
        await prisma.texture.update({
          where: { id: existingTexture.id },
          data: {
            title: textureData.title,
            description: textureData.description,
            imageUrl: textureData.imageUrl,
            imageThumbnailUrl: textureData.imageUrl, // Используем то же изображение для миниатюры
            coordinates: parsedCoordinates,
            isFeatured: textureData.isFeatured || false,
            districtId: district.id
          }
        });
        
        // Удаляем старые связи с тегами
        await prisma.textureTag.deleteMany({
          where: { textureId: existingTexture.id }
        });
        
        // Создаем новые связи с тегами
        for (const tag of tags) {
          // Проверяем, существует ли уже связь между текстурой и тегом
          const existingTagLink = await prisma.textureTag.findFirst({
            where: {
              textureId: existingTexture.id,
              tagId: tag.id
            }
          });
          
          if (!existingTagLink) {
            await prisma.textureTag.create({
              data: {
                textureId: existingTexture.id,
                tagId: tag.id
              }
            });
          }
        }
        
        updatedCount++;
        console.log(`Обновлена текстура: ${textureData.title}`);
      } else {
        // Создаем новую текстуру
        const newTexture = await prisma.texture.create({
          data: {
            id: textureData.id,
            title: textureData.title,
            description: textureData.description,
            imageUrl: textureData.imageUrl,
            imageThumbnailUrl: textureData.imageUrl, // Используем то же изображение для миниатюры
            coordinates: parsedCoordinates,
            isFeatured: textureData.isFeatured || false,
            districtId: district.id
          }
        });
        
        // Создаем связи с тегами
        for (const tag of tags) {
          try {
            await prisma.textureTag.create({
              data: {
                textureId: newTexture.id,
                tagId: tag.id
              }
            });
          } catch (e) {
            console.log(`Связь текстуры ${newTexture.id} с тегом ${tag.id} уже существует или произошла ошибка`);
          }
        }
        
        importedCount++;
        console.log(`Импортирована текстура: ${textureData.title}`);
      }
    }
    
    console.log(`Импорт завершен! Создано: ${importedCount}, обновлено: ${updatedCount} текстур.`);
  } catch (error) {
    console.error('Ошибка при импорте текстур:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск импорта
importTextures(); 