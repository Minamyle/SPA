'use client';

import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

interface WishlistIconProps {
  className?: string;
  onClick?: () => void;
}

export function WishlistIcon({ className, onClick }: WishlistIconProps) {
  const { itemCount } = useWishlist();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior - could open a wishlist modal or navigate to wishlist page
      alert(`You have ${itemCount} items in your wishlist!`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'relative p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group',
        'hover:scale-110 hover:shadow-lg',
        className
      )}
      aria-label={`Wishlist with ${itemCount} items`}
    >
      <svg 
        className="h-6 w-6 text-white group-hover:text-white/90 transition-colors" 
        fill={itemCount > 0 ? "currentColor" : "none"}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
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