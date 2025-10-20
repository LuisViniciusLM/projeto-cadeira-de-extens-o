import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  iconColor?: string;
  children?: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, icon: Icon, title, description, iconColor = 'text-primary', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-2xl bg-gradient-card border border-border p-6 transition-all duration-300 hover:scale-105 hover:shadow-glow-primary cursor-pointer animate-fade-in',
          className
        )}
        {...props}
      >
        <div className="relative z-10">
          {Icon && (
            <div className={cn('mb-4', iconColor)}>
              <Icon className="h-10 w-10" />
            </div>
          )}
          {title && (
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
