import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/AdminSidebar';
import styles from '../../styles/Admin.module.css';

interface Setting {
  id: string;
  name: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
}

const SettingsAdminPage: NextPage = () => {
  const router = useRouter();
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
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Проверка аутентификации
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [router]);
  
  // Обработка изменений настроек
  const handleSettingChange = (id: string, value: string) => {
    setSettings(prevSettings => prevSettings.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    ));
    setHasChanges(true);
  };
  
  // Сохранение настроек
  const handleSaveSettings = () => {
    setIsSubmitting(true);
    
    // Имитация API-запроса
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Настройки успешно сохранены');
      setHasChanges(false);
      
      // Скрыть сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 800);
  };
  
  return (
    <div className="d-flex">
      <AdminSidebar activeItem="settings" />
      
      <div className={styles.content}>
        <Container fluid className="px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold">Настройки</h2>
            <Button
              variant="primary"
              onClick={handleSaveSettings}
              disabled={!hasChanges || isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
          
          {successMessage && (
            <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Row>
                <Col md={8} lg={6}>
                  <Form>
                    {settings.map(setting => (
                      <Form.Group className="mb-4" key={setting.id}>
                        <Form.Label className="fw-medium">{setting.description}</Form.Label>
                        {setting.type === 'boolean' ? (
                          <Form.Check
                            type="switch"
                            checked={setting.value === 'true'}
                            onChange={(e) => handleSettingChange(setting.id, String(e.target.checked))}
                            label={setting.value === 'true' ? 'Включено' : 'Выключено'}
                          />
                        ) : setting.type === 'number' ? (
                          <Form.Control
                            type="number"
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                            min={0}
                          />
                        ) : (
                          <Form.Control
                            type="text"
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          />
                        )}
                        <Form.Text className="text-muted">
                          Ключ настройки: <code>{setting.name}</code>
                        </Form.Text>
                      </Form.Group>
                    ))}
                  </Form>
                </Col>
                
                <Col md={4} lg={6} className="d-none d-md-block">
                  <div className="h-100 d-flex flex-column justify-content-center align-items-center ps-4 border-start">
                    <div className="rounded-circle bg-light p-4 mb-3">
                      <i className="bi bi-gear text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="text-center mb-2">Системные настройки</h5>
                    <p className="text-muted text-center mb-0">
                      Изменения будут применены ко всему сайту после сохранения
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default SettingsAdminPage; 