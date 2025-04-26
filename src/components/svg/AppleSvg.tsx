import React from 'react';

interface AppleSvgProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
}

const AppleSvg: React.FC<AppleSvgProps> = ({ 
  width = 200, 
  height = 200, 
  className,
  color = '#E53935' // Default apple red color
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={`${color}99`} />
        </linearGradient>
        
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#43A047" />
        </linearGradient>
        
        <filter id="appleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="3" stdDeviation="5" floodColor="#00000044" />
        </filter>
        
        <filter id="leafShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#00000044" />
        </filter>
        
        <clipPath id="appleBite">
          <path d="M140,70 A30,30 0 1,0 160,100 L130,85 Z" />
        </clipPath>
      </defs>
      
      {/* Стебель яблока */}
      <path
        d="M100,30 C100,30 95,10 105,10 C115,10 120,15 118,25 C116,35 110,40 100,30 Z"
        fill="#795548"
        filter="url(#leafShadow)"
      />
      
      {/* Лист */}
      <path
        d="M100,30 C100,30 70,15 60,5 C50,-5 75,-10 90,15 C105,40 100,30 100,30 Z"
        fill="url(#leafGradient)"
        filter="url(#leafShadow)"
      />
      
      {/* Основное тело яблока */}
      <path
        d="M60,70 C40,120 45,170 100,170 C155,170 160,120 140,70 C130,50 120,40 100,50 C80,40 70,50 60,70 Z"
        fill="url(#appleGradient)"
        filter="url(#appleShadow)"
        clipPath="url(#appleBite)"
      />
      
      {/* Укус */}
      <path
        d="M140,70 A30,30 0 1,0 160,100 L130,85 Z"
        fill="#FFFFFF"
        opacity="0.2"
      />
      
      {/* Блик на яблоке */}
      <ellipse
        cx="80"
        cy="80"
        rx="20"
        ry="25"
        fill="white"
        opacity="0.3"
        transform="rotate(-20 80 80)"
      />
      
      {/* Семечки (видны в месте укуса) */}
      <ellipse
        cx="145"
        cy="85"
        rx="3"
        ry="5"
        fill="#5D4037"
        transform="rotate(30 145 85)"
      />
      
      <ellipse
        cx="153"
        cy="92"
        rx="3"
        ry="5"
        fill="#5D4037"
        transform="rotate(60 153 92)"
      />
      
      {/* Текст "Алматы" стилизованный */}
      <text
        x="100"
        y="130"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        filter="url(#leafShadow)"
      >
        Алматы
      </text>
      
      {/* Подзаголовок "город яблок" */}
      <text
        x="100"
        y="146"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fontStyle="italic"
        fill="white"
        textAnchor="middle"
      >
        город яблок
      </text>
    </svg>
  );
};

export default AppleSvg; 