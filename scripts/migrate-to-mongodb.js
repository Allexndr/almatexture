// Script to migrate data from PostgreSQL to MongoDB
require('dotenv').config();
const { PrismaClient } = require('../prisma/generated/client');
const { MongoClient, ObjectId } = require('mongodb');

const prisma = new PrismaClient();
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://sanmemik2000:9dX2yUpRzso2A0MU@cluster0.aism76i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'textures_app';

async function main() {
  console.log('Starting migration from PostgreSQL to MongoDB...');
  
  // Connect to MongoDB
  const mongoClient = new MongoClient(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
    
    const db = mongoClient.db(DB_NAME);
    
    // Migrate Districts
    console.log('Migrating Districts...');
    const districts = await prisma.district.findMany();
    if (districts.length > 0) {
      const districtsCollection = db.collection('districts');
      
      // Convert PostgreSQL IDs to MongoDB ObjectIds and adjust date fields
      const formattedDistricts = districts.map(district => ({
        _id: new ObjectId(),
        name: district.name,
        slug: district.slug,
        description: district.description,
        coordinates: district.coordinates,
        color: district.color,
        createdAt: district.createdAt || new Date(),
        updatedAt: district.updatedAt || new Date(),
        // Save original PostgreSQL ID for reference during migration
        _postgresId: district.id
      }));
      
      await districtsCollection.insertMany(formattedDistricts);
      console.log(`Migrated ${formattedDistricts.length} districts`);
      
      // Create a map of PostgreSQL IDs to MongoDB IDs for reference
      const districtMap = {};
      for (const district of formattedDistricts) {
        districtMap[district._postgresId] = district._id;
      }
      
      // Migrate Textures
      console.log('Migrating Textures...');
      const textures = await prisma.texture.findMany();
      if (textures.length > 0) {
        const texturesCollection = db.collection('textures');
        
        const formattedTextures = textures.map(texture => ({
          _id: new ObjectId(),
          districtId: texture.districtId ? districtMap[texture.districtId] : null,
          title: texture.title,
          description: texture.description,
          imageUrl: texture.imageUrl,
          imageThumbnailUrl: texture.imageThumbnailUrl,
          coordinates: texture.coordinates,
          metaData: texture.metaData ? JSON.parse(texture.metaData) : {},
          viewsCount: texture.viewsCount || 0,
          isFeatured: texture.isFeatured || false,
          createdAt: texture.createdAt || new Date(),
          updatedAt: texture.updatedAt || new Date(),
          _postgresId: texture.id
        }));
        
        await texturesCollection.insertMany(formattedTextures);
        console.log(`Migrated ${formattedTextures.length} textures`);
        
        // Create a map of PostgreSQL texture IDs to MongoDB IDs
        const textureMap = {};
        for (const texture of formattedTextures) {
          textureMap[texture._postgresId] = texture._id;
        }
        
        // Migrate Tags
        console.log('Migrating Tags...');
        const tags = await prisma.tag.findMany();
        if (tags.length > 0) {
          const tagsCollection = db.collection('tags');
          
          const formattedTags = tags.map(tag => ({
            _id: new ObjectId(),
            name: tag.name,
            slug: tag.slug,
            color: tag.color,
            createdAt: tag.createdAt || new Date(),
            _postgresId: tag.id
          }));
          
          await tagsCollection.insertMany(formattedTags);
          console.log(`Migrated ${formattedTags.length} tags`);
          
          // Create a map of PostgreSQL tag IDs to MongoDB IDs
          const tagMap = {};
          for (const tag of formattedTags) {
            tagMap[tag._postgresId] = tag._id;
          }
          
          // Migrate TextureTags
          console.log('Migrating TextureTags...');
          const textureTags = await prisma.textureTag.findMany();
          if (textureTags.length > 0) {
            const textureTagsCollection = db.collection('texture_tags');
            
            const formattedTextureTags = textureTags.map(textureTag => ({
              _id: new ObjectId(),
              textureId: textureMap[textureTag.textureId],
              tagId: tagMap[textureTag.tagId]
            }));
            
            await textureTagsCollection.insertMany(formattedTextureTags);
            console.log(`Migrated ${formattedTextureTags.length} texture tags`);
          }
        }
        
        // Migrate Products
        console.log('Migrating Products...');
        const products = await prisma.product.findMany();
        if (products.length > 0) {
          const productsCollection = db.collection('products');
          
          const formattedProducts = products.map(product => ({
            _id: new ObjectId(),
            textureId: product.textureId ? textureMap[product.textureId] : null,
            type: product.type,
            name: product.name,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice,
            stockQuantity: product.stockQuantity || 0,
            isAvailable: product.isAvailable || true,
            metaData: product.metaData ? JSON.parse(product.metaData) : {},
            createdAt: product.createdAt || new Date(),
            updatedAt: product.updatedAt || new Date(),
            _postgresId: product.id
          }));
          
          await productsCollection.insertMany(formattedProducts);
          console.log(`Migrated ${formattedProducts.length} products`);
          
          // Create a map of PostgreSQL product IDs to MongoDB IDs
          const productMap = {};
          for (const product of formattedProducts) {
            productMap[product._postgresId] = product._id;
          }
          
          // Migrate ProductVariants
          console.log('Migrating ProductVariants...');
          const productVariants = await prisma.productVariant.findMany();
          if (productVariants.length > 0) {
            const productVariantsCollection = db.collection('product_variants');
            
            const formattedProductVariants = productVariants.map(variant => ({
              _id: new ObjectId(),
              productId: variant.productId ? productMap[variant.productId] : null,
              color: variant.color,
              size: variant.size,
              priceAdjustment: variant.priceAdjustment || 0,
              stockQuantity: variant.stockQuantity || 0,
              isAvailable: variant.isAvailable || true,
              createdAt: variant.createdAt || new Date(),
              _postgresId: variant.id
            }));
            
            await productVariantsCollection.insertMany(formattedProductVariants);
            console.log(`Migrated ${formattedProductVariants.length} product variants`);
            
            // Create a map of PostgreSQL variant IDs to MongoDB IDs
            const variantMap = {};
            for (const variant of formattedProductVariants) {
              variantMap[variant._postgresId] = variant._id;
            }
            
            // Migrate Users
            console.log('Migrating Users...');
            const users = await prisma.user.findMany();
            if (users.length > 0) {
              const usersCollection = db.collection('users');
              
              const formattedUsers = users.map(user => ({
                _id: new ObjectId(),
                email: user.email,
                passwordHash: user.passwordHash,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role || 'user',
                createdAt: user.createdAt || new Date(),
                updatedAt: user.updatedAt || new Date(),
                _postgresId: user.id
              }));
              
              await usersCollection.insertMany(formattedUsers);
              console.log(`Migrated ${formattedUsers.length} users`);
              
              // Create a map of PostgreSQL user IDs to MongoDB IDs
              const userMap = {};
              for (const user of formattedUsers) {
                userMap[user._postgresId] = user._id;
              }
              
              // Migrate Orders
              console.log('Migrating Orders...');
              const orders = await prisma.order.findMany();
              if (orders.length > 0) {
                const ordersCollection = db.collection('orders');
                
                const formattedOrders = orders.map(order => ({
                  _id: new ObjectId(),
                  userId: order.userId ? userMap[order.userId] : null,
                  status: order.status,
                  totalAmount: order.totalAmount,
                  shippingAddress: order.shippingAddress,
                  contactInfo: order.contactInfo,
                  paymentInfo: order.paymentInfo,
                  notes: order.notes,
                  createdAt: order.createdAt || new Date(),
                  updatedAt: order.updatedAt || new Date(),
                  _postgresId: order.id
                }));
                
                await ordersCollection.insertMany(formattedOrders);
                console.log(`Migrated ${formattedOrders.length} orders`);
                
                // Create a map of PostgreSQL order IDs to MongoDB IDs
                const orderMap = {};
                for (const order of formattedOrders) {
                  orderMap[order._postgresId] = order._id;
                }
                
                // Migrate OrderItems
                console.log('Migrating OrderItems...');
                const orderItems = await prisma.orderItem.findMany();
                if (orderItems.length > 0) {
                  const orderItemsCollection = db.collection('order_items');
                  
                  const formattedOrderItems = orderItems.map(item => ({
                    _id: new ObjectId(),
                    orderId: item.orderId ? orderMap[item.orderId] : null,
                    productId: item.productId ? productMap[item.productId] : null,
                    productVariantId: item.productVariantId ? variantMap[item.productVariantId] : null,
                    quantity: item.quantity,
                    price: item.price,
                    customDesign: item.customDesign,
                    createdAt: item.createdAt || new Date()
                  }));
                  
                  await orderItemsCollection.insertMany(formattedOrderItems);
                  console.log(`Migrated ${formattedOrderItems.length} order items`);
                }
              }
            }
          }
        }
      }
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 