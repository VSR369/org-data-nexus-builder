
import { useState, useEffect } from 'react';

interface DashboardBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenWidth: number;
  recommendedLayout: 'stack' | 'flex' | 'grid';
  recommendedColumns: number;
}

export const useDashboardResponsive = (): DashboardBreakpoints => {
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024 && screenWidth < 1440;
  const isLargeDesktop = screenWidth >= 1440;

  // Recommend layout based on screen size
  const recommendedLayout = isMobile ? 'stack' : isTablet ? 'flex' : 'grid';
  
  // Recommend number of columns
  let recommendedColumns = 1;
  if (isTablet) recommendedColumns = 2;
  else if (isDesktop) recommendedColumns = 3;
  else if (isLargeDesktop) recommendedColumns = 4;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    screenWidth,
    recommendedLayout,
    recommendedColumns
  };
};
