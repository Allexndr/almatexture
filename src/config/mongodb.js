// Конфигурация MongoDB
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sanmemik2000:9dX2yUpRzso2A0MU@cluster0.aism76i.mongodb.net/textures_app?retryWrites=true&w=majority&appName=Cluster0';

export const MONGODB_OPTIONS = {
  tls: true,
  tlsCAFile: undefined, // Позволяет Node.js использовать системные CA сертификаты
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  retryWrites: true,
  minPoolSize: 0,
  maxIdleTimeMS: 0,
  ssl: true,
  authSource: 'admin',
  // Для development можем отключить SSL проверку
  ...(process.env.NODE_ENV === 'development' && { 
    tlsInsecure: true,
    tlsAllowInvalidCertificates: true
  })
}; 