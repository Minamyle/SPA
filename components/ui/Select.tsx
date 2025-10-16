import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'modern';
}

export function Select({ 
  label, 
  error, 
  helperText, 
  className, 
  id,
  options,
  placeholder = 'Select an option',
  children,
  variant = 'default',
  ...props 
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = 'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50';
  
  const variants = {
    default: 'border-input bg-background text-foreground hover:border-ring/50',
    modern: 'border-outline bg-surface text-foreground hover:border-primary/50 shadow-sm hover:shadow-md',
  };

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            baseStyles,
            variants[variant],
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="h-4 w-4 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1" role="alert">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
