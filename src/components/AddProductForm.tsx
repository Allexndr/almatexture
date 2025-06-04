import React, { useRef, useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../store/dataSlice';

interface AddProductFormProps {
  onProductAdded?: (product: any) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onProductAdded }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '1',
    hasColors: true,
    hasSize: true,
    district: '',
    texture: '',
    clothingType: '',
    material: '',
    collection: '',
    season: '',
    printTechnique: '',
    designStyle: '',
    isEco: false,
    isOnSale: false,
    discountPrice: '',
    timePeriod: '',
    imageUrl: ''
  });
  
  // Для загрузки доступных районов и текстур
  const [districts, setDistricts] = useState<{id: string, name: string}[]>([]);
  const [textures, setTextures] = useState<{id: string, title: string}[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingTextures, setLoadingTextures] = useState(false);
  
  // Colors and sizes states
  const [colors, setColors] = useState<string[]>(['white']);
  const [sizes, setSizes] = useState<string[]>(['M']);
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Загрузка районов и текстур
  useEffect(() => {
    // Загрузка районов
    setLoadingDistricts(true);
    fetch('/api/districts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDistricts(data);
        }
        setLoadingDistricts(false);
      })
      .catch(error => {
        console.error('Ошибка при загрузке районов:', error);
        setLoadingDistricts(false);
      });
    
    // Загрузка текстур
    setLoadingTextures(true);
    fetch('/api/textures')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTextures(data);
        }
        setLoadingTextures(false);
      })
      .catch(error => {
        console.error('Ошибка при загрузке текстур:', error);
        setLoadingTextures(false);
      });
  }, []);

  // Обработка изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox changes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    // Автозаполнение типа одежды на основе категории, если тип одежды пуст
    if (name === 'category' && !form.clothingType) {
      setForm(prev => ({ ...prev, clothingType: value }));
    }
  };
  
  // Add color
  const handleAddColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()]);
      setColorInput('');
    }
  };
  
  // Remove color
  const handleRemoveColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };
  
  // Add size
  const handleAddSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput('');
    }
  };
  
  // Remove size
  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Валидация URL изображения
      if (!form.imageUrl.trim()) {
        setError('Необходимо указать URL изображения');
        return;
      }

      // Отправляем данные как JSON, а не FormData
      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        category: form.category,
        stock: parseInt(form.stock),
        imageUrl: form.imageUrl,
        district: form.district,
        texture: form.texture,
        clothingType: form.clothingType,
        material: form.material,
        collection: form.collection,
        season: form.season,
        printTechnique: form.printTechnique,
        designStyle: form.designStyle,
        isEco: form.isEco,
        isOnSale: form.isOnSale,
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        timePeriod: form.timePeriod,
        colors: form.hasColors ? colors : [],
        sizes: form.hasSize ? sizes : []
      };

      const res = await fetch('/api/products/create-by-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Товар успешно добавлен!');
        setForm({ 
          name: '', 
          price: '', 
          description: '', 
          category: '', 
          stock: '1',
          hasColors: true,
          hasSize: true,
          district: '',
          texture: '',
          clothingType: '',
          material: '',
          collection: '',
          season: '',
          printTechnique: '',
          designStyle: '',
          isEco: false,
          isOnSale: false,
          discountPrice: '',
          timePeriod: '',
          imageUrl: ''
        });
        setColors(['white']);
        setSizes(['M']);
        
        // Обновляем список товаров в Redux store
        dispatch(fetchProducts());
        
        if (onProductAdded) onProductAdded(data.product);
      } else {
        setError(data.error || 'Ошибка при добавлении товара');
      }
    } catch (e) {
      setError('Ошибка при отправке формы');
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Predefined color options
  const predefinedColors = [
    { name: 'Белый', value: 'white' },
    { name: 'Черный', value: 'black' },
    { name: 'Серый', value: 'gray' },
    { name: 'Синий', value: 'blue' },
    { name: 'Красный', value: 'red' },
    { name: 'Зеленый', value: 'green' },
    { name: 'Желтый', value: 'yellow' },
    { name: 'Бежевый', value: 'beige' }
  ];
  
  // Predefined size options
  const predefinedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  
  // Предопределенные типы одежды
  const clothingTypes = [
    { id: '', name: 'Выберите тип одежды' },
    { id: 'tshirt', name: 'Футболки' },
    { id: 'hoodie', name: 'Толстовки' },
    { id: 'longsleeve', name: 'Лонгсливы' },
    { id: 'sweater', name: 'Свитера' },
    { id: 'sweatshirt', name: 'Свитшоты' },
    { id: 'polo', name: 'Поло' },
    { id: 'jacket', name: 'Куртки' },
    { id: 'pants', name: 'Штаны' },
    { id: 'shorts', name: 'Шорты' },
    { id: 'hat', name: 'Головные уборы' },
    { id: 'accessory', name: 'Аксессуары' }
  ];

  // Константы для новых фильтров
  const materials = [
    { id: '', name: 'Выберите материал' },
    { id: 'cotton', name: 'Хлопок' },
    { id: 'linen', name: 'Лен' },
    { id: 'synthetic', name: 'Синтетика' },
    { id: 'mixed', name: 'Смесовые ткани' },
    { id: 'recycled', name: 'Переработанные материалы' },
    { id: 'paper', name: 'Бумага' },
    { id: 'canvas', name: 'Холст' },
    { id: 'wood', name: 'Дерево' }
  ];
  
  const collections = [
    { id: '', name: 'Выберите коллекцию' },
    { id: 'historic-center', name: 'Исторический центр' },
    { id: 'new-buildings', name: 'Новостройки' },
    { id: 'parks', name: 'Парки' },
    { id: 'streets', name: 'Улицы' },
    { id: 'mountains', name: 'Горы Алматы' },
    { id: 'bazaars', name: 'Базары' }
  ];
  
  const seasons = [
    { id: '', name: 'Выберите сезон' },
    { id: 'spring-summer', name: 'Весна-Лето' },
    { id: 'fall-winter', name: 'Осень-Зима' },
    { id: 'all-season', name: 'Всесезонное' }
  ];
  
  const printTechniques = [
    { id: '', name: 'Выберите технику' },
    { id: 'embroidery', name: 'Вышивка' },
    { id: 'screen-printing', name: 'Шелкография' },
    { id: 'digital-printing', name: 'Цифровая печать' },
    { id: 'embossing', name: 'Тиснение' },
    { id: 'hand-painted', name: 'Ручная роспись' },
    { id: 'sublimation', name: 'Сублимация' }
  ];
  
  const designStyles = [
    { id: '', name: 'Выберите стиль' },
    { id: 'minimalism', name: 'Минимализм' },
    { id: 'vintage', name: 'Винтаж' },
    { id: 'abstract', name: 'Абстракция' },
    { id: 'ethnic', name: 'Этнический' },
    { id: 'geometric', name: 'Геометрический' },
    { id: 'postmodernism', name: 'Постмодернизм' }
  ];
  
  const timePeriods = [
    { id: '', name: 'Выберите период' },
    { id: 'pre-soviet', name: 'Досоветский' },
    { id: 'soviet', name: 'Советский' },
    { id: 'independence', name: 'Период независимости' },
    { id: 'modern', name: 'Современность' },
    { id: 'future', name: 'Будущее' }
  ];

  return (
    <Card className="shadow border-0 mb-4">
      <Card.Header className="bg-white py-3">
        <h3 className="m-0 fw-bold">Добавить новый товар</h3>
      </Card.Header>
      <Card.Body className="p-4">
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Название товара <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Введите название товара"
                  className="py-2"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Цена (₸) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder="Укажите цену в тенге"
                  className="py-2"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Категория <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="py-2"
                >
                  <option value="">Выберите категорию</option>
                  <option value="tshirt">Футболки</option>
                  <option value="hoodie">Толстовки</option>
                  <option value="poster">Постеры</option>
                  <option value="tote">Шопперы</option>
                  <option value="caps">Кепки</option>
                  <option value="bandanas">Банданы</option>
                  <option value="tablecloth">Скатерти</option>
                  <option value="apron">Фартуки</option>
                  <option value="stickers">Стикеры</option>
                  <option value="decals">Наклейки</option>
                  <option value="other">Другое</option>
                </Form.Select>
              </Form.Group>
              
              {/* Новое поле для выбора типа одежды */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Тип одежды/предмета</Form.Label>
                <Form.Select
                  name="clothingType"
                  value={form.clothingType}
                  onChange={handleChange}
                  className="py-2"
                >
                  {clothingTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Более точная категория для фильтрации товаров
                </Form.Text>
              </Form.Group>
              
              {/* Новые поля для района и текстуры */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Район</Form.Label>
                    <Form.Select
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      className="py-2"
                      disabled={loadingDistricts}
                    >
                      <option value="">Выберите район</option>
                      {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </Form.Select>
                    {loadingDistricts && (
                      <div className="text-center mt-2">
                        <Spinner animation="border" size="sm" /> Загрузка районов...
                      </div>
                    )}
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Текстура</Form.Label>
                    <Form.Select
                      name="texture"
                      value={form.texture}
                      onChange={handleChange}
                      className="py-2"
                      disabled={loadingTextures}
                    >
                      <option value="">Выберите текстуру</option>
                      {textures.map(texture => (
                        <option key={texture.id} value={texture.id}>{texture.title}</option>
                      ))}
                    </Form.Select>
                    {loadingTextures && (
                      <div className="text-center mt-2">
                        <Spinner animation="border" size="sm" /> Загрузка текстур...
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">В наличии (шт.)</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min={1}
                  required
                  placeholder="Укажите количество товара"
                  className="py-2"
                />
              </Form.Group>
              
              {/* Новые поля для классификации товара */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Материал</Form.Label>
                    <Form.Select
                      name="material"
                      value={form.material}
                      onChange={handleChange}
                      className="py-2"
                    >
                      {materials.map(material => (
                        <option key={material.id} value={material.id}>{material.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Коллекция</Form.Label>
                    <Form.Select
                      name="collection"
                      value={form.collection}
                      onChange={handleChange}
                      className="py-2"
                    >
                      {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>{collection.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Сезон</Form.Label>
                    <Form.Select
                      name="season"
                      value={form.season}
                      onChange={handleChange}
                      className="py-2"
                    >
                      {seasons.map(season => (
                        <option key={season.id} value={season.id}>{season.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Техника нанесения</Form.Label>
                    <Form.Select
                      name="printTechnique"
                      value={form.printTechnique}
                      onChange={handleChange}
                      className="py-2"
                    >
                      {printTechniques.map(technique => (
                        <option key={technique.id} value={technique.id}>{technique.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Стиль дизайна</Form.Label>
                    <Form.Select
                      name="designStyle"
                      value={form.designStyle}
                      onChange={handleChange}
                      className="py-2"
                    >
                      {designStyles.map(style => (
                        <option key={style.id} value={style.id}>{style.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Временной период</Form.Label>
                    <Form.Select
                      name="timePeriod"
                      value={form.timePeriod}
                      onChange={handleChange}
                      className="py-2"
                    >
                      {timePeriods.map(period => (
                        <option key={period.id} value={period.id}>{period.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center">
                      <Form.Check 
                        type="switch"
                        id="eco-switch"
                        name="isEco"
                        label="Экологичный товар"
                        checked={form.isEco}
                        onChange={handleChange}
                        className="me-3"
                      />
                      <i className="bi bi-info-circle text-muted" title="Отметьте, если товар изготовлен из экологичных материалов или экологичным способом"></i>
                    </div>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center">
                      <Form.Check 
                        type="switch"
                        id="sale-switch"
                        name="isOnSale"
                        label="Товар со скидкой"
                        checked={form.isOnSale}
                        onChange={handleChange}
                        className="me-3"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Поле для скидочной цены, видимое только если товар со скидкой */}
              {form.isOnSale && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Цена со скидкой (₸)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discountPrice"
                    value={form.discountPrice}
                    onChange={handleChange}
                    min={0}
                    max={Number(form.price) || 999999}
                    placeholder="Укажите цену со скидкой"
                    className="py-2"
                  />
                  <Form.Text className="text-muted">
                    Цена со скидкой должна быть меньше обычной цены {form.price}₸
                  </Form.Text>
                </Form.Group>
              )}
              
              {/* Color options */}
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="fw-semibold mb-0">Варианты цветов</Form.Label>
                  <Form.Check 
                    type="switch"
                    id="color-switch"
                    name="hasColors"
                    label="Имеет цвета"
                    checked={form.hasColors}
                    onChange={handleChange}
                  />
                </div>
                
                {form.hasColors && (
                  <div className="color-options p-3 border rounded mb-3">
                    <div className="d-flex mb-2">
                      {colors.map(color => (
                        <Badge 
                          key={color} 
                          bg="light" 
                          text="dark" 
                          className="me-2 mb-2 p-2 d-flex align-items-center"
                        >
                          <span 
                            className="color-dot me-1" 
                            style={{
                              width: '12px', 
                              height: '12px',
                              borderRadius: '50%',
                              display: 'inline-block',
                              backgroundColor: color,
                              border: color === 'white' ? '1px solid #ddd' : 'none'
                            }}
                          ></span>
                          {color}
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 ms-2 text-danger" 
                            onClick={() => handleRemoveColor(color)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="d-flex mt-2">
                      <Form.Select 
                        size="sm" 
                        value={colorInput} 
                        onChange={(e) => setColorInput(e.target.value)}
                        className="me-2"
                      >
                        <option value="">Выберите цвет</option>
                        {predefinedColors.map(color => (
                          <option key={color.value} value={color.value}>{color.name}</option>
                        ))}
                      </Form.Select>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={handleAddColor}
                      >
                        Добавить
                      </Button>
                    </div>
                  </div>
                )}
              </Form.Group>
              
              {/* Size options */}
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="fw-semibold mb-0">Размеры</Form.Label>
                  <Form.Check 
                    type="switch"
                    id="size-switch"
                    name="hasSize"
                    label="Имеет размеры"
                    checked={form.hasSize}
                    onChange={handleChange}
                  />
                </div>
                
                {form.hasSize && (
                  <div className="size-options p-3 border rounded mb-3">
                    <div className="d-flex flex-wrap mb-2">
                      {sizes.map(size => (
                        <Badge 
                          key={size} 
                          bg="light" 
                          text="dark" 
                          className="me-2 mb-2 p-2 d-flex align-items-center"
                        >
                          {size}
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 ms-2 text-danger" 
                            onClick={() => handleRemoveSize(size)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="d-flex mt-2">
                      <Form.Select 
                        size="sm" 
                        value={sizeInput} 
                        onChange={(e) => setSizeInput(e.target.value)}
                        className="me-2"
                      >
                        <option value="">Выберите размер</option>
                        {predefinedSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </Form.Select>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={handleAddSize}
                      >
                        Добавить
                      </Button>
                    </div>
                  </div>
                )}
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Описание <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Подробное описание товара"
                  className="py-2"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">URL изображения товара <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  required
                  placeholder="Введите URL изображения товара"
                  className="py-2"
                />
                <Form.Text className="text-muted">
                  Введите URL изображения с Cloudinary или другого источника. Поддерживаются форматы: JPG, PNG, WebP
                </Form.Text>
              </Form.Group>

              <div className="product-info-card mt-4">
                <div className="bg-light p-3 rounded">
                  <h5 className="mb-3">Основная информация:</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i> Добавление товара в каталог</li>
                    <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i> Все товары синхронизируются с магазином</li>
                    <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i> Изображение будет автоматически оптимизировано</li>
                    <li className="mb-2"><i className="bi bi-info-circle text-primary me-2"></i> Поля, отмеченные <span className="text-danger">*</span>, обязательны для заполнения</li>
                  </ul>
                </div>
                
                <div className="bg-light p-3 rounded mt-4">
                  <h5 className="mb-3">Расширенная информация:</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="bi bi-geo-alt text-primary me-2"></i> Район указывает, где была найдена текстура</li>
                    <li className="mb-2"><i className="bi bi-boxes text-primary me-2"></i> Связь с текстурой позволяет покупателям находить товары по текстурам</li>
                    <li className="mb-2"><i className="bi bi-tags text-primary me-2"></i> Тип одежды позволяет более точно фильтровать товары</li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end mt-4">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              size="lg"
              className="px-4"
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Добавление...
                </>
              ) : 'Добавить товар'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddProductForm; 