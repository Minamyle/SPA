import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'electric' | 'minimal';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className,
  text 
}: LoadingSpinnerProps) {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const variants = {
    default: 'text-primary',
    primary: 'text-primary drop-shadow-brand',
    electric: 'text-electric-500 drop-shadow-electric',
    minimal: 'text-muted-foreground',
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center space-y-3">
          <div className={cn('animate-spin', sizes[size])}>
            <div className={cn('rounded-full border-2 border-current border-r-transparent', variants[variant])} 
                 style={{ width: '100%', height: '100%' }} />
          </div>
          {text && (
            <p className="text-sm text-muted-foreground font-medium">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          {/* Outer ring */}
          <div className={cn(
            'animate-spin rounded-full border-2 border-muted-foreground/20',
            sizes[size]
          )}>
            <div className={cn(
              'h-full w-full rounded-full border-2 border-transparent border-t-current animate-spin',
              variants[variant]
            )} style={{ animationDuration: '1s' }} />
          </div>
          
          {/* Inner glow effect for primary and electric variants */}
          {(variant === 'primary' || variant === 'electric') && (
            <div className={cn(
              'absolute inset-0 rounded-full animate-pulse',
              variant === 'primary' ? 'bg-primary/10' : 'bg-electric-500/10'
            )} />
          )}
        </div>
        
        {text && (
          <p className={cn(
            'text-sm font-medium animate-pulse',
            variant === 'primary' ? 'text-primary' :
            variant === 'electric' ? 'text-electric-600' :
            'text-muted-foreground'
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
