import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess } from '../../store/userSlice';

// Схема валидации
const schema = yup.object({
  email: yup.string()
    .required('Email обязателен')
    .email('Введите корректный email'),
  password: yup.string()
    .required('Пароль обязателен')
}).required();

type FormData = yup.InferType<typeof schema>;

interface LoginModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onHide, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      // Здесь в реальном приложении был бы API-запрос для аутентификации
      console.log('Login data:', data);
      
      // Имитация задержки сервера
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Имитация успешного входа для демонстрации
      if (data.email === 'admin@example.com' && data.password === 'Admin123!') {
        dispatch(loginSuccess({
          id: '1',
          email: data.email,
          firstName: 'Администратор',
          lastName: 'Системы'
        }));
        
        reset();
        onHide();
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setLoginError('Неверный email или пароль');
      }
    } catch (error) {
      setLoginError('Произошла ошибка при входе. Пожалуйста, попробуйте снова.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      aria-labelledby="login-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="login-modal-title">Вход в систему</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {loginError && (
          <Alert variant="danger" className="mb-3">
            {loginError}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              autoComplete="username"
              isInvalid={!!errors.email}
              {...register('email')}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              autoComplete="current-password"
              isInvalid={!!errors.password}
              {...register('password')}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="d-flex justify-content-between align-items-center">
            <Button variant="link" onClick={onHide} className="text-decoration-none p-0" size="sm">
              Забыли пароль?
            </Button>
            
            <div>
              <Button variant="secondary" onClick={onHide} className="me-2">
                Отмена
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Вход...' : 'Войти'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="justify-content-center">
        <div className="text-center">
          <p className="mb-0">Нет аккаунта?</p>
          <Button variant="link" onClick={onHide} className="text-decoration-none p-0">
            Зарегистрироваться
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal; 