import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importProducts() {
  try {
    console.log('Начинаю импорт продуктов из JSON...');
    
    // Загружаем данные из JSON-файла
    const jsonPath = path.join(process.cwd(), 'public', 'products.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('Файл products.json не найден!');
      return;
    }
    
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Загружено ${productsData.length} продуктов из JSON-файла`);
    
    // Загружаем текстуры для сопоставления
    const textures = await prisma.texture.findMany();
    const textureMap = new Map();
    
    textures.forEach(texture => {
      // Приводим к нижнему регистру для удобства поиска
      const title = texture.title.toLowerCase();
      textureMap.set(title, texture.id);
    });
    
    let importedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const productData of productsData) {
      try {
        // Ищем соответствующую текстуру
        let textureId = null;
        
        if (productData.texture) {
          const textureName = productData.texture.toLowerCase();
          
          if (textureMap.has(textureName)) {
            textureId = textureMap.get(textureName);
          } else {
            // Поиск по частичному совпадению
            for (const [key, id] of textureMap.entries()) {
              if (textureName.includes(key) || key.includes(textureName)) {
                textureId = id;
                break;
              }
            }
          }
        }
        
        // Проверяем, существует ли продукт с таким ID
        const existingProduct = await prisma.product.findFirst({
          where: {
            OR: [
              { id: productData.id },
              { 
                name: productData.name,
                type: productData.type
              }
            ]
          },
          include: {
            variants: true
          }
        });
        
        // Подготавливаем метаданные
        const metaData = {
          material: productData.material || null,
          size: productData.size || null,
          color: productData.color || null,
          weight: productData.weight || null,
          customizable: productData.customizable || false
        };
        
        if (existingProduct) {
          // Обновляем существующий продукт
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              name: productData.name,
              description: productData.description,
              price: productData.price,
              discountPrice: productData.discountPrice || null,
              stockQuantity: productData.stockQuantity || 0,
              isAvailable: productData.isAvailable !== false,
              metaData: JSON.stringify(metaData),
              textureId: textureId,
              type: productData.type || 'other'
            }
          });
          
          // Если у продукта есть варианты, обновляем или создаем их
          if (productData.variants && Array.isArray(productData.variants)) {
            // Удаляем старые варианты
            await prisma.productVariant.deleteMany({
              where: { productId: existingProduct.id }
            });
            
            // Создаем новые варианты
            for (const variant of productData.variants) {
              await prisma.productVariant.create({
                data: {
                  productId: existingProduct.id,
                  color: variant.color || null,
                  size: variant.size || null,
                  priceAdjustment: variant.priceAdjustment || 0,
                  stockQuantity: variant.stockQuantity || 0,
                  isAvailable: variant.isAvailable !== false
                }
              });
            }
          }
          
          updatedCount++;
          console.log(`Обновлен продукт: ${productData.name}`);
        } else {
          // Создаем новый продукт
          const newProduct = await prisma.product.create({
            data: {
              id: productData.id,
              name: productData.name,
              description: productData.description,
              price: productData.price,
              discountPrice: productData.discountPrice || null,
              stockQuantity: productData.stockQuantity || 0,
              isAvailable: productData.isAvailable !== false,
              metaData: JSON.stringify(metaData),
              textureId: textureId,
              type: productData.type || 'other'
            }
          });
          
          // Если у продукта есть варианты, создаем их
          if (productData.variants && Array.isArray(productData.variants)) {
            for (const variant of productData.variants) {
              await prisma.productVariant.create({
                data: {
                  productId: newProduct.id,
                  color: variant.color || null,
                  size: variant.size || null,
                  priceAdjustment: variant.priceAdjustment || 0,
                  stockQuantity: variant.stockQuantity || 0,
                  isAvailable: variant.isAvailable !== false
                }
              });
            }
          }
          
          importedCount++;
          console.log(`Импортирован продукт: ${productData.name}`);
        }
      } catch (error) {
        console.error(`Ошибка при импорте продукта "${productData.name}":`, error);
        errorCount++;
      }
    }
    
    console.log(`Импорт завершен! Создано: ${importedCount}, обновлено: ${updatedCount}, ошибок: ${errorCount} продуктов.`);
  } catch (error) {
    console.error('Ошибка при импорте продуктов:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск импорта
importProducts(); 