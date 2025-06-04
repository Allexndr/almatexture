import cloudinary from '../config/cloudinary';

export async function uploadImage(file) {
  try {
    // Загрузка файла в Cloudinary с оптимизацией
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'textures',
          resource_type: 'auto',
          // Оптимизация качества и формата
          quality: 'auto',
          fetch_format: 'auto',
          // Ограничение максимального размера
          transformation: [
            { width: 2000, height: 2000, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file);
    });

    // Создаем оптимизированный URL
    const optimizedUrl = cloudinary.url(result.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true
    });

    return {
      url: optimizedUrl,
      original_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
} 