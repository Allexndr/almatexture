import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { NextPage } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegistrationForm from '../components/RegistrationForm';
import { useAppSelector } from '../store/hooks';
import { useRouter } from 'next/router';

const RegisterPage: NextPage = () => {
  const { isAuthenticated } = useAppSelector(state => state.user);
  const router = useRouter();
  
  // Если пользователь уже авторизован, перенаправляем на главную страницу
  if (isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }
  
  return (
    <div className="register-page min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1 py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <RegistrationForm />
                </Card.Body>
              </Card>
              
              <div className="text-center mt-4">
                <p>Уже зарегистрированы?</p>
                <Button 
                  variant="link" 
                  className="text-decoration-none"
                  onClick={() => router.push('/login')}
                >
                  Войти в аккаунт
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage; 