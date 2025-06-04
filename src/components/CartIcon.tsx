import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

const CartIcon: React.FC = () => {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <Link href="/cart" style={{ 
      position: 'relative', 
      textDecoration: 'none', 
      color: '#444',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      transition: 'all 0.3s ease'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <svg 
        width="22" 
        height="22" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      
      {isMounted && cart.totalItems > 0 && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: '#3498db',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          minWidth: '18px',
          height: '18px',
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          padding: '0 5px'
        }}>
          {cart.totalItems > 9 ? '9+' : cart.totalItems}
        </div>
      )}
    </Link>
  );
};

export default CartIcon; 