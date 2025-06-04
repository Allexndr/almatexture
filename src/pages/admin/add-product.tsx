import React from 'react';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AddProductForm from '../../components/AddProductForm';

const AddProductPage = () => {
  return (
    <div className="add-product-page min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1 py-5">
        <Container>
          <AddProductForm />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AddProductPage; 