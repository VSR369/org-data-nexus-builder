import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseMasterDataService } from '@/services/SupabaseMasterDataService'
import { testCountries, testCurrencies, testOrganizationTypes } from '../fixtures/masterDataFixtures'

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    })),
  },
}))

describe('SupabaseMasterDataService', () => {
  let service: SupabaseMasterDataService
  let mockSupabaseClient: any

  beforeEach(() => {
    service = new SupabaseMasterDataService()
    mockSupabaseClient = (global as any).supabase
    vi.clearAllMocks()
  })

  describe('getItems', () => {
    it('should fetch items from the specified table', async () => {
      const mockData = testCountries
      mockSupabaseClient.from().select().order().mockResolvedValue({
        data: mockData,
        error: null,
      })

      const result = await service.getItems('master_countries')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('master_countries')
      expect(result).toEqual(mockData)
    })

    it('should handle errors gracefully', async () => {
      const mockError = { message: 'Database error' }
      mockSupabaseClient.from().select().order().mockResolvedValue({
        data: null,
        error: mockError,
      })

      const result = await service.getItems('master_countries')

      expect(result).toEqual([])
    })

    it('should order results by name ascending', async () => {
      mockSupabaseClient.from().select().order().mockResolvedValue({
        data: [],
        error: null,
      })

      await service.getItems('master_countries')

      expect(mockSupabaseClient.from().order).toHaveBeenCalledWith('name')
    })
  })

  describe('addItem', () => {
    it('should add a new item to the specified table', async () => {
      const newItem = { name: 'New Country', code: 'NC' }
      mockSupabaseClient.from().insert().single().mockResolvedValue({
        data: { ...newItem, id: '123' },
        error: null,
      })

      const result = await service.addItem('master_countries', newItem)

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('master_countries')
      expect(mockSupabaseClient.from().insert).toHaveBeenCalledWith(newItem)
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const newItem = { name: 'New Country', code: 'NC' }
      mockSupabaseClient.from().insert().single().mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      })

      const result = await service.addItem('master_countries', newItem)

      expect(result).toBe(false)
    })
  })

  describe('updateItem', () => {
    it('should update an existing item', async () => {
      const itemId = '123'
      const updates = { name: 'Updated Country' }
      mockSupabaseClient.from().update().eq().single().mockResolvedValue({
        data: { id: itemId, ...updates },
        error: null,
      })

      const result = await service.updateItem('master_countries', itemId, updates)

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('master_countries')
      expect(mockSupabaseClient.from().update).toHaveBeenCalledWith(updates)
      expect(mockSupabaseClient.from().eq).toHaveBeenCalledWith('id', itemId)
      expect(result).toBe(true)
    })

    it('should return false on update error', async () => {
      const itemId = '123'
      const updates = { name: 'Updated Country' }
      mockSupabaseClient.from().update().eq().single().mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })

      const result = await service.updateItem('master_countries', itemId, updates)

      expect(result).toBe(false)
    })
  })

  describe('deleteItem', () => {
    it('should delete an item by id', async () => {
      const itemId = '123'
      mockSupabaseClient.from().delete().eq().mockResolvedValue({
        data: null,
        error: null,
      })

      const result = await service.deleteItem('master_countries', itemId)

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('master_countries')
      expect(mockSupabaseClient.from().delete).toHaveBeenCalled()
      expect(mockSupabaseClient.from().eq).toHaveBeenCalledWith('id', itemId)
      expect(result).toBe(true)
    })

    it('should return false on delete error', async () => {
      const itemId = '123'
      mockSupabaseClient.from().delete().eq().mockResolvedValue({
        data: null,
        error: { message: 'Delete failed' },
      })

      const result = await service.deleteItem('master_countries', itemId)

      expect(result).toBe(false)
    })
  })

  describe('saveItems', () => {
    it('should replace all items in the table', async () => {
      const items = testCountries
      
      // Mock delete all
      mockSupabaseClient.from().delete().neq().mockResolvedValue({
        data: null,
        error: null,
      })
      
      // Mock insert new items
      mockSupabaseClient.from().insert().mockResolvedValue({
        data: items,
        error: null,
      })

      const result = await service.saveItems('master_countries', items)

      expect(result).toBe(true)
    })

    it('should handle save errors gracefully', async () => {
      const items = testCountries
      
      // Mock delete success but insert failure
      mockSupabaseClient.from().delete().neq().mockResolvedValue({
        data: null,
        error: null,
      })
      
      mockSupabaseClient.from().insert().mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      })

      const result = await service.saveItems('master_countries', items)

      expect(result).toBe(false)
    })
  })

  describe('Specific master data methods', () => {
    describe('getCountries', () => {
      it('should fetch countries', async () => {
        const spy = vi.spyOn(service, 'getItems').mockResolvedValue(testCountries)

        const result = await service.getCountries()

        expect(spy).toHaveBeenCalledWith('master_countries')
        expect(result).toEqual(testCountries)
      })
    })

    describe('getCurrencies', () => {
      it('should fetch currencies', async () => {
        const spy = vi.spyOn(service, 'getItems').mockResolvedValue(testCurrencies)

        const result = await service.getCurrencies()

        expect(spy).toHaveBeenCalledWith('master_currencies')
        expect(result).toEqual(testCurrencies)
      })
    })

    describe('getOrganizationTypes', () => {
      it('should fetch organization types', async () => {
        const spy = vi.spyOn(service, 'getItems').mockResolvedValue(testOrganizationTypes)

        const result = await service.getOrganizationTypes()

        expect(spy).toHaveBeenCalledWith('master_organization_types')
        expect(result).toEqual(testOrganizationTypes)
      })
    })

    describe('saveCountries', () => {
      it('should save countries', async () => {
        const spy = vi.spyOn(service, 'saveItems').mockResolvedValue(true)

        const result = await service.saveCountries(testCountries)

        expect(spy).toHaveBeenCalledWith('master_countries', testCountries)
        expect(result).toBe(true)
      })
    })
  })
})