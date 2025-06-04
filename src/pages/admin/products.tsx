import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, Spinner, Alert, Table } from 'react-bootstrap';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/AdminSidebar';
import styles from '../../styles/Admin.module.css';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  hasColorOptions: boolean;
  hasSizeOptions: boolean;
  colors?: string[];
  sizes?: string[];
}

const ProductsAdminPage: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'tshirt',
    stock: '10',
    hasColorOptions: false,
    hasSizeOptions: false,
    colors: '',
    sizes: '',
    imageUrl: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Проверка аутентификации
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin');
    } else {
      fetchProducts();
    }
  }, [router]);
  
  // Загрузка товаров
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Не удалось загрузить данные товаров');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Категории товаров
  const categories = [
    { id: 'tshirt', name: 'Футболки' },
    { id: 'hoodie', name: 'Толстовки' },
    { id: 'poster', name: 'Постеры' },
    { id: 'tote', name: 'Шопперы' },
    { id: 'caps', name: 'Кепки' },
    { id: 'bandanas', name: 'Банданы' },
    { id: 'tablecloth', name: 'Скатерти' },
    { id: 'apron', name: 'Фартуки' },
    { id: 'stickers', name: 'Стикеры' },
    { id: 'decals', name: 'Наклейки' },
    { id: 'other', name: 'Другое' }
  ];
  
  // Получение названия категории
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  // Фильтрация товаров
  const filteredProducts = products
    .filter(product => filterCategory === 'all' || product.category === filterCategory)
    .filter(product => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
  
  // Обработка изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Подготовка формы для добавления
  const handleAddProduct = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'tshirt',
      stock: '10',
      hasColorOptions: false,
      hasSizeOptions: false,
      colors: '',
      sizes: '',
      imageUrl: ''
    });
    setShowAddModal(true);
  };
  
  // Подготовка формы для редактирования
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      hasColorOptions: product.hasColorOptions || false,
      hasSizeOptions: product.hasSizeOptions || false,
      colors: product.colors ? product.colors.join(', ') : '',
      sizes: product.sizes ? product.sizes.join(', ') : '',
      imageUrl: product.imageUrl
    });
    setShowEditModal(true);
  };
  
  // Подготовка для удаления
  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  
  // Отправка формы добавления
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Создаем объект товара напрямую без сложной обработки
      const productData = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        hasColorOptions: formData.hasColorOptions,
        hasSizeOptions: formData.hasSizeOptions,
        imageUrl: formData.imageUrl
      };
      
      // Добавляем опции цветов и размеров, если они выбраны
      if (formData.hasColorOptions && formData.colors) {
        productData['colors'] = formData.colors.split(',').map(c => c.trim());
      }
      
      if (formData.hasSizeOptions && formData.sizes) {
        productData['sizes'] = formData.sizes.split(',').map(s => s.trim());
      }
      
      console.log('Отправка данных:', productData);
      
      // Отправляем POST-запрос
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Ошибка ответа:', text);
        throw new Error(`Ошибка сервера: ${response.status}. ${text || 'Нет деталей'}`);
      }
      
      // Обновляем список товаров
      await fetchProducts();
      
      // Сбрасываем форму и закрываем модальное окно
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'tshirt',
        stock: '10',
        hasColorOptions: false,
        hasSizeOptions: false,
        colors: '',
        sizes: '',
        imageUrl: ''
      });
      setShowAddModal(false);
      
      alert('Товар успешно добавлен!');
    } catch (error: any) {
      console.error('Ошибка при добавлении товара:', error);
      alert(`Не удалось добавить товар: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Отправка формы редактирования
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!selectedProduct) return;
      
      // Обновляем товар
      const updatedProduct: Product = {
        ...selectedProduct,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        imageUrl: formData.imageUrl,
        stock: parseInt(formData.stock) || 0,
        hasColorOptions: formData.hasColorOptions,
        hasSizeOptions: formData.hasSizeOptions
      };
      
      if (formData.hasColorOptions && formData.colors) {
        updatedProduct.colors = formData.colors.split(',').map(color => color.trim());
      } else {
        delete updatedProduct.colors;
      }
      
      if (formData.hasSizeOptions && formData.sizes) {
        updatedProduct.sizes = formData.sizes.split(',').map(size => size.trim());
      } else {
        delete updatedProduct.sizes;
      }
      
      // Отправляем обновленный товар на сервер
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при обновлении товара');
      }
      
      const result = await response.json();
      
      // Обновляем товар в списке
      setProducts(prev => prev.map(product => 
        product.id === selectedProduct.id ? result.product : product
      ));
      
      setShowEditModal(false);
      alert('Товар успешно обновлен');
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Удаление товара
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    
    try {
      if (!selectedProduct) return;
      
      // Отправляем запрос на удаление товара
      const response = await fetch(`/api/admin/products?id=${selectedProduct.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении товара');
      }
      
      // Удаляем товар из списка
      setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));
      
      setShowDeleteModal(false);
      alert('Товар успешно удален');
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="d-flex">
      <AdminSidebar activeItem="products" />
      
      <div className={styles.content}>
        <Container fluid className="px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold">Управление товарами</h2>
            <Button 
              variant="primary" 
              onClick={handleAddProduct}
              className="d-flex align-items-center"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Добавить товар
            </Button>
          </div>
          
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small text-muted">Фильтр по категории</Form.Label>
                    <Form.Select 
                      value={filterCategory} 
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="shadow-none"
                    >
                      <option value="all">Все категории</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted">Поиск</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Поиск по названию или описанию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="shadow-none"
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="text-end">
                  <Button 
                    variant="outline-secondary" 
                    className="w-100"
                    onClick={() => {
                      setFilterCategory('all');
                      setSearchQuery('');
                      fetchProducts();
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Обновить
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Загрузка товаров...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0 text-muted">Всего товаров: {products.length}</p>
                {filterCategory !== 'all' && (
                  <Badge bg="info" className="fs-6">
                    Категория: {getCategoryName(filterCategory)}
                  </Badge>
                )}
              </div>
              
              <Card className="border-0 shadow-sm">
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: '80px' }}>ID</th>
                        <th style={{ width: '100px' }}>Изображение</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th style={{ width: '100px' }}>Цена</th>
                        <th style={{ width: '100px' }}>Наличие</th>
                        <th style={{ width: '100px' }}>Опции</th>
                        <th style={{ width: '120px' }} className="text-end">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-4 text-muted">
                            Товары не найдены. {searchQuery && 'Попробуйте изменить параметры поиска.'}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(product => (
                          <tr key={product.id}>
                            <td className="text-muted">#{product.id.toString().slice(0, 5)}</td>
                            <td>
                              <div 
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '4px',
                                  background: '#f8f9fa',
                                  overflow: 'hidden'
                                }}
                              >
                                <img 
                                  src={product.imageUrl || '/pictures/product_placeholder.jpg'} 
                                  alt={product.title}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/pictures/product_placeholder.jpg';
                                  }}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="fw-medium">{product.title}</div>
                              <div className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
                                {product.description}
                              </div>
                            </td>
                            <td>
                              <Badge bg="light" text="dark">
                                {getCategoryName(product.category)}
                              </Badge>
                            </td>
                            <td className="fw-medium">{formatPrice(product.price)}</td>
                            <td>
                              <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                                {product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии'}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex flex-column gap-1">
                                {product.hasColorOptions && (
                                  <Badge bg="info" pill className="small">Цвета</Badge>
                                )}
                                {product.hasSizeOptions && (
                                  <Badge bg="info" pill className="small">Размеры</Badge>
                                )}
                              </div>
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end align-items-center">
                              <Button
                                  variant="primary"
                                size="sm"
                                  className="me-2 d-flex align-items-center justify-content-center"
                                  style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                                onClick={() => handleEditProduct(product)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                  variant="danger"
                                size="sm"
                                  className="d-flex align-items-center justify-content-center"
                                  style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                                onClick={() => handleDeleteProduct(product)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </>
          )}
        </Container>
      </div>
      
      {/* Модальное окно добавления товара */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавление нового товара</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Название товара <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Категория <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Описание <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Цена (KZT) <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Количество <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <div className="d-flex gap-4">
                    <Form.Check
                      type="checkbox"
                      label="Опции цветов"
                      name="hasColorOptions"
                      checked={formData.hasColorOptions}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Опции размеров"
                      name="hasSizeOptions"
                      checked={formData.hasSizeOptions}
                      onChange={handleInputChange}
                    />
                  </div>
                </Form.Group>
                
                {formData.hasColorOptions && (
                  <Form.Group className="mb-3">
                    <Form.Label>Цвета (через запятую)</Form.Label>
                    <Form.Control
                      type="text"
                      name="colors"
                      value={formData.colors}
                      onChange={handleInputChange}
                      placeholder="Белый, Черный, Синий"
                    />
                  </Form.Group>
                )}
                
                {formData.hasSizeOptions && (
                  <Form.Group className="mb-3">
                    <Form.Label>Размеры (через запятую)</Form.Label>
                    <Form.Control
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleInputChange}
                      placeholder="S, M, L, XL"
                    />
                  </Form.Group>
                )}
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL изображения товара <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите URL изображения товара"
                  />
                  <Form.Text className="text-muted">
                    Введите URL изображения с Cloudinary или другого источника. Поддерживаются форматы: JPG, PNG, WebP
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Отмена</Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Добавление...
                </>
              ) : 'Добавить товар'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Модальное окно редактирования товара */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Редактирование товара</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Название товара <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Категория <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Описание <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Цена (KZT) <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Количество <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <div className="d-flex gap-4">
                    <Form.Check
                      type="checkbox"
                      label="Опции цветов"
                      name="hasColorOptions"
                      checked={formData.hasColorOptions}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Опции размеров"
                      name="hasSizeOptions"
                      checked={formData.hasSizeOptions}
                      onChange={handleInputChange}
                    />
                  </div>
                </Form.Group>
                
                {formData.hasColorOptions && (
                  <Form.Group className="mb-3">
                    <Form.Label>Цвета (через запятую)</Form.Label>
                    <Form.Control
                      type="text"
                      name="colors"
                      value={formData.colors}
                      onChange={handleInputChange}
                      placeholder="Белый, Черный, Синий"
                    />
                  </Form.Group>
                )}
                
                {formData.hasSizeOptions && (
                  <Form.Group className="mb-3">
                    <Form.Label>Размеры (через запятую)</Form.Label>
                    <Form.Control
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleInputChange}
                      placeholder="S, M, L, XL"
                    />
                  </Form.Group>
                )}
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL изображения товара</Form.Label>
                  <Form.Control
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={handleInputChange}
                    placeholder="Введите URL изображения товара"
                  />
                  <Form.Text className="text-muted">
                    Введите URL изображения с Cloudinary или другого источника. Поддерживаются форматы: JPG, PNG, WebP
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Отмена</Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Сохранение...
                </>
              ) : 'Сохранить изменения'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Модальное окно удаления товара */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Удаление товара</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p className="mb-3">Вы действительно хотите удалить товар <strong>"{selectedProduct.title}"</strong>?</p>
              <p className="text-danger mb-0">Это действие невозможно отменить.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Отмена</Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Удаление...
              </>
            ) : 'Удалить'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsAdminPage; 