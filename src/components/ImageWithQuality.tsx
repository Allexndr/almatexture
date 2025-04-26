import Image, { ImageProps } from 'next/image';
import { FC } from 'react';

// Расширяем стандартные свойства Image, добавляя настройку качества
interface ImageWithQualityProps extends Omit<ImageProps, 'quality'> {
  quality?: number;
}

/**
 * Компонент-обертка над Next.js Image с предустановленным качеством
 * Используйте его вместо стандартного Image для оптимизации изображений
 */
const ImageWithQuality: FC<ImageWithQualityProps> = ({
  quality = 80, // Значение по умолчанию для качества
  ...props
}) => {
  return <Image {...props} quality={quality} />;
};

export default ImageWithQuality; 