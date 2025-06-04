import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

interface Product {
  id: string;
  name?: string;
  title?: string;
  price: number;
  image?: string;
  imageUrl?: string;
  description: string;
  category: string;
  stock: number;
}

interface AdminProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRefresh?: () => void;
}

class AdminProductsTable extends React.Component<AdminProductsTableProps> {
  getCategoryBadge(category: string) {
    let variant = 'secondary';
    
    switch(category) {
      case 'tshirt':
        variant = 'primary';
        break;
      case 'poster':
        variant = 'success';
        break;
      case 'postcard':
        variant = 'info';
        break;
      case 'album':
        variant = 'warning';
        break;
    }
    
    return <Badge bg={variant}>{category}</Badge>;
  }
  
  getFormattedPrice(price: number) {
    return new Intl.NumberFormat('ru-KZ', { 
      style: 'currency', 
      currency: 'KZT',
      maximumFractionDigits: 0
    }).format(price);
  }
  
  render() {
    const { products, onEdit, onDelete, onRefresh } = this.props;
    return (
      <div>
        <div className="d-flex justify-content-between mb-3">
          <h4>Список товаров ({products.length})</h4>
          {onRefresh && (
            <Button variant="outline-primary" onClick={onRefresh}>
              <i className="bi bi-arrow-clockwise"></i> Обновить
            </Button>
          )}
        </div>
        
        {products.length === 0 ? (
          <div className="alert alert-info">
            Список товаров пуст. Добавьте новый товар с помощью формы выше.
          </div>
        ) : (
          <Table striped bordered hover responsive className="align-middle">
            <thead>
              <tr>
                <th style={{width: '80px'}}>Фото</th>
                <th>Название</th>
                <th>Категория</th>
                <th style={{width: '100px'}}>Цена</th>
                <th style={{width: '100px'}}>В наличии</th>
                <th style={{width: '200px'}}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.imageUrl || product.image} 
                      alt={product.name || product.title} 
                      style={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'cover', 
                        borderRadius: 8,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </td>
                  <td>{product.name || product.title}</td>
                  <td>{this.getCategoryBadge(product.category)}</td>
                  <td>{this.getFormattedPrice(product.price)}</td>
                  <td>
                    {product.stock <= 0 ? (
                      <Badge bg="danger">Нет в наличии</Badge>
                    ) : product.stock < 5 ? (
                      <Badge bg="warning" text="dark">{product.stock} шт.</Badge>
                    ) : (
                      <Badge bg="success">{product.stock} шт.</Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: '36px', height: '36px', borderRadius: '8px', padding: '0' }}
                        onClick={() => onEdit(product)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: '36px', height: '36px', borderRadius: '8px', padding: '0' }}
                        onClick={() => onDelete(product)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  }
}

export default AdminProductsTable; 