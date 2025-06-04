// Конфигурация MongoDB
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sanmemik2000:9dX2yUpRzso2A0MU@cluster0.aism76i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const MONGODB_OPTIONS = {
  // Безопасные настройки для production
  tls: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  retryWrites: true,
  // Для development можем отключить SSL проверку
  ...(process.env.NODE_ENV === 'development' && { 
    tlsInsecure: true,
    tlsAllowInvalidCertificates: true
  })
}; 