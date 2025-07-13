import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/testUtils'

// Mock the hook
const mockAddItem = vi.fn()
const mockUpdateItem = vi.fn()

vi.mock('@/hooks/useMasterDataCRUD', () => ({
  useMasterDataCRUD: () => ({
    addItem: mockAddItem,
    updateItem: mockUpdateItem,
    loading: false,
    items: []
  })
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

// Mock form component for testing validation
const MasterDataForm = ({ 
  tableName, 
  initialData = null, 
  onSuccess 
}: { 
  tableName: string
  initialData?: any
  onSuccess?: () => void 
}) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = {}
    
    // Extract form data
    for (const [key, value] of formData.entries()) {
      data[key] = value
    }

    // Basic validation
    const errors: string[] = []
    
    // Required field validation
    if (!data.name || data.name.trim() === '') {
      errors.push('Name is required')
    }
    
    // Email validation for contact fields
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format')
    }
    
    // Number validation
    if (data.amount && isNaN(Number(data.amount))) {
      errors.push('Amount must be a number')
    }
    
    // Length validation
    if (data.description && data.description.length > 255) {
      errors.push('Description must be 255 characters or less')
    }
    
    // Display errors
    if (errors.length > 0) {
      const errorDiv = document.querySelector('[data-testid="validation-errors"]')
      if (errorDiv) {
        errorDiv.textContent = errors.join(', ')
        errorDiv.classList.remove('hidden')
      }
      return
    }
    
    // Clear errors
    const errorDiv = document.querySelector('[data-testid="validation-errors"]')
    if (errorDiv) {
      errorDiv.textContent = ''
      errorDiv.classList.add('hidden')
    }
    
    // Submit data
    try {
      if (initialData) {
        await mockUpdateItem(initialData.id, data)
      } else {
        await mockAddItem(data)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="master-data-form">
      <div 
        data-testid="validation-errors" 
        className="text-red-500 mb-4 hidden"
        role="alert"
      />
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name || ''}
          className="w-full border rounded px-3 py-2"
          data-testid="name-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={initialData?.email || ''}
          className="w-full border rounded px-3 py-2"
          data-testid="email-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          defaultValue={initialData?.amount || ''}
          className="w-full border rounded px-3 py-2"
          data-testid="amount-input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ''}
          maxLength={255}
          className="w-full border rounded px-3 py-2"
          data-testid="description-input"
          rows={3}
        />
        <div className="text-sm text-gray-500 mt-1">
          <span data-testid="character-count">0</span>/255 characters
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={initialData?.phone || ''}
          pattern="[0-9+\-\s\(\)]+"
          className="w-full border rounded px-3 py-2"
          data-testid="phone-input"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        data-testid="submit-button"
      >
        {initialData ? 'Update' : 'Create'}
      </button>
    </form>
  )
}

describe('Data Validation Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAddItem.mockResolvedValue(true)
    mockUpdateItem.mockResolvedValue(true)
  })

  describe('Required Field Validation', () => {
    it('should show validation error when name field is empty', async () => {
      render(<MasterDataForm tableName="master_countries" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toContain('Name is required')
        expect(errorDiv).not.toHaveClass('hidden')
      })
      
      expect(mockAddItem).not.toHaveBeenCalled()
    })

    it('should show validation error when name field contains only whitespace', async () => {
      render(<MasterDataForm tableName="master_countries" />)
      
      const nameInput = screen.getByTestId('name-input')
      fireEvent.change(nameInput, { target: { value: '   ' } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toContain('Name is required')
      })
    })

    it('should clear validation errors when valid data is entered', async () => {
      render(<MasterDataForm tableName="master_countries" />)
      
      // First submit empty to trigger error
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toContain('Name is required')
      })
      
      // Then fill in required field and submit again
      const nameInput = screen.getByTestId('name-input')
      fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toBe('')
        expect(errorDiv).toHaveClass('hidden')
      })
      
      expect(mockAddItem).toHaveBeenCalledWith({
        name: 'Valid Name',
        email: '',
        amount: '',
        description: '',
        phone: ''
      })
    })
  })

  describe('Data Type Validation', () => {
    it('should show validation error for invalid number in amount field', async () => {
      render(<MasterDataForm tableName="master_membership_fees" />)
      
      const nameInput = screen.getByTestId('name-input')
      const amountInput = screen.getByTestId('amount-input')
      
      fireEvent.change(nameInput, { target: { value: 'Test Fee' } })
      fireEvent.change(amountInput, { target: { value: 'not-a-number' } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toContain('Amount must be a number')
      })
    })

    it('should accept valid numbers in amount field', async () => {
      render(<MasterDataForm tableName="master_membership_fees" />)
      
      const nameInput = screen.getByTestId('name-input')
      const amountInput = screen.getByTestId('amount-input')
      
      fireEvent.change(nameInput, { target: { value: 'Test Fee' } })
      fireEvent.change(amountInput, { target: { value: '99.99' } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toBe('')
      })
      
      expect(mockAddItem).toHaveBeenCalledWith({
        name: 'Test Fee',
        email: '',
        amount: '99.99',
        description: '',
        phone: ''
      })
    })

    it('should accept negative numbers in amount field', async () => {
      render(<MasterDataForm tableName="master_membership_fees" />)
      
      const nameInput = screen.getByTestId('name-input')
      const amountInput = screen.getByTestId('amount-input')
      
      fireEvent.change(nameInput, { target: { value: 'Discount' } })
      fireEvent.change(amountInput, { target: { value: '-10.50' } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith({
          name: 'Discount',
          email: '',
          amount: '-10.50',
          description: '',
          phone: ''
        })
      })
    })
  })

  describe('Email Format Validation', () => {
    it('should show validation error for invalid email format', async () => {
      render(<MasterDataForm tableName="master_contacts" />)
      
      const nameInput = screen.getByTestId('name-input')
      const emailInput = screen.getByTestId('email-input')
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toContain('Invalid email format')
      })
    })

    it('should accept valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'user123@example-domain.com'
      ]
      
      for (const email of validEmails) {
        render(<MasterDataForm tableName="master_contacts" />)
        
        const nameInput = screen.getByTestId('name-input')
        const emailInput = screen.getByTestId('email-input')
        
        fireEvent.change(nameInput, { target: { value: 'Test User' } })
        fireEvent.change(emailInput, { target: { value: email } })
        
        const submitButton = screen.getByTestId('submit-button')
        fireEvent.click(submitButton)
        
        await waitFor(() => {
          const errorDiv = screen.getByTestId('validation-errors')
          expect(errorDiv.textContent).toBe('')
        })
      }
    })

    it('should allow empty email field', async () => {
      render(<MasterDataForm tableName="master_contacts" />)
      
      const nameInput = screen.getByTestId('name-input')
      fireEvent.change(nameInput, { target: { value: 'Test User' } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toBe('')
      })
    })
  })

  describe('Maximum Length Validation', () => {
    it('should show validation error when description exceeds maximum length', async () => {
      render(<MasterDataForm tableName="master_countries" />)
      
      const nameInput = screen.getByTestId('name-input')
      const descriptionInput = screen.getByTestId('description-input')
      
      const longText = 'a'.repeat(256) // Exceeds 255 character limit
      
      fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
      fireEvent.change(descriptionInput, { target: { value: longText } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toContain('Description must be 255 characters or less')
      })
    })

    it('should accept description at maximum length boundary', async () => {
      render(<MasterDataForm tableName="master_countries" />)
      
      const nameInput = screen.getByTestId('name-input')
      const descriptionInput = screen.getByTestId('description-input')
      
      const maxLengthText = 'a'.repeat(255) // Exactly 255 characters
      
      fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
      fireEvent.change(descriptionInput, { target: { value: maxLengthText } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toBe('')
      })
      
      expect(mockAddItem).toHaveBeenCalledWith({
        name: 'Valid Name',
        email: '',
        amount: '',
        description: maxLengthText,
        phone: ''
      })
    })
  })

  describe('Multiple Validation Errors', () => {
    it('should show multiple validation errors at once', async () => {
      render(<MasterDataForm tableName="master_contacts" />)
      
      const emailInput = screen.getByTestId('email-input')
      const amountInput = screen.getByTestId('amount-input')
      const descriptionInput = screen.getByTestId('description-input')
      
      // Leave name empty (required field error)
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.change(amountInput, { target: { value: 'not-a-number' } })
      fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(256) } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        const errorText = errorDiv.textContent || ''
        
        expect(errorText).toContain('Name is required')
        expect(errorText).toContain('Invalid email format')
        expect(errorText).toContain('Amount must be a number')
        expect(errorText).toContain('Description must be 255 characters or less')
      })
    })

    it('should progressively remove errors as they are fixed', async () => {
      render(<MasterDataForm tableName="master_contacts" />)
      
      const nameInput = screen.getByTestId('name-input')
      const emailInput = screen.getByTestId('email-input')
      const submitButton = screen.getByTestId('submit-button')
      
      // First, create multiple errors
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        const errorText = errorDiv.textContent || ''
        expect(errorText).toContain('Name is required')
        expect(errorText).toContain('Invalid email format')
      })
      
      // Fix the name error
      fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        const errorText = errorDiv.textContent || ''
        expect(errorText).not.toContain('Name is required')
        expect(errorText).toContain('Invalid email format')
      })
      
      // Fix the email error
      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv.textContent).toBe('')
        expect(errorDiv).toHaveClass('hidden')
      })
    })
  })

  describe('UI Error Display', () => {
    it('should display validation errors with proper styling and accessibility', async () => {
      render(<MasterDataForm tableName="master_countries" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        
        // Check that error is visible
        expect(errorDiv).not.toHaveClass('hidden')
        
        // Check styling
        expect(errorDiv).toHaveClass('text-red-500')
        
        // Check accessibility
        expect(errorDiv).toHaveAttribute('role', 'alert')
        
        // Check content
        expect(errorDiv.textContent).toContain('Name is required')
      })
    })

    it('should hide error display when no errors exist', async () => {
      render(<MasterDataForm tableName="master_countries" />)
      
      const nameInput = screen.getByTestId('name-input')
      fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv).toHaveClass('hidden')
        expect(errorDiv.textContent).toBe('')
      })
    })

    it('should maintain error visibility until explicitly cleared', async () => {
      render(<MasterDataForm tableName="master_countries" />)
      
      const submitButton = screen.getByTestId('submit-button')
      
      // Trigger error
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv).not.toHaveClass('hidden')
      })
      
      // Click again without fixing - error should still be visible
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('validation-errors')
        expect(errorDiv).not.toHaveClass('hidden')
        expect(errorDiv.textContent).toContain('Name is required')
      })
    })
  })
})