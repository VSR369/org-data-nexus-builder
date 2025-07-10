
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
  // Gap classes
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8'
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3 lg:p-4',
    md: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8'
  };

  // Layout classes
  const layoutClasses = {
    grid: `grid grid-cols-1 ${minItemWidth <= 250 ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : minItemWidth <= 300 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-2 xl:grid-cols-3'}`,
    flex: 'flex flex-wrap',
    stack: 'flex flex-col'
  };

  // Dynamic grid template for larger screens
  const gridStyle = layout === 'grid' ? {
    '--min-item-width': `${minItemWidth}px`,
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${minItemWidth}px, 100%), 1fr))`
  } as React.CSSProperties : {};

  return (
    <div
      className={cn(
        // Base container styles
        'w-full max-w-full overflow-x-hidden',
        // Background
        showBackground && 'bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-gray-900/50 dark:to-slate-900/50',
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
          // Responsive behavior
          'w-full max-w-full',
          // Scroll behavior if maxHeight is set
          maxHeight && 'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'
        )}
        style={gridStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsiveDashboardWrapper;
