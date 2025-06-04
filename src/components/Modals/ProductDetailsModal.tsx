import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { Product } from '../../store/dataSlice';
import { useAppDispatch } from '../../store/hooks';
import { closeModal } from '../../store/uiSlice';

interface ProductDetailsModalProps {
  show: boolean;
  onHide: () => void;
  product: Product | null;
  onAddToCart?: (product: Product, quantity: number, options: any) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  show, 
  onHide, 
  product, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  
  // Сброс состояния при закрытии модального окна или смене продукта
  useEffect(() => {
    if (show && product) {
      setQuantity(1);
      setSelectedColor(null);
      setSelectedSize(null);
      
      // Prevent scrolling when modal is shown
      if (typeof window !== 'undefined') {
        window.scrollTo(window.scrollX, window.scrollY);
        document.body.style.overflow = 'hidden';
      }
    } else if (!show) {
      // Restore scrolling when modal is closed
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [show, product]);
  
  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    onHide();
    
    // Prevent page navigation or scrolling when closing
    if (typeof window !== 'undefined') {
      window.scrollTo(window.scrollX, window.scrollY);
    }
    
    // Only try to dispatch if the store is available
    try {
      dispatch(closeModal('productDetails'));
    } catch (error) {
      console.log('Modal closed without Redux dispatch');
    }
  };
  
  // Обработчик добавления в корзину
  const handleAddToCart = () => {
    if (product && onAddToCart) {
      onAddToCart(product, quantity, {
        color: selectedColor,
        size: selectedSize
      });
      handleClose();
    }
  };
  
  // Увеличение количества
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  // Уменьшение количества
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Обработчик прямого ввода количества
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    if (!isNaN(value)) {
      if (product && value > 0 && value <= product.stock) {
        setQuantity(value);
      }
    }
  };
  
  // Получение категории в формате для отображения
  const getCategoryName = (category: string): string => {
    const categories: {[key: string]: string} = {
      'tshirt': 'Футболки',
      'poster': 'Постеры',
      'postcard': 'Открытки',
      'album': 'Альбомы',
      'other': 'Другое'
    };
    return categories[category] || category;
  };
  
  // Получение бейджа категории
  const getCategoryBadge = (category: string) => {
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
    
    return <Badge bg={variant}>{getCategoryName(category)}</Badge>;
  };
  
  // Обработка цены с учетом возможных скидок
  const getPrice = (product: Product) => {
    const price = product.price;
    const discountPrice = (product as any).discountPrice;
    
    if (discountPrice && discountPrice < price) {
      return (
        <div>
          <span className="text-decoration-line-through text-muted me-2">
            {price.toLocaleString()} ₸
          </span>
          <span className="text-danger fw-bold">
            {discountPrice.toLocaleString()} ₸
          </span>
        </div>
      );
    }
    
    return <span>{price.toLocaleString()} ₸</span>;
  };
  
  if (!product) return null;
  
  const productName = product.name || product.title || '';
  const productImage = product.imageUrl || product.image || '';
  
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
      aria-labelledby="product-details-modal-title"
      className="product-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <>
        <Modal.Header closeButton>
          <Modal.Title id="product-details-modal-title">
            {productName}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Row>
            <Col md={6} className="mb-4 mb-md-0">
              <div className="product-image-container position-relative">
                <img
                  src={productImage}
                  alt={productName}
                  className="img-fluid rounded shadow-sm"
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'cover',
                    maxHeight: '400px' 
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                />
                {getCategoryBadge(product.category)}
              </div>
            </Col>
            
            <Col md={6}>
              <div className="product-details">
                <h4 className="mb-2">{productName}</h4>
                
                <p className="text-muted mb-2">
                  Категория: {getCategoryName(product.category)}
                </p>
                
                <h5 className="text-primary mb-3">
                  {getPrice(product)}
                </h5>
                
                <div className="mb-3 product-description" style={{ minHeight: '80px' }}>
                  {product.description}
                </div>
                
                <Badge 
                  bg={product.stock > 5 ? 'success' : (product.stock > 0 ? 'warning' : 'danger')}
                  className="mb-3"
                >
                  {product.stock > 5 
                    ? 'В наличии' 
                    : (product.stock > 0 
                      ? `Осталось: ${product.stock}` 
                      : 'Нет в наличии')}
                </Badge>
                
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-3">
                    <Form.Label>Цвет:</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <div
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: color,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: selectedColor === color 
                              ? '2px solid #000' 
                              : '1px solid #dee2e6',
                            boxShadow: selectedColor === color
                              ? '0 0 0 2px rgba(0,123,255,.25)'
                              : 'none',
                            transition: 'all 0.2s ease'
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-3">
                    <Form.Label>Размер:</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? 'primary' : 'outline-secondary'}
                          onClick={() => setSelectedSize(size)}
                          className="size-button"
                          size="sm"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="quantity-selector mb-3">
                  <Form.Label>Количество:</Form.Label>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min={1}
                      max={product.stock}
                      className="text-center mx-2"
                      style={{ width: '60px' }}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <i className="bi bi-plus"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || 
              (product.colors && product.colors.length > 0 && !selectedColor) || 
              (product.sizes && product.sizes.length > 0 && !selectedSize)}
          >
            {product.stock === 0 
              ? 'Нет в наличии' 
              : (onAddToCart ? 'Добавить в корзину' : 'Закрыть')}
          </Button>
        </Modal.Footer>
      </>
    </Modal>
  );
};

export default ProductDetailsModal; 