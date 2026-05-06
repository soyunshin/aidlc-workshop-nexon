import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem, MenuItem } from '../api/types';
import { saveCart, loadCart, clearCartStorage } from '../utils/storage';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'INCREASE_QUANTITY'; payload: number }
  | { type: 'DECREASE_QUANTITY'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.menu_item_id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.menu_item_id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            menu_item_id: action.payload.id,
            name: action.payload.name,
            price: action.payload.price,
            quantity: 1,
            image_url: action.payload.image_url,
          },
        ],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.menu_item_id !== action.payload),
      };
    case 'INCREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.menu_item_id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case 'DECREASE_QUANTITY': {
      const item = state.items.find((i) => i.menu_item_id === action.payload);
      if (item && item.quantity <= 1) {
        return { ...state, items: state.items.filter((i) => i.menu_item_id !== action.payload) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.menu_item_id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_DRAWER':
      return { ...state, isOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: number) => void;
  increaseQuantity: (menuItemId: number) => void;
  decreaseQuantity: (menuItemId: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = loadCart();
    if (saved.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: saved });
    }
  }, []);

  // Sync cart to localStorage on change
  useEffect(() => {
    saveCart(state.items);
  }, [state.items]);

  const totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(menuItem: MenuItem) {
    dispatch({ type: 'ADD_ITEM', payload: menuItem });
  }
  function removeItem(menuItemId: number) {
    dispatch({ type: 'REMOVE_ITEM', payload: menuItemId });
  }
  function increaseQuantity(menuItemId: number) {
    dispatch({ type: 'INCREASE_QUANTITY', payload: menuItemId });
  }
  function decreaseQuantity(menuItemId: number) {
    dispatch({ type: 'DECREASE_QUANTITY', payload: menuItemId });
  }
  function clearCart() {
    clearCartStorage();
    dispatch({ type: 'CLEAR_CART' });
  }
  function openDrawer() {
    dispatch({ type: 'OPEN_DRAWER' });
  }
  function closeDrawer() {
    dispatch({ type: 'CLOSE_DRAWER' });
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        openDrawer,
        closeDrawer,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
