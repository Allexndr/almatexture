import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-auto py-6 bg-white">
      <div className="container mx-auto px-6 text-center">
        {/* Cute Message Added */}
        <div className="text-xs text-gray-500">
          Сделано с любовью в Алматы ❤️
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} AlmaTexture. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 