import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/testUtils'

// Mock service with error simulation
const mockServiceWithErrors = {
  getItems: vi.fn(),
  addItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
}

// Mock toast notifications
const mockToast = vi.fn()

vi.mock('@/services/SupabaseMasterDataService', () => ({
  SupabaseMasterDataService: vi.fn().mockImplementation(() => mockServiceWithErrors),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock component that handles database operations with error handling
const DatabaseOperationForm = ({ 
  tableName,
  operation = 'create' 
}: { 
  tableName: string
  operation?: 'create' | 'update' | 'delete'
}) => {
  const handleOperation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = {}
    
    for (const [key, value] of formData.entries()) {
      data[key] = value
    }

    try {
      // Show loading state
      const loadingElement = document.querySelector('[data-testid="loading-indicator"]')
      const errorElement = document.querySelector('[data-testid="error-message"]')
      const successElement = document.querySelector('[data-testid="success-message"]')
      
      if (loadingElement) loadingElement.classList.remove('hidden')
      if (errorElement) errorElement.classList.add('hidden')
      if (successElement) successElement.classList.add('hidden')

      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      const service = new SupabaseMasterDataService()

      let result
      switch (operation) {
        case 'create':
          result = await service.addItem(tableName, data)
          break
        case 'update':
          result = await service.updateItem(tableName, data.id, data)
          break
        case 'delete':
          result = await service.deleteItem(tableName, data.id)
          break
      }

      if (result) {
        if (successElement) {
          successElement.textContent = `${operation} operation completed successfully`
          successElement.classList.remove('hidden')
        }
        mockToast({
          title: 'Success',
          description: `${operation} operation completed successfully`,
          variant: 'default'
        })
      }
    } catch (error: any) {
      console.error('Database operation failed:', error)
      
      const errorElement = document.querySelector('[data-testid="error-message"]')
      if (errorElement) {
        errorElement.textContent = error.message || 'Operation failed'
        errorElement.classList.remove('hidden')
      }

      // Show toast notification for error
      mockToast({
        title: 'Error',
        description: error.message || 'Operation failed',
        variant: 'destructive'
      })
    } finally {
      // Hide loading state
      const loadingElement = document.querySelector('[data-testid="loading-indicator"]')
      if (loadingElement) loadingElement.classList.add('hidden')
    }
  }

  return (
    <div data-testid="database-operation-form">
      <div 
        data-testid="loading-indicator" 
        className="text-blue-600 mb-4 hidden"
      >
        Processing...
      </div>
      
      <div 
        data-testid="error-message" 
        className="text-red-600 mb-4 hidden"
        role="alert"
      />
      
      <div 
        data-testid="success-message" 
        className="text-green-600 mb-4 hidden"
      />

      <form onSubmit={handleOperation}>
        <input 
          name="id" 
          defaultValue="test-id" 
          data-testid="id-input"
          className="hidden"
        />
        <input 
          name="name" 
          placeholder="Name" 
          data-testid="name-input"
          className="border rounded px-2 py-1 mr-2"
        />
        <input 
          name="code" 
          placeholder="Code" 
          data-testid="code-input"
          className="border rounded px-2 py-1 mr-2"
        />
        
        <button 
          type="submit" 
          data-testid="submit-button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {operation.charAt(0).toUpperCase() + operation.slice(1)}
        </button>
      </form>
    </div>
  )
}

describe('Database Error Handling Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Duplicate Unique Field Errors', () => {
    it('should handle duplicate key constraint violation', async () => {
      const duplicateError = new Error('duplicate key value violates unique constraint "master_countries_code_key"')
      mockServiceWithErrors.addItem.mockRejectedValue(duplicateError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const nameInput = screen.getByTestId('name-input')
      const codeInput = screen.getByTestId('code-input')
      const submitButton = screen.getByTestId('submit-button')
      
      fireEvent.change(nameInput, { target: { value: 'United States' } })
      fireEvent.change(codeInput, { target: { value: 'US' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toContain('duplicate key value violates unique constraint')
        expect(errorDiv).not.toHaveClass('hidden')
      })

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'duplicate key value violates unique constraint "master_countries_code_key"',
        variant: 'destructive'
      })
    })

    it('should handle unique constraint with user-friendly message', async () => {
      const duplicateError = new Error('Country code already exists')
      mockServiceWithErrors.addItem.mockRejectedValue(duplicateError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toBe('Country code already exists')
      })
    })

    it('should not create partial data on duplicate error', async () => {
      const duplicateError = new Error('duplicate key value violates unique constraint')
      mockServiceWithErrors.addItem.mockRejectedValue(duplicateError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv).not.toHaveClass('hidden')
      })

      // Verify no success state was triggered
      const successDiv = screen.getByTestId('success-message')
      expect(successDiv).toHaveClass('hidden')
      
      // Verify service was called but failed
      expect(mockServiceWithErrors.addItem).toHaveBeenCalledTimes(1)
    })
  })

  describe('Foreign Key Constraint Errors', () => {
    it('should handle foreign key constraint violation on create', async () => {
      const fkError = new Error('insert or update on table "master_categories" violates foreign key constraint "fk_categories_domain_group"')
      mockServiceWithErrors.addItem.mockRejectedValue(fkError)

      render(<DatabaseOperationForm tableName="master_categories" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toContain('violates foreign key constraint')
      })
    })

    it('should handle foreign key constraint violation on delete', async () => {
      const fkError = new Error('update or delete on table "master_domain_groups" violates foreign key constraint')
      mockServiceWithErrors.deleteItem.mockRejectedValue(fkError)

      render(<DatabaseOperationForm tableName="master_domain_groups" operation="delete" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toContain('violates foreign key constraint')
      })
    })
  })

  describe('Validation Errors', () => {
    it('should handle check constraint violations', async () => {
      const checkError = new Error('new row for relation "master_capability_levels" violates check constraint "capability_levels_score_range"')
      mockServiceWithErrors.addItem.mockRejectedValue(checkError)

      render(<DatabaseOperationForm tableName="master_capability_levels" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toContain('violates check constraint')
      })
    })

    it('should handle not null constraint violations', async () => {
      const notNullError = new Error('null value in column "name" violates not-null constraint')
      mockServiceWithErrors.addItem.mockRejectedValue(notNullError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toContain('violates not-null constraint')
      })
    })
  })

  describe('Record Not Found Errors', () => {
    it('should handle update on non-existent record', async () => {
      const notFoundError = new Error('Record not found')
      mockServiceWithErrors.updateItem.mockRejectedValue(notFoundError)

      render(<DatabaseOperationForm tableName="master_countries" operation="update" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toBe('Record not found')
      })
    })

    it('should handle delete on non-existent record', async () => {
      const notFoundError = new Error('No record found to delete')
      mockServiceWithErrors.deleteItem.mockRejectedValue(notFoundError)

      render(<DatabaseOperationForm tableName="master_countries" operation="delete" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toBe('No record found to delete')
      })
    })
  })

  describe('Permission and Authentication Errors', () => {
    it('should handle RLS policy violation', async () => {
      const rlsError = new Error('new row violates row-level security policy for table "master_countries"')
      mockServiceWithErrors.addItem.mockRejectedValue(rlsError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toContain('violates row-level security policy')
      })
    })

    it('should handle insufficient privileges error', async () => {
      const privilegeError = new Error('permission denied for table master_countries')
      mockServiceWithErrors.addItem.mockRejectedValue(privilegeError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toContain('permission denied')
      })
    })
  })

  describe('Error Message Display and User Experience', () => {
    it('should show loading state during operation', async () => {
      let resolvePromise: (value: any) => void
      const slowPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockServiceWithErrors.addItem.mockReturnValue(slowPromise)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      // Check loading state appears
      await waitFor(() => {
        const loadingDiv = screen.getByTestId('loading-indicator')
        expect(loadingDiv).not.toHaveClass('hidden')
      })
      
      // Resolve the promise
      resolvePromise!(true)
      
      // Check loading state disappears
      await waitFor(() => {
        const loadingDiv = screen.getByTestId('loading-indicator')
        expect(loadingDiv).toHaveClass('hidden')
      })
    })

    it('should clear previous error messages on new operation', async () => {
      const error = new Error('First error')
      mockServiceWithErrors.addItem.mockRejectedValueOnce(error)
      mockServiceWithErrors.addItem.mockResolvedValueOnce(true)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      
      // First operation fails
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toBe('First error')
      })
      
      // Second operation succeeds
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv).toHaveClass('hidden')
        
        const successDiv = screen.getByTestId('success-message')
        expect(successDiv).not.toHaveClass('hidden')
      })
    })

    it('should provide proper accessibility for error messages', async () => {
      const error = new Error('Accessibility test error')
      mockServiceWithErrors.addItem.mockRejectedValue(error)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv).toHaveAttribute('role', 'alert')
        expect(errorDiv.textContent).toBe('Accessibility test error')
      })
    })

    it('should show both UI error message and toast notification', async () => {
      const error = new Error('Test error for notifications')
      mockServiceWithErrors.addItem.mockRejectedValue(error)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        // Check UI error message
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toBe('Test error for notifications')
        
        // Check toast was called
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Test error for notifications',
          variant: 'destructive'
        })
      })
    })
  })

  describe('Generic Database Errors', () => {
    it('should handle generic database connection errors', async () => {
      const connectionError = new Error('Connection to database failed')
      mockServiceWithErrors.addItem.mockRejectedValue(connectionError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toBe('Connection to database failed')
      })
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      mockServiceWithErrors.addItem.mockRejectedValue(timeoutError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toBe('Request timeout')
      })
    })

    it('should handle unknown errors gracefully', async () => {
      const unknownError = new Error()
      mockServiceWithErrors.addItem.mockRejectedValue(unknownError)

      render(<DatabaseOperationForm tableName="master_countries" operation="create" />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error-message')
        expect(errorDiv.textContent).toBe('Operation failed')
      })
    })
  })
})