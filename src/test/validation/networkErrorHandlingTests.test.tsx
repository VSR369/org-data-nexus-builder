import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/testUtils'

// Mock network conditions
const mockNetworkService = {
  getItems: vi.fn(),
  addItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
}

// Mock toast for error notifications
const mockToast = vi.fn()

vi.mock('@/services/SupabaseMasterDataService', () => ({
  SupabaseMasterDataService: vi.fn().mockImplementation(() => mockNetworkService),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock component that handles network-related operations
const NetworkAwareComponent = ({ 
  tableName = 'master_countries',
  enableRetry = true 
}: { 
  tableName?: string
  enableRetry?: boolean 
}) => {
  const handleOperation = async (operationType: string) => {
    const statusElement = document.querySelector('[data-testid="connection-status"]')
    const errorElement = document.querySelector('[data-testid="network-error"]')
    const retryElement = document.querySelector('[data-testid="retry-button"]')
    
    try {
      // Show connecting status
      if (statusElement) {
        statusElement.textContent = 'Connecting...'
        statusElement.className = 'text-blue-600'
      }
      
      if (errorElement) errorElement.classList.add('hidden')

      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      const service = new SupabaseMasterDataService()

      let result
      switch (operationType) {
        case 'fetch':
          result = await service.getItems(tableName)
          break
        case 'create':
          result = await service.addItem(tableName, { name: 'Test Item' })
          break
        case 'update':
          result = await service.updateItem(tableName, 'test-id', { name: 'Updated Item' })
          break
        case 'delete':
          result = await service.deleteItem(tableName, 'test-id')
          break
      }

      // Show success status
      if (statusElement) {
        statusElement.textContent = 'Connected'
        statusElement.className = 'text-green-600'
      }

      return result
    } catch (error: any) {
      // Handle different types of network errors
      let errorMessage = 'Unknown error occurred'
      let retryable = true

      if (error.message.includes('fetch')) {
        errorMessage = 'Network connection failed'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out'
      } else if (error.message.includes('offline')) {
        errorMessage = 'You appear to be offline'
      } else if (error.message.includes('supabase')) {
        errorMessage = 'Database service unavailable'
      } else if (error.message.includes('authentication')) {
        errorMessage = 'Authentication expired'
        retryable = false
      } else {
        errorMessage = error.message
      }

      // Update UI with error state
      if (statusElement) {
        statusElement.textContent = 'Disconnected'
        statusElement.className = 'text-red-600'
      }
      
      if (errorElement) {
        errorElement.textContent = errorMessage
        errorElement.classList.remove('hidden')
      }

      // Show retry button if error is retryable and retry is enabled
      if (retryElement && retryable && enableRetry) {
        retryElement.classList.remove('hidden')
      }

      // Show toast notification
      mockToast({
        title: 'Connection Error',
        description: errorMessage,
        variant: 'destructive'
      })

      throw error
    }
  }

  const handleRetry = () => {
    const lastOperation = 'fetch' // In a real app, this would be stored
    handleOperation(lastOperation)
  }

  return (
    <div data-testid="network-aware-component">
      <div data-testid="connection-status" className="text-gray-600 mb-4">
        Ready
      </div>
      
      <div 
        data-testid="network-error" 
        className="text-red-600 mb-4 hidden"
        role="alert"
      />
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={() => handleOperation('fetch')}
          data-testid="fetch-button"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Fetch Data
        </button>
        
        <button 
          onClick={() => handleOperation('create')}
          data-testid="create-button"
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Create Item
        </button>
        
        <button 
          onClick={() => handleOperation('update')}
          data-testid="update-button"
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Update Item
        </button>
        
        <button 
          onClick={() => handleOperation('delete')}
          data-testid="delete-button"
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete Item
        </button>
      </div>
      
      <button 
        onClick={handleRetry}
        data-testid="retry-button"
        className="bg-gray-500 text-white px-3 py-1 rounded hidden"
      >
        Retry
      </button>
    </div>
  )
}

describe('Network Error and Connection Handling Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Network Disconnection Scenarios', () => {
    it('should handle network fetch failures', async () => {
      const networkError = new Error('Failed to fetch')
      mockNetworkService.getItems.mockRejectedValue(networkError)

      render(<NetworkAwareComponent />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      fireEvent.click(fetchButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('connection-status')
        const errorDiv = screen.getByTestId('network-error')
        
        expect(statusDiv.textContent).toBe('Disconnected')
        expect(statusDiv).toHaveClass('text-red-600')
        expect(errorDiv.textContent).toBe('Network connection failed')
        expect(errorDiv).not.toHaveClass('hidden')
      })

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Connection Error',
        description: 'Network connection failed',
        variant: 'destructive'
      })
    })

    it('should handle request timeout errors', async () => {
      const timeoutError = new Error('Request timeout exceeded')
      mockNetworkService.addItem.mockRejectedValue(timeoutError)

      render(<NetworkAwareComponent />)
      
      const createButton = screen.getByTestId('create-button')
      fireEvent.click(createButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('network-error')
        expect(errorDiv.textContent).toBe('Request timed out')
      })
    })

    it('should handle offline detection', async () => {
      const offlineError = new Error('User appears to be offline')
      mockNetworkService.updateItem.mockRejectedValue(offlineError)

      render(<NetworkAwareComponent />)
      
      const updateButton = screen.getByTestId('update-button')
      fireEvent.click(updateButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('network-error')
        expect(errorDiv.textContent).toBe('You appear to be offline')
      })
    })
  })

  describe('Supabase Connection Issues', () => {
    it('should handle Supabase service unavailable', async () => {
      const supabaseError = new Error('Supabase service temporarily unavailable')
      mockNetworkService.getItems.mockRejectedValue(supabaseError)

      render(<NetworkAwareComponent />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      fireEvent.click(fetchButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('network-error')
        expect(errorDiv.textContent).toBe('Database service unavailable')
      })
    })

    it('should handle authentication token expiration', async () => {
      const authError = new Error('JWT token has expired or is invalid - authentication required')
      mockNetworkService.addItem.mockRejectedValue(authError)

      render(<NetworkAwareComponent />)
      
      const createButton = screen.getByTestId('create-button')
      fireEvent.click(createButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('network-error')
        const retryButton = screen.getByTestId('retry-button')
        
        expect(errorDiv.textContent).toBe('Authentication expired')
        expect(retryButton).toHaveClass('hidden') // Should not show retry for auth errors
      })
    })

    it('should handle Supabase rate limiting', async () => {
      const rateLimitError = new Error('Rate limit exceeded. Please try again later.')
      mockNetworkService.deleteItem.mockRejectedValue(rateLimitError)

      render(<NetworkAwareComponent />)
      
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('network-error')
        expect(errorDiv.textContent).toBe('Rate limit exceeded. Please try again later.')
      })
    })
  })

  describe('Connection Status Indicators', () => {
    it('should show connecting status during operations', async () => {
      let resolvePromise: (value: any) => void
      const slowPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockNetworkService.getItems.mockReturnValue(slowPromise)

      render(<NetworkAwareComponent />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      fireEvent.click(fetchButton)
      
      // Check connecting status appears immediately
      await waitFor(() => {
        const statusDiv = screen.getByTestId('connection-status')
        expect(statusDiv.textContent).toBe('Connecting...')
        expect(statusDiv).toHaveClass('text-blue-600')
      })
      
      // Resolve the promise
      resolvePromise!([])
      
      // Check connected status appears
      await waitFor(() => {
        const statusDiv = screen.getByTestId('connection-status')
        expect(statusDiv.textContent).toBe('Connected')
        expect(statusDiv).toHaveClass('text-green-600')
      })
    })

    it('should transition from error back to connected on successful retry', async () => {
      const error = new Error('Failed to fetch')
      mockNetworkService.getItems
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce([])

      render(<NetworkAwareComponent />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      
      // First attempt fails
      fireEvent.click(fetchButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('connection-status')
        expect(statusDiv.textContent).toBe('Disconnected')
        expect(statusDiv).toHaveClass('text-red-600')
      })
      
      // Retry succeeds
      const retryButton = screen.getByTestId('retry-button')
      fireEvent.click(retryButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('connection-status')
        const errorDiv = screen.getByTestId('network-error')
        
        expect(statusDiv.textContent).toBe('Connected')
        expect(statusDiv).toHaveClass('text-green-600')
        expect(errorDiv).toHaveClass('hidden')
      })
    })
  })

  describe('Retry Mechanism', () => {
    it('should show retry button for retryable errors', async () => {
      const networkError = new Error('Failed to fetch')
      mockNetworkService.getItems.mockRejectedValue(networkError)

      render(<NetworkAwareComponent enableRetry={true} />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      fireEvent.click(fetchButton)
      
      await waitFor(() => {
        const retryButton = screen.getByTestId('retry-button')
        expect(retryButton).not.toHaveClass('hidden')
      })
    })

    it('should not show retry button for non-retryable errors', async () => {
      const authError = new Error('JWT token has expired - authentication required')
      mockNetworkService.getItems.mockRejectedValue(authError)

      render(<NetworkAwareComponent enableRetry={true} />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      fireEvent.click(fetchButton)
      
      await waitFor(() => {
        const retryButton = screen.getByTestId('retry-button')
        expect(retryButton).toHaveClass('hidden')
      })
    })

    it('should not show retry button when retry is disabled', async () => {
      const networkError = new Error('Failed to fetch')
      mockNetworkService.getItems.mockRejectedValue(networkError)

      render(<NetworkAwareComponent enableRetry={false} />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      fireEvent.click(fetchButton)
      
      await waitFor(() => {
        const retryButton = screen.getByTestId('retry-button')
        expect(retryButton).toHaveClass('hidden')
      })
    })

    it('should execute retry operation when retry button is clicked', async () => {
      const error = new Error('Failed to fetch')
      mockNetworkService.getItems
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce([])

      render(<NetworkAwareComponent />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      fireEvent.click(fetchButton)
      
      await waitFor(() => {
        const retryButton = screen.getByTestId('retry-button')
        expect(retryButton).not.toHaveClass('hidden')
      })
      
      const retryButton = screen.getByTestId('retry-button')
      fireEvent.click(retryButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('connection-status')
        expect(statusDiv.textContent).toBe('Connected')
      })
      
      expect(mockNetworkService.getItems).toHaveBeenCalledTimes(2)
    })
  })

  describe('Error Recovery and Graceful Degradation', () => {
    it('should maintain application state during network errors', async () => {
      const error = new Error('Network error')
      mockNetworkService.addItem.mockRejectedValue(error)

      render(<NetworkAwareComponent />)
      
      const createButton = screen.getByTestId('create-button')
      fireEvent.click(createButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('network-error')
        expect(errorDiv).not.toHaveClass('hidden')
      })
      
      // All buttons should still be functional
      const fetchButton = screen.getByTestId('fetch-button')
      const updateButton = screen.getByTestId('update-button')
      const deleteButton = screen.getByTestId('delete-button')
      
      expect(fetchButton).not.toBeDisabled()
      expect(updateButton).not.toBeDisabled()
      expect(deleteButton).not.toBeDisabled()
    })

    it('should provide appropriate error messages for different error types', async () => {
      const errorTypes = [
        { error: new Error('Failed to fetch'), expected: 'Network connection failed' },
        { error: new Error('Request timeout'), expected: 'Request timed out' },
        { error: new Error('User is offline'), expected: 'You appear to be offline' },
        { error: new Error('Supabase error'), expected: 'Database service unavailable' },
        { error: new Error('Some other error'), expected: 'Some other error' }
      ]

      for (const { error, expected } of errorTypes) {
        mockNetworkService.getItems.mockRejectedValueOnce(error)
        
        render(<NetworkAwareComponent />)
        
        const fetchButton = screen.getByTestId('fetch-button')
        fireEvent.click(fetchButton)
        
        await waitFor(() => {
          const errorDiv = screen.getByTestId('network-error')
          expect(errorDiv.textContent).toBe(expected)
        })
      }
    })

    it('should handle rapid successive network errors', async () => {
      const errors = [
        new Error('First network error'),
        new Error('Second network error'),
        new Error('Third network error')
      ]

      mockNetworkService.getItems
        .mockRejectedValueOnce(errors[0])
        .mockRejectedValueOnce(errors[1])
        .mockRejectedValueOnce(errors[2])

      render(<NetworkAwareComponent />)
      
      const fetchButton = screen.getByTestId('fetch-button')
      
      // Rapid clicks
      fireEvent.click(fetchButton)
      fireEvent.click(fetchButton)
      fireEvent.click(fetchButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('network-error')
        // Should show the last error message
        expect(errorDiv.textContent).toBe('Third network error')
      })
      
      expect(mockNetworkService.getItems).toHaveBeenCalledTimes(3)
    })
  })
})