// Script to check MongoDB connection
require('dotenv').config();
const { MongoClient } = require('mongodb');
require('../src/config/mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://sanmemik2000:9dX2yUpRzso2A0MU@cluster0.aism76i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'textures_app';

async function checkMongoDBConnection() {
  console.log('Checking MongoDB connection...');
  
  const client = new MongoClient(uri, {
    tls: true,
    tlsInsecure: true,
    directConnection: true
  });
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('MongoDB connection successful!');
    
    // Print the MongoDB URI for debugging (masked for security)
    const maskedUri = uri.replace(/:\/\/(.+?)@/, '://****:****@');
    console.log('MongoDB URI:', maskedUri);
    
    // Get the database
    const db = client.db(DB_NAME);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name).join(', ') || 'No collections found');
    
    // Check if products collection exists and try to count products
    if (collections.some(c => c.name === 'products')) {
      const productCount = await db.collection('products').countDocuments();
      console.log(`Found ${productCount} products in the database.`);
      
      // If products exist, fetch some of them
      if (productCount > 0) {
        const products = await db.collection('products').find().limit(5).toArray();
        console.log('Sample products:', JSON.stringify(products, null, 2));
      }
    }
    
  } catch (error) {
    console.error('MongoDB connection or query error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the check
checkMongoDBConnection(); 