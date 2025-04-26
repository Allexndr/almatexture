import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';
import { NextPage } from 'next';

// Типы данных для администрирования
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image?: string; // Для отображения в админке
  type: string;
  textureId: number | null;
  stockQuantity?: number | null;
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
    if (tab === 'products') apiUrl = '/api/admin/products';
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
      
      if (tab === 'products') setProducts(Array.isArray(data) ? data : []);
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
    alert(`TODO: Implement Add ${type}`);
  };
  
  const handleEdit = (type: string, id: number | string) => {
    alert(`TODO: Implement Edit ${type} with ID: ${id}`);
  };
  
  const handleDelete = async (type: string, id: number | string) => {
    // Add confirmation prompt
    if (!window.confirm(`Вы уверены, что хотите удалить ${type} с ID: ${id}?`)) {
      return; // Stop if user cancels
    }

    let apiUrl = '';
    if (type === 'Product') {
      apiUrl = `/api/products?id=${id}`;
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

  const renderContent = () => {
    if (isDataLoading) {
      return <div className={styles.loadingSpinner}>Загрузка данных...</div>;
    }
    if (fetchError) {
      return <div className={styles.error}>{fetchError}</div>;
    }

    switch(activeTab) {
      case 'dashboard':
        return <p>Добро пожаловать в панель управления!</p>;
      case 'products':
        return (
          <div>
            <div className={styles.actionsBar}>
              <button className={styles.addButton} onClick={() => handleAdd('Product')}>Добавить товар</button>
            </div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Тип</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.price} ₸</td>
                    <td>{p.type}</td>
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
      case 'districts':
        return <p>Управление районами (TODO)</p>;
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
      <>
        <Head>
          <title>Админ-панель | AlmaTexture</title>
          <meta name="description" content="Административная панель сайта Текстуры Алматы" />
        </Head>
        
        <div className={styles.main}>
          <aside className={styles.sidebar}>
            <div className={styles.logo}>AlmaTexture Admin</div>
            <nav className={styles.nav}>
              <ul>
                <li><button className={activeTab === 'dashboard' ? styles.active : ''} onClick={() => setActiveTab('dashboard')}>Панель</button></li>
                <li><button className={activeTab === 'products' ? styles.active : ''} onClick={() => setActiveTab('products')}>Товары</button></li>
                <li><button className={activeTab === 'textures' ? styles.active : ''} onClick={() => setActiveTab('textures')}>Текстуры</button></li>
                <li><button className={activeTab === 'districts' ? styles.active : ''} onClick={() => setActiveTab('districts')}>Районы</button></li>
                <li><button className={activeTab === 'users' ? styles.active : ''} onClick={() => setActiveTab('users')}>Пользователи</button></li>
                <li><button className={activeTab === 'settings' ? styles.active : ''} onClick={() => setActiveTab('settings')}>Настройки</button></li>
              </ul>
            </nav>
            {/* Simple Logout Button Example */}
             <div className={styles.userInfo}>
               <button onClick={handleLogout} className={styles.logoutButton}>Выйти</button>
             </div>
          </aside>
          
          <main className={styles.content}>
            <div className={styles.contentHeader}>
              {/* Title could be dynamic based on tab */} 
               <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            </div>
            {renderContent()} 
          </main>
        </div>
      </>
    );
  }

  // Render null or a loading indicator during SSR or initial client load before hydration check
  return null; 
};

export default AdminPage; 