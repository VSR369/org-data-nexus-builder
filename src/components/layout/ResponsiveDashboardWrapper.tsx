
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveDashboardWrapperProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Layout mode for the dashboard content
   * - grid: Uses CSS Grid with auto-fit columns
   * - flex: Uses Flexbox with wrap
   * - stack: Forces single column layout
   */
  layout?: 'grid' | 'flex' | 'stack';
  /**
   * Minimum width for grid/flex items (in px)
   */
  minItemWidth?: number;
  /**
   * Gap between items (in rem)
   */
  gap?: 'sm' | 'md' | 'lg';
  /**
   * Padding around the container
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Maximum height for the container (enables vertical scrolling if needed)
   */
  maxHeight?: string;
  /**
   * Whether to show a subtle background
   */
  showBackground?: boolean;
}

const ResponsiveDashboardWrapper: React.FC<ResponsiveDashboardWrapperProps> = ({
  children,
  className,
  layout = 'grid',
  minItemWidth = 300,
  gap = 'md',
  padding = 'md',
  maxHeight,
  showBackground = false,
}) => {
  // Gap classes with mobile-first approach
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8'
  };

  // Padding classes with mobile-first approach
  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-3 lg:p-4',
    md: 'p-3 sm:p-4 lg:p-6',
    lg: 'p-4 sm:p-6 lg:p-8'
  };

  // Layout classes with improved mobile responsiveness
  const layoutClasses = {
    grid: `grid grid-cols-1 ${minItemWidth <= 250 ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : minItemWidth <= 300 ? 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`,
    flex: 'flex flex-wrap items-start',
    stack: 'flex flex-col'
  };

  // Dynamic grid template with mobile optimization
  const mobileMinWidth = Math.min(minItemWidth, 280); // Ensure mobile cards don't get too narrow
  const gridStyle = layout === 'grid' ? {
    '--min-item-width': `${minItemWidth}px`,
    '--mobile-min-width': `${mobileMinWidth}px`,
    gridTemplateColumns: `repeat(auto-fit, minmax(min(var(--min-item-width), 100%), 1fr))`
  } as React.CSSProperties : {};

  return (
    <div
      className={cn(
        // Base container styles with mobile optimization
        'w-full max-w-full overflow-x-hidden min-h-0',
        // Background with mobile-friendly gradients
        showBackground && 'bg-gradient-to-br from-background/50 to-muted/30',
        // Padding
        paddingClasses[padding],
        // Custom className
        className
      )}
      style={{ maxHeight }}
    >
      <div
        className={cn(
          // Layout classes
          layoutClasses[layout],
          // Gap classes
          gapClasses[gap],
          // Responsive behavior with mobile touch optimization
          'w-full max-w-full touch-manipulation',
          // Scroll behavior if maxHeight is set
          maxHeight && 'overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
          // Mobile-specific optimizations
          'scroll-smooth'
        )}
        style={gridStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsiveDashboardWrapper;
