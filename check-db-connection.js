// Script to check database connection and products table
const { PrismaClient } = require('./prisma/generated/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function checkDatabaseConnection() {
  console.log('Checking database connection...');
  
  try {
    // Check if we can connect to the database
    await prisma.$connect();
    console.log('Database connection successful!');
    
    // Print the DATABASE_URL for debugging (masked for security)
    const dbUrl = process.env.DATABASE_URL || 'Not found in process.env';
    const maskedUrl = dbUrl.replace(/:\/\/(.+?)@/, '://****:****@');
    console.log('Database URL:', maskedUrl);
    
    // Try to count products
    const productCount = await prisma.product.count();
    console.log(`Found ${productCount} products in the database.`);
    
    // If products exist, fetch them
    if (productCount > 0) {
      const products = await prisma.product.findMany();
      console.log('Products:', JSON.stringify(products, null, 2));
    }
    
  } catch (error) {
    console.error('Database connection or query error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
require('dotenv').config();
checkDatabaseConnection(); 