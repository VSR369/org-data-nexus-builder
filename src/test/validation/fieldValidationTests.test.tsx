import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/testUtils'

// Mock validation functions
const validateRequiredFields = (data: Record<string, any>, requiredFields: string[]) => {
  const errors: string[] = []
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`)
    }
  }
  
  return errors
}

const validateDataTypes = (data: Record<string, any>, fieldTypes: Record<string, string>) => {
  const errors: string[] = []
  
  for (const [field, expectedType] of Object.entries(fieldTypes)) {
    const value = data[field]
    if (value === '' || value === null || value === undefined) continue
    
    switch (expectedType) {
      case 'number':
        if (isNaN(Number(value))) {
          errors.push(`${field} must be a valid number`)
        }
        break
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email address`)
        }
        break
      case 'url':
        try {
          new URL(value)
        } catch {
          errors.push(`${field} must be a valid URL`)
        }
        break
      case 'phone':
        if (!/^[+]?[\d\s\-\(\)]+$/.test(value)) {
          errors.push(`${field} must be a valid phone number`)
        }
        break
    }
  }
  
  return errors
}

const validateFieldLengths = (data: Record<string, any>, maxLengths: Record<string, number>) => {
  const errors: string[] = []
  
  for (const [field, maxLength] of Object.entries(maxLengths)) {
    const value = data[field]
    if (value && typeof value === 'string' && value.length > maxLength) {
      errors.push(`${field} must be ${maxLength} characters or less`)
    }
  }
  
  return errors
}

const validateBusinessRules = (data: Record<string, any>, tableName: string) => {
  const errors: string[] = []
  
  switch (tableName) {
    case 'master_currencies':
      // Currency codes should be 3 characters
      if (data.code && data.code.length !== 3) {
        errors.push('Currency code must be exactly 3 characters')
      }
      // Currency codes should be uppercase
      if (data.code && data.code !== data.code.toUpperCase()) {
        errors.push('Currency code must be uppercase')
      }
      break
      
    case 'master_countries':
      // Country codes should be 2 characters
      if (data.code && data.code.length !== 2) {
        errors.push('Country code must be exactly 2 characters')
      }
      break
      
    case 'master_seeker_membership_fees':
      // At least one fee amount should be provided
      if (!data.monthly_amount && !data.quarterly_amount && !data.half_yearly_amount && !data.annual_amount) {
        errors.push('At least one fee amount must be provided')
      }
      // Negative amounts should not be allowed for fees
      const feeFields = ['monthly_amount', 'quarterly_amount', 'half_yearly_amount', 'annual_amount']
      for (const field of feeFields) {
        if (data[field] && Number(data[field]) < 0) {
          errors.push(`${field} cannot be negative`)
        }
      }
      break
      
    case 'master_capability_levels':
      // Min score should be less than max score
      if (data.min_score && data.max_score && Number(data.min_score) >= Number(data.max_score)) {
        errors.push('Minimum score must be less than maximum score')
      }
      // Scores should be non-negative
      if (data.min_score && Number(data.min_score) < 0) {
        errors.push('Minimum score cannot be negative')
      }
      if (data.max_score && Number(data.max_score) < 0) {
        errors.push('Maximum score cannot be negative')
      }
      break
  }
  
  return errors
}

