'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search products...',
  className,
  debounceMs = 300
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the onChange call
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={cn('relative group', className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("pl-12 pr-10", className?.includes('h-') ? '' : 'h-11')}
        aria-label="Search products"
        variant="modern"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors rounded-full hover:bg-muted p-1"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
