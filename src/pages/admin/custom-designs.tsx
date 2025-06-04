import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/AdminSidebar';
import styles from '../../styles/Admin.module.css';

interface CustomDesignRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  productType: string;
  size: string;
  color: string;
  description: string;
  designType: string;
  textureId?: string;
  referenceImageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

const ADMIN_EMAIL = 'admin@almatexture.kz';
const ADMIN_PASSWORD = 'almaty2023';
const STORAGE_KEY = 'almatexture_design_requests_status';

const CustomDesignsAdmin = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<CustomDesignRequest[]>([]);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CustomDesignRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // In a real app, you would use a proper authentication system
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_authenticated', 'true');
      }
      setIsAdmin(true);
      fetchRequests();
    } else {
      setLoginError('Неверный email или пароль');
    }
    
    setIsLoading(false);
  };
  
  // Check if admin is logged in on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      setIsAdmin(isAuthenticated);
      
      if (isAuthenticated) {
        fetchRequests();
      }
    }
  }, []);
  
  // Load saved statuses from localStorage
  const loadSavedStatuses = (originalRequests: CustomDesignRequest[]): CustomDesignRequest[] => {
    if (typeof window === 'undefined') return originalRequests;
    
    const savedStatusesString = localStorage.getItem(STORAGE_KEY);
    if (!savedStatusesString) return originalRequests;
    
    try {
      const savedStatuses = JSON.parse(savedStatusesString) as Record<string, string>;
      
      return originalRequests.map(request => {
        if (savedStatuses[request.id]) {
          return {
            ...request,
            status: savedStatuses[request.id] as 'pending' | 'processing' | 'completed' | 'cancelled'
          };
        }
        return request;
      });
    } catch (error) {
      console.error('Error parsing saved statuses:', error);
      return originalRequests;
    }
  };
  
  // Fetch custom design requests
  const fetchRequests = async () => {
    setIsLoadingRequests(true);
    
    try {
      // In a real app, this would be an API call to get data from the server
      const response = await fetch('/custom-designs.json');
      
      if (response.ok) {
        const data = await response.json();
        // Apply saved statuses from localStorage
        const requestsWithSavedStatus = loadSavedStatuses(data || []);
        setRequests(requestsWithSavedStatus);
        
        // Check for new pending requests
        const hasPending = requestsWithSavedStatus.some(req => req.status === 'pending');
        setHasNewRequests(hasPending);
      } else {
        console.error('Failed to fetch custom design requests');
      }
    } catch (error) {
      console.error('Error fetching custom design requests:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };
  
  // View request details
  const handleViewRequest = (request: CustomDesignRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };
  
  // Update request status
  const handleUpdateStatus = async (requestId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    // Update the status in memory
    const updatedRequests = requests.map(req => 
      req.id === requestId 
        ? { ...req, status: newStatus } 
        : req
    );
    
    setRequests(updatedRequests);
    
    // If we're updating the currently selected request, update that too
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest({
        ...selectedRequest,
        status: newStatus
      });
    }
    
    // Save status to localStorage
    if (typeof window !== 'undefined') {
      const savedStatusesString = localStorage.getItem(STORAGE_KEY);
      let savedStatuses: Record<string, string> = {};
      
      if (savedStatusesString) {
        try {
          savedStatuses = JSON.parse(savedStatusesString);
        } catch (error) {
          console.error('Error parsing saved statuses:', error);
        }
      }
      
      savedStatuses[requestId] = newStatus;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStatuses));
    }
    
    // Check if we still have pending requests
    const hasPending = updatedRequests.some(req => req.status === 'pending');
    setHasNewRequests(hasPending);
    
    // Mock API saving - in a real app you would have an API endpoint
    // to update the status and save to database
    alert(`Статус заявки ${requestId} изменен на ${getStatusLabel(newStatus)}`);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };
  
  // Get status label in Russian
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'processing': return 'В работе';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return 'Неизвестно';
    }
  };
  
  // Filter requests by status
  const filteredRequests = statusFilter === 'all' 
    ? requests 
    : requests.filter(req => req.status === statusFilter);
  
  // Get product type label in Russian
  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'tshirt': return 'Футболка';
      case 'hoodie': return 'Толстовка';
      case 'tote': return 'Шоппер';
      case 'cap': return 'Кепка';
      default: return type;
    }
  };
  
  // Format date
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
  
  // Admin login form
  if (!isAdmin) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5} xl={4}>
              <Card className="shadow border-0">
                <Card.Header className="bg-primary text-white py-3">
                  <h4 className="mb-0">Вход в панель администратора</h4>
                </Card.Header>
                <Card.Body className="p-4">
                  {loginError && (
                    <Alert variant="danger" dismissible onClose={() => setLoginError(null)}>
                      {loginError}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Введите email"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Введите пароль"
                      />
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      variant="primary"
                      className="w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Вход...
                        </>
                      ) : 'Войти'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
  
  return (
    <div className="d-flex">
      <AdminSidebar activeItem="custom-designs" hasNewRequests={hasNewRequests} />
      
      <div className={styles.content}>
        <Container fluid className="px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold">Заявки на кастомный дизайн</h2>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => fetchRequests()}
              disabled={isLoadingRequests}
              className="d-flex align-items-center"
            >
              {isLoadingRequests ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Загрузка...
                </>
              ) : <><i className="bi bi-arrow-clockwise me-2"></i> Обновить</>}
            </Button>
          </div>
          
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <span className="text-muted small">Всего заявок: {requests.length}</span>
                  {hasNewRequests && (
                    <Badge bg="warning" text="dark" className="ms-2">
                      Есть новые заявки
                    </Badge>
                  )}
                </div>
                <div>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="sm"
                    style={{ width: '200px' }}
                    className="shadow-none"
                  >
                    <option value="all">Все статусы</option>
                    <option value="pending">Ожидает</option>
                    <option value="processing">В работе</option>
                    <option value="completed">Завершена</option>
                    <option value="cancelled">Отменена</option>
                  </Form.Select>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {isLoadingRequests ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Загрузка заявок...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <Alert variant="info">
              Заявки не найдены. {statusFilter !== 'all' && 'Попробуйте изменить фильтр.'}
            </Alert>
          ) : (
            <Card className="border-0 shadow-sm">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-3" style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '120px' }}>Дата</th>
                      <th>Клиент</th>
                      <th>Изделие</th>
                      <th style={{ width: '100px' }}>Размер</th>
                      <th style={{ width: '120px' }}>Статус</th>
                      <th className="text-end pe-3" style={{ width: '120px' }}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map(request => (
                      <tr key={request.id}>
                        <td className="ps-3 text-muted small">#{request.id.substring(0, 8)}</td>
                        <td className="small">{formatDate(request.createdAt)}</td>
                        <td>
                          <div className="fw-medium">{request.name}</div>
                          <div className="text-muted small">{request.email}</div>
                        </td>
                        <td>{getProductTypeLabel(request.productType)}</td>
                        <td className="text-center">{request.size}</td>
                        <td>
                          <Badge bg={getStatusColor(request.status)} pill>
                            {getStatusLabel(request.status)}
                          </Badge>
                          {request.status === 'pending' && (
                            <span className="ms-1 text-warning">●</span>
                          )}
                        </td>
                        <td className="text-end pe-3">
                          <Button
                            variant="primary"
                            size="sm"
                            className="d-flex align-items-center justify-content-center py-2 px-3"
                            style={{ borderRadius: '8px', minWidth: '100px' }}
                            onClick={() => handleViewRequest(request)}
                          >
                            Подробнее
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}
          
          {/* Detail Modal */}
          <Modal 
            show={showDetailModal} 
            onHide={() => setShowDetailModal(false)}
            size="lg"
            centered
            dialogClassName="modal-90w"
          >
            {selectedRequest && (
              <>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Заявка #{selectedRequest.id.substring(0, 8)}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-3">Информация о клиенте</h5>
                      <Table>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Имя:</td>
                            <td>{selectedRequest.name}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Email:</td>
                            <td>{selectedRequest.email}</td>
                          </tr>
                          {selectedRequest.phone && (
                            <tr>
                              <td className="fw-bold">Телефон:</td>
                              <td>{selectedRequest.phone}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="fw-bold">Дата заявки:</td>
                            <td>{formatDate(selectedRequest.createdAt)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-3">Параметры изделия</h5>
                      <Table>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Тип изделия:</td>
                            <td>{getProductTypeLabel(selectedRequest.productType)}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Размер:</td>
                            <td>{selectedRequest.size}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Цвет:</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span 
                                  className="d-inline-block me-2"
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    backgroundColor: selectedRequest.color,
                                    border: selectedRequest.color === 'white' ? '1px solid #ddd' : 'none'
                                  }}
                                ></span>
                                {selectedRequest.color}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Тип дизайна:</td>
                            <td>
                              {selectedRequest.designType === 'texture' ? 'Текстура города' :
                               selectedRequest.designType === 'district' ? 'Конкретный район' :
                               selectedRequest.designType === 'custom' ? 'Собственный дизайн' :
                               selectedRequest.designType}
                            </td>
                          </tr>
                          {selectedRequest.textureId && (
                            <tr>
                              <td className="fw-bold">ID текстуры:</td>
                              <td>{selectedRequest.textureId}</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  
                  <h5 className="mb-3 mt-3">Описание дизайна</h5>
                  <div className="p-3 bg-light rounded mb-4">
                    {selectedRequest.description}
                  </div>
                  
                  {selectedRequest.referenceImageUrl && (
                    <div className="mb-4">
                      <h5 className="mb-3">Референс</h5>
                      <img 
                        src={selectedRequest.referenceImageUrl} 
                        alt="Референс"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          objectFit: 'contain',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  )}
                  
                  <h5 className="mb-3">Статус заявки</h5>
                  <div className="d-flex gap-2 mb-3">
                    <Button
                      variant={selectedRequest.status === 'pending' ? 'warning' : 'outline-warning'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'pending')}
                    >
                      Ожидает
                    </Button>
                    <Button
                      variant={selectedRequest.status === 'processing' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'processing')}
                    >
                      В работе
                    </Button>
                    <Button
                      variant={selectedRequest.status === 'completed' ? 'success' : 'outline-success'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'completed')}
                    >
                      Завершена
                    </Button>
                    <Button
                      variant={selectedRequest.status === 'cancelled' ? 'danger' : 'outline-danger'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'cancelled')}
                    >
                      Отменена
                    </Button>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                    Закрыть
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default CustomDesignsAdmin; 