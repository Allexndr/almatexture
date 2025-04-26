import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Admin.module.css';

interface Product {
  id: string;
  title: string;
  price: number;
  inventory: number;
  imageUrl: string;
  description: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

interface Settings {
  siteName: string;
  currency: string;
  contactEmail: string;
  shippingCost: number;
  freeShippingThreshold: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    
    // Get admin email from localStorage
    const email = localStorage.getItem('admin_email');
    if (email) {
      setAdminEmail(email);
    }
    
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }
    
    // Load data
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Try to use API endpoints first
        let productsData, ordersData, settingsData;
        
        try {
          // Load products from API
          const productsResponse = await fetch('/api/admin/products');
          if (!productsResponse.ok) throw new Error('Failed to load products from API');
          productsData = await productsResponse.json();
        } catch (apiError) {
          console.warn('Failed to load products from API, falling back to static files:', apiError);
          // Fall back to static files
          const fallbackResponse = await fetch('/admin-data/products.json');
          if (!fallbackResponse.ok) throw new Error('Failed to load products');
          productsData = await fallbackResponse.json();
        }
        
        try {
          // Load orders from API
          const ordersResponse = await fetch('/api/admin/orders');
          if (!ordersResponse.ok) throw new Error('Failed to load orders from API');
          ordersData = await ordersResponse.json();
        } catch (apiError) {
          console.warn('Failed to load orders from API, falling back to static files:', apiError);
          // Fall back to static files
          const fallbackResponse = await fetch('/admin-data/orders.json');
          if (!fallbackResponse.ok) throw new Error('Failed to load orders');
          ordersData = await fallbackResponse.json();
        }
        
        try {
          // Load settings from API
          const settingsResponse = await fetch('/api/admin/settings');
          if (!settingsResponse.ok) throw new Error('Failed to load settings from API');
          settingsData = await settingsResponse.json();
        } catch (apiError) {
          console.warn('Failed to load settings from API, falling back to static files:', apiError);
          // Fall back to static files
          const fallbackResponse = await fetch('/admin-data/settings.json');
          if (!fallbackResponse.ok) throw new Error('Failed to load settings');
          settingsData = await fallbackResponse.json();
        }
        
        setProducts(productsData);
        setOrders(ordersData);
        setSettings(settingsData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading admin data:', err);
        setError('Ошибка загрузки данных. Убедитесь, что вы запустили npm run setup-env');
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [router]);
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_last_login');
      router.push('/admin');
    }
  };
  
  // Display based on loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.dashboardContent}>
          <div className={styles.loadingSpinner}></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }
  
  // Display error if any
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.dashboardContent}>
          <div className={styles.error}>{error}</div>
          <button 
            className={styles.button} 
            onClick={() => router.push('/admin')}
          >
            Вернуться к входу
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Админ-панель | Текстуры Алматы</title>
        <meta name="description" content="Администрирование сайта Текстуры Алматы" />
      </Head>
      
      <div className={styles.dashboardContainer}>
        <div className={styles.sidebar}>
          <div className={styles.logo}>
            <Link href="/">
              Текстуры Алматы
            </Link>
          </div>
          
          <nav className={styles.nav}>
            <ul>
              <li>
                <button
                  className={activeTab === 'products' ? styles.active : ''}
                  onClick={() => setActiveTab('products')}
                >
                  Товары
                </button>
              </li>
              <li>
                <button
                  className={activeTab === 'orders' ? styles.active : ''}
                  onClick={() => setActiveTab('orders')}
                >
                  Заказы
                </button>
              </li>
              <li>
                <button
                  className={activeTab === 'settings' ? styles.active : ''}
                  onClick={() => setActiveTab('settings')}
                >
                  Настройки
                </button>
              </li>
            </ul>
          </nav>
          
          <div className={styles.userInfo}>
            {isClient && (
              <>
                <p>{adminEmail}</p>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h1>
              {activeTab === 'products' && 'Управление товарами'}
              {activeTab === 'orders' && 'Управление заказами'}
              {activeTab === 'settings' && 'Настройки сайта'}
            </h1>
          </div>
          
          {activeTab === 'products' && (
            <div className={styles.productsList}>
              <div className={styles.actionsBar}>
                <button className={styles.addButton}>
                  + Добавить товар
                </button>
              </div>
              
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Остаток</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id.substring(0, 8)}</td>
                      <td>{product.title}</td>
                      <td>{product.price} ₸</td>
                      <td>{product.inventory}</td>
                      <td>
                        <button className={styles.actionButton}>
                          Редактировать
                        </button>
                        <button className={styles.actionButton + ' ' + styles.deleteButton}>
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className={styles.ordersList}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Клиент</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id.substring(0, 8)}</td>
                      <td>{order.customerName}</td>
                      <td>{order.total} ₸</td>
                      <td>{getStatusText(order.status)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className={styles.actionButton}>
                          Подробнее
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'settings' && settings && (
            <div className={styles.settingsForm}>
              <form>
                <div className={styles.formGroup}>
                  <label htmlFor="siteName">Название сайта</label>
                  <input
                    type="text"
                    id="siteName"
                    className={styles.input}
                    value={settings.siteName}
                    readOnly
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="contactEmail">Email для связи</label>
                  <input
                    type="email"
                    id="contactEmail"
                    className={styles.input}
                    value={settings.contactEmail}
                    readOnly
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="currency">Валюта</label>
                  <input
                    type="text"
                    id="currency"
                    className={styles.input}
                    value={settings.currency}
                    readOnly
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="shippingCost">Стоимость доставки</label>
                  <input
                    type="number"
                    id="shippingCost"
                    className={styles.input}
                    value={settings.shippingCost}
                    readOnly
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="freeShippingThreshold">Бесплатная доставка от</label>
                  <input
                    type="number"
                    id="freeShippingThreshold"
                    className={styles.input}
                    value={settings.freeShippingThreshold}
                    readOnly
                  />
                </div>
                
                <button type="button" className={styles.button} disabled>
                  Сохранить
                </button>
                <p className={styles.note}>Редактирование настроек пока недоступно</p>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Helper function to get readable status text
function getStatusText(status: string): string {
  switch (status) {
    case 'pending': return 'Ожидает';
    case 'processing': return 'В обработке';
    case 'completed': return 'Выполнен';
    case 'cancelled': return 'Отменен';
    default: return status;
  }
}

export default AdminDashboard; 