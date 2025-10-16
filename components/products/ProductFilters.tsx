'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Input } from '@/components/ui/Input';
import { ProductFilters as ProductFiltersType, ApiParams } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  filters: ApiParams;
  categories: string[];
  brands: string[];
  onFiltersChange: (filters: Partial<ProductFiltersType>) => void;
  className?: string;
}

export function ProductFilters({ 
  filters, 
  categories, 
  brands, 
  onFiltersChange,
  className 
}: ProductFiltersProps) {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  const categoryOptions = categories.filter(category => typeof category === 'string').map(category => ({
    value: category,
    label: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  }));

  const brandOptions = brands.filter(brand => typeof brand === 'string').map(brand => ({
    value: brand,
    label: brand,
  }));

  const handleFilterChange = (key: keyof ProductFiltersType, value: string | string[] | number | undefined) => {
    onFiltersChange({ [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      brand: '',
      category: '',
      brands: [],
      categories: [],
      priceMin: undefined,
      priceMax: undefined,
      status: undefined,
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.brand ||
    filters.category ||
    (filters.brands && filters.brands.length > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    filters.priceMin ||
    filters.priceMax ||
    filters.status
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Quick Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <svg className="h-4 w-4 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Filters
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleFilterChange('status', 'in-stock')}
            className={cn(
              'p-3 text-xs font-medium rounded-lg border transition-all',
              filters.status === 'in-stock'
                ? 'bg-electric-500 text-white border-electric-500 shadow-md'
                : 'bg-muted/50 hover:bg-electric-50 border-border/50 hover:border-electric-200'
            )}
          >
            In Stock Only
          </button>
          <button
            onClick={() => handleFilterChange('status', 'low-stock')}
            className={cn(
              'p-3 text-xs font-medium rounded-lg border transition-all',
              filters.status === 'low-stock'
                ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                : 'bg-muted/50 hover:bg-amber-50 border-border/50 hover:border-amber-200'
            )}
          >
            Low Stock
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Price Range
        </h3>
        <div className="bg-gradient-to-r from-muted/30 to-background p-4 rounded-xl border border-border/30">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Min Price</label>
              <Input
                type="number"
                placeholder="$0"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                min="0"
                step="0.01"
                className="text-sm h-9"
                variant="modern"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Max Price</label>
              <Input
                type="number"
                placeholder="$∞"
                value={filters.priceMax || ''}
                onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                min="0"
                step="0.01"
                className="text-sm h-9"
                variant="modern"
              />
            </div>
          </div>
          {/* Quick price ranges */}
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: '< $50', min: 0, max: 50 },
              { label: '$50-100', min: 50, max: 100 },
              { label: '> $100', min: 100, max: undefined }
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  handleFilterChange('priceMin', range.min);
                  handleFilterChange('priceMax', range.max);
                }}
                className={cn(
                  'px-2 py-1 text-xs rounded-md border transition-all',
                  filters.priceMin === range.min && filters.priceMax === range.max
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-background hover:bg-muted border-border/50'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <svg className="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Brands
        </h3>
        <MultiSelect
          options={brandOptions}
          value={filters.brands || []}
          onChange={(value) => handleFilterChange('brands', value)}
          placeholder="Select brands..."
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </h3>
        <MultiSelect
          options={categoryOptions}
          value={filters.categories || []}
          onChange={(value) => handleFilterChange('categories', value)}
          placeholder="Select categories..."
        />
      </div>

      {/* Stock Status */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <svg className="h-4 w-4 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Stock Status
        </h3>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                filters.status === option.value
                  ? 'bg-gradient-to-r from-brand-50 to-primary-50 border-brand-200'
                  : 'bg-background hover:bg-muted/50 border-border/30'
              )}
            >
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={filters.status === option.value}
                onChange={(e) => handleFilterChange('status', e.target.value as ProductFiltersType['status'])}
                className="w-4 h-4 text-brand-600 border-border/50 focus:ring-brand-500"
              />
              <span className="text-sm font-medium flex items-center gap-2">
                {option.value === 'in-stock' && <div className="w-2 h-2 bg-electric-500 rounded-full" />}
                {option.value === 'low-stock' && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                {option.value === 'out-of-stock' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border/30">
          <button
            onClick={clearFilters}
            className="w-full py-3 text-sm font-medium text-red-600 hover:text-red-700 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200/50 rounded-xl transition-all hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
