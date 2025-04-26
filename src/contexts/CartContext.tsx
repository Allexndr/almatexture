import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Типы для корзины
export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
  customDesign?: any;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  cart: CartState;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Создаем контекст
const CartContext = createContext<CartContextType | undefined>(undefined);

// Редуктор для управления состоянием корзины
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Проверяем, есть ли уже такой товар в корзине
      const existingItemIndex = state.items.findIndex(
        item => 
          item.productId === action.payload.productId && 
          item.size === action.payload.size && 
          item.color === action.payload.color
      );

      if (existingItemIndex > -1) {
        // Если товар существует, увеличиваем количество
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;

        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.price * action.payload.quantity),
        };
      } else {
        // Добавление нового товара
        const newItem = {
          ...action.payload,
          id: Date.now() // Простой способ генерации уникального ID
        };

        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + newItem.quantity,
          totalPrice: state.totalPrice + (newItem.price * newItem.quantity),
        };
      }
    }
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload.id);
      if (!itemToRemove) return state;

      const filteredItems = state.items.filter(item => item.id !== action.payload.id);
      
      return {
        ...state,
        items: filteredItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
      };
    }
    case 'UPDATE_QUANTITY': {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (itemIndex === -1) return state;

      const item = state.items[itemIndex];
      const quantityDifference = action.payload.quantity - item.quantity;
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex] = {
        ...item,
        quantity: action.payload.quantity,
      };

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDifference,
        totalPrice: state.totalPrice + (item.price * quantityDifference),
      };
    }
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

// Провайдер корзины
export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Пытаемся загрузить состояние корзины из localStorage
  const loadCartFromStorage = (): CartState => {
    if (typeof window === 'undefined') return initialState;
    
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
    return initialState;
  };

  const [cart, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);

  // Сохраняем состояние корзины в localStorage при изменении
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item as CartItem });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Хук для использования контекста корзины
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 