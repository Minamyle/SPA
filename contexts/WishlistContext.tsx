'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types/product';

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: { product: Product } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'lotus-wishlist';

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Item already exists, don't add duplicate
        return state;
      }
      
      const newItems = [
        ...state.items,
        {
          product,
          addedAt: new Date().toISOString(),
        },
      ];
      
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload.productId);
      
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length,
      };
    }
    
    case 'CLEAR_WISHLIST': {
      return {
        ...state,
        items: [],
        itemCount: 0,
      };
    }
    
    case 'LOAD_WISHLIST': {
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.length,
      };
    }
    
    default:
      return state;
  }
}

const initialState: WishlistState = {
  items: [],
  itemCount: 0,
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  
  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        const wishlistItems: WishlistItem[] = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error);
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error);
    }
  }, [state.items]);
  
  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
  };
  
  const removeFromWishlist = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };
  
  const isInWishlist = (productId: number): boolean => {
    return state.items.some(item => item.product.id === productId);
  };
  
  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const value: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    toggleWishlist,
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}