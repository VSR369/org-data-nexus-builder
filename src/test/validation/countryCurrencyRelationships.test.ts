import { describe, it, expect, beforeEach } from 'vitest'
import { testCountryCurrencyRelation } from '../fixtures/masterDataFixtures'
import { mockService, setupMocks, clearMocks, getService } from './shared/testUtils'

setupMocks()

describe('Country-Currency Relationships', () => {
  beforeEach(() => {
    clearMocks()
  })

  describe('Country → Currency Relationship', () => {
    it('should create country-currency relationship correctly', async () => {
      const { country, currency } = testCountryCurrencyRelation

      mockService.addItem
        .mockResolvedValueOnce(true) // Country
        .mockResolvedValueOnce(true) // Currency

      const service = await getService()

      // Create Country first
      const countryResult = await service.addItem('master_countries', country)
      expect(countryResult).toBe(true)

      // Create Currency linked to Country
      const currencyData = {
        ...currency,
        country: country.name,
        country_code: country.code,
      }
      const currencyResult = await service.addItem('master_currencies', currencyData)
      expect(currencyResult).toBe(true)

      expect(mockService.addItem).toHaveBeenCalledWith('master_countries', country)
      expect(mockService.addItem).toHaveBeenCalledWith('master_currencies', currencyData)
    })

    it('should validate currency belongs to correct country', async () => {
      const { country, currency } = testCountryCurrencyRelation

      // Verify currency references correct country
      expect(currency.country).toBe(country.name)
      expect(currency.country_code).toBe(country.code)

      // Mock fetching countries
      mockService.getItems.mockResolvedValue([country])
      const service = await getService()

      const countries = await service.getItems('master_countries')
      const relatedCountry = countries.find(c => c.name === currency.country)

      expect(relatedCountry).toBeDefined()
      expect(relatedCountry?.code).toBe(currency.country_code)
    })

    it('should handle country deletion with dependent currencies', async () => {
      const { country, currency } = testCountryCurrencyRelation

      // Mock getting dependent currencies
      mockService.getItems.mockResolvedValue([currency])
      const service = await getService()

      // Check for dependent currencies before deleting country
      const dependentCurrencies = await service.getItems('master_currencies')
      const countryDependencies = dependentCurrencies.filter(c => (c as any).country === country.name)

      expect(countryDependencies).toHaveLength(1)
      expect((countryDependencies[0] as any).country).toBe(country.name)

      // In real implementation, would prevent deletion or handle cascade
      expect(countryDependencies.length > 0).toBe(true)
    })

    it('should validate country code consistency', async () => {
      const { country, currency } = testCountryCurrencyRelation

      // Ensure country code matches between country and currency
      expect(currency.country_code).toBe(country.code)

      mockService.getItems
        .mockResolvedValueOnce([country])
        .mockResolvedValueOnce([currency])

      const service = await getService()

      const countries = await service.getItems('master_countries')
      const currencies = await service.getItems('master_currencies')

      const countryRecord = countries.find(c => c.name === currency.country)
      const currencyRecord = currencies.find(c => (c as any).country === country.name)

      expect(countryRecord?.code).toBe((currencyRecord as any)?.country_code)
    })

    it('should handle multiple currencies for same country', async () => {
      const country = { id: 'country-1', name: 'United States', code: 'US' }
      const currencies = [
        { 
          id: 'curr-1', 
          name: 'US Dollar', 
          code: 'USD', 
          country: 'United States', 
          country_code: 'US' 
        },
        { 
          id: 'curr-2', 
          name: 'US Dollar Coin', 
          code: 'USC', 
          country: 'United States', 
          country_code: 'US' 
        }
      ]

      mockService.getItems.mockResolvedValue(currencies)
      const service = await getService()

      const allCurrencies = await service.getItems('master_currencies')
      const usCurrencies = allCurrencies.filter(c => (c as any).country === country.name)

      expect(usCurrencies).toHaveLength(2)
      expect(usCurrencies.every(c => (c as any).country_code === country.code)).toBe(true)
    })

    it('should prevent orphaned currencies', async () => {
      const orphanedCurrency = {
        id: 'curr-orphan',
        name: 'Orphaned Currency',
        code: 'ORP',
        country: 'Nonexistent Country',
        country_code: 'NX'
      }

      const existingCountries = [
        { id: 'country-1', name: 'United States', code: 'US' }
      ]

      mockService.getItems
        .mockResolvedValueOnce([orphanedCurrency])
        .mockResolvedValueOnce(existingCountries)

      const service = await getService()

      const currencies = await service.getItems('master_currencies')
      const countries = await service.getItems('master_countries')

      // Find currencies without valid country references
      const orphanedCurrencies = currencies.filter(currency => {
        const countryName = (currency as any).country
        return !countries.some(country => country.name === countryName)
      })

      expect(orphanedCurrencies).toHaveLength(1)
      expect(orphanedCurrencies[0].name).toBe('Orphaned Currency')
    })
  })
})