// Mock comprehensive validation component
const ValidationTestForm = ({ 
  tableName, 
  validationRules 
}: { 
  tableName: string
  validationRules: {
    required: string[]
    types: Record<string, string>
    maxLengths: Record<string, number>
  }
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}
    
    for (const [key, value] of formData.entries()) {
      data[key] = value
    }
    
    // Run all validations
    const allErrors = [
      ...validateRequiredFields(data, validationRules.required),
      ...validateDataTypes(data, validationRules.types),
      ...validateFieldLengths(data, validationRules.maxLengths),
      ...validateBusinessRules(data, tableName)
    ]
    
    // Display results
    const errorContainer = document.querySelector('[data-testid="validation-results"]')
    const successContainer = document.querySelector('[data-testid="success-message"]')
    
    if (allErrors.length > 0) {
      if (errorContainer) {
        errorContainer.textContent = allErrors.join('; ')
        errorContainer.classList.remove('hidden')
      }
      if (successContainer) {
        successContainer.classList.add('hidden')
      }
    } else {
      if (errorContainer) {
        errorContainer.textContent = ''
        errorContainer.classList.add('hidden')
      }
      if (successContainer) {
        successContainer.textContent = 'Validation passed successfully'
        successContainer.classList.remove('hidden')
      }
    }
  }
  
  return (
    <div data-testid="validation-test-form">
      <form onSubmit={handleSubmit}>
        <div 
          data-testid="validation-results" 
          className="text-red-600 mb-4 hidden"
          role="alert"
        />
        <div 
          data-testid="success-message" 
          className="text-green-600 mb-4 hidden"
        />
        
        {/* Dynamic form fields based on table */}
        {tableName === 'master_countries' && (
          <>
            <input name="name" placeholder="Country Name" data-testid="name-field" />
            <input name="code" placeholder="Country Code" data-testid="code-field" />
            <textarea name="description" placeholder="Description" data-testid="description-field" />
          </>
        )}
        
        {tableName === 'master_currencies' && (
          <>
            <input name="name" placeholder="Currency Name" data-testid="name-field" />
            <input name="code" placeholder="Currency Code" data-testid="code-field" />
            <input name="symbol" placeholder="Symbol" data-testid="symbol-field" />
            <input name="country" placeholder="Country" data-testid="country-field" />
          </>
        )}
        
        {tableName === 'master_seeker_membership_fees' && (
          <>
            <input name="country" placeholder="Country" data-testid="country-field" />
            <input name="organization_type" placeholder="Organization Type" data-testid="org-type-field" />
            <input name="entity_type" placeholder="Entity Type" data-testid="entity-type-field" />
            <input name="monthly_amount" type="number" placeholder="Monthly Amount" data-testid="monthly-amount-field" />
            <input name="quarterly_amount" type="number" placeholder="Quarterly Amount" data-testid="quarterly-amount-field" />
            <input name="annual_amount" type="number" placeholder="Annual Amount" data-testid="annual-amount-field" />
          </>
        )}
        
        {tableName === 'master_capability_levels' && (
          <>
            <input name="name" placeholder="Level Name" data-testid="name-field" />
            <input name="min_score" type="number" placeholder="Min Score" data-testid="min-score-field" />
            <input name="max_score" type="number" placeholder="Max Score" data-testid="max-score-field" />
            <input name="color" placeholder="Color" data-testid="color-field" />
          </>
        )}
        
        {tableName === 'master_communication_types' && (
          <>
            <input name="name" placeholder="Communication Type" data-testid="name-field" />
            <input name="link" placeholder="Link URL" data-testid="link-field" />
            <textarea name="description" placeholder="Description" data-testid="description-field" />
          </>
        )}
        
        <button type="submit" data-testid="validate-button">
          Validate Data
        </button>
      </form>
    </div>
  )
}

