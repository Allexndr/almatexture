import clientPromise from './mongodb';

// Database and collection names
const DB_NAME = 'textures_app';
const COLLECTIONS = {
  DISTRICTS: 'districts',
  TEXTURES: 'textures',
  TAGS: 'tags',
  TEXTURE_TAGS: 'texture_tags',
  USERS: 'users',
  PRODUCTS: 'products',
  PRODUCT_VARIANTS: 'product_variants',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
};

// Helper function to get the database
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// Helper function to get a collection
export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// District collection helpers
export async function getDistricts() {
  const collection = await getCollection(COLLECTIONS.DISTRICTS);
  return collection.find({}).toArray();
}

export async function getDistrictBySlug(slug) {
  const collection = await getCollection(COLLECTIONS.DISTRICTS);
  return collection.findOne({ slug });
}

// Texture collection helpers
export async function getTextures(options = {}) {
  const { limit = 50, skip = 0, sort = { createdAt: -1 }, filter = {} } = options;
  
  const collection = await getCollection(COLLECTIONS.TEXTURES);
  return collection.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
}

export async function getTextureById(id) {
  const collection = await getCollection(COLLECTIONS.TEXTURES);
  return collection.findOne({ _id: id });
}

// Product collection helpers
export async function getProducts(options = {}) {
  const { limit = 50, skip = 0, sort = { createdAt: -1 }, filter = {} } = options;
  
  const collection = await getCollection(COLLECTIONS.PRODUCTS);
  return collection.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
}

export async function getProductById(id) {
  const collection = await getCollection(COLLECTIONS.PRODUCTS);
  return collection.findOne({ _id: id });
}

// User collection helpers
export async function getUserByEmail(email) {
  const collection = await getCollection(COLLECTIONS.USERS);
  return collection.findOne({ email });
}

// Order collection helpers
export async function getOrdersByUserId(userId) {
  const collection = await getCollection(COLLECTIONS.ORDERS);
  return collection.find({ userId }).toArray();
}

export { COLLECTIONS }; 