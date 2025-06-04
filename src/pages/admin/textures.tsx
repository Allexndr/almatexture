import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/AdminSidebar';
import styles from '../../styles/Admin.module.css';

// Интерфейс для текстуры
interface Texture {
  id: number;
  title: string;
  description: string;
  district: string;
  imageUrl: string;
  tags: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

// Интерфейс для формы
interface FormData {
  title: string;
  description: string;
  district: string;
  tags: string;
  imageUrl: string;
}

const TexturesAdminPage: NextPage = () => {
  const router = useRouter();
  const [textures, setTextures] = useState<Texture[]>([]);
  const [filteredTextures, setFilteredTextures] = useState<Texture[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTexture, setEditingTexture] = useState<Texture | null>(null);
  const [deletingTexture, setDeletingTexture] = useState<Texture | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    district: districts[1], // Медеуский по умолчанию
    tags: '',
    imageUrl: ''
  });
  
  // Список районов Алматы
  const districts = [
    'Медеуский',
    'Алмалинский',
    'Бостандыкский',
    'Ауэзовский',
    'Алатауский',
    'Жетысуский',
    'Турксибский',
    'Наурызбайский'
  ];
  
  // Проверка аутентификации
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin');
    } else {
      fetchTextures();
    }
  }, [router]);
  
  // Загрузка текстур
  const fetchTextures = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/textures');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setTextures(Array.isArray(data) ? data : []);
      setFilteredTextures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching textures:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Фильтрация текстур при изменении параметров
  useEffect(() => {
    let filtered = textures;
    
    // Фильтрация по району
    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(texture => texture.district === selectedDistrict);
    }
    
    // Фильтрация по поисковому запросу
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(texture => 
        texture.title.toLowerCase().includes(query) ||
        texture.description.toLowerCase().includes(query) ||
        texture.district.toLowerCase().includes(query) ||
        (texture.tags && texture.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredTextures(filtered);
  }, [textures, selectedDistrict, searchTerm]);
  
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
  const handleAddTexture = () => {
    setFormData({
      title: '',
      description: '',
      district: districts[1],
      tags: '',
      imageUrl: ''
    });
    setShowAddModal(true);
  };
  
  // Подготовка формы для редактирования
  const handleEditTexture = (texture: Texture) => {
    setEditingTexture(texture);
    setFormData({
      title: texture.title,
      description: texture.description,
      district: texture.district,
      tags: texture.tags.join(', '),
      imageUrl: texture.imageUrl
    });
    setShowEditModal(true);
  };
  
  // Подготовка для удаления
  const handleDeleteTexture = (texture: Texture) => {
    setDeletingTexture(texture);
    setShowDeleteModal(true);
  };
  
  // Отправка формы добавления
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/textures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Произошла ошибка при добавлении текстуры');
      }
      
      const result = await response.json();
      
      // Добавляем новую текстуру в список
      setTextures(prev => [...prev, result.texture]);
      
      setShowAddModal(false);
      alert('Текстура успешно добавлена');
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Отправка формы редактирования
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!editingTexture) return;
      
      const response = await fetch('/api/admin/textures', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Произошла ошибка при обновлении текстуры');
      }
      
      const result = await response.json();
      
      // Обновляем текстуру в списке
      setTextures(prev => prev.map(texture => 
        texture.id === editingTexture.id ? result.texture : texture
      ));
      
      setShowEditModal(false);
      alert('Текстура успешно обновлена');
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Удаление текстуры
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    
    try {
      if (!deletingTexture) return;
      
      const response = await fetch(`/api/admin/textures?id=${deletingTexture.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Произошла ошибка при удалении текстуры');
      }
      
      // Удаляем текстуру из списка
      setTextures(prev => prev.filter(texture => texture.id !== deletingTexture.id));
      
      setShowDeleteModal(false);
      alert('Текстура успешно удалена');
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="d-flex">
      <AdminSidebar activeItem="textures" />
      
      <div className={styles.content}>
        <Container fluid className="px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold">Управление текстурами</h2>
            <Button 
              variant="primary" 
              onClick={handleAddTexture}
              className="d-flex align-items-center"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Добавить текстуру
            </Button>
          </div>
          
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Фильтровать по району</Form.Label>
                    <Form.Select 
                      value={selectedDistrict} 
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                      <option value="all">Все районы</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Район в котором была найдена текстура. Это важно для правильной фильтрации в магазине.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted">Поиск</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Поиск по названию, описанию или тегам..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="shadow-none"
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="text-end">
                  <Button 
                    variant="outline-secondary" 
                    className="w-100"
                    onClick={() => {
                      setSelectedDistrict('all');
                      setSearchTerm('');
                      fetchTextures();
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
              <p className="mt-3 text-muted">Загрузка текстур...</p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0 text-muted">Всего текстур: {textures.length}</p>
                {selectedDistrict !== 'all' && (
                  <Badge bg="info" className="fs-6">
                    Район: {selectedDistrict}
                  </Badge>
                )}
              </div>
              
              <Row className="g-4">
                {filteredTextures.length === 0 ? (
                  <Col xs={12}>
                    <Alert variant="info">
                      Текстуры не найдены. {searchTerm && 'Попробуйте изменить параметры поиска.'}
                    </Alert>
                  </Col>
                ) : (
                  filteredTextures.map(texture => (
                    <Col key={texture.id} lg={4} md={6}>
                      <Card className={styles.textureCard}>
                        <div style={{ position: 'relative' }}>
                          <Card.Img 
                            variant="top" 
                            src={texture.imageUrl} 
                            className={styles.textureImage}
                            alt={texture.title}
                          />
                        </div>
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between mb-2">
                            <h5 className="card-title mb-0">{texture.title}</h5>
                          </div>
                          <Card.Text className={styles.textureDescription}>{texture.description}</Card.Text>
                          
                          <div className="mt-2">
                            <Badge bg="info" className="me-2">
                              Район: {texture.district}
                            </Badge>
                            {texture.tags.map(tag => (
                              <Badge key={tag} bg="primary" className="me-1">{tag}</Badge>
                            ))}
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                            <small className="text-muted">
                              {formatDate(texture.createdAt)}
                            </small>
                            <div>
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="me-2 d-flex align-items-center justify-content-center"
                                style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                                onClick={() => handleEditTexture(texture)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                                onClick={() => handleDeleteTexture(texture)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            </>
          )}
        </Container>
      </div>
      
      {/* Модальное окно добавления текстуры */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавление новой текстуры</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Название текстуры <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Район *</Form.Label>
                  <Form.Select 
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  >
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Выберите район города, где была найдена текстура. Это поле используется для системы фильтрации в магазине.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Описание <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Теги (через запятую)</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="архитектура, брусчатка, улица"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Изображение текстуры <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите URL изображения текстуры"
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
              ) : 'Добавить текстуру'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Модальное окно редактирования текстуры */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Редактирование текстуры</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Название текстуры <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Район *</Form.Label>
                  <Form.Select 
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  >
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Выберите район города, где была найдена текстура. Это поле используется для системы фильтрации в магазине.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Описание <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Теги (через запятую)</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="архитектура, брусчатка, улица"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Изображение текстуры <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите URL изображения текстуры"
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
      
      {/* Модальное окно удаления текстуры */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Удаление текстуры</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingTexture && (
            <div>
              <p className="mb-3">Вы действительно хотите удалить текстуру <strong>"{deletingTexture.title}"</strong>?</p>
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

export default TexturesAdminPage; 