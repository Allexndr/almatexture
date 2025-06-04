import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/userSlice';

// Схема валидации
const schema = yup.object({
  firstName: yup.string()
    .required('Имя обязательно')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .matches(/^[A-Za-zА-Яа-яЁё\s]+$/, 'Только буквы'),
  
  lastName: yup.string()
    .required('Фамилия обязательна')
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .matches(/^[A-Za-zА-Яа-яЁё\s]+$/, 'Только буквы'),
  
  email: yup.string()
    .required('Email обязателен')
    .email('Введите корректный email'),
  
  password: yup.string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .matches(/[!@#$%^&*]/, 'Пароль должен содержать хотя бы один спецсимвол'),
  
  confirmPassword: yup.string()
    .required('Подтвердите пароль')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
  
  age: yup.number()
    .required('Возраст обязателен')
    .positive('Возраст должен быть положительным числом')
    .integer('Возраст должен быть целым числом')
    .min(18, 'Вам должно быть не менее 18 лет')
    .max(120, 'Возраст должен быть не более 120 лет'),
  
  city: yup.string()
    .required('Город обязателен'),
  
  region: yup.string()
    .required('Регион обязателен'),
  
  country: yup.string()
    .required('Страна обязательна'),
  
  address: yup.string()
    .required('Адрес обязателен')
    .min(5, 'Адрес должен содержать минимум 5 символов'),
  
  phone: yup.string()
    .required('Телефон обязателен')
    .matches(/^\+?[0-9]{10,15}$/, 'Введите корректный номер телефона'),
  
  gender: yup.string()
    .required('Выберите пол'),
  
  agreeTerms: yup.boolean()
    .oneOf([true], 'Вы должны согласиться с условиями')
}).required();

type FormData = yup.InferType<typeof schema>;

const RegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useAppDispatch();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Здесь в реальном приложении был бы API-запрос
      console.log('Form data:', data);
      
      // Имитация задержки сервера
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Успешная регистрация
      setSuccess(true);
      reset();
      
      // Сохраняем пользователя в Redux
      dispatch(loginSuccess({
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        city: data.city,
        region: data.region,
        country: data.country,
        address: data.address,
        phone: data.phone
      }));
      
    } catch (error) {
      setSubmitError('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
      console.error('Registration error:', error);
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
    <div className="registration-form-container my-4">
      <h2 className="mb-4 text-center">Регистрация</h2>
      
      {success && (
        <Alert variant="success" className="mb-4">
          Регистрация прошла успешно! Теперь вы можете войти в систему.
        </Alert>
      )}
      
      {submitError && (
        <Alert variant="danger" className="mb-4 error-animate">
          {submitError}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} noValidate>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите имя"
                isInvalid={!!errors.firstName}
                {...register('firstName')}
              />
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.firstName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Фамилия</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите фамилию"
                isInvalid={!!errors.lastName}
                {...register('lastName')}
              />
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.lastName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@example.com"
                isInvalid={!!errors.email}
                {...register('email')}
              />
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Возраст</Form.Label>
              <Form.Control
                type="number"
                placeholder="Введите возраст"
                isInvalid={!!errors.age}
                {...register('age', { valueAsNumber: true })}
              />
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.age?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введите пароль"
                isInvalid={!!errors.password}
                {...register('password')}
              />
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Подтверждение пароля</Form.Label>
              <Form.Control
                type="password"
                placeholder="Подтвердите пароль"
                isInvalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.confirmPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Город</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите город"
                isInvalid={!!errors.city}
                {...register('city')}
              />
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.city?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Регион</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите регион"
                isInvalid={!!errors.region}
                {...register('region')}
              />
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.region?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Страна</Form.Label>
              <Form.Select
                isInvalid={!!errors.country}
                {...register('country')}
              >
                <option value="">Выберите страну</option>
                <option value="Казахстан">Казахстан</option>
                <option value="Россия">Россия</option>
                <option value="Узбекистан">Узбекистан</option>
                <option value="Кыргызстан">Кыргызстан</option>
                <option value="Украина">Украина</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid" className="error-animate">
                {errors.country?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Адрес</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите адрес"
            isInvalid={!!errors.address}
            {...register('address')}
          />
          <Form.Control.Feedback type="invalid" className="error-animate">
            {errors.address?.message}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Телефон</Form.Label>
          <Form.Control
            type="tel"
            placeholder="+7 (XXX) XXX-XX-XX"
            isInvalid={!!errors.phone}
            {...register('phone')}
          />
          <Form.Control.Feedback type="invalid" className="error-animate">
            {errors.phone?.message}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Пол</Form.Label>
          <div>
            <Form.Check
              inline
              type="radio"
              label="Мужской"
              value="male"
              id="gender-male"
              isInvalid={!!errors.gender}
              {...register('gender')}
            />
            <Form.Check
              inline
              type="radio"
              label="Женский"
              value="female"
              id="gender-female"
              isInvalid={!!errors.gender}
              {...register('gender')}
            />
            <Form.Check
              inline
              type="radio"
              label="Другой"
              value="other"
              id="gender-other"
              isInvalid={!!errors.gender}
              {...register('gender')}
            />
          </div>
          {errors.gender && (
            <div className="text-danger small mt-1 error-animate">{errors.gender.message}</div>
          )}
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Я согласен с условиями и политикой конфиденциальности"
            isInvalid={!!errors.agreeTerms}
            {...register('agreeTerms')}
            id="agree-terms"
          />
          {errors.agreeTerms && (
            <div className="text-danger small mt-1 error-animate">{errors.agreeTerms.message}</div>
          )}
        </Form.Group>
        
        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
            className="mt-2"
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegistrationForm; 