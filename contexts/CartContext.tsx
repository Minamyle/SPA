'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  totalAmount: number;
  subtotal: number;
  savings: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'lotus-cart';

function calculateCartTotals(items: CartItem[]): {
  itemCount: number;
  totalAmount: number;
  subtotal: number;
  savings: number;
} {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  let subtotal = 0;
  let savings = 0;
  
  items.forEach(item => {
    const { product, quantity } = item;
    const originalPrice = product.price;
    const discountedPrice = product.discountPercentage > 0 
      ? originalPrice * (1 - product.discountPercentage / 100)
      : originalPrice;
    
    subtotal += originalPrice * quantity;
    savings += (originalPrice - discountedPrice) * quantity;
  });
  
  const totalAmount = subtotal - savings;
  
  return { itemCount, totalAmount, subtotal, savings };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        // Add new item
        newItems = [
          ...state.items,
          {
            product,
            quantity: Math.min(quantity, product.stock),
            addedAt: new Date().toISOString(),
          },
        ];
      }
      
      const totals = calculateCartTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload.productId);
      const totals = calculateCartTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter(item => item.product.id !== productId);
        const totals = calculateCartTotals(newItems);
        
        return {
          ...state,
          items: newItems,
          ...totals,
        };
      }
      
      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      );
      
      const totals = calculateCartTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }
    
    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        itemCount: 0,
        totalAmount: 0,
        subtotal: 0,
        savings: 0,
      };
    }
    
    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }
    
    case 'OPEN_CART': {
      return {
        ...state,
        isOpen: true,
      };
    }
    
    case 'CLOSE_CART': {
      return {
        ...state,
        isOpen: false,
      };
    }
    
    case 'LOAD_CART': {
      const totals = calculateCartTotals(action.payload);
      
      return {
        ...state,
        items: action.payload,
        ...totals,
      };
    }
    
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  itemCount: 0,
  totalAmount: 0,
  subtotal: 0,
  savings: 0,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const cartItems: CartItem[] = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items]);
  
  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };
  
  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  
  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };
  
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };
  
  const isInCart = (productId: number): boolean => {
    return state.items.some(item => item.product.id === productId);
  };
  
  const getItemQuantity = (productId: number): number => {
    const item = state.items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };
  
  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    isInCart,
    getItemQuantity,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}