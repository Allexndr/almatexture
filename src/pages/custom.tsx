import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MountainSvg from '../components/svg/MountainSvg';

interface FormData {
  name: string;
  email: string;
  phone: string;
  productType: string;
  size: string;
  color: string;
  description: string;
  designType: string;
  reference?: string;
  textureId?: string;
}

const CustomDesignPage = () => {
  const router = useRouter();
  const { texture } = router.query;
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    productType: 'tshirt',
    size: 'M',
    color: 'white',
    description: '',
    designType: 'texture'
  });
  
  // Handle texture ID from URL
  useEffect(() => {
    if (texture && typeof texture === 'string') {
      setFormData(prev => ({
        ...prev,
        textureId: texture,
        designType: 'texture',
        description: prev.description || `Футболка с текстурой (ID: ${texture}). Пожалуйста, адаптируйте дизайн для моего изделия.`
      }));
    }
  }, [texture]);
  
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Предпросмотр фото
  const handleFileChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };
  
  // Обработка выбора файла через input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  // Drag-and-drop обработчики
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      // Create form data for submission
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });
      
      // Add image if available
      if (image) {
        submitData.append('referenceImage', image);
      }
      
      // Send to the API
      const response = await fetch('/api/custom-design', {
        method: 'POST',
        body: submitData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Success response
        setSuccess(result.message || 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          productType: 'tshirt',
          size: 'M',
          color: 'white',
          description: '',
          designType: 'texture'
        });
        setImage(null);
        setPreview(null);
        
        // Remove texture ID from URL
        if (texture) {
          router.replace('/custom', undefined, { shallow: true });
        }
      } else {
        setError(result.error || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
      }
    } catch (err) {
      setError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Color options
  const colorOptions = [
    { name: 'Белый', value: 'white' },
    { name: 'Черный', value: 'black' },
    { name: 'Серый', value: 'gray' },
    { name: 'Синий', value: 'blue' },
    { name: 'Красный', value: 'red' },
    { name: 'Зеленый', value: 'green' }
  ];
  
  // Size options
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Product type options
  const productOptions = [
    { name: 'Футболка', value: 'tshirt' },
    { name: 'Толстовка', value: 'hoodie' },
    { name: 'Шоппер', value: 'tote' },
    { name: 'Кепка', value: 'cap' }
  ];
  
  return (
    <div className="custom-design-page" style={{
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.98))',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Фоновое изображение гор Алматы с эффектом "мыла" */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: `url('/pictures/almaty_mountains.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
          opacity: 0.15
        }} />
      </div>
      
      {/* Фоновое SVG изображение гор */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.08,
        overflow: 'hidden'
      }}>
        <MountainSvg width="100%" height="100%" />
      </div>
      
      <Head>
        <title>Создать дизайн | AlmaTexture</title>
        <meta name="description" content="Создайте свой уникальный дизайн с текстурами Алматы" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <Container style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '1140px' }}>
        <h1 className="text-center mb-4" style={{ fontSize: '2.5rem', fontWeight: '600' }}>Создайте свой дизайн</h1>
        
        <Row className="justify-content-center">
          <Col lg={10}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
              <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                Заполните форму ниже, чтобы заказать изделие с уникальным дизайном, 
                созданным специально для вас на основе текстур Алматы.
              </p>
              
              {texture && (
                <Alert variant="info" className="mt-3">
                  Вы выбрали текстуру с ID: {texture}. Мы учтем ваш выбор при разработке дизайна.
                </Alert>
              )}
            </div>
            
            {success ? (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="text-center p-5">
                  <div className="mb-4">
                    <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">Спасибо за вашу заявку!</h3>
                  <p className="text-muted mb-4">{success}</p>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => {
                      setSuccess(null);
                      router.push('/');
                    }}
                  >
                    Вернуться на главную
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                      {error}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <h5 className="mb-3 fw-bold">Контактная информация</h5>
                    <Row className="mb-4">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ваше имя <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Введите ваше имя"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@mail.com"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Телефон</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+7 (___) ___-__-__"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <h5 className="mb-3 fw-bold">Параметры изделия</h5>
                    <Row className="mb-4">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Тип изделия <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="productType"
                            value={formData.productType}
                            onChange={handleChange}
                            required
                          >
                            {productOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Размер <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                          >
                            {sizeOptions.map(size => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Цвет <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            required
                          >
                            {colorOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <h5 className="mb-3 fw-bold">Детали дизайна</h5>
                    <Form.Group className="mb-4">
                      <Form.Label>Тип дизайна <span className="text-danger">*</span></Form.Label>
                      <div className="mb-3">
                        <Card 
                          className={`mb-3 ${formData.designType === 'texture' ? 'border-primary' : 'border'}`}
                          onClick={() => setFormData({...formData, designType: 'texture'})}
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Body className="p-3 d-flex align-items-center">
                            <div className="me-3">
                              <i className="bi bi-grid-3x3-gap-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                            </div>
                            <div>
                              <div className="fw-bold">Текстура города</div>
                              <div className="small text-muted">Мы подберем уникальную городскую текстуру Алматы, соответствующую вашему запросу и стилю.</div>
                            </div>
                          </Card.Body>
                        </Card>
                        
                        <Card 
                          className={`mb-3 ${formData.designType === 'custom' ? 'border-primary' : 'border'}`}
                          onClick={() => setFormData({...formData, designType: 'custom'})}
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Body className="p-3 d-flex align-items-center">
                            <div className="me-3">
                              <i className="bi bi-brush-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                            </div>
                            <div>
                              <div className="fw-bold">Мой собственный дизайн</div>
                              <div className="small text-muted">Загрузите свой эскиз или опишите, как вы хотите видеть дизайн на изделии.</div>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Описание дизайна <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Опишите, какой дизайн вы хотите видеть на изделии. Укажите особенности, расположение принта, детали."
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Референс или собственный эскиз</Form.Label>
                      <div
                        className={`d-flex flex-column align-items-center justify-content-center p-4 rounded ${dragActive ? 'bg-light border-primary' : 'bg-light border'}`}
                        style={{ 
                          border: '2px dashed #dee2e6', 
                          cursor: 'pointer',
                          minHeight: '200px',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {preview ? (
                          <div className="text-center">
                            <img 
                              src={preview} 
                              alt="Превью" 
                              style={{ 
                                maxHeight: '200px', 
                                maxWidth: '100%',
                                borderRadius: '4px',
                                marginBottom: '10px'
                              }}
                            />
                            <div>
                              <Button 
                                variant="link" 
                                className="text-danger p-0" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImage(null);
                                  setPreview(null);
                                }}
                              >
                                Удалить
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <i className="bi bi-cloud-arrow-up mb-3" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                            <p className="mb-2">Перетащите изображение для референса или нажмите для выбора</p>
                            <p className="text-muted small">Поддерживаются JPG, PNG. Максимальный размер 5MB</p>
                          </>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleInputChange}
                          accept="image/jpeg,image/png"
                          style={{ display: 'none' }}
                        />
                      </div>
                    </Form.Group>
                    
                    <div className="text-center mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        style={{ minWidth: '200px' }}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Отправка...
                          </>
                        ) : 'Отправить заявку'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
        
        <div className="mt-5 pt-4">
          <h3 className="h4 text-center mb-4">Как мы создаем уникальные дизайны</h3>
          
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="d-flex justify-content-center align-items-center mb-3 rounded-circle mx-auto" 
                    style={{ width: '60px', height: '60px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <span className="h4 mb-0 text-primary">1</span>
                  </div>
                  <h4 className="h5 mb-3">Запрос</h4>
                  <p className="text-muted mb-0">Вы отправляете нам заявку с описанием желаемого дизайна</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="d-flex justify-content-center align-items-center mb-3 rounded-circle mx-auto" 
                    style={{ width: '60px', height: '60px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <span className="h4 mb-0 text-primary">2</span>
                  </div>
                  <h4 className="h5 mb-3">Разработка</h4>
                  <p className="text-muted mb-0">Наши дизайнеры создают макет и согласуют его с вами</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="d-flex justify-content-center align-items-center mb-3 rounded-circle mx-auto" 
                    style={{ width: '60px', height: '60px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <span className="h4 mb-0 text-primary">3</span>
                  </div>
                  <h4 className="h5 mb-3">Производство</h4>
                  <p className="text-muted mb-0">Мы изготавливаем изделие и доставляем его вам</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="mt-4 pt-2">
            <p className="text-center">
              Наша команда дизайнеров работает с текстурами Алматы, чтобы создать для вас по-настоящему уникальные изделия. Мы используем фотографии и паттерны различных районов и локаций города, преобразуя их в стильные дизайны для одежды и аксессуаров.
            </p>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default CustomDesignPage; 