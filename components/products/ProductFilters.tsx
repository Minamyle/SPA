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
    <div className={cn('space-y-3 sm:space-y-4', className)}>
      {/* Brand Filter */}
      <MultiSelect
        label="Brands"
        options={brandOptions}
        value={filters.brands || []}
        onChange={(value) => handleFilterChange('brands', value)}
        placeholder="Select brands"
      />

      {/* Category Filter */}
      <MultiSelect
        label="Categories"
        options={categoryOptions}
        value={filters.categories || []}
        onChange={(value) => handleFilterChange('categories', value)}
        placeholder="Select categories"
      />

      {/* Status Filter */}
      <Select
        label="Stock Status"
        value={filters.status || ''}
        onChange={(e) => handleFilterChange('status', e.target.value as ProductFiltersType['status'])}
        options={statusOptions}
        placeholder="Select status"
      />

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceMin || ''}
            onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseFloat(e.target.value) : undefined)}
            min="0"
            step="0.01"
            className="text-sm" // Smaller text on mobile
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceMax || ''}
            onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseFloat(e.target.value) : undefined)}
            min="0"
            step="0.01"
            className="text-sm" // Smaller text on mobile
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:underline bg-blue-50 dark:bg-blue-900/20 rounded-md transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
