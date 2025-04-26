import React, { useState, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose }) => {
  const [currentColor, setCurrentColor] = useState(color);
  
  // Цветовая палитра
  const colorPalette = [
    // Ряд 1: Основные цвета
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff',
    // Ряд 2: Оттенки синего (как в логотипе сайта)
    '#3498db', '#2980b9', '#1f618d', '#1a5276', '#154360', '#0e2f44', '#6ab0de', '#85c1e9',
    // Ряд 3: Оттенки зеленого
    '#2ecc71', '#27ae60', '#229954', '#1e8449', '#196f3d', '#145a32', '#82e0aa', '#a9dfbf',
    // Ряд 4: Оттенки красного/розового
    '#e74c3c', '#c0392b', '#a93226', '#922b21', '#7b241c', '#641e16', '#f1948a', '#fadbd8',
    // Ряд 5: Оттенки серого
    '#7f8c8d', '#707b7c', '#616a6b', '#515a5a', '#424949', '#333333', '#bdc3c7', '#e5e8e8'
  ];
  
  // Обновление цвета при инициализации
  useEffect(() => {
    setCurrentColor(color);
  }, [color]);
  
  // Обработчик выбора цвета
  const handleColorSelect = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor);
  };
  
  return (
    <div style={{
      position: 'relative',
      background: 'white',
      padding: '10px',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      width: '250px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 'bold' 
        }}>
          Выберите цвет
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(8, 1fr)', 
        gap: '5px',
        marginBottom: '10px'
      }}>
        {colorPalette.map((paletteColor, index) => (
          <div 
            key={index}
            onClick={() => handleColorSelect(paletteColor)}
            style={{
              width: '25px',
              height: '25px',
              backgroundColor: paletteColor,
              border: paletteColor === '#ffffff' ? '1px solid #e0e0e0' : 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {currentColor === paletteColor && (
              <MdCheck 
                color={paletteColor === '#ffffff' || paletteColor === '#ffff00' ? '#000000' : '#ffffff'} 
                size={16} 
              />
            )}
          </div>
        ))}
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px' 
      }}>
        <div 
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: currentColor,
            border: currentColor === '#ffffff' ? '1px solid #e0e0e0' : 'none',
            borderRadius: '4px'
          }}
        />
        <div style={{ flex: 1 }}>
          <input 
            type="text"
            value={currentColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker; 