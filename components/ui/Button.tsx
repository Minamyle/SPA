import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient' | 'electric' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md',
    primary: 'bg-gradient-to-r from-brand-500 to-primary-500 text-white hover:from-brand-600 hover:to-primary-600 shadow-brand hover:shadow-brand-lg hover:scale-105 transform',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md hover:border-primary/50',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md',
    gradient: 'bg-gradient-to-r from-brand-500 via-primary-500 to-electric-500 text-white hover:scale-105 shadow-brand hover:shadow-brand-lg transform relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-brand-600 before:via-primary-600 before:to-electric-600 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
    electric: 'bg-gradient-to-r from-electric-500 to-electric-600 text-white hover:from-electric-600 hover:to-electric-700 shadow-electric hover:shadow-electric-lg hover:scale-105 transform',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-glass hover:shadow-lg'
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
    xl: 'h-14 px-8 text-xl',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect for gradient buttons */}
      {(variant === 'gradient' || variant === 'primary') && (
        <div className="absolute inset-0 -top-10 -bottom-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      )}
      
      {loading && (
        <div className="mr-2 relative">
          <svg
            className="h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
