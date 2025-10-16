import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'floating' | 'modern';
}

export function Input({ 
  label, 
  error, 
  helperText, 
  className, 
  id,
  variant = 'default',
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    setHasValue(inputRef.current?.value !== '');
  };

  if (variant === 'floating') {
    return (
      <div className="relative space-y-1">
        <div className="relative">
          <input
            ref={inputRef}
            id={inputId}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'peer h-12 w-full rounded-xl border-2 bg-background px-4 pt-6 pb-2 text-sm transition-all duration-200 focus:outline-none focus:ring-0',
              'border-border/40 focus:border-primary hover:border-border/60',
              error && 'border-destructive focus:border-destructive',
              'placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:transition-opacity',
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-4 transition-all duration-200 pointer-events-none',
                'peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary',
                (isFocused || hasValue || props.value) 
                  ? 'top-2 text-xs text-primary' 
                  : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground',
                error && 'text-destructive peer-focus:text-destructive'
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1" role="alert">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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

  if (variant === 'modern') {
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-card-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            id={inputId}
            className={cn(
              'flex h-11 w-full rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm px-4 py-2 text-sm transition-all duration-200',
              'placeholder:text-muted-foreground/70',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'hover:border-border/60 hover:bg-background/80',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'group-hover:shadow-sm focus:shadow-md',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
              className
            )}
            {...props}
          />
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-500 to-primary-500 scale-x-0 transition-transform duration-200 origin-left focus-within:scale-x-100" />
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1" role="alert">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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

  // Default variant
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-card-foreground"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
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
