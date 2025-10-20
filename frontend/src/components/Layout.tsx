import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showBackground?: boolean;
}

export const Layout = ({ children, className, showBackground = true }: LayoutProps) => {
  return (
    <div className={cn(
      'min-h-screen w-full flex items-center justify-center p-4',
      showBackground && 'bg-gradient-to-br from-background via-background to-background/95',
      className
    )}>
      <div className="w-full max-w-6xl animate-scale-in">
        {children}
      </div>
    </div>
  );
};
