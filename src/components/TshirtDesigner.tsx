import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { MdAdd, MdRemove, MdRotateLeft, MdRotateRight, MdColorLens, MdFileUpload, MdTextFields, MdImage, MdDelete, MdSave, MdMap } from 'react-icons/md';
import ColorPicker from './ColorPicker';
import MountainSvg from './svg/MountainSvg';

// Extend fabric types to work with TypeScript
declare global {
  interface Window {
    fabric: typeof fabric;
  }
}

// Define Canvas type for fabric.js
type FabricCanvas = fabric.Canvas;

// Type declarations for fabric.js
declare module 'fabric' {
  export interface Canvas {
    getObjects(): fabric.Object[];
    add(...objects: fabric.Object[]): fabric.Canvas;
    remove(object: fabric.Object): fabric.Canvas;
    setActiveObject(object: fabric.Object): fabric.Canvas;
    getActiveObject(): fabric.Object;
    renderAll(): fabric.Canvas;
    setBackgroundImage(image: fabric.Image, callback: Function, options?: any): fabric.Canvas;
    on(event: 'selection:created', handler: (e: { selected?: fabric.Object[] }) => void): fabric.Canvas;
    on(event: 'selection:updated', handler: (e: { selected?: fabric.Object[] }) => void): fabric.Canvas;
    on(event: 'selection:cleared', handler: (e: any) => void): fabric.Canvas;
    on(event: string, handler: Function): fabric.Canvas;
    dispose(): void;
    toDataURL(options?: any): string;
    toJSON(propertiesToInclude?: string[]): any;
    backgroundImage?: fabric.Image;
    width?: number;
    height?: number;
  }
  
  export interface Image extends Object {
    setSrc(src: string, callback?: Function, options?: any): fabric.Image;
  }
  
  export interface Object {
    set(key: any, value: any): fabric.Object;
    get(key: string): any;
    setCoords(): fabric.Object;
    toObject(propertiesToInclude?: string[]): any;
    getSvgStyles(): string;
    setControlsVisibility(options: any): fabric.Object;
    customId?: string;
    name?: string;
    scaleX: number;
    scaleY: number;
    angle: number;
    left: number;
    top: number;
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
    fontWeight?: string;
    text?: string;
    transparentCorners?: boolean;
    cornerColor?: string;
    cornerSize?: number;
    cornerStyle?: string;
    selectable?: boolean;
    evented?: boolean;
    visible?: boolean;
    hasControls?: boolean;
    hasBorders?: boolean;
    lockMovementX?: boolean;
    lockMovementY?: boolean;
    lockScalingX?: boolean;
    lockScalingY?: boolean;
    lockRotation?: boolean;
    opacity?: number;
    originX?: string;
    originY?: string;
    type?: string;
  }
  
  export interface IText extends Object {
    text: string;
    setSelectionStart(index: number): fabric.IText;
    setSelectionEnd(index: number): fabric.IText;
    selectAll(): fabric.IText;
    enterEditing(): fabric.IText;
    exitEditing(): fabric.IText;
  }
}

interface Location {
  name: string;
  lat: number;
  lng: number;
  src: string;
}

interface TshirtDesignerProps {
  onSaveDesign?: (designData: any) => void;
}

