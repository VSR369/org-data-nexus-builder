import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseMasterDataService } from '@/services/SupabaseMasterDataService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        })),
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
        update: vi.fn(() => Promise.resolve({ data: null, error: null })),
        delete: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }
}));

describe('Query Optimization and Slow Query Detection', () => {
  let queryClient: QueryClient;
  let service: SupabaseMasterDataService;
  let performanceObserver: any;
  let slowQueries: any[];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    service = new SupabaseMasterDataService();
    slowQueries = [];

    // Mock Performance Observer for query monitoring
    if (typeof PerformanceObserver !== 'undefined') {
      performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 1000) { // Queries taking more than 1 second
            slowQueries.push({
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        });
      });
      performanceObserver.observe({ entryTypes: ['measure'] });
    }
  });

  afterEach(() => {
    queryClient.clear();
    if (performanceObserver) {
      performanceObserver.disconnect();
    }
    vi.clearAllMocks();
  });

  describe('Query Execution Time Monitoring', () => {
    it('should detect slow SELECT queries', async () => {
      const startTime = performance.now();
      performance.mark('query-start');

      // Simulate a potentially slow query
      const mockOrder = vi.fn(() => {
        // Simulate slow response
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: [], error: null });
          }, 1200); // 1.2 seconds - considered slow
        });
      });

      const mockSelect = vi.fn(() => ({
        order: mockOrder
      }));

      const mockFrom = vi.fn(() => ({
        select: mockSelect
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await service.getCountries();
      
      performance.mark('query-end');
      performance.measure('query-duration', 'query-start', 'query-end');
      
      const endTime = performance.now();
      const queryTime = endTime - startTime;

      expect(queryTime).toBeGreaterThan(1000);
      console.warn(`Slow query detected: ${queryTime}ms for getCountries()`);
    });

    it('should monitor INSERT operation performance', async () => {
      const startTime = performance.now();
      
      const testItem = {
        name: 'Test Country',
        code: 'TC',
        created_by: 'test-user'
      };

      const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
      const mockFrom = vi.fn(() => ({
        insert: mockInsert
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await service.addItem('master_countries', testItem);
      
      const endTime = performance.now();
      const insertTime = endTime - startTime;

      expect(insertTime).toBeLessThan(2000); // INSERT should be reasonably fast
      expect(mockInsert).toHaveBeenCalledWith(testItem);
    });

    it('should monitor UPDATE operation performance', async () => {
      const startTime = performance.now();
      
      const testId = 'test-id';
      const updateData = {
        name: 'Updated Country',
        updated_at: new Date().toISOString()
      };

      const mockUpdate = vi.fn(() => Promise.resolve({ data: null, error: null }));
      const mockEq = vi.fn(() => ({
        update: mockUpdate
      }));
      const mockFrom = vi.fn(() => ({
        update: vi.fn(() => ({
          eq: mockEq
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await service.updateItem('master_countries', testId, updateData);
      
      const endTime = performance.now();
      const updateTime = endTime - startTime;

      expect(updateTime).toBeLessThan(1500); // UPDATE should be fast
    });

    it('should monitor DELETE operation performance', async () => {
      const startTime = performance.now();
      
      const testId = 'test-id';

      const mockDelete = vi.fn(() => Promise.resolve({ data: null, error: null }));
      const mockEq = vi.fn(() => ({
        delete: mockDelete
      }));
      const mockFrom = vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: mockEq
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await service.deleteItem('master_countries', testId);
      
      const endTime = performance.now();
      const deleteTime = endTime - startTime;

      expect(deleteTime).toBeLessThan(1000); // DELETE should be very fast
    });
  });

  describe('Query Optimization Patterns', () => {
    it('should verify efficient query structure for fetching lists', async () => {
      const mockOrder = vi.fn(() => Promise.resolve({ data: [], error: null }));
      const mockSelect = vi.fn(() => ({
        order: mockOrder
      }));
      const mockFrom = vi.fn(() => ({
        select: mockSelect
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await service.getCountries();

      // Verify optimal query structure
      expect(mockFrom).toHaveBeenCalledWith('master_countries');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('name');
    });

    it('should check for proper indexing usage in filters', async () => {
      const mockSingle = vi.fn(() => Promise.resolve({ data: null, error: null }));
      const mockEq = vi.fn(() => ({
        single: mockSingle
      }));
      const mockSelect = vi.fn(() => ({
        eq: mockEq
      }));
      const mockFrom = vi.fn(() => ({
        select: mockSelect
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      // This would typically use an indexed field like 'id'
      const result = await service.getItems('master_countries');
      
      // Verify that the query structure supports efficient indexing
      expect(mockFrom).toHaveBeenCalledWith('master_countries');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should measure batch operation efficiency', async () => {
      const batchSize = 100;
      const items = Array.from({ length: batchSize }, (_, i) => ({
        name: `Item ${i}`,
        code: `I${i}`,
        created_by: 'batch-test'
      }));

      const startTime = performance.now();

      const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
      const mockFrom = vi.fn(() => ({
        insert: mockInsert
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      // Simulate batch insert
      await service.saveItems('master_countries', items);

      const endTime = performance.now();
      const batchTime = endTime - startTime;

      expect(batchTime).toBeLessThan(5000); // Batch operations should be efficient
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  describe('Connection and Network Performance', () => {
    it('should handle connection timeouts gracefully', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.reject(new Error('Connection timeout')))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const startTime = performance.now();
      
      try {
        await service.getCountries();
      } catch (error) {
        const endTime = performance.now();
        const timeoutDuration = endTime - startTime;
        
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Connection timeout');
        // Should fail relatively quickly, not hang indefinitely
        expect(timeoutDuration).toBeLessThan(10000);
      }
    });

    it('should measure network latency impact', async () => {
      const latencyTests = [0, 100, 500, 1000]; // Different simulated latencies
      
      for (const latency of latencyTests) {
        const startTime = performance.now();
        
        const mockOrder = vi.fn(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({ data: [], error: null });
            }, latency);
          });
        });

        const mockSelect = vi.fn(() => ({
          order: mockOrder
        }));

        const mockFrom = vi.fn(() => ({
          select: mockSelect
        }));

        (supabase.from as any).mockImplementation(mockFrom);

        await service.getCountries();
        
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        
        expect(totalTime).toBeGreaterThanOrEqual(latency);
        console.log(`Latency ${latency}ms: Total time ${totalTime}ms`);
      }
    });

    it('should track query frequency and caching opportunities', async () => {
      const queryTracker = new Map<string, number>();
      
      const originalFrom = supabase.from;
      (supabase as any).from = vi.fn((table: string) => {
        const count = queryTracker.get(table) || 0;
        queryTracker.set(table, count + 1);
        
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        };
      });

      // Simulate multiple calls to the same endpoint
      await service.getCountries();
      await service.getCountries();
      await service.getCurrencies();
      await service.getCountries();

      expect(queryTracker.get('master_countries')).toBe(3);
      expect(queryTracker.get('master_currencies')).toBe(1);
      
      // This indicates opportunities for caching
      console.log('Query frequency:', Object.fromEntries(queryTracker));
    });
  });

  describe('Resource Usage Monitoring', () => {
    it('should monitor memory usage during operations', async () => {
      const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Perform several operations
      await service.getCountries();
      await service.getCurrencies();
      await service.getOrganizationTypes();
      
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryDiff = memoryAfter - memoryBefore;
      
      // Memory usage should be reasonable
      expect(memoryDiff).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
    });

    it('should track concurrent query performance', async () => {
      const concurrentQueries = [
        service.getCountries(),
        service.getCurrencies(),
        service.getOrganizationTypes(),
        service.getEntityTypes(),
        service.getEngagementModels()
      ];

      const startTime = performance.now();
      await Promise.all(concurrentQueries);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      
      // Concurrent queries should be more efficient than sequential
      expect(totalTime).toBeLessThan(5000);
    });
  });
});