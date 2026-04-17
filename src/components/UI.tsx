import * as React from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
      secondary: 'bg-secondary text-white hover:opacity-90 shadow-sm',
      outline: 'border border-border bg-transparent hover:bg-muted-surface text-text-main',
      ghost: 'bg-transparent hover:bg-muted-surface text-text-muted hover:text-text-main',
      danger: 'bg-danger text-white hover:opacity-90 shadow-sm',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'bg-surface border border-border rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Badge = ({ className, variant = 'neutral', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'primary' }) => {
  const variants = {
    neutral: 'bg-muted-surface text-text-muted border-border',
    success: 'bg-[#D1FAE5] text-[#065F46] border-none',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    primary: 'bg-[#E0E7FF] text-[#3730A3] border-none',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Avatar = ({ src, alt, fallback, className }: { src?: string; alt?: string; fallback: string; className?: string }) => (
  <div className={cn('relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted-surface', className)}>
    {src ? (
      <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-muted-surface text-xs font-bold uppercase text-text-muted">
        {fallback}
      </div>
    )}
  </div>
);