describe('Comprehensive Field Validation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Country Master Data Validation', () => {
    const countryValidationRules = {
      required: ['name'],
      types: {},
      maxLengths: { name: 100, description: 255 }
    }

    it('should validate required country name', async () => {
      render(<ValidationTestForm tableName="master_countries" validationRules={countryValidationRules} />)
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('name is required')
      })
    })

    it('should validate country code length', async () => {
      render(<ValidationTestForm tableName="master_countries" validationRules={countryValidationRules} />)
      
      const nameField = screen.getByTestId('name-field')
      const codeField = screen.getByTestId('code-field')
      
      fireEvent.change(nameField, { target: { value: 'United States' } })
      fireEvent.change(codeField, { target: { value: 'USA' } }) // Should be 2 chars
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('Country code must be exactly 2 characters')
      })
    })

    it('should accept valid country data', async () => {
      render(<ValidationTestForm tableName="master_countries" validationRules={countryValidationRules} />)
      
      const nameField = screen.getByTestId('name-field')
      const codeField = screen.getByTestId('code-field')
      
      fireEvent.change(nameField, { target: { value: 'United States' } })
      fireEvent.change(codeField, { target: { value: 'US' } })
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const successDiv = screen.getByTestId('success-message')
        expect(successDiv.textContent).toContain('Validation passed successfully')
      })
    })
  })

  describe('Currency Master Data Validation', () => {
    const currencyValidationRules = {
      required: ['name', 'code'],
      types: {},
      maxLengths: { name: 100, symbol: 5 }
    }

    it('should validate currency code format', async () => {
      render(<ValidationTestForm tableName="master_currencies" validationRules={currencyValidationRules} />)
      
      const nameField = screen.getByTestId('name-field')
      const codeField = screen.getByTestId('code-field')
      
      fireEvent.change(nameField, { target: { value: 'US Dollar' } })
      fireEvent.change(codeField, { target: { value: 'usd' } }) // Should be uppercase
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('Currency code must be uppercase')
      })
    })

    it('should validate currency code length', async () => {
      render(<ValidationTestForm tableName="master_currencies" validationRules={currencyValidationRules} />)
      
      const nameField = screen.getByTestId('name-field')
      const codeField = screen.getByTestId('code-field')
      
      fireEvent.change(nameField, { target: { value: 'US Dollar' } })
      fireEvent.change(codeField, { target: { value: 'USDD' } }) // Should be 3 chars
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('Currency code must be exactly 3 characters')
      })
    })
  })

  describe('Membership Fees Validation', () => {
    const feesValidationRules = {
      required: ['country', 'organization_type', 'entity_type'],
      types: { 
        monthly_amount: 'number', 
        quarterly_amount: 'number', 
        annual_amount: 'number' 
      },
      maxLengths: {}
    }

    it('should require at least one fee amount', async () => {
      render(<ValidationTestForm tableName="master_seeker_membership_fees" validationRules={feesValidationRules} />)
      
      const countryField = screen.getByTestId('country-field')
      const orgTypeField = screen.getByTestId('org-type-field')
      const entityTypeField = screen.getByTestId('entity-type-field')
      
      fireEvent.change(countryField, { target: { value: 'United States' } })
      fireEvent.change(orgTypeField, { target: { value: 'Corporation' } })
      fireEvent.change(entityTypeField, { target: { value: 'Business' } })
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('At least one fee amount must be provided')
      })
    })

    it('should reject negative fee amounts', async () => {
      render(<ValidationTestForm tableName="master_seeker_membership_fees" validationRules={feesValidationRules} />)
      
      const countryField = screen.getByTestId('country-field')
      const orgTypeField = screen.getByTestId('org-type-field')
      const entityTypeField = screen.getByTestId('entity-type-field')
      const monthlyAmountField = screen.getByTestId('monthly-amount-field')
      
      fireEvent.change(countryField, { target: { value: 'United States' } })
      fireEvent.change(orgTypeField, { target: { value: 'Corporation' } })
      fireEvent.change(entityTypeField, { target: { value: 'Business' } })
      fireEvent.change(monthlyAmountField, { target: { value: '-50' } })
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('monthly_amount cannot be negative')
      })
    })
  })

  describe('Capability Levels Validation', () => {
    const capabilityValidationRules = {
      required: ['name', 'min_score', 'max_score', 'color'],
      types: { min_score: 'number', max_score: 'number' },
      maxLengths: { name: 100 }
    }

    it('should validate score range logic', async () => {
      render(<ValidationTestForm tableName="master_capability_levels" validationRules={capabilityValidationRules} />)
      
      const nameField = screen.getByTestId('name-field')
      const minScoreField = screen.getByTestId('min-score-field')
      const maxScoreField = screen.getByTestId('max-score-field')
      const colorField = screen.getByTestId('color-field')
      
      fireEvent.change(nameField, { target: { value: 'Beginner' } })
      fireEvent.change(minScoreField, { target: { value: '80' } })
      fireEvent.change(maxScoreField, { target: { value: '60' } }) // Min > Max
      fireEvent.change(colorField, { target: { value: '#FF0000' } })
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('Minimum score must be less than maximum score')
      })
    })

    it('should reject negative scores', async () => {
      render(<ValidationTestForm tableName="master_capability_levels" validationRules={capabilityValidationRules} />)
      
      const nameField = screen.getByTestId('name-field')
      const minScoreField = screen.getByTestId('min-score-field')
      const maxScoreField = screen.getByTestId('max-score-field')
      const colorField = screen.getByTestId('color-field')
      
      fireEvent.change(nameField, { target: { value: 'Beginner' } })
      fireEvent.change(minScoreField, { target: { value: '-10' } })
      fireEvent.change(maxScoreField, { target: { value: '50' } })
      fireEvent.change(colorField, { target: { value: '#FF0000' } })
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('Minimum score cannot be negative')
      })
    })
  })

  describe('Communication Types URL Validation', () => {
    const commValidationRules = {
      required: ['name', 'link'],
      types: { link: 'url' },
      maxLengths: { name: 100, description: 255 }
    }

    it('should validate URL format', async () => {
      render(<ValidationTestForm tableName="master_communication_types" validationRules={commValidationRules} />)
      
      const nameField = screen.getByTestId('name-field')
      const linkField = screen.getByTestId('link-field')
      
      fireEvent.change(nameField, { target: { value: 'Email' } })
      fireEvent.change(linkField, { target: { value: 'not-a-valid-url' } })
      
      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-results')
        expect(errorDiv.textContent).toContain('link must be a valid URL')
      })
    })

    it('should accept valid URLs', async () => {
      const validUrls = [
        'https://example.com',
        'http://localhost:3000',
        'mailto:test@example.com',
        'ftp://files.example.com'
      ]
      
      for (const url of validUrls) {
        render(<ValidationTestForm tableName="master_communication_types" validationRules={commValidationRules} />)
        
        const nameField = screen.getByTestId('name-field')
        const linkField = screen.getByTestId('link-field')
        
        fireEvent.change(nameField, { target: { value: 'Test Link' } })
        fireEvent.change(linkField, { target: { value: url } })
        
        const validateButton = screen.getByTestId('validate-button')
        fireEvent.click(validateButton)
        
        await waitFor(() => {
          const successDiv = screen.getByTestId('success-message')
          expect(successDiv.textContent).toContain('Validation passed successfully')
        })
      }
    })
  })
})