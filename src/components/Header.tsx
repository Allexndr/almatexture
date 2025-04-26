import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { CSSProperties, useState } from 'react';
import CartIcon from './CartIcon';

const navItemStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-block',
  padding: '8px 0',
  marginRight: '24px'
};

const activeStyle: CSSProperties = {
  color: '#3498db',
  fontWeight: 600
};

const indicatorStyle: CSSProperties = {
  position: 'absolute',
  bottom: '0px',
  left: '0',
  width: '100%',
  height: '3px',
  backgroundColor: '#3498db',
  borderRadius: '2px',
  transform: 'scaleX(1)',
  transformOrigin: 'left',
  transition: 'transform 0.3s ease'
};

const Header: React.FC = () => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const navigation = [
    { name: 'Галерея', href: '/gallery' },
    { name: 'Районы', href: '/districts' },
    { name: 'Магазин', href: '/shop' },
    { name: 'О проекте', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];

  return (
    <header style={{ 
      position: 'fixed',
      width: '100%',
      top: 0,
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 100
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <Link href="/" style={{ 
            textDecoration: 'none', 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#3498db' 
          }}>
            <span>AlmaTexture</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <nav style={{ display: 'flex' }}>
              {navigation.map((item) => {
                const isActive = router.pathname === item.href;
                const isHovered = hoveredItem === item.href;
                return (
                  <div 
                    key={item.href} 
                    style={navItemStyle}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={item.href}
                      style={{
                        textDecoration: 'none',
                        color: isActive ? '#3498db' : isHovered ? '#3498db' : '#444',
                        fontWeight: isActive ? 600 : 500,
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {item.name}
                    </Link>
                    {(isActive || isHovered) && (
                      <div 
                        style={{
                          ...indicatorStyle,
                          opacity: isHovered && !isActive ? 0.5 : 1,
                          transform: 'scaleX(1)'
                        }} 
                      />
                    )}
                  </div>
                );
              })}
            </nav>
            
            <div style={{ marginLeft: '12px' }}>
              <CartIcon />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 