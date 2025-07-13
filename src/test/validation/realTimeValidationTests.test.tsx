import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/testUtils'

// Mock real-time validation component
const RealTimeValidationForm = ({ tableName }: { tableName: string }) => {
  const validateField = (fieldName: string, value: string, fieldType?: string) => {
    const errors: string[] = []
    
    // Real-time validation rules
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errors.push('Name is required')
        } else if (value.length > 100) {
          errors.push('Name must be 100 characters or less')
        }
        break
        
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push('Invalid email format')
        }
        break
        
      case 'code':
        if (tableName === 'master_countries' && value && value.length !== 2) {
          errors.push('Country code must be 2 characters')
        }
        if (tableName === 'master_currencies') {
          if (value && value.length !== 3) {
            errors.push('Currency code must be 3 characters')
          }
          if (value && value !== value.toUpperCase()) {
            errors.push('Currency code must be uppercase')
          }
        }
        break
        
      case 'amount':
        if (value && isNaN(Number(value))) {
          errors.push('Amount must be a valid number')
        }
        if (value && Number(value) < 0) {
          errors.push('Amount cannot be negative')
        }
        break
        
      case 'min_score':
        if (value && isNaN(Number(value))) {
          errors.push('Min score must be a number')
        }
        if (value && Number(value) < 0) {
          errors.push('Min score cannot be negative')
        }
        break
        
      case 'max_score':
        if (value && isNaN(Number(value))) {
          errors.push('Max score must be a number')
        }
        if (value && Number(value) < 0) {
          errors.push('Max score cannot be negative')
        }
        break
    }
    
    return errors
  }
  
  const handleFieldChange = (fieldName: string, value: string) => {
    const errors = validateField(fieldName, value)
    const errorElement = document.querySelector(`[data-testid="${fieldName}-error"]`)
    
    if (errorElement) {
      if (errors.length > 0) {
        errorElement.textContent = errors.join(', ')
        errorElement.classList.remove('hidden')
      } else {
        errorElement.textContent = ''
        errorElement.classList.add('hidden')
      }
    }
  }
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    const allErrors: string[] = []
    
    // Collect all form data and validate
    for (const [key, value] of formData.entries()) {
      data[key] = value as string
      const fieldErrors = validateField(key, value as string)
      allErrors.push(...fieldErrors)
    }
    
    // Cross-field validation
    if (data.min_score && data.max_score) {
      const minScore = Number(data.min_score)
      const maxScore = Number(data.max_score)
      if (!isNaN(minScore) && !isNaN(maxScore) && minScore >= maxScore) {
        allErrors.push('Min score must be less than max score')
      }
    }
    
    // Display form-level results
    const formErrorElement = document.querySelector('[data-testid="form-errors"]')
    const successElement = document.querySelector('[data-testid="form-success"]')
    
    if (allErrors.length > 0) {
      if (formErrorElement) {
        formErrorElement.textContent = allErrors.join('; ')
        formErrorElement.classList.remove('hidden')
      }
      if (successElement) {
        successElement.classList.add('hidden')
      }
    } else {
      if (formErrorElement) {
        formErrorElement.classList.add('hidden')
      }
      if (successElement) {
        successElement.textContent = 'Form submitted successfully'
        successElement.classList.remove('hidden')
      }
    }
  }
  
  return (
    <form onSubmit={handleFormSubmit} data-testid="realtime-validation-form">
      <div data-testid="form-errors" className="text-red-600 mb-4 hidden" role="alert" />
      <div data-testid="form-success" className="text-green-600 mb-4 hidden" />
      
      {/* Name field */}
      <div className="mb-4">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          data-testid="name-field"
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className="border rounded px-2 py-1"
        />
        <div data-testid="name-error" className="text-red-500 text-sm hidden" />
      </div>
      
      {/* Email field */}
      <div className="mb-4">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          data-testid="email-field"
          onChange={(e) => handleFieldChange('email', e.target.value)}
          className="border rounded px-2 py-1"
        />
        <div data-testid="email-error" className="text-red-500 text-sm hidden" />
      </div>
      
      {/* Code field */}
      <div className="mb-4">
        <label htmlFor="code">Code:</label>
        <input
          type="text"
          id="code"
          name="code"
          data-testid="code-field"
          onChange={(e) => handleFieldChange('code', e.target.value)}
          className="border rounded px-2 py-1"
        />
        <div data-testid="code-error" className="text-red-500 text-sm hidden" />
      </div>
      
      {/* Amount field */}
      {tableName.includes('fee') && (
        <div className="mb-4">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            data-testid="amount-field"
            onChange={(e) => handleFieldChange('amount', e.target.value)}
            className="border rounded px-2 py-1"
          />
          <div data-testid="amount-error" className="text-red-500 text-sm hidden" />
        </div>
      )}
      
      {/* Score fields for capability levels */}
      {tableName === 'master_capability_levels' && (
        <>
          <div className="mb-4">
            <label htmlFor="min_score">Min Score:</label>
            <input
              type="number"
              id="min_score"
              name="min_score"
              data-testid="min-score-field"
              onChange={(e) => handleFieldChange('min_score', e.target.value)}
              className="border rounded px-2 py-1"
            />
            <div data-testid="min_score-error" className="text-red-500 text-sm hidden" />
          </div>
          
          <div className="mb-4">
            <label htmlFor="max_score">Max Score:</label>
            <input
              type="number"
              id="max_score"
              name="max_score"
              data-testid="max-score-field"
              onChange={(e) => handleFieldChange('max_score', e.target.value)}
              className="border rounded px-2 py-1"
            />
            <div data-testid="max_score-error" className="text-red-500 text-sm hidden" />
          </div>
        </>
      )}
      
      <button type="submit" data-testid="submit-button" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  )
}

