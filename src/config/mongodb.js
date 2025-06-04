// Отключаем проверку SSL для разработки
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sanmemik2000:9dX2yUpRzso2A0MU@cluster0.aism76i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const MONGODB_OPTIONS = {
  tls: true,
  tlsInsecure: true
}; 