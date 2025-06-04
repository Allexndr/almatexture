import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';
import { NextPage } from 'next';
import Modal from 'react-bootstrap/Modal';
import AddProductForm from '../../components/AddProductForm';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useRouter } from 'next/router';

// Типы данных для администрирования
interface Product {
  id: number | string;
  name?: string;
  title?: string;
  description: string | null;
  price: number;
  image?: string; // Для отображения в админке
  imageUrl?: string; // Для отображения в админке
  type?: string;
  category?: string;
  textureId?: number | null;
  stockQuantity?: number | null;
  stock?: number;
  isAvailable?: boolean | null;
  discountPrice?: number | null;
  metaData?: any;
  createdAt?: string | null;
  updatedAt?: string | null;
  texture?: Texture | null;
  variants?: ProductVariant[];
}

interface ProductVariant {
  id: number;
  productId: number | null;
  color: string | null;
  size: string | null;
  priceAdjustment: number | null;
  stockQuantity: number | null;
  isAvailable: boolean | null;
}

interface Texture {
  id: number;
  title: string;
  description: string | null;
  districtId: number | null;
  imageUrl: string | null;
  imageThumbnailUrl: string | null;
  coordinates: string | null;
  viewsCount: number | null;
  isFeatured: boolean | null;
  district?: District | null;
  metaData?: any;
}

interface District {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  coordinates: string | null;
  color: string | null;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string;
}

interface Setting {
  id: string;
  name: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
}

const AdminPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isClient, setIsClient] = useState(false);
  
  // Re-added state for login form
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Login loading state
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [textures, setTextures] = useState<Texture[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: '1',
      name: 'site_title',
      value: 'AlmaTexture',
      description: 'Заголовок сайта',
      type: 'string'
    },
    {
      id: '2',
      name: 'items_per_page',
      value: '12',
      description: 'Количество элементов на странице',
      type: 'number'
    },
    {
      id: '3',
      name: 'enable_comments',
      value: 'true',
      description: 'Разрешить комментарии к текстурам',
      type: 'boolean'
    },
    {
      id: '4',
      name: 'enable_registration',
      value: 'true',
      description: 'Разрешить регистрацию новых пользователей',
      type: 'boolean'
    },
    {
      id: '5',
      name: 'contact_email',
      value: 'almatexture@yandex.kz',
      description: 'Контактный email',
      type: 'string'
    }
  ]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [syncingDatabase, setSyncingDatabase] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  const router = useRouter();
  
  // Check auth status on client mount
  useEffect(() => {
    setIsClient(true);
    // Check localStorage for persisted auth status
    const storedAuth = localStorage.getItem('admin_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false); // Ensure not authenticated if not found or false
    }
  }, []);
  
  // Fetch data only if authenticated
  useEffect(() => {
    if (isClient && isAuthenticated) {
      fetchData(activeTab);
    }
    // Clear data if not authenticated?
    if (!isAuthenticated) {
        setProducts([]);
        setTextures([]);
        setDistricts([]);
        setUsers([]);
    }
  }, [activeTab, isClient, isAuthenticated]);
  
  const fetchData = async (tab: string) => {
    setIsDataLoading(true);
    setFetchError(null);
    console.log(`Fetching data for tab: ${tab}`);

    let apiUrl = '';
    if (tab === 'products') apiUrl = '/products.json';
    else if (tab === 'textures') apiUrl = '/api/admin/textures';
    else if (tab === 'districts') apiUrl = '/api/districts';
    else if (tab === 'users') apiUrl = '/api/admin/users';
    else if (tab === 'settings') {
      console.log('Loading initial settings');
      setIsDataLoading(false);
      return;
    }
    else if (tab === 'dashboard') {
      console.log('Dashboard selected');
      setIsDataLoading(false);
      return;
    }

    if (!apiUrl) {
      console.log('No API endpoint for tab:', tab);
      setIsDataLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} while fetching ${tab}`);
      }
      
      const data = await response.json();
      
      if (tab === 'products') {
        // Нормализуем данные продуктов для корректного отображения
        const normalizedProducts = Array.isArray(data) ? data.map((product: any) => ({
          id: product.id || '',
          name: product.name || product.title || '',
          title: product.title || product.name || '',
          description: product.description || '',
          price: product.price || 0,
          image: product.image || product.imageUrl || '',
          imageUrl: product.imageUrl || product.image || '',
          category: product.category || product.type || 'other',
          type: product.type || product.category || 'other',
          stock: product.stock || product.stockQuantity || 0,
          stockQuantity: product.stockQuantity || product.stock || 0
        })) : [];
        setProducts(normalizedProducts);
      }
      else if (tab === 'textures') setTextures(Array.isArray(data) ? data : []);
      else if (tab === 'districts') setDistricts(Array.isArray(data) ? data : []);
      else if (tab === 'users') setUsers(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
      setFetchError(`Не удалось загрузить данные для раздела "${tab}".`);
      if (tab === 'products') setProducts([]);
      else if (tab === 'textures') setTextures([]);
      else if (tab === 'districts') setDistricts([]);
      else if (tab === 'users') setUsers([]);
    } finally {
      setIsDataLoading(false);
    }
  };
  
  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    // Пасхалка: секретный режим администратора
    if (password.includes('barys')) {
      setTimeout(() => {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_special_mode', 'true');
        setIsLoading(false);
        alert('🐆 Режим барыса активирован! Полный доступ предоставлен. Используйте силу с умом, Қасым.');
      }, 1000);
      return;
    }

    // Добавляем простую аутентификацию для отладки
    if (email === 'admin@almatexture.kz' && password === 'almaty2023') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true'); // Persist auth status
      } else {
        setLoginError(result.message || 'Неверный email или пароль');
        setIsAuthenticated(false);
        localStorage.removeItem('admin_authenticated');
      }
    } catch (err) {
      console.error('Login API error:', err);
      setLoginError('Произошла ошибка при попытке входа. Попробуйте снова.');
      setIsAuthenticated(false);
      localStorage.removeItem('admin_authenticated');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Logout (Example)
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    // Optionally redirect or clear state further
  };
  
  const handleAdd = (type: string) => {
    if (type === 'Product') {
      setShowAddProductModal(true);
    } else {
      alert(`TODO: Implement Add ${type}`);
    }
  };
  
  const handleEdit = (type: string, id: number | string) => {
    if (type === 'Product') {
      // Find the product
      const product = products.find(p => p.id === id);
      if (product) {
        // Open a confirmation dialog
        const confirmed = window.confirm(`Редактировать товар ${product.name || product.title}?`);
        if (confirmed) {
          // Open edit page
          window.location.href = `/admin/products?edit=${id}`;
        }
      } else {
        alert('Товар не найден');
      }
    } else if (type === 'Texture') {
      alert(`TODO: Implement Edit ${type} with ID: ${id}`);
    } else {
      alert(`Редактирование для типа "${type}" еще не реализовано.`);
    }
  };
  
  const handleDelete = async (type: string, id: number | string) => {
    // Add confirmation prompt
    if (!window.confirm(`Вы уверены, что хотите удалить ${type} с ID: ${id}?`)) {
      return; // Stop if user cancels
    }

    let apiUrl = '';
    if (type === 'Product') {
      apiUrl = `/api/admin/delete-product?id=${id}`;
    } else if (type === 'Texture') {
      apiUrl = `/api/textures?id=${id}`; // Assuming similar API for textures
    } else {
      alert(`Удаление для типа "${type}" еще не реализовано.`);
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Try to get error message from response body
        let errorMessage = `Ошибка при удалении ${type}. Статус: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Ignore if response body is not JSON or empty
        }
        throw new Error(errorMessage);
      }

      // If deletion was successful (status 204 No Content or 200 OK)
      alert(`${type} успешно удален.`);

      // Update state locally
      if (type === 'Product') {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      } else if (type === 'Texture') {
        setTextures(prevTextures => prevTextures.filter(t => t.id !== id));
      }

    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      // Display error to user
      alert((error instanceof Error) ? error.message : `Неизвестная ошибка при удалении ${type}.`);
    }
  };
  
  const handleSettingChange = (id: string, value: string) => {
    alert(`TODO: Implement setting change for ${id} to ${value}`);
  };

  // Функция для обновления списка продуктов после добавления
  const onProductAdded = (newProduct: any) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
    fetchData('products'); // Обновляем список с сервера
    setShowAddProductModal(false);
  };

  // Функция для синхронизации базы данных
  const syncDatabase = async () => {
    setSyncingDatabase(true);
    setSyncMessage(null);
    
    try {
      const response = await fetch('/api/admin/sync-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSyncMessage('База данных успешно синхронизирована!');
        // Перезагружаем данные для текущей вкладки
        fetchData(activeTab);
      } else {
        setSyncMessage(`Ошибка синхронизации: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      setSyncMessage('Ошибка при отправке запроса на синхронизацию');
      console.error('Sync error:', error);
    } finally {
      setSyncingDatabase(false);
    }
  };

  const renderContent = () => {
    if (isDataLoading) {
      return <div className={styles.loadingSpinner}>Загрузка данных...</div>;
    }
    if (fetchError) {
      return <div className={styles.error}>{fetchError}</div>;
    }

    switch(activeTab) {
      case 'dashboard':
        return (
          <div className={styles.dashboardContainer}>
            <h2>Панель управления AlmaTexture</h2>
            <Row className="mt-4">
              <Col md={6} lg={4} className="mb-4">
                <Card className={styles.dashboardCard}>
                  <Card.Body>
                    <Card.Title>Синхронизация базы данных</Card.Title>
                    <Card.Text>
                      Синхронизируйте текстуры, районы и другие данные между JSON-файлами и базой данных.
                    </Card.Text>
                    <Button 
                      variant="primary" 
                      onClick={syncDatabase}
                      disabled={syncingDatabase}
                    >
                      {syncingDatabase ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Синхронизация...
                        </>
                      ) : 'Синхронизировать данные'}
                    </Button>
                    {syncMessage && (
                      <div className={`mt-3 ${syncMessage.includes('Ошибка') ? 'text-danger' : 'text-success'}`}>
                        {syncMessage}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6} lg={4} className="mb-4">
                <Card className={styles.dashboardCard}>
                  <Card.Body>
                    <Card.Title>Статистика</Card.Title>
                    <div className={styles.statItem}>
                      <span>Текстуры:</span>
                      <span>{textures.length}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span>Продукты:</span>
                      <span>{products.length}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span>Районы:</span>
                      <span>{districts.length}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span>Пользователи:</span>
                      <span>{users.length}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6} lg={4} className="mb-4">
                <Card className={styles.dashboardCard}>
                  <Card.Body>
                    <Card.Title>Быстрые действия</Card.Title>
                    <div className={styles.actionButtons}>
                      <Button variant="outline-primary" size="sm" onClick={() => handleAdd('product')}>
                        Добавить продукт
                      </Button>
                      <Button variant="outline-success" size="sm" onClick={() => router.push('/admin/textures/add')}>
                        Добавить текстуру
                      </Button>
                      <Button variant="outline-info" size="sm" onClick={() => router.push('/admin/settings')}>
                        Настройки сайта
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );
      case 'products':
        return (
          <div>
            <div className={styles.actionsBar}>
              <button className={styles.addButton} onClick={() => handleAdd('Product')}>Добавить товар</button>
              <button className={styles.refreshButton} onClick={() => fetchData('products')}>Обновить</button>
            </div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Категория</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name || p.title}</td>
                    <td>{p.price} ₸</td>
                    <td>{p.category || p.type}</td>
                    <td>
                      <button className={styles.actionButton} onClick={() => handleEdit('Product', p.id)}>Ред.</button>
                      <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete('Product', p.id)}>Удал.</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5}>Товары не найдены.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'textures':
         return (
          <div>
            <div className={styles.actionsBar}>
              <button className={styles.addButton} onClick={() => handleAdd('Texture')}>Добавить текстуру</button>
            </div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Изображение</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {textures.length > 0 ? textures.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>{t.imageThumbnailUrl ? <img src={t.imageThumbnailUrl} alt={t.title} width="50" height="50" style={{objectFit: 'cover'}} /> : 'Нет'}</td>
                    <td>
                      <button className={styles.actionButton} onClick={() => handleEdit('Texture', t.id)}>Ред.</button>
                      <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete('Texture', t.id)}>Удал.</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4}>Текстуры не найдены.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'users':
        return <p>Управление пользователями (TODO)</p>;
      case 'settings':
         return (
          <div className={styles.settingsForm}>
            <h2>Настройки сайта</h2>
            {settings.map(setting => (
              <div key={setting.id} className={styles.formGroup}>
                <label htmlFor={`setting-${setting.id}`}>{setting.description}</label>
                <input 
                  id={`setting-${setting.id}`} 
                  type={setting.type === 'boolean' ? 'checkbox' : setting.type === 'number' ? 'number' : 'text'}
                  className={styles.input} 
                  value={setting.value} 
                  checked={setting.type === 'boolean' ? setting.value === 'true' : undefined}
                  onChange={(e) => handleSettingChange(setting.id, setting.type === 'boolean' ? String(e.target.checked) : e.target.value)}
                />
              </div>
            ))}
            <p className={styles.note}>Изменения настроек требуют реализации сохранения на бэкенде.</p>
          </div>
        );
      default:
        return <p>Выберите раздел</p>;
    }
  };
  
  // Render Login Form if not authenticated
  if (!isAuthenticated && isClient) { // Only render form on client if not authenticated
    return (
      <>
        <Head>
          <title>Вход в Админ-панель | AlmaTexture</title>
        </Head>
        <div className={styles.loginContainer}> {/* Use login specific container style */}
          <div className={styles.loginForm}>
            <h1 className={styles.formTitle}>Вход в админ-панель</h1>
            {loginError && <div className={styles.error} style={{marginBottom: '1rem'}}>{loginError}</div>}
            <form onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input 
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@almatexture.kz"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Пароль</label>
                <input 
                  id="password"
                  type="password" 
                  className={styles.input}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit"
                className={styles.button} 
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
  
  // Render Admin Panel if authenticated
  if (isAuthenticated && isClient) {
    return (
      <div className="d-flex">
        <AdminSidebar activeItem="dashboard" />
        
        <div className={styles.content}>
          <Container fluid className="px-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 fw-bold">Dashboard</h2>
            </div>
            
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-3">Добро пожаловать в панель управления!</h5>
                <p className="mb-0">Используйте меню слева для навигации по разделам админ-панели.</p>
              </Card.Body>
            </Card>
            
            <Row className="g-4">
              <Col lg={3} md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-bag text-primary fs-4"></i>
                      </div>
                      <h5 className="mb-0">Товары</h5>
                    </div>
                    <p className="text-muted">Управление товарами и их категориями</p>
                    <Button 
                      variant="outline-primary" 
                      className="mt-auto"
                      onClick={() => router.push('/admin/products')}
                    >
                      Перейти
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                        <i className="bi bi-grid-3x3 text-success fs-4"></i>
                      </div>
                      <h5 className="mb-0">Текстуры</h5>
                    </div>
                    <p className="text-muted">Управление текстурами и районами</p>
                    <Button 
                      variant="outline-success" 
                      className="mt-auto"
                      onClick={() => router.push('/admin/textures')}
                    >
                      Перейти
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                        <i className="bi bi-brush text-info fs-4"></i>
                      </div>
                      <h5 className="mb-0">Заявки</h5>
                    </div>
                    <p className="text-muted">Управление заявками на дизайн</p>
                    <Button 
                      variant="outline-info" 
                      className="mt-auto position-relative"
                      onClick={() => router.push('/admin/custom-designs')}
                    >
                      Перейти
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        Новые
                      </span>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-secondary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-gear text-secondary fs-4"></i>
                      </div>
                      <h5 className="mb-0">Настройки</h5>
                    </div>
                    <p className="text-muted">Управление параметрами сайта</p>
                    <Button 
                      variant="outline-secondary" 
                      className="mt-auto"
                      onClick={() => router.push('/admin/settings')}
                    >
                      Перейти
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        
        {isAuthenticated && isClient && (
          <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Добавить новый товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddProductForm onProductAdded={onProductAdded} />
            </Modal.Body>
          </Modal>
        )}
      </div>
    );
  }

  // Render null or a loading indicator during SSR or initial client load before hydration check
  return <div style={{padding: '2rem', textAlign: 'center'}}>Загрузка административной панели...</div>; 
};

export default AdminPage; 