describe('Real-Time Validation and Error Display Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Real-Time Field Validation', () => {
    it('should show validation errors immediately on field blur', async () => {
      render(<RealTimeValidationForm tableName="master_countries" />)
      
      const nameField = screen.getByTestId('name-field')
      
      // Type and then clear the field
      fireEvent.change(nameField, { target: { value: 'Test' } })
      fireEvent.change(nameField, { target: { value: '' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('name-error')
        expect(errorDiv.textContent).toContain('Name is required')
        expect(errorDiv).not.toHaveClass('hidden')
      })
    })

    it('should clear validation errors when field becomes valid', async () => {
      render(<RealTimeValidationForm tableName="master_countries" />)
      
      const nameField = screen.getByTestId('name-field')
      
      // First trigger error
      fireEvent.change(nameField, { target: { value: '' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('name-error')
        expect(errorDiv).not.toHaveClass('hidden')
      })
      
      // Then fix it
      fireEvent.change(nameField, { target: { value: 'Valid Name' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('name-error')
        expect(errorDiv.textContent).toBe('')
        expect(errorDiv).toHaveClass('hidden')
      })
    })

    it('should validate email format in real-time', async () => {
      render(<RealTimeValidationForm tableName="master_contacts" />)
      
      const emailField = screen.getByTestId('email-field')
      
      // Invalid email
      fireEvent.change(emailField, { target: { value: 'invalid-email' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('email-error')
        expect(errorDiv.textContent).toContain('Invalid email format')
      })
      
      // Valid email
      fireEvent.change(emailField, { target: { value: 'valid@email.com' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('email-error')
        expect(errorDiv.textContent).toBe('')
      })
    })

    it('should validate currency code format and case in real-time', async () => {
      render(<RealTimeValidationForm tableName="master_currencies" />)
      
      const codeField = screen.getByTestId('code-field')
      
      // Wrong length
      fireEvent.change(codeField, { target: { value: 'US' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('code-error')
        expect(errorDiv.textContent).toContain('Currency code must be 3 characters')
      })
      
      // Wrong case
      fireEvent.change(codeField, { target: { value: 'usd' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('code-error')
        expect(errorDiv.textContent).toContain('Currency code must be uppercase')
      })
      
      // Valid code
      fireEvent.change(codeField, { target: { value: 'USD' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('code-error')
        expect(errorDiv.textContent).toBe('')
      })
    })
  })

  describe('Cross-Field Validation', () => {
    it('should validate min/max score relationship on form submission', async () => {
      render(<RealTimeValidationForm tableName="master_capability_levels" />)
      
      const nameField = screen.getByTestId('name-field')
      const minScoreField = screen.getByTestId('min-score-field')
      const maxScoreField = screen.getByTestId('max-score-field')
      const submitButton = screen.getByTestId('submit-button')
      
      fireEvent.change(nameField, { target: { value: 'Test Level' } })
      fireEvent.change(minScoreField, { target: { value: '80' } })
      fireEvent.change(maxScoreField, { target: { value: '60' } })
      
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const formErrorDiv = screen.getByTestId('form-errors')
        expect(formErrorDiv.textContent).toContain('Min score must be less than max score')
      })
    })

    it('should pass validation when scores are correctly ordered', async () => {
      render(<RealTimeValidationForm tableName="master_capability_levels" />)
      
      const nameField = screen.getByTestId('name-field')
      const minScoreField = screen.getByTestId('min-score-field')
      const maxScoreField = screen.getByTestId('max-score-field')
      const submitButton = screen.getByTestId('submit-button')
      
      fireEvent.change(nameField, { target: { value: 'Test Level' } })
      fireEvent.change(minScoreField, { target: { value: '60' } })
      fireEvent.change(maxScoreField, { target: { value: '80' } })
      
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const successDiv = screen.getByTestId('form-success')
        expect(successDiv.textContent).toContain('Form submitted successfully')
      })
    })
  })

  describe('Error Message Display Behavior', () => {
    it('should show multiple field errors simultaneously', async () => {
      render(<RealTimeValidationForm tableName="master_currencies" />)
      
      const nameField = screen.getByTestId('name-field')
      const codeField = screen.getByTestId('code-field')
      const emailField = screen.getByTestId('email-field')
      
      // Trigger multiple errors
      fireEvent.change(nameField, { target: { value: '' } })
      fireEvent.change(codeField, { target: { value: 'us' } })
      fireEvent.change(emailField, { target: { value: 'invalid' } })
      
      await waitFor(() => {
        const nameError = screen.getByTestId('name-error')
        const codeError = screen.getByTestId('code-error')
        const emailError = screen.getByTestId('email-error')
        
        expect(nameError).not.toHaveClass('hidden')
        expect(codeError).not.toHaveClass('hidden')
        expect(emailError).not.toHaveClass('hidden')
        
        expect(nameError.textContent).toContain('Name is required')
        expect(codeError.textContent).toContain('Currency code must be 3 characters')
        expect(emailError.textContent).toContain('Invalid email format')
      })
    })

    it('should maintain error state until field is corrected', async () => {
      render(<RealTimeValidationForm tableName="master_countries" />)
      
      const nameField = screen.getByTestId('name-field')
      
      // Trigger error
      fireEvent.change(nameField, { target: { value: '' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('name-error')
        expect(errorDiv).not.toHaveClass('hidden')
      })
      
      // Change to another invalid value
      fireEvent.change(nameField, { target: { value: '   ' } })
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('name-error')
        expect(errorDiv).not.toHaveClass('hidden')
        expect(errorDiv.textContent).toContain('Name is required')
      })
    })

    it('should show proper accessibility attributes for error messages', async () => {
      render(<RealTimeValidationForm tableName="master_countries" />)
      
      const nameField = screen.getByTestId('name-field')
      fireEvent.change(nameField, { target: { value: '' } })
      
      await waitFor(() => {
        const formErrorDiv = screen.getByTestId('form-errors')
        expect(formErrorDiv).toHaveAttribute('role', 'alert')
      })
    })
  })

  describe('Form Submission Validation', () => {
    it('should prevent submission when validation errors exist', async () => {
      render(<RealTimeValidationForm tableName="master_countries" />)
      
      const submitButton = screen.getByTestId('submit-button')
      
      // Submit with empty required field
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const formErrorDiv = screen.getByTestId('form-errors')
        expect(formErrorDiv).not.toHaveClass('hidden')
        expect(formErrorDiv.textContent).toContain('Name is required')
        
        const successDiv = screen.getByTestId('form-success')
        expect(successDiv).toHaveClass('hidden')
      })
    })

    it('should allow submission when all validations pass', async () => {
      render(<RealTimeValidationForm tableName="master_countries" />)
      
      const nameField = screen.getByTestId('name-field')
      const codeField = screen.getByTestId('code-field')
      const submitButton = screen.getByTestId('submit-button')
      
      fireEvent.change(nameField, { target: { value: 'United States' } })
      fireEvent.change(codeField, { target: { value: 'US' } })
      
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const successDiv = screen.getByTestId('form-success')
        expect(successDiv).not.toHaveClass('hidden')
        expect(successDiv.textContent).toContain('Form submitted successfully')
        
        const formErrorDiv = screen.getByTestId('form-errors')
        expect(formErrorDiv).toHaveClass('hidden')
      })
    })

    it('should combine field-level and form-level validation errors', async () => {
      render(<RealTimeValidationForm tableName="master_capability_levels" />)
      
      const minScoreField = screen.getByTestId('min-score-field')
      const maxScoreField = screen.getByTestId('max-score-field')
      const submitButton = screen.getByTestId('submit-button')
      
      // Invalid individual fields + invalid relationship
      fireEvent.change(minScoreField, { target: { value: '-10' } }) // Negative
      fireEvent.change(maxScoreField, { target: { value: '-5' } })  // Negative + min > max
      
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const formErrorDiv = screen.getByTestId('form-errors')
        const errorText = formErrorDiv.textContent || ''
        
        expect(errorText).toContain('Name is required')
        expect(errorText).toContain('Min score cannot be negative')
        expect(errorText).toContain('Max score cannot be negative')
      })
    })
  })
})