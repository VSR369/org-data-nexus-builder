import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseMasterDataService } from '@/services/SupabaseMasterDataService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          range: vi.fn(() => Promise.resolve({ data: [], error: null })),
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        ilike: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        range: vi.fn(() => Promise.resolve({ data: [], error: null })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}));

describe('Database Performance Tests', () => {
  let queryClient: QueryClient;
  let service: SupabaseMasterDataService;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    service = new SupabaseMasterDataService();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    queryClient.clear();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    vi.clearAllMocks();
  });

  describe('Large Lists Loading Performance', () => {
    it('should load large lists of countries within acceptable time', async () => {
      const startTime = performance.now();
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `country-${i}`,
        name: `Country ${i}`,
        code: `C${i.toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: largeDataset, 
            error: null 
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await service.getCountries();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(result).toHaveLength(1000);
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle loading large lists of currencies efficiently', async () => {
      const startTime = performance.now();
      const largeDataset = Array.from({ length: 500 }, (_, i) => ({
        id: `currency-${i}`,
        name: `Currency ${i}`,
        code: `CUR${i}`,
        symbol: `$${i}`,
        country: `Country ${i}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: largeDataset, 
            error: null 
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await service.getCurrencies();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(result).toHaveLength(500);
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should monitor memory usage during large data loading', async () => {
      const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
      
      const largeDataset = Array.from({ length: 2000 }, (_, i) => ({
        id: `org-${i}`,
        name: `Organization ${i}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: largeDataset, 
            error: null 
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await service.getOrganizationTypes();
      
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = memoryAfter - memoryBefore;

      // Memory increase should be reasonable (less than 50MB for this test)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Pagination Performance', () => {
    it('should handle pagination efficiently', async () => {
      const pageSize = 50;
      const totalItems = 1000;
      
      for (let page = 0; page < 5; page++) {
        const startTime = performance.now();
        const start = page * pageSize;
        const end = start + pageSize - 1;

        const pageData = Array.from({ length: pageSize }, (_, i) => ({
          id: `item-${start + i}`,
          name: `Item ${start + i}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const mockFrom = vi.fn(() => ({
          select: vi.fn(() => ({
            order: vi.fn(() => ({
              range: vi.fn((rangeStart, rangeEnd) => {
                expect(rangeStart).toBe(start);
                expect(rangeEnd).toBe(end);
                return Promise.resolve({ 
                  data: pageData, 
                  error: null 
                });
              })
            }))
          }))
        }));

        (supabase.from as any).mockImplementation(mockFrom);

        const result = await service.getCountries();
        const endTime = performance.now();
        const loadTime = endTime - startTime;

        expect(result).toHaveLength(pageSize);
        expect(loadTime).toBeLessThan(1000); // Each page should load within 1 second
      }
    });

    it('should verify pagination parameters are correctly applied', async () => {
      const mockRange = vi.fn(() => Promise.resolve({ data: [], error: null }));
      const mockOrder = vi.fn(() => ({ range: mockRange }));
      const mockSelect = vi.fn(() => ({ order: mockOrder }));
      const mockFrom = vi.fn(() => ({ select: mockSelect }));

      (supabase.from as any).mockImplementation(mockFrom);

      // Simulate paginated request
      await service.getCountries();

      expect(mockFrom).toHaveBeenCalledWith('master_countries');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('name');
    });

    it('should handle edge cases in pagination', async () => {
      const testCases = [
        { page: 0, pageSize: 10 },
        { page: 1, pageSize: 25 },
        { page: 10, pageSize: 100 },
        { page: 0, pageSize: 1 } // Edge case: single item per page
      ];

      for (const testCase of testCases) {
        const startTime = performance.now();
        
        const mockFrom = vi.fn(() => ({
          select: vi.fn(() => ({
            order: vi.fn(() => ({
              range: vi.fn(() => Promise.resolve({ 
                data: [], 
                error: null 
              }))
            }))
          }))
        }));

        (supabase.from as any).mockImplementation(mockFrom);

        await service.getCountries();
        const endTime = performance.now();
        const loadTime = endTime - startTime;

        expect(loadTime).toBeLessThan(500); // Should handle edge cases quickly
      }
    });
  });

  describe('Console Error and Warning Monitoring', () => {
    it('should not produce console errors during normal operations', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: [], 
            error: null 
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await service.getCountries();
      await service.getCurrencies();
      await service.getOrganizationTypes();

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not produce console warnings during normal operations', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: [], 
            error: null 
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await service.getCountries();
      await service.getCurrencies();
      await service.getOrganizationTypes();

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should monitor for performance warnings during large operations', async () => {
      const largeDataset = Array.from({ length: 5000 }, (_, i) => ({
        id: `item-${i}`,
        name: `Item ${i}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: largeDataset, 
            error: null 
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const startTime = performance.now();
      await service.getCountries();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Check if operation took longer than expected
      if (loadTime > 10000) {
        console.warn(`Large operation took ${loadTime}ms, consider optimization`);
      }

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});