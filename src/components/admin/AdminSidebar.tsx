import React from 'react';
import Link from 'next/link';
import styles from '../../styles/Admin.module.css';

interface AdminSidebarProps {
  activeItem: string;
  hasNewRequests?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeItem, hasNewRequests = false }) => {
  // Обработчик выхода из админ-панели
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_authenticated');
      window.location.href = '/admin'; // Редирект на страницу входа
    }
  };
  
  const menuItems = [
    { id: 'dashboard', label: 'Панель', icon: 'bi-speedometer2', href: '/admin' },
    { id: 'products', label: 'Товары', icon: 'bi-bag', href: '/admin/products' },
    { id: 'textures', label: 'Текстуры', icon: 'bi-grid-3x3', href: '/admin/textures' },
    { id: 'custom-designs', label: 'Заявки', icon: 'bi-brush', href: '/admin/custom-designs' },
    { id: 'settings', label: 'Настройки', icon: 'bi-gear', href: '/admin/settings' },
  ];
  
  return (
    <aside className={styles.adminSidebar}>
      <div className={styles.sidebarHeader}>
        <Link href="/" className={styles.sidebarBrand}>
          <i className="bi bi-boxes me-2"></i>
          <span className={styles.brandText}>AlmaTexture</span>
        </Link>
      </div>
      
      <div className={styles.sidebarBody}>
        <nav>
          <ul className={styles.nav}>
            {menuItems.map(item => (
              <li key={item.id} className={styles.navItem}>
                <Link 
                  href={item.href} 
                  className={`${styles.navLink} ${activeItem === item.id ? styles.active : ''}`}
                >
                  <i className={`bi ${item.icon} ${styles.navIcon}`}></i>
                  <span className={styles.navText}>{item.label}</span>
                  {item.id === 'custom-designs' && hasNewRequests && (
                    <span className={styles.badge}>Новые</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className={styles.sidebarFooter}>
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          aria-label="Выйти"
        >
          <i className="bi bi-box-arrow-left me-2"></i>
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar; 