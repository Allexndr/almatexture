/**
 * Скрипт для проверки подключения к базе данных и времени выполнения запросов
 */

const { PrismaClient } = require('../prisma/generated/client');

async function checkDbConnection() {
  console.log('Starting database connection test...');
  
  const prisma = new PrismaClient();
  try {
    console.log('Connecting to database...');
    
    // Измеряем время подключения к базе данных
    const startConnect = Date.now();
    
    // Выполняем простой запрос к базе данных
    await prisma.$connect();
    
    const connectTime = Date.now() - startConnect;
    console.log(`Database connection established in ${connectTime}ms`);
    
    // Проверяем скорость выполнения запроса на чтение пользователей
    console.log('Testing user query...');
    const startUserQuery = Date.now();
    
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    
    const userQueryTime = Date.now() - startUserQuery;
    console.log(`User query completed in ${userQueryTime}ms, found ${users.length} users`);
    
    // Проверяем общее здоровье БД
    console.log('Checking database health...');
    const tables = [
      'user',
      'texture',
      'district',
      'tag',
      'textureTag'
    ];
    
    for (const table of tables) {
      try {
        const startCount = Date.now();
        // Проверяем, есть ли доступ к таблице и сколько в ней записей
        const count = await prisma[table].count();
        const countTime = Date.now() - startCount;
        console.log(`Table ${table} count: ${count} (query took ${countTime}ms)`);
      } catch (e) {
        console.log(`Table ${table} cannot be accessed: ${e.message}`);
      }
    }
    
    console.log('Database connection test completed successfully!');
  } catch (error) {
    console.error('Error during database connection test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем тест
checkDbConnection()
  .then(() => {
    console.log('Test finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed with error:', error);
    process.exit(1);
  }); 