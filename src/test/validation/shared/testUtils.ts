import { describe, it, expect, vi, beforeEach } from 'vitest'

// Shared mock service for all relationship tests
export const mockService = {
  getItems: vi.fn(),
  addItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
}

// Shared mock setup
export const setupMocks = () => {
  vi.mock('@/services/SupabaseMasterDataService', () => ({
    SupabaseMasterDataService: vi.fn().mockImplementation(() => mockService),
  }))

  vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
      toast: vi.fn(),
    }),
  }))
}

// Shared test utilities
export const clearMocks = () => {
  vi.clearAllMocks()
}

export const getService = async () => {
  const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
  return new SupabaseMasterDataService()
}