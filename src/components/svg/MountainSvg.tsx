import React from 'react';

interface MountainSvgProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const MountainSvg: React.FC<MountainSvgProps> = ({ 
  width = 800, 
  height = 300, 
  className 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 800 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#64B5F6" />
        </linearGradient>
        
        <linearGradient id="mountainGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" /> {/* Snow */}
          <stop offset="35%" stopColor="#FAFAFA" /> {/* Snow */}
          <stop offset="45%" stopColor="#795548" /> {/* Rock */}
          <stop offset="100%" stopColor="#5D4037" /> {/* Rock shadow */}
        </linearGradient>
        
        <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" /> {/* Snow */}
          <stop offset="25%" stopColor="#FAFAFA" /> {/* Snow */}
          <stop offset="35%" stopColor="#795548" /> {/* Rock */}
          <stop offset="100%" stopColor="#5D4037" /> {/* Rock shadow */}
        </linearGradient>
        
        <linearGradient id="mountainGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" /> {/* Snow */}
          <stop offset="40%" stopColor="#FAFAFA" /> {/* Snow */}
          <stop offset="50%" stopColor="#795548" /> {/* Rock */}
          <stop offset="100%" stopColor="#5D4037" /> {/* Rock shadow */}
        </linearGradient>
        
        <linearGradient id="footHillsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7CB342" />
          <stop offset="100%" stopColor="#558B2F" />
        </linearGradient>
        
        <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
        
        <filter id="mountainShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="2" stdDeviation="5" floodColor="#00000022" />
        </filter>
        
        <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>
      
      {/* Sky */}
      <rect width="800" height="300" fill="url(#skyGradient)" />
      
      {/* Sun */}
      <circle cx="700" cy="60" r="35" fill="#FFEE58" />
      <circle cx="700" cy="60" r="45" fill="#FFEE58" fillOpacity="0.3" />
      <circle cx="700" cy="60" r="55" fill="#FFEE58" fillOpacity="0.1" />
      
      {/* Clouds */}
      <g filter="url(#cloudBlur)">
        <ellipse cx="150" cy="70" rx="40" ry="20" fill="white" opacity="0.8" />
        <ellipse cx="180" cy="65" rx="35" ry="15" fill="white" opacity="0.8" />
        <ellipse cx="120" cy="75" rx="30" ry="15" fill="white" opacity="0.8" />
      </g>
      
      <g filter="url(#cloudBlur)">
        <ellipse cx="550" cy="100" rx="50" ry="20" fill="white" opacity="0.6" />
        <ellipse cx="580" cy="90" rx="40" ry="25" fill="white" opacity="0.6" />
        <ellipse cx="520" cy="90" rx="30" ry="15" fill="white" opacity="0.6" />
      </g>
      
      {/* Distant Mountains (4th layer) */}
      <path 
        d="M0,200 L50,170 L100,190 L150,160 L200,180 L250,170 L300,190 L350,150 L400,170 L450,150 L500,180 L550,160 L600,170 L650,190 L700,160 L750,180 L800,170 L800,300 L0,300 Z" 
        fill="#78909C" 
        opacity="0.8"
      />
      
      {/* Mid-Range Mountains (3rd layer) */}
      <path 
        d="M-50,210 L0,180 L50,200 L100,170 L150,190 L200,160 L250,190 L300,150 L350,180 L400,160 L450,190 L500,170 L550,200 L600,160 L650,190 L700,170 L750,200 L800,180 L850,210 L850,300 L-50,300 Z" 
        fill="#607D8B" 
        opacity="0.9"
      />
      
      {/* Foothills (2nd layer) */}
      <path 
        d="M-100,240 L-50,220 L0,230 L50,210 L100,225 L150,215 L200,230 L250,210 L300,225 L350,215 L400,230 L450,210 L500,225 L550,215 L600,230 L650,210 L700,225 L750,210 L800,230 L850,215 L900,240 L900,300 L-100,300 Z" 
        fill="url(#footHillsGradient)" 
      />
      
      {/* Main Peaks (1st layer / foreground) */}
      <g filter="url(#mountainShadow)">
        {/* Left Peak */}
        <path 
          d="M-50,300 L100,120 L250,300 Z" 
          fill="url(#mountainGradient1)" 
        />
        
        {/* Middle Peak (Highest - Talgar) */}
        <path 
          d="M200,300 L400,80 L600,300 Z" 
          fill="url(#mountainGradient2)" 
        />
        
        {/* Right Peak */}
        <path 
          d="M550,300 L700,130 L850,300 Z" 
          fill="url(#mountainGradient3)" 
        />
      </g>
      
      {/* Snow Reflections - subtle details */}
      <path 
        d="M100,120 L120,140 L140,130 L160,150 L180,145 L200,160" 
        stroke="#FFFFFF" 
        strokeWidth="2" 
        strokeOpacity="0.3" 
        fill="none" 
      />
      
      <path 
        d="M400,80 L420,100 L440,95 L460,110 L480,105 L500,120" 
        stroke="#FFFFFF" 
        strokeWidth="2" 
        strokeOpacity="0.3" 
        fill="none" 
      />
      
      <path 
        d="M700,130 L720,150 L740,145 L760,160" 
        stroke="#FFFFFF" 
        strokeWidth="2" 
        strokeOpacity="0.3" 
        fill="none" 
      />
      
      {/* Title */}
      <text
        x="400"
        y="280"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        filter="url(#textShadow)"
      >
        Алматы - у подножия Заилийского Алатау
      </text>
    </svg>
  );
};

export default MountainSvg; 