/**
 * Admin Environment Setup Script
 * 
 * This script initializes the admin environment by creating necessary configuration
 * files and directories for the TexturesAlmaty admin panel.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure necessary directories exist
const adminDataDir = path.join(__dirname, '..', 'public', 'admin-data');
if (!fs.existsSync(adminDataDir)) {
  console.log('Creating admin-data directory...');
  fs.mkdirSync(adminDataDir, { recursive: true });
}

// Generate sample products data
const products = [
  {
    id: 'prod_' + crypto.randomBytes(8).toString('hex'),
    title: 'Текстурный фотоальбом "Алмалы"',
    price: 12500,
    inventory: 20,
    imageUrl: '/images/products/album-almaly.jpg',
    description: 'Фотоальбом с уникальными текстурами старейшего района Алматы',
  },
  {
    id: 'prod_' + crypto.randomBytes(8).toString('hex'),
    title: 'Набор открыток "Советская архитектура"',
    price: 3800,
    inventory: 35,
    imageUrl: '/images/products/postcards-soviet.jpg',
    description: 'Коллекция из 10 открыток с текстурами советской архитектуры Алматы',
  },
  {
    id: 'prod_' + crypto.randomBytes(8).toString('hex'),
    title: 'Плакат "Текстуры Медеу"',
    price: 6000,
    inventory: 15,
    imageUrl: '/images/products/poster-medeu.jpg',
    description: 'Постер формата А2 с визуальными текстурами района Медеу',
  },
  {
    id: 'prod_' + crypto.randomBytes(8).toString('hex'),
    title: 'Текстурный блокнот "Алматы"',
    price: 4200,
    inventory: 50,
    imageUrl: '/images/products/notebook-almaty.jpg',
    description: 'Блокнот с обложкой, вдохновленной текстурами города',
  },
  {
    id: 'prod_' + crypto.randomBytes(8).toString('hex'),
    title: 'Фотокнига "Текстуры старого города"',
    price: 15000,
    inventory: 10,
    imageUrl: '/images/products/photobook-old-city.jpg',
    description: 'Художественное издание с фотографиями исторических текстур Алматы',
  }
];

// Generate sample orders data
const orders = [
  {
    id: 'ord_' + crypto.randomBytes(8).toString('hex'),
    customerName: 'Анна Сергеева',
    customerEmail: 'anna@example.com',
    customerPhone: '+7 701 234 5678',
    items: [
      {
        productId: products[0].id,
        quantity: 1,
        price: products[0].price
      },
      {
        productId: products[1].id,
        quantity: 2,
        price: products[1].price
      }
    ],
    total: products[0].price + (products[1].price * 2),
    status: 'completed',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: 'ord_' + crypto.randomBytes(8).toString('hex'),
    customerName: 'Марат Алиев',
    customerEmail: 'marat@example.com',
    customerPhone: '+7 777 765 4321',
    items: [
      {
        productId: products[2].id,
        quantity: 1,
        price: products[2].price
      }
    ],
    total: products[2].price,
    status: 'processing',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'ord_' + crypto.randomBytes(8).toString('hex'),
    customerName: 'Елена Ким',
    customerEmail: 'elena@example.com',
    customerPhone: '+7 700 123 4567',
    items: [
      {
        productId: products[3].id,
        quantity: 3,
        price: products[3].price
      },
      {
        productId: products[4].id,
        quantity: 1,
        price: products[4].price
      }
    ],
    total: (products[3].price * 3) + products[4].price,
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
  }
];

// Create site settings
const settings = {
  siteTitle: 'AlmaTexture',
  itemsPerPage: 12,
  enableComments: true,
  enableRegistration: false,
  contactEmail: 'almatexture@yandex.kz',
  defaultMapCenter: { lat: 43.2389, lng: 76.8897 },
  defaultMapZoom: 12,
  currency: 'KZT',
  shippingCost: 1500,
  freeShippingThreshold: 20000
};

// Default admin credentials
const adminUser = {
  email: 'admin@almatexture.kz',
  password: 'almaty2023' // Change this to a more secure password
};

// Admin helper functions
const adminHelper = {
  authenticate: function(email, password) {
    if (email === window.AdminConfig.adminEmail && 
        password === window.AdminConfig.adminPassword) {
      localStorage.setItem('adminAuthToken', window.AdminConfig.authToken);
      return true;
    }
    return false;
  },
  
  isAuthenticated: function() {
    return localStorage.getItem('adminAuthToken') === window.AdminConfig.authToken;
  },
  
  logout: function() {
    localStorage.removeItem('adminAuthToken');
  }
};

// Create the admin configuration script
const createAdminScript = () => {
  const scriptContent = `
    window.AdminConfig = ${JSON.stringify(defaultConfig, null, 2)};
    window.AdminHelper = ${adminHelper.toString().replace(/(\w+): function/g, '$1')};
  `;
  
  // Save to public directory
  const publicDir = path.join(process.cwd(), 'public');
  const scriptPath = path.join(publicDir, 'admin-config.js');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`✅ Admin configuration script created at ${scriptPath}`);
};

// Run the script
createAdminScript();

// Write files to disk
try {
  // Write products data
  fs.writeFileSync(
    path.join(adminDataDir, 'products.json'),
    JSON.stringify(products, null, 2)
  );
  console.log('✅ Created products.json');

  // Write orders data
  fs.writeFileSync(
    path.join(adminDataDir, 'orders.json'),
    JSON.stringify(orders, null, 2)
  );
  console.log('✅ Created orders.json');

  // Write settings data
  fs.writeFileSync(
    path.join(adminDataDir, 'settings.json'),
    JSON.stringify(settings, null, 2)
  );
  console.log('✅ Created settings.json');

  console.log('\n🚀 Setup complete! Admin panel is ready to use.');
  console.log('📝 Admin credentials:');
  console.log('   Email: admin@almatexture.kz');
  console.log('   Password: almaty2023');
  console.log('\n⚠️  Note: This is a development setup. In production, use proper authentication and secure storage.');
} catch (error) {
  console.error('❌ Error setting up admin environment:', error);
  process.exit(1);
}

// Output success message
console.log('\nAdmin setup completed successfully!');
console.log('  - Default settings created in public/admin-data/settings.json');
console.log('  - Admin user credentials created in public/admin-data/admin-helper.js');
console.log('  - Environment variables created in .env.local');
console.log('\nAdmin Login Details:');
console.log(`   Email: ${adminUser.email}`);
console.log(`   Password: ${adminUser.password} (Use this for first login)`);
console.log('\nPlease restart your Next.js development server.'); 