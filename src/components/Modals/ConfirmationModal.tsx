import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  variant = 'danger'
}) => {
  // Обработчик подтверждения с закрытием модального окна
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };
  
  // Обработчик клавиатурных событий
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      onHide();
    }
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      onKeyDown={handleKeyDown}
      aria-labelledby="confirmation-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="confirmation-modal-title">
          {title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal; 