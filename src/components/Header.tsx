import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { CSSProperties, useState } from 'react';
import CartIcon from './CartIcon';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

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
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
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
      backgroundColor: theme === 'dark' ? 'var(--header-bg)' : 'white',
      boxShadow: theme === 'dark' ? 'var(--shadow)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
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
            color: theme === 'dark' ? 'var(--text-color)' : 'var(--primary-color)',
            transition: 'color 0.3s ease'
          }}>
            <span>AlmaTexture</span>
          </Link>

          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            {[
              { href: '/gallery', label: t('nav.gallery') },
              { href: '/districts', label: t('nav.districts') },
              { href: '/shop', label: t('nav.shop') },
              { href: '/about', label: t('nav.about') },
              { href: '/contacts', label: t('nav.contacts') }
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: 'none',
                  color: theme === 'dark' ? 'var(--text-color)' : 'var(--text-color)',
                  opacity: router.pathname === href ? 1 : 0.7,
                  fontWeight: router.pathname === href ? 600 : 400,
                  transition: 'all 0.3s ease',
                  ':hover': {
                    opacity: 1
                  }
                }}
              >
                {label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 