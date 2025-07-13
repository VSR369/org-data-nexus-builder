import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { waitFor } from '../utils/testUtils'
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD'
import { testCountries } from '../fixtures/masterDataFixtures'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock the SupabaseMasterDataService
vi.mock('@/services/SupabaseMasterDataService', () => ({
  SupabaseMasterDataService: vi.fn().mockImplementation(() => ({
    getItems: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
  })),
}))

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

describe('useMasterDataCRUD', () => {
  let queryClient: QueryClient
  let wrapper: React.FC<{ children: React.ReactNode }>

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
        },
      },
    })
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
    vi.clearAllMocks()
  })

  describe('loadItems', () => {
    it('should load items successfully', async () => {
      const mockService = {
        getItems: vi.fn().mockResolvedValue(testCountries),
        addItem: vi.fn(),
        updateItem: vi.fn(),
        deleteItem: vi.fn(),
      }
      
      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      ;(SupabaseMasterDataService as any).mockImplementation(() => mockService)

      const { result } = renderHook(() => useMasterDataCRUD('master_countries' as any), { wrapper })

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.items).toEqual(testCountries)
      expect(mockService.getItems).toHaveBeenCalledWith('master_countries')
    })

    it('should handle loading errors', async () => {
      const mockService = {
        getItems: vi.fn().mockRejectedValue(new Error('Network error')),
        addItem: vi.fn(),
        updateItem: vi.fn(),
        deleteItem: vi.fn(),
      }
      
      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      ;(SupabaseMasterDataService as any).mockImplementation(() => mockService)

      const { result } = renderHook(() => useMasterDataCRUD('master_countries' as any), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.items).toEqual([])
    })

    it('should set loading state correctly', async () => {
      const mockService = {
        getItems: vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(testCountries), 100))),
        addItem: vi.fn(),
        updateItem: vi.fn(),
        deleteItem: vi.fn(),
      }
      
      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      ;(SupabaseMasterDataService as any).mockImplementation(() => mockService)

      const { result } = renderHook(() => useMasterDataCRUD('master_countries' as any), { wrapper })

      // Should start loading
      expect(result.current.loading).toBe(true)

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.items).toEqual(testCountries)
    })
  })

  describe('addItem', () => {
    it('should add item successfully', async () => {
      const newItem = { name: 'New Country', code: 'NC' }
      const mockService = {
        getItems: vi.fn().mockResolvedValue(testCountries),
        addItem: vi.fn().mockResolvedValue(true),
        updateItem: vi.fn(),
        deleteItem: vi.fn(),
      }
      
      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      ;(SupabaseMasterDataService as any).mockImplementation(() => mockService)

      const { result } = renderHook(() => useMasterDataCRUD('master_countries' as any), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        const success = await result.current.addItem(newItem)
        expect(success).toBe(true)
      })

      expect(mockService.addItem).toHaveBeenCalledWith('master_countries', newItem)
    })

    it('should handle add errors', async () => {
      const newItem = { name: 'New Country', code: 'NC' }
      const mockService = {
        getItems: vi.fn().mockResolvedValue(testCountries),
        addItem: vi.fn().mockResolvedValue(false),
        updateItem: vi.fn(),
        deleteItem: vi.fn(),
      }
      
      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      ;(SupabaseMasterDataService as any).mockImplementation(() => mockService)

      const { result } = renderHook(() => useMasterDataCRUD('master_countries' as any), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        const success = await result.current.addItem(newItem)
        expect(success).toBe(false)
      })
    })
  })

  describe('updateItem', () => {
    it('should update item successfully', async () => {
      const itemId = '123'
      const updates = { name: 'Updated Country' }
      const mockService = {
        getItems: vi.fn().mockResolvedValue(testCountries),
        addItem: vi.fn(),
        updateItem: vi.fn().mockResolvedValue(true),
        deleteItem: vi.fn(),
      }
      
      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      ;(SupabaseMasterDataService as any).mockImplementation(() => mockService)

      const { result } = renderHook(() => useMasterDataCRUD('master_countries' as any), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        const success = await result.current.updateItem(itemId, updates)
        expect(success).toBe(true)
      })

      expect(mockService.updateItem).toHaveBeenCalledWith('master_countries', itemId, updates)
    })
  })

  describe('deleteItem', () => {
    it('should delete item successfully', async () => {
      const itemId = '123'
      const mockService = {
        getItems: vi.fn().mockResolvedValue(testCountries),
        addItem: vi.fn(),
        updateItem: vi.fn(),
        deleteItem: vi.fn().mockResolvedValue(true),
      }
      
      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      ;(SupabaseMasterDataService as any).mockImplementation(() => mockService)

      const { result } = renderHook(() => useMasterDataCRUD('master_countries' as any), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        const success = await result.current.deleteItem(itemId)
        expect(success).toBe(true)
      })

      expect(mockService.deleteItem).toHaveBeenCalledWith('master_countries', itemId)
    })
  })

  describe('refreshItems', () => {
    it('should refresh items from server', async () => {
      const mockService = {
        getItems: vi.fn().mockResolvedValue(testCountries),
        addItem: vi.fn(),
        updateItem: vi.fn(),
        deleteItem: vi.fn(),
      }
      
      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      ;(SupabaseMasterDataService as any).mockImplementation(() => mockService)

      const { result } = renderHook(() => useMasterDataCRUD('master_countries' as any), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Clear previous calls
      mockService.getItems.mockClear()

      await act(async () => {
        await result.current.refreshItems()
      })

      expect(mockService.getItems).toHaveBeenCalledWith('master_countries')
    })
  })
})