const TshirtDesigner: React.FC<TshirtDesignerProps> = ({ onSaveDesign }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [tshirtColor, setTshirtColor] = useState<string>('white');
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentTab, setCurrentTab] = useState<'texture' | 'text' | 'settings'>('texture');
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [databaseTextures, setDatabaseTextures] = useState<any[]>([]);
  const [isLoadingTextures, setIsLoadingTextures] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const tshirtColors = [
    { name: 'Белый', value: '#ffffff' },
    { name: 'Черный', value: '#000000' },
    { name: 'Серый', value: '#808080' },
    { name: 'Синий', value: '#0000ff' },
    { name: 'Красный', value: '#ff0000' },
  ];
  
  const locations: Location[] = [
    { name: 'Медеу', lat: 43.1567, lng: 77.0516, src: '/pictures/almaty_mountains.jpg' },
    { name: 'Панфилова', lat: 43.2584, lng: 76.9452, src: '/pictures/almaty_wibe.jpg' },
    { name: 'Коктобе', lat: 43.2372, lng: 76.9584, src: '/backgrounds/panorama.jpg' },
    { name: 'Зелёный Базар', lat: 43.2573, lng: 76.9422, src: '/backgrounds/tower.jpg' },
  ];

  // Fetch textures from database
  useEffect(() => {
    const fetchTextures = async () => {
      try {
        setIsLoadingTextures(true);
        const response = await fetch('/api/textures?limit=20');
        if (response.ok) {
          const data = await response.json();
          setDatabaseTextures(data);
        }
      } catch (error) {
        console.error('Error fetching textures:', error);
      } finally {
        setIsLoadingTextures(false);
      }
    };
    
    fetchTextures();
  }, []);

  // Инициализация canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      try {
        // Создаем новый canvas с явными размерами
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 400,
          height: 400,
          selection: true,
        });
        
        // Проверяем, что canvas создался успешно
        if (!canvas) {
          console.error('Failed to create canvas');
          return;
        }
        
        // Устанавливаем canvas в state только после успешной инициализации
        setFabricCanvas(canvas);
        
        // Добавляем обработчик события выбора объекта
        canvas.on('selection:created', (e) => {
          setSelectedObject(e.selected?.[0] || null);
        });
        
        canvas.on('selection:updated', (e) => {
          setSelectedObject(e.selected?.[0] || null);
        });
        
        canvas.on('selection:cleared', () => {
          setSelectedObject(null);
        });
        
        // Очистка при размонтировании
        return () => {
          try {
            canvas.dispose();
          } catch (err) {
            console.error('Error disposing canvas:', err);
          }
        };
      } catch (err) {
        console.error('Error initializing canvas:', err);
      }
    }
  }, [canvasRef, fabricCanvas]);

  // Обновляем фон при изменении цвета футболки
  useEffect(() => {
    if (fabricCanvas) {
      // Используем существующее изображение вместо несуществующих цветов футболок
      const bgUrl = `/backgrounds/panorama.jpg`;
      setBackgroundImage(fabricCanvas, bgUrl);
    }
  }, [tshirtColor, fabricCanvas]);

  const setBackgroundImage = (canvas: fabric.Canvas, url: string) => {
    if (!canvas) return;
    
    fabric.Image.fromURL(url, (img) => {
      try {
        // Дополнительная проверка на случай, если canvas был уничтожен
        if (!canvas) return;
        
        // Проверка, что изображение загрузилось корректно
        if (!img || !img.width || !img.height) {
          console.warn('Image failed to load properly:', url);
          return;
        }
        
        // Безопасные вычисления коэффициентов масштабирования
        const scaleX = canvas.width ? canvas.width / img.width : 1;
        const scaleY = canvas.height ? canvas.height / img.height : 1;
        
        canvas.setBackgroundImage(img, () => {
          try {
            canvas.renderAll();
          } catch (e) {
            console.error('Error rendering canvas after setting background:', e);
          }
        }, {
          scaleX: scaleX,
          scaleY: scaleY,
        });
      } catch (e) {
        console.error('Error setting background image:', e);
      }
    }, { crossOrigin: 'anonymous' });
  };

  // Функция добавления изображения
  const addImage = (url: string) => {
    if (!fabricCanvas) {
      setUploadError("Canvas не инициализирован. Попробуйте обновить страницу.");
      return;
    }
    
    setIsLoading(true);
    setUploadError(null);
    
    try {
      fabric.Image.fromURL(url, (img) => {
        try {
          // Проверяем, что canvas и изображение существуют
          if (!fabricCanvas) {
            setUploadError("Canvas не инициализирован во время загрузки изображения.");
            setIsLoading(false);
            return;
          }
          
          // Проверяем, что изображение загрузилось корректно
          if (!img || !img.width || !img.height) {
            console.warn('Image failed to load properly:', url);
            setUploadError("Не удалось загрузить изображение. Проверьте формат файла.");
            setIsLoading(false);
            return;
          }
          
          // Масштабируем изображение, чтобы оно помещалось в область дизайна
          const maxSize = 100;
          if (img.width > img.height) {
            if (img.width > maxSize) {
              img.scaleToWidth(maxSize);
            }
          } else {
            if (img.height > maxSize) {
              img.scaleToHeight(maxSize);
            }
          }
          
          // Центрируем изображение в области дизайна
          img.set({
            left: 150,
            top: 150,
            originX: 'center',
            originY: 'center',
            transparentCorners: false,
            cornerColor: '#3498db',
            cornerSize: 8,
            cornerStyle: 'circle',
            borderColor: '#3498db',
            borderScaleFactor: 1.5
          });
          
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          setSelectedObject(img);
          
          try {
            fabricCanvas.renderAll();
          } catch (err) {
            console.error('Error rendering canvas after adding image:', err);
            setUploadError("Ошибка при отображении изображения на холсте.");
            setIsLoading(false);
            return;
          }
          
          setIsLoading(false);
        } catch (err) {
          console.error('Error processing image:', err);
          setUploadError("Ошибка при обработке изображения.");
          setIsLoading(false);
        }
      }, { crossOrigin: 'anonymous' });
    } catch (err) {
      console.error('Error loading image:', err);
      setUploadError("Ошибка при загрузке изображения.");
      setIsLoading(false);
    }
  };

  // Обработчик загрузки изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      setUploadError("Не выбран файл для загрузки.");
      return;
    }
    
    const file = files[0];
    
    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Размер файла превышает 5MB.");
      return;
    }
    
    // Проверка типа файла
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError("Неподдерживаемый формат файла. Используйте JPG, PNG, GIF или SVG.");
      return;
    }
    
    if (!fabricCanvas) {
      setUploadError("Canvas не инициализирован. Попробуйте обновить страницу.");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      addImage(imgUrl);
    };
    
    reader.onerror = () => {
      setUploadError("Ошибка при чтении файла.");
    };
    
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error reading file:', err);
      setUploadError("Ошибка при чтении файла.");
    }
    
    // Сбросить input, чтобы можно было загружать тот же файл снова
    e.target.value = '';
  };

  // Добавление SVG горы
  const addMountainSvg = () => {
    if (!fabricCanvas) return;
    
    try {
      const svgStr = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,80 L40,30 L60,60 L90,20 L90,80 Z" fill="#3498db" />
        <path d="M30,80 L50,50 L70,65 L90,40 L90,80 Z" fill="#2980b9" />
        <circle cx="60" cy="25" r="5" fill="#ecf0f1" />
      </svg>`;
      
      fabric.loadSVGFromString(svgStr, (objects, options) => {
        try {
          const svgGroup = fabric.util.groupSVGElements(objects, options);
          
          svgGroup.set({
            left: 150,
            top: 150,
            originX: 'center',
            originY: 'center',
            transparentCorners: false,
            cornerColor: '#3498db',
            cornerSize: 8
          });
          
          fabricCanvas.add(svgGroup);
          fabricCanvas.setActiveObject(svgGroup);
          setSelectedObject(svgGroup);
          
          if (fabricCanvas) {
            fabricCanvas.renderAll();
          }
        } catch (err) {
          console.error('Error processing SVG:', err);
        }
      });
    } catch (err) {
      console.error('Error adding SVG:', err);
    }
  };

  // Добавление предустановленного изображения
  const addPresetImage = (src: string) => {
    addImage(src);
  };

  // Добавление текста
  const addText = () => {
    if (!fabricCanvas || !textInput.trim()) return;
    
    try {
      const text = new fabric.IText(textInput, {
        left: 150,
        top: 150,
        originX: 'center',
        originY: 'center',
        fontFamily: fontFamily,
        fontSize: fontSize,
        fill: textColor,
        textAlign: 'center',
        transparentCorners: false,
        cornerColor: '#3498db',
        cornerSize: 8,
        cornerStyle: 'circle',
        borderColor: '#3498db',
        borderScaleFactor: 1.5
      });
      
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      setSelectedObject(text);
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
      
      setTextInput('');
    } catch (err) {
      console.error('Error adding text:', err);
      setUploadError("Ошибка при добавлении текста на холст.");
    }
  };

  // Удаление выбранного объекта
  const deleteSelectedObject = () => {
    if (!fabricCanvas || !selectedObject) return;
    
    try {
      fabricCanvas.remove(selectedObject);
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
      
      setSelectedObject(null);
    } catch (err) {
      console.error('Error deleting object:', err);
    }
  };

  // Изменение цвета выбранного объекта
  const changeObjectColor = (color: string) => {
    if (!fabricCanvas || !selectedObject) return;
    
    try {
      if (selectedObject.type === 'i-text') {
        selectedObject.set('fill', color);
        setTextColor(color);
      } else {
        selectedObject.set('fill', color);
      }
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
    } catch (err) {
      console.error('Error changing object color:', err);
    }
  };

  // Увеличение масштаба
  const zoomIn = () => {
    if (!fabricCanvas) return;
    
    try {
      const newZoom = Math.min(3, zoom + 0.1);
      setZoom(newZoom);
      
      fabricCanvas.setZoom(newZoom);
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
    } catch (err) {
      console.error('Error zooming in:', err);
    }
  };

  // Уменьшение масштаба
  const zoomOut = () => {
    if (!fabricCanvas) return;
    
    try {
      const newZoom = Math.max(0.5, zoom - 0.1);
      setZoom(newZoom);
      
      fabricCanvas.setZoom(newZoom);
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
    } catch (err) {
      console.error('Error zooming out:', err);
    }
  };

  // Поворот влево
  const rotateLeft = () => {
    if (!fabricCanvas || !selectedObject) return;
    
    try {
      selectedObject.rotate((selectedObject.angle || 0) - 15);
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
    } catch (err) {
      console.error('Error rotating left:', err);
    }
  };

  // Поворот вправо
  const rotateRight = () => {
    if (!fabricCanvas || !selectedObject) return;
    
    try {
      selectedObject.rotate((selectedObject.angle || 0) + 15);
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
    } catch (err) {
      console.error('Error rotating right:', err);
    }
  };

  // Выбор локации
  const selectLocation = (location: Location) => {
    setCurrentLocation(location);
    addImage(location.src);
    
    if (showCoordinates) {
      addCoordinates(location);
    }
  };
  
  // Добавление координат
  const addCoordinates = (location: Location) => {
    if (!fabricCanvas) return;
    
    try {
      const coordText = new fabric.IText(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, {
        left: 150,
        top: 200,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Courier New',
        fontSize: 12,
        fill: '#666666',
        textAlign: 'center',
        transparentCorners: false,
        cornerColor: '#3498db',
        cornerSize: 6
      });
      
      fabricCanvas.add(coordText);
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
    } catch (err) {
      console.error('Error adding coordinates:', err);
    }
  };

  // Функция для сохранения дизайна
  const saveDesign = () => {
    if (!fabricCanvas) return;
    
    try {
      // Временно скрываем область дизайна
      const designArea = fabricCanvas.getObjects().find(obj => obj.name === 'designArea');
      if (designArea) {
        designArea.visible = false;
      }
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
      
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1
      });
      
      // Восстанавливаем видимость области дизайна
      if (designArea) {
        designArea.visible = true;
      }
      
      if (fabricCanvas) {
        fabricCanvas.renderAll();
      }
      
      if (onSaveDesign) {
        onSaveDesign({
          image: dataURL,
          color: tshirtColor,
          objects: fabricCanvas.toJSON().objects,
          location: currentLocation
        });
      }
      
      // Создаем ссылку для скачивания изображения
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'tshirt-design.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error saving design:', err);
    }
  };

  // Стили для интерфейса
  const tabButtonStyle = (tab: string) => ({
    background: currentTab === tab ? '#3498db' : '#f8f8f8',
    color: currentTab === tab ? 'white' : '#555',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: currentTab === tab ? 'bold' : 'normal',
    flex: 1,
    transition: 'all 0.2s ease'
  });

  // Add a database texture to the design
  const addDatabaseTexture = (texture: any) => {
    if (!fabricCanvas) return;
    
    try {
      // Use image URL from the database
      const imageUrl = texture.imageUrl || texture.imageThumbnailUrl;
      if (!imageUrl) {
        console.error('Texture has no image URL');
        return;
      }
      
      fabric.Image.fromURL(imageUrl, (img) => {
        try {
          // Scale down image if it's too large
          const maxWidth = 200;
          const maxHeight = 200;
          
          if (img.width && img.height) {
            if (img.width > maxWidth || img.height > maxHeight) {
              const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
              img.scale(scale);
            }
          }
          
          // Position in the center of the canvas
          img.set({
            left: (fabricCanvas?.width || 400) / 2 - (img.width || 0) * (img.scaleX || 1) / 2,
            top: (fabricCanvas?.height || 400) / 2 - (img.height || 0) * (img.scaleY || 1) / 2,
            name: texture.title || 'Texture'
          });
          
          // Set custom properties
          (img as any).customId = `texture-${texture.id}`;
          
          if (fabricCanvas) {
            fabricCanvas.add(img);
            fabricCanvas.setActiveObject(img);
            fabricCanvas.renderAll();
          }
          
          // Set current location if coordinates are available
          if (texture.coordinates) {
            let lat = 0;
            let lng = 0;
            
            // Parse coordinates from GeoJSON if available
            try {
              if (typeof texture.coordinates === 'string') {
                const geoJson = JSON.parse(texture.coordinates);
                if (geoJson.type === 'Point' && geoJson.coordinates) {
                  [lng, lat] = geoJson.coordinates;
                }
              } else if (texture.coordinates.type === 'Point' && texture.coordinates.coordinates) {
                [lng, lat] = texture.coordinates.coordinates;
              }
              
              if (lat && lng) {
                setCurrentLocation({
                  name: texture.title || 'Custom Location',
                  lat,
                  lng,
                  src: imageUrl
                });
              }
            } catch (error) {
              console.error('Failed to parse coordinates:', error);
            }
          }
        } catch (err) {
          console.error('Error processing database texture image:', err);
        }
      }, {
        crossOrigin: 'Anonymous'
      });
    } catch (err) {
      console.error('Error adding database texture:', err);
    }
  };

  return (
    <div className="tshirt-designer">
      <div className="designer-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="canvas-container" ref={canvasContainerRef} style={{ position: 'relative', width: '300px' }}>
          {isLoading && (
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.7)',
              zIndex: 10
            }}>
              Загрузка...
            </div>
          )}
          <canvas ref={canvasRef} id="tshirt-canvas" />
          
          {/* Панель инструментов для выбранного объекта */}
          {selectedObject && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(255,255,255,0.9)',
              padding: '5px',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              display: 'flex',
              gap: '5px'
            }}>
              <button onClick={rotateLeft} title="Повернуть влево" style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '5px'
              }}>
                <MdRotateLeft />
              </button>
              <button onClick={rotateRight} title="Повернуть вправо" style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '5px'
              }}>
                <MdRotateRight />
              </button>
              <button onClick={() => setShowColorPicker(true)} title="Изменить цвет" style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '5px'
              }}>
                <MdColorLens />
              </button>
              <button onClick={deleteSelectedObject} title="Удалить" style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '5px',
                color: '#e74c3c'
              }}>
                <MdDelete />
              </button>
            </div>
          )}
          
          {/* Цветовая палитра */}
          {showColorPicker && (
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '10px',
              background: 'white',
              padding: '10px',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              zIndex: 100
            }}>
              <ColorPicker 
                color={selectedObject?.type === 'i-text' ? textColor : '#000000'} 
                onChange={changeObjectColor}
                onClose={() => setShowColorPicker(false)}
              />
            </div>
          )}
        </div>
        
        <div className="controls-container" style={{ flex: 1, minWidth: '300px', maxWidth: '500px' }}>
          {/* Вкладки */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button 
              onClick={() => setCurrentTab('texture')} 
              style={tabButtonStyle('texture')}
            >
              Текстуры
            </button>
            <button 
              onClick={() => setCurrentTab('text')} 
              style={tabButtonStyle('text')}
            >
              Текст
            </button>
            <button 
              onClick={() => setCurrentTab('settings')} 
              style={tabButtonStyle('settings')}
            >
              Настройки
            </button>
          </div>
          
          {/* Вкладка текстур */}
          {currentTab === 'texture' && (
            <div className="texture-tab">
              <div className="control-section" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>Локации Алматы</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                  {locations.map((location, index) => (
                    <div 
                      key={index} 
                      onClick={() => selectLocation(location)}
                      style={{
                        width: '100px',
                        height: '100px',
                        border: currentLocation?.name === location.name ? '3px solid #3498db' : '1px solid #ddd',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <img 
                        src={location.src} 
                        alt={location.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src.endsWith('.jpg')) {
                            target.src = location.src.replace('.jpg', '.png');
                          } else if (target.src.endsWith('.png')) {
                            target.src = 'https://via.placeholder.com/100x100?text=Ошибка';
                          }
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '4px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}>
                        {location.name}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="show-coordinates" 
                    checked={showCoordinates} 
                    onChange={(e) => setShowCoordinates(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="show-coordinates" style={{ cursor: 'pointer' }}>
                    Добавлять координаты
                  </label>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Загрузить свою текстуру</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      <MdFileUpload /> Загрузить изображение
                    </button>
                    <button 
                      onClick={addMountainSvg}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      title="Добавить горы"
                    >
                      <MdImage />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                  </div>
                  {isLoading && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <p>Загрузка изображения...</p>
                    </div>
                  )}
                  {uploadError && (
                    <div style={{ 
                      marginTop: '10px', 
                      padding: '10px', 
                      backgroundColor: '#ffecec', 
                      color: '#e74c3c', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      <p>{uploadError}</p>
                    </div>
                  )}
                </div>
                
                {/* Database Textures Section */}
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Текстуры города</h3>
                  {isLoadingTextures ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      Загрузка текстур...
                    </div>
                  ) : databaseTextures.length > 0 ? (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', 
                      gap: '10px',
                      maxHeight: '250px',
                      overflowY: 'auto',
                      padding: '5px'
                    }}>
                      {databaseTextures.map((texture, index) => (
                        <div 
                          key={index}
                          onClick={() => addDatabaseTexture(texture)}
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                        >
                          <img 
                            src={texture.imageUrl || texture.imageThumbnailUrl || `/textures/texture${(index % 4) + 1}.jpg`} 
                            alt={texture.title || `Texture ${index + 1}`}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `/textures/texture${(index % 4) + 1}.jpg`;
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '2px 4px',
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            fontSize: '10px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {texture.title || `Текстура ${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '15px', textAlign: 'center', background: '#f5f5f5', borderRadius: '4px' }}>
                      Нет доступных текстур
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Вкладка текста */}
          {currentTab === 'text' && (
            <div className="text-tab" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Добавить текст</h3>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="text" 
                  value={textInput} 
                  onChange={(e) => setTextInput(e.target.value)} 
                  placeholder="Введите текст..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <button 
                  onClick={addText}
                  disabled={!textInput.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: textInput.trim() ? '#3498db' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '4px',
                    cursor: textInput.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  <MdTextFields /> Добавить текст
                </button>
                
                <div onClick={() => setShowTextColorPicker(!showTextColorPicker)} style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '4px',
                  background: textColor,
                  border: '1px solid #ccc',
                  cursor: 'pointer'
                }} />
              </div>
              
              {showTextColorPicker && (
                <div style={{ marginBottom: '15px' }}>
                  <ColorPicker 
                    color={textColor} 
                    onChange={(color) => setTextColor(color)}
                    onClose={() => setShowTextColorPicker(false)}
                  />
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Размер текста</label>
                  <input 
                    type="range" 
                    min="12" 
                    max="48" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                    <span>12</span>
                    <span>{fontSize}</span>
                    <span>48</span>
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Шрифт</label>
                  <select 
                    value={fontFamily} 
                    onChange={(e) => setFontFamily(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Вкладка настроек */}
          {currentTab === 'settings' && (
            <div className="settings-tab">
              <h3 style={{ marginBottom: '10px' }}>Настройки футболки</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ marginBottom: '5px' }}>Цвет футболки:</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {tshirtColors.map((color, index) => (
                    <div 
                      key={index}
                      onClick={() => setTshirtColor(color.value)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: color.value,
                        border: tshirtColor === color.value ? '3px solid #3498db' : '1px solid #ccc',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      {tshirtColor === color.value && (
                        <span style={{
                          position: 'absolute',
                          top: '40px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '12px',
                          whiteSpace: 'nowrap'
                        }}>
                          {color.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ marginBottom: '5px' }}>Масштаб:</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button 
                    onClick={zoomOut}
                    style={{
                      background: '#f1f1f1',
                      border: 'none',
                      borderRadius: '4px',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <MdRemove />
                  </button>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    {Math.round(zoom * 100)}%
                  </div>
                  <button 
                    onClick={zoomIn}
                    style={{
                      background: '#f1f1f1',
                      border: 'none',
                      borderRadius: '4px',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <MdAdd />
                  </button>
                </div>
              </div>
              
              <div style={{ marginTop: '30px' }}>
                <button 
                  onClick={saveDesign}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px 20px',
                    width: '100%',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <MdSave /> Сохранить дизайн
                </button>
                
                {currentLocation && (
                  <div style={{ 
                    marginTop: '15px', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    background: '#f9f9f9',
                    borderRadius: '4px'
                  }}>
                    <MdMap style={{ fontSize: '20px', color: '#3498db' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{currentLocation.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TshirtDesigner; 