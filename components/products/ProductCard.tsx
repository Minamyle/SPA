'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  className?: string;
}

export function ProductCard({ product, onClick, className }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600' };
    if (stock < 10) return { label: 'Low Stock', color: 'text-yellow-600' };
    return { label: 'In Stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 relative">
            <Image
              src={product.thumbnail || '/placeholder-product.jpg'}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-200 hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onError={() => {
                // Handle error by showing fallback image
              }}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {product.title}
            </h3>
            
            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {product.description}
            </p>

            {/* Price and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(product.price)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-red-600 dark:text-red-400">
                  {product.discountPercentage}% off
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ⭐ {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {product.brand}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between text-sm">
              <span className={cn('font-medium', stockStatus.color)}>
                {stockStatus.label}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {formatDate(product.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
