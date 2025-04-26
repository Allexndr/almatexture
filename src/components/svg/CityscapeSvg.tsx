import React from 'react';

interface CityScapeSvgProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const CityScapeSvg: React.FC<CityScapeSvgProps> = ({ 
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
        <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#E0F7FA" />
        </linearGradient>
        
        <linearGradient id="buildingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#42A5F5" />
          <stop offset="100%" stopColor="#1E88E5" />
        </linearGradient>
        
        <linearGradient id="buildingGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#26C6DA" />
          <stop offset="100%" stopColor="#00ACC1" />
        </linearGradient>
        
        <linearGradient id="buildingGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7E57C2" />
          <stop offset="100%" stopColor="#5E35B1" />
        </linearGradient>
        
        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
        
        <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#43A047" />
      </linearGradient>
        
        <filter id="buildingShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000033" />
        </filter>
        
        <filter id="windowGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Sky background */}
      <rect width="800" height="300" fill="url(#skyGradient)" />
      
      {/* Distant mountains silhouette */}
      <path 
        d="M0,150 L80,100 L150,140 L200,90 L250,130 L300,110 L350,150 L400,130 L450,150 L500,120 L550,140 L600,100 L650,130 L700,110 L750,140 L800,130 L800,300 L0,300 Z" 
        fill="#E1F5FE50" 
      />
      
      {/* Ground */}
      <rect x="0" y="250" width="800" height="50" fill="url(#groundGradient)" />
      
      {/* Modern Buildings */}
      
      {/* Almaty Tower (similar to Bayterek) */}
      <g transform="translate(600, 100)" filter="url(#buildingShadow)">
        <rect x="-15" y="0" width="30" height="150" fill="url(#buildingGradient1)" />
        <ellipse cx="0" cy="0" rx="25" ry="25" fill="#64B5F6" />
        
        {/* Windows */}
        <rect x="-10" y="20" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="5" y="20" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="-10" y="40" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="5" y="40" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="-10" y="60" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="5" y="60" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="-10" y="80" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="5" y="80" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="-10" y="100" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="5" y="100" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="-10" y="120" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
        <rect x="5" y="120" width="5" height="10" fill="#E3F2FD" filter="url(#windowGlow)" />
      </g>
      
      {/* Glass Skyscraper */}
      <g transform="translate(500, 130)" filter="url(#buildingShadow)">
        <rect x="-30" y="0" width="60" height="120" fill="url(#buildingGradient2)" rx="5" ry="5" />
        
        {/* Windows Grid */}
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={`floor-${i}`} transform={`translate(0, ${i * 12})`}>
            <rect x="-25" y="0" width="10" height="8" fill="#E3F2FD" opacity="0.7" />
            <rect x="-10" y="0" width="10" height="8" fill="#E3F2FD" opacity="0.7" />
            <rect x="5" y="0" width="10" height="8" fill="#E3F2FD" opacity="0.7" />
            <rect x="20" y="0" width="10" height="8" fill="#E3F2FD" opacity="0.7" />
          </g>
        ))}
      </g>
      
      {/* Modern Business Center */}
      <g transform="translate(400, 150)" filter="url(#buildingShadow)">
        <rect x="-40" y="0" width="80" height="100" fill="url(#buildingGradient3)" />
        <path d="M-40,0 L40,0 L0,-30 Z" fill="url(#buildingGradient3)" />
        
        {/* Windows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`bc-floor-${i}`} transform={`translate(0, ${i * 12 + 10})`}>
            <rect x="-35" y="0" width="8" height="8" fill="#E3F2FD" opacity="0.6" />
            <rect x="-20" y="0" width="8" height="8" fill="#E3F2FD" opacity="0.6" />
            <rect x="-5" y="0" width="8" height="8" fill="#E3F2FD" opacity="0.6" />
            <rect x="10" y="0" width="8" height="8" fill="#E3F2FD" opacity="0.6" />
            <rect x="25" y="0" width="8" height="8" fill="#E3F2FD" opacity="0.6" />
          </g>
        ))}
      </g>
      
      {/* Hotel Kazakhstan (Iconic Almaty building) */}
      <g transform="translate(300, 170)" filter="url(#buildingShadow)">
        <rect x="-25" y="0" width="50" height="80" fill="#90CAF9" />
        <rect x="-30" y="70" width="60" height="10" fill="#64B5F6" />
        
        {/* Windows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={`hotel-floor-${i}`} transform={`translate(0, ${i * 7 + 5})`}>
            <rect x="-20" y="0" width="5" height="5" fill="#E3F2FD" />
            <rect x="-10" y="0" width="5" height="5" fill="#E3F2FD" />
            <rect x="0" y="0" width="5" height="5" fill="#E3F2FD" />
            <rect x="10" y="0" width="5" height="5" fill="#E3F2FD" />
          </g>
        ))}
      </g>
      
      {/* Modern Residential Building */}
      <g transform="translate(200, 180)" filter="url(#buildingShadow)">
        <rect x="-30" y="0" width="60" height="70" fill="#90A4AE" />
        
        {/* Balconies */}
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={`res-floor-${i}`} transform={`translate(0, ${i * 12 + 5})`}>
            <rect x="-25" y="0" width="10" height="8" fill="#CFD8DC" stroke="#78909C" strokeWidth="0.5" />
            <rect x="-10" y="0" width="10" height="8" fill="#CFD8DC" stroke="#78909C" strokeWidth="0.5" />
            <rect x="5" y="0" width="10" height="8" fill="#CFD8DC" stroke="#78909C" strokeWidth="0.5" />
            <rect x="20" y="0" width="10" height="8" fill="#CFD8DC" stroke="#78909C" strokeWidth="0.5" />
          </g>
        ))}
      </g>
      
      {/* Small Office Building */}
      <g transform="translate(100, 210)" filter="url(#buildingShadow)">
        <rect x="-25" y="0" width="50" height="40" fill="#4FC3F7" />
        
        {/* Windows */}
        <rect x="-20" y="5" width="10" height="10" fill="#E1F5FE" />
        <rect x="-5" y="5" width="10" height="10" fill="#E1F5FE" />
        <rect x="10" y="5" width="10" height="10" fill="#E1F5FE" />
        <rect x="-20" y="20" width="10" height="10" fill="#E1F5FE" />
        <rect x="-5" y="20" width="10" height="10" fill="#E1F5FE" />
        <rect x="10" y="20" width="10" height="10" fill="#E1F5FE" />
      </g>
      
      {/* Apple Tree (symbol of Almaty) */}
      <g transform="translate(700, 220)">
        {/* Trunk */}
        <rect x="-5" y="0" width="10" height="30" fill="#795548" />
        
        {/* Tree Crown */}
        <ellipse cx="0" cy="-10" rx="25" ry="25" fill="url(#treeGradient)" />
        
        {/* Apples */}
        <circle cx="-15" cy="-20" r="5" fill="#E53935" />
        <circle cx="10" cy="-5" r="5" fill="#E53935" />
        <circle cx="5" cy="-25" r="5" fill="#E53935" />
      </g>
      
      {/* Regular Tree */}
      <g transform="translate(150, 230)">
        {/* Trunk */}
        <rect x="-3" y="0" width="6" height="20" fill="#795548" />
        
        {/* Tree Crown */}
        <ellipse cx="0" cy="-5" rx="15" ry="15" fill="#66BB6A" />
      </g>
      
      {/* Regular Tree */}
      <g transform="translate(350, 235)">
        {/* Trunk */}
        <rect x="-3" y="0" width="6" height="15" fill="#795548" />
        
        {/* Tree Crown */}
        <ellipse cx="0" cy="-5" rx="12" ry="12" fill="#66BB6A" />
      </g>
      
      {/* Text Label */}
      <text
        x="400"
        y="280"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="#37474F"
        textAnchor="middle"
      >
        Алматы - город в горах
      </text>
    </svg>
  );
};

export default CityScapeSvg; 