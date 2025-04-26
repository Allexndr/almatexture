import React from 'react';

interface CitySvgProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const CitySvg: React.FC<CitySvgProps> = ({ 
  width = 800, 
  height = 400, 
  className 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Градиенты и фильтры */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#E0F7FF" />
        </linearGradient>
        
        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7CB342" />
          <stop offset="100%" stopColor="#558B2F" />
        </linearGradient>
        
        <linearGradient id="buildingGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#42A5F5" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>
        
        <linearGradient id="buildingGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#26C6DA" />
          <stop offset="100%" stopColor="#00ACC1" />
        </linearGradient>
        
        <linearGradient id="buildingGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC407A" />
          <stop offset="100%" stopColor="#D81B60" />
        </linearGradient>
        
        <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7CB342" />
          <stop offset="100%" stopColor="#558B2F" />
        </linearGradient>
        
        <filter id="cityShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Небо и земля */}
      <rect x="0" y="0" width="800" height="300" fill="url(#skyGradient)" />
      <rect x="0" y="300" width="800" height="100" fill="url(#groundGradient)" />
      
      {/* Горы на заднем плане */}
      <path 
        d="M0,300 L100,200 L150,250 L200,150 L300,220 L400,180 L500,250 L600,180 L700,220 L800,170 L800,300 Z" 
        fill="#9575CD" 
        opacity="0.5" 
      />
      
      {/* Телебашня Кок-Тобе */}
      <g transform="translate(620, 170)">
        <rect x="-5" y="0" width="10" height="130" fill="#78909C" />
        <rect x="-15" y="80" width="30" height="20" fill="#78909C" rx="5" ry="5" />
        <circle cx="0" cy="70" r="20" fill="#78909C" />
      </g>
      
      {/* Современные здания */}
      {/* Здание 1 - Небоскреб */}
      <rect x="100" y="150" width="80" height="150" fill="url(#buildingGradient1)" filter="url(#cityShadow)" />
      <g>
        {Array.from({ length: 10 }).map((_, i) => (
          <React.Fragment key={`windows1-${i}`}>
            <rect x="110" y={160 + i * 14} width="10" height="8" fill="#F5F5F5" opacity="0.8" />
            <rect x="130" y={160 + i * 14} width="10" height="8" fill="#F5F5F5" opacity="0.8" />
            <rect x="150" y={160 + i * 14} width="10" height="8" fill="#F5F5F5" opacity="0.8" />
            <rect x="170" y={160 + i * 14} width="10" height="8" fill="#F5F5F5" opacity="0.8" />
          </React.Fragment>
        ))}
      </g>
      
      {/* Здание 2 - Широкий бизнес-центр */}
      <rect x="200" y="180" width="150" height="120" fill="url(#buildingGradient2)" filter="url(#cityShadow)" />
      <g>
        {Array.from({ length: 6 }).map((_, i) => (
          <React.Fragment key={`windows2-${i}`}>
            <rect x="210" y={190 + i * 18} width="15" height="10" fill="#F5F5F5" opacity="0.8" />
            <rect x="235" y={190 + i * 18} width="15" height="10" fill="#F5F5F5" opacity="0.8" />
            <rect x="260" y={190 + i * 18} width="15" height="10" fill="#F5F5F5" opacity="0.8" />
            <rect x="285" y={190 + i * 18} width="15" height="10" fill="#F5F5F5" opacity="0.8" />
            <rect x="310" y={190 + i * 18} width="15" height="10" fill="#F5F5F5" opacity="0.8" />
            <rect x="335" y={190 + i * 18} width="15" height="10" fill="#F5F5F5" opacity="0.8" />
          </React.Fragment>
        ))}
      </g>
      
      {/* Здание 3 - ЖК */}
      <rect x="380" y="160" width="100" height="140" fill="url(#buildingGradient3)" filter="url(#cityShadow)" />
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <React.Fragment key={`windows3-${i}`}>
            <rect x="390" y={170 + i * 15} width="12" height="8" fill="#F5F5F5" opacity="0.7" />
            <rect x="410" y={170 + i * 15} width="12" height="8" fill="#F5F5F5" opacity="0.7" />
            <rect x="430" y={170 + i * 15} width="12" height="8" fill="#F5F5F5" opacity="0.7" />
            <rect x="450" y={170 + i * 15} width="12" height="8" fill="#F5F5F5" opacity="0.7" />
            <rect x="470" y={170 + i * 15} width="12" height="8" fill="#F5F5F5" opacity="0.7" />
          </React.Fragment>
        ))}
      </g>
      
      {/* Здание 4 - Стеклянная башня */}
      <rect x="500" y="120" width="60" height="180" fill="#90CAF9" filter="url(#cityShadow)" />
      <rect x="505" y="125" width="50" height="175" fill="#E1F5FE" opacity="0.7" />
      <g>
        {Array.from({ length: 12 }).map((_, i) => (
          <React.Fragment key={`windows4-${i}`}>
            <line x1="505" y1={140 + i * 13} x2="555" y2={140 + i * 13} stroke="#BBDEFB" strokeWidth="1" />
            <line x1="530" y1="125" x2="530" y2="300" stroke="#BBDEFB" strokeWidth="1" />
          </React.Fragment>
        ))}
      </g>
      
      {/* Дерево - Яблоня (символ Алматы) */}
      <g transform="translate(40, 260)">
        <rect x="0" y="0" width="10" height="40" fill="#795548" />
        <ellipse cx="5" cy="-20" rx="30" ry="30" fill="url(#treeGradient)" />
        {/* Яблоки на дереве */}
        <circle cx="-10" cy="-30" r="5" fill="#D32F2F" />
        <circle cx="20" cy="-25" r="4" fill="#D32F2F" />
        <circle cx="0" cy="-10" r="4.5" fill="#D32F2F" />
        <circle cx="-15" cy="-15" r="3.5" fill="#D32F2F" />
        <circle cx="15" cy="-5" r="4" fill="#D32F2F" />
      </g>
      
      {/* Другие деревья */}
      <g transform="translate(700, 270)">
        <rect x="0" y="0" width="8" height="30" fill="#795548" />
        <ellipse cx="4" cy="-10" rx="20" ry="20" fill="url(#treeGradient)" />
      </g>
      
      <g transform="translate(300, 270)">
        <rect x="0" y="0" width="7" height="30" fill="#795548" />
        <ellipse cx="3.5" cy="-12" rx="18" ry="18" fill="url(#treeGradient)" />
      </g>
      
      {/* Дорога */}
      <rect x="0" y="320" width="800" height="30" fill="#9E9E9E" />
      <g>
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={`road-mark-${i}`} x={i * 40 + 20} y="334" width="20" height="2" fill="#FFFFFF" />
        ))}
      </g>
      
      {/* Облака */}
      <g opacity="0.8" transform="translate(150, 80)">
        <ellipse cx="0" cy="0" rx="40" ry="20" fill="#FFFFFF" />
        <ellipse cx="30" cy="-10" rx="30" ry="15" fill="#FFFFFF" />
        <ellipse cx="-30" cy="5" rx="25" ry="13" fill="#FFFFFF" />
      </g>
      
      <g opacity="0.7" transform="translate(550, 60)">
        <ellipse cx="0" cy="0" rx="50" ry="25" fill="#FFFFFF" />
        <ellipse cx="40" cy="-10" rx="35" ry="20" fill="#FFFFFF" />
        <ellipse cx="-40" cy="5" rx="30" ry="15" fill="#FFFFFF" />
      </g>
      
      {/* Солнце */}
      <circle cx="700" cy="70" r="30" fill="#FFEB3B" />
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = 700 + Math.cos(angle) * 35;
          const y1 = 70 + Math.sin(angle) * 35;
          const x2 = 700 + Math.cos(angle) * 50;
          const y2 = 70 + Math.sin(angle) * 50;
          return (
            <line 
              key={`sun-ray-${i}`}
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke="#FFEB3B" 
              strokeWidth="3" 
            />
          );
        })}
      </g>
    </svg>
  );
};

export default CitySvg; 