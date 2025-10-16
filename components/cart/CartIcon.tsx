'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className }: CartIconProps) {
  const { itemCount, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className={cn(
        'relative p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group',
        'hover:scale-110 hover:shadow-lg',
        className
      )}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg 
        className="h-6 w-6 text-white group-hover:text-white/90 transition-colors" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" 
        />
      </svg>
      
      {/* Item count badge */}
      {itemCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse border-2 border-white">
          {itemCount > 99 ? '99+' : itemCount}
        </div>
      )}
    </button>
  );
}