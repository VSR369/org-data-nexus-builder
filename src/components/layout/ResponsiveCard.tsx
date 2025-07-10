
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerContent?: React.ReactNode;
  /**
   * Card size variant
   */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /**
   * Whether the card should have a hover effect
   */
  hoverable?: boolean;
  /**
   * Whether the card content should be scrollable
   */
  scrollable?: boolean;
  /**
   * Maximum height for scrollable content
   */
  maxHeight?: string;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  title,
  subtitle,
  className,
  headerContent,
  size = 'md',
  hoverable = false,
  scrollable = false,
  maxHeight = '400px'
}) => {
  const sizeClasses = {
    sm: 'min-w-[250px]',
    md: 'min-w-[300px]',
    lg: 'min-w-[400px]',
    full: 'w-full'
  };

  return (
    <Card
      className={cn(
        // Base styles
        'w-full max-w-full overflow-hidden',
        // Size classes
        sizeClasses[size],
        // Hover effect
        hoverable && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
        // Custom className
        className
      )}
    >
      {(title || subtitle || headerContent) && (
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="text-lg font-semibold leading-none tracking-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {subtitle}
                </p>
              )}
            </div>
            {headerContent && (
              <div className="flex-shrink-0 ml-4">
                {headerContent}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      
      <CardContent
        className={cn(
          'w-full',
          scrollable && 'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'
        )}
        style={scrollable ? { maxHeight } : undefined}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default ResponsiveCard;
