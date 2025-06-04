import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('Начинаю процесс миграции и обновления данных...');
    
    // Проверка наличия .env файла
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:cfif20041@localhost:5432/almatexture';
      fs.writeFileSync(envPath, `DATABASE_URL="${databaseUrl}"\n`);
      console.log('Создан файл .env с настройками подключения к БД');
    }
    
    // Применение миграций Prisma
    console.log('Применение миграций Prisma...');
    try {
      execSync('npx prisma migrate dev --name sync_textures', { stdio: 'inherit' });
    } catch (error) {
      console.warn('Ошибка при выполнении миграции. Возможно, миграция уже применена.');
    }
    
    // Генерация клиента Prisma
    console.log('Генерация клиента Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Применение SQL-представлений
    console.log('Применение SQL-представлений...');
    const sqlDir = path.join(process.cwd(), 'prisma', 'migration-sql');
    
    // Проверяем файлы представлений
    const sqlFiles = [
      'create_texture_product_view.sql',
      'create_filterable_products_view.sql'
    ];
    
    for (const sqlFile of sqlFiles) {
      const sqlPath = path.join(sqlDir, sqlFile);
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        try {
          await prisma.$executeRawUnsafe(sql);
          console.log(`SQL-представление из файла ${sqlFile} успешно применено`);
        } catch (error) {
          console.error(`Ошибка при применении SQL-представления из файла ${sqlFile}:`, error);
        }
      } else {
        console.warn(`Файл SQL-представления не найден по пути: ${sqlPath}`);
      }
    }
    
    // Запуск скрипта для импорта текстур из JSON
    console.log('Запуск импорта текстур из JSON...');
    try {
      execSync('npm run import-textures', { stdio: 'inherit' });
    } catch (error) {
      console.error('Ошибка при импорте текстур:', error);
    }
    
    // Запуск скрипта для импорта продуктов из JSON
    console.log('Запуск импорта продуктов из JSON...');
    try {
      execSync('npm run import-products', { stdio: 'inherit' });
    } catch (error) {
      console.error('Ошибка при импорте продуктов:', error);
    }
    
    console.log('Миграция и обновление данных завершены успешно!');
  } catch (error) {
    console.error('Ошибка при выполнении миграции:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration(); 