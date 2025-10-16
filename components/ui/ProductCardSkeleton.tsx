'use client';

import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Product Image Skeleton */}
          <div className="aspect-square w-full rounded-lg bg-gray-200 dark:bg-gray-700" />

          {/* Product Info Skeleton */}
          <div className="space-y-2">
            {/* Title */}
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            
            {/* Description */}
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>

            {/* Price and Discount */}
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>

            {/* Rating and Brand */}
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>

            {/* Stock Status and Date */}
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({ count = 9, className }: ProductGridSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}