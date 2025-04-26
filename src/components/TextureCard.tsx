import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface TextureCardProps {
  title: string;
  slug: string;
  preview: string;
  neighborhood: string;
  captureDate: string;
  quote?: string;
}

export default function TextureCard({
  title,
  slug,
  preview,
  neighborhood,
  captureDate,
  quote,
}: TextureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Set client-side flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="texture-card-wrapper">
      <Link href={`/gallery/textures/${slug}`} legacyBehavior>
        <a className="block">
          <article
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={preview}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                isClient && isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-transform duration-300 ${
                isClient && isHovered ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <h3 className="text-lg font-display font-bold mb-1">{title}</h3>
              <p className="text-sm text-gray-300 mb-2">
                {neighborhood} • {new Date(captureDate).toLocaleDateString()}
              </p>
              {quote && (
                <p className="text-sm italic text-gray-300 line-clamp-2">{quote}</p>
              )}
            </div>
          </article>
        </a>
      </Link>
    </div>
  );
} 