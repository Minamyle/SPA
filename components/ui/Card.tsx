import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
}

export function Card({ className, children, variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-card/50 backdrop-blur-sm border border-border/40 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300',
    elevated: 'bg-gradient-to-br from-card to-card/80 border border-border/20 shadow-elevated hover:shadow-brand-lg transition-all duration-500 hover:-translate-y-1',
    glass: 'bg-white/20 backdrop-blur-md border border-white/30 shadow-glass',
    gradient: 'bg-gradient-to-br from-brand-50 to-primary-50 border border-brand-200/50 shadow-brand hover:shadow-brand-lg transition-all duration-300'
  };

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export function CardHeader({ className, children, gradient = false, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 p-6 relative',
        gradient && 'bg-gradient-to-r from-brand-500/5 to-primary-500/5 border-b border-border/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export function CardTitle({ className, children, gradient = false, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-card-foreground',
        gradient && 'bg-gradient-to-r from-brand-600 to-primary-600 bg-clip-text text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
