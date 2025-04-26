import React from 'react';

interface MountainsSvgProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const MountainsSvg: React.FC<MountainsSvgProps> = ({ 
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
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A237E" />
          <stop offset="50%" stopColor="#303F9F" />
          <stop offset="100%" stopColor="#5C6BC0" />
        </linearGradient>
        
        <linearGradient id="mountain1Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#263238" />
          <stop offset="100%" stopColor="#455A64" />
        </linearGradient>
        
        <linearGradient id="mountain2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#37474F" />
          <stop offset="100%" stopColor="#546E7A" />
        </linearGradient>
        
        <linearGradient id="mountain3Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#424242" />
          <stop offset="100%" stopColor="#616161" />
        </linearGradient>
        
        <linearGradient id="snowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F7FA" />
        </linearGradient>
        
        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B5E20" />
          <stop offset="100%" stopColor="#388E3C" />
        </linearGradient>
        
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
        
        <filter id="glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Небо и звезды */}
      <rect width="800" height="400" fill="url(#skyGradient)" />
      
      {/* Звезды */}
      {Array.from({ length: 100 }).map((_, i) => {
        const x = Math.random() * 800;
        const y = Math.random() * 200;
        const size = Math.random() * 1.5 + 0.5;
        const opacity = Math.random() * 0.7 + 0.3;
        
        return (
          <circle 
            key={`star-${i}`} 
            cx={x} 
            cy={y} 
            r={size} 
            fill="white" 
            opacity={opacity} 
          />
        );
      })}
      
      {/* Луна */}
      <circle cx="700" cy="80" r="40" fill="#FFECB3" filter="url(#glow)" />
      <circle cx="710" cy="70" r="15" fill="#FFF9C4" opacity="0.7" />
      
      {/* Дальние горы (Тянь-Шань) */}
      <path 
        d="M0,240 L50,180 L100,230 L150,150 L200,180 L250,140 L300,200 L350,130 L400,190 L450,140 L500,200 L550,150 L600,210 L650,160 L700,230 L750,180 L800,220 L800,400 L0,400 Z" 
        fill="url(#mountain1Gradient)" 
      />
      
      {/* Снег на дальних горах */}
      <path 
        d="M50,180 L60,175 L70,178 L80,172 L90,180 L100,230 L150,150 L160,145 L180,160 L190,155 L200,180 L250,140 L260,135 L280,145 L290,140 L300,200 L350,130 L360,125 L380,135 L390,130 L400,190 L450,140 L460,135 L490,145 L500,200 L550,150 L560,145 L580,155 L590,150 L600,210" 
        fill="url(#snowGradient)"
        opacity="0.9"
      />
      
      {/* Горы среднего плана */}
      <path 
        d="M-50,260 L0,220 L50,240 L100,200 L150,250 L200,210 L250,260 L300,230 L350,270 L400,220 L450,260 L500,230 L550,280 L600,240 L650,270 L700,230 L750,250 L800,220 L850,260 L800,400 L0,400 Z" 
        fill="url(#mountain2Gradient)" 
      />
      
      {/* Снег на горах среднего плана */}
      <path 
        d="M0,220 L10,215 L20,218 L30,214 L40,222 L50,240 L100,200 L110,195 L120,205 L130,200 L150,250 L200,210 L210,205 L220,215 L230,210 L250,260 L300,230 L310,225 L320,235 L330,230 L350,270" 
        fill="url(#snowGradient)"
        opacity="0.7"
      />
      
      {/* Горы переднего плана (силуэт гор Алматы) */}
      <path 
        d="M-100,300 L0,250 L50,280 L100,240 L150,300 L200,260 L250,310 L300,250 L350,290 L400,240 L450,290 L500,260 L550,320 L600,270 L650,310 L700,260 L750,290 L800,250 L850,300 L800,400 L0,400 Z" 
        fill="url(#mountain3Gradient)" 
      />
      
      {/* Снег на горах переднего плана */}
      <path 
        d="M50,280 L60,275 L70,278 L80,274 L90,282 L100,240 L110,235 L130,245 L140,240 L150,300 L200,260 L210,255 L220,265 L230,260 L250,310 L300,250 L310,245 L330,255 L340,250 L350,290" 
        fill="url(#snowGradient)"
        opacity="0.5"
      />
      
      {/* Земля/долина */}
      <rect x="0" y="320" width="800" height="80" fill="url(#groundGradient)" />
      
      {/* Туман в долине */}
      <rect x="0" y="320" width="800" height="20" fill="white" opacity="0.3" filter="url(#blur)" />
      
      {/* Озеро Большое Алматинское */}
      <ellipse cx="500" cy="350" rx="150" ry="20" fill="#1A237E" opacity="0.7" />
      <ellipse cx="500" cy="350" rx="140" ry="15" fill="#303F9F" opacity="0.7" />
      <ellipse cx="500" cy="350" rx="130" ry="10" fill="#3F51B5" opacity="0.7" />
      
      {/* Отражение звезд в озере */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = 400 + Math.random() * 200;
        const y = 345 + Math.random() * 10;
        const size = Math.random() * 1 + 0.5;
        const opacity = Math.random() * 0.5 + 0.1;
        
        return (
          <circle 
            key={`reflection-${i}`} 
            cx={x} 
            cy={y} 
            r={size} 
            fill="white" 
            opacity={opacity} 
          />
        );
      })}
      
      {/* Подпись "Алматы" */}
      <text 
        x="400" 
        y="380" 
        fontFamily="Arial, sans-serif" 
        fontSize="20" 
        fontWeight="bold" 
        fill="white" 
        textAnchor="middle"
      >
        Алматы
      </text>
    </svg>
  );
};

export default MountainsSvg; 