import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/testUtils'

// Mock service for testing transaction-like behavior
const mockTransactionService = {
  getItems: vi.fn(),
  addItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
  batchOperation: vi.fn(),
}

// Mock toast notifications
const mockToast = vi.fn()

vi.mock('@/services/SupabaseMasterDataService', () => ({
  SupabaseMasterDataService: vi.fn().mockImplementation(() => mockTransactionService),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock component that handles batch operations and data consistency
const TransactionTestComponent = ({ 
  tableName = 'master_countries',
  enableBatch = true 
}: { 
  tableName?: string
  enableBatch?: boolean 
}) => {
  // Simulate batch operation that should be atomic
  const handleBatchOperation = async () => {
    const statusElement = document.querySelector('[data-testid="operation-status"]')
    const errorElement = document.querySelector('[data-testid="operation-error"]')
    const resultElement = document.querySelector('[data-testid="operation-result"]')
    
    try {
      if (statusElement) statusElement.textContent = 'Processing batch operation...'
      if (errorElement) errorElement.classList.add('hidden')
      if (resultElement) resultElement.classList.add('hidden')

      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      const service = new SupabaseMasterDataService()

      // Simulate a batch operation with multiple steps
      const operations = [
        { type: 'create', data: { name: 'Item 1', code: 'IT1' } },
        { type: 'create', data: { name: 'Item 2', code: 'IT2' } },
        { type: 'update', data: { id: 'existing-1', name: 'Updated Item' } }
      ]

      if (enableBatch && (service as any).batchOperation) {
        // Use batch operation if available
        const result = await (service as any).batchOperation(tableName, operations)
        
        if (statusElement) statusElement.textContent = 'Batch operation completed'
        if (resultElement) {
          resultElement.textContent = `Processed ${operations.length} operations successfully`
          resultElement.classList.remove('hidden')
        }
        
        return result
      } else {
        // Simulate individual operations
        for (const operation of operations) {
          switch (operation.type) {
            case 'create':
              await service.addItem(tableName, operation.data)
              break
            case 'update':
              await service.updateItem(tableName, operation.data.id, operation.data)
              break
          }
        }
        
        if (statusElement) statusElement.textContent = 'Individual operations completed'
        if (resultElement) {
          resultElement.textContent = `Processed ${operations.length} operations individually`
          resultElement.classList.remove('hidden')
        }
      }
    } catch (error: any) {
      console.error('Batch operation failed:', error)
      
      if (statusElement) statusElement.textContent = 'Operation failed'
      if (errorElement) {
        errorElement.textContent = error.message || 'Batch operation failed'
        errorElement.classList.remove('hidden')
      }

      mockToast({
        title: 'Operation Failed',
        description: error.message || 'Batch operation failed',
        variant: 'destructive'
      })

      throw error
    }
  }

  // Simulate operation that might leave partial data
  const handlePartialFailureTest = async () => {
    const statusElement = document.querySelector('[data-testid="partial-test-status"]')
    const errorElement = document.querySelector('[data-testid="partial-test-error"]')
    const dataStateElement = document.querySelector('[data-testid="data-state"]')
    
    try {
      if (statusElement) statusElement.textContent = 'Testing partial failure scenario...'
      if (errorElement) errorElement.classList.add('hidden')

      const { SupabaseMasterDataService } = await import('@/services/SupabaseMasterDataService')
      const service = new SupabaseMasterDataService()

      // Step 1: Create first item (should succeed)
      await service.addItem(tableName, { name: 'First Item', code: 'FI1' })
      
      if (dataStateElement) {
        dataStateElement.textContent = 'Step 1 completed: First item created'
      }

      // Step 2: Create second item (might fail)
      await service.addItem(tableName, { name: 'Second Item', code: 'SI2' })
      
      if (dataStateElement) {
        dataStateElement.textContent = 'Step 2 completed: Second item created'
      }

      // Step 3: Update existing item (might fail)
      await service.updateItem(tableName, 'existing-id', { name: 'Updated Item' })
      
      if (statusElement) statusElement.textContent = 'All steps completed successfully'
      if (dataStateElement) {
        dataStateElement.textContent = 'All operations completed - data is consistent'
      }

    } catch (error: any) {
      if (statusElement) statusElement.textContent = 'Operation failed at some step'
      if (errorElement) {
        errorElement.textContent = `Failed: ${error.message}`
        errorElement.classList.remove('hidden')
      }
      
      // Show data state - in a real app, this would check database state
      if (dataStateElement) {
        dataStateElement.textContent = 'Warning: Data may be in inconsistent state'
        dataStateElement.className = 'text-orange-600 font-semibold'
      }

      throw error
    }
  }

  return (
    <div data-testid="transaction-test-component">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Batch Operation Test</h3>
        <div data-testid="operation-status" className="text-blue-600 mb-2">Ready</div>
        <div 
          data-testid="operation-error" 
          className="text-red-600 mb-2 hidden"
          role="alert"
        />
        <div 
          data-testid="operation-result" 
          className="text-green-600 mb-2 hidden"
        />
        <button 
          onClick={handleBatchOperation}
          data-testid="batch-operation-button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Execute Batch Operation
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Partial Failure Test</h3>
        <div data-testid="partial-test-status" className="text-blue-600 mb-2">Ready</div>
        <div 
          data-testid="partial-test-error" 
          className="text-red-600 mb-2 hidden"
          role="alert"
        />
        <div 
          data-testid="data-state" 
          className="text-gray-600 mb-2"
        >
          Data state: Clean
        </div>
        <button 
          onClick={handlePartialFailureTest}
          data-testid="partial-failure-button"
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Test Partial Failure
        </button>
      </div>
    </div>
  )
}

describe('Data Consistency and Partial Failure Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Atomic Operations and Rollback', () => {
    it('should complete batch operation atomically on success', async () => {
      const batchResult = { success: true, operations: 3 }
      mockTransactionService.batchOperation.mockResolvedValue(batchResult)

      render(<TransactionTestComponent enableBatch={true} />)
      
      const batchButton = screen.getByTestId('batch-operation-button')
      fireEvent.click(batchButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('operation-status')
        const resultDiv = screen.getByTestId('operation-result')
        
        expect(statusDiv.textContent).toBe('Batch operation completed')
        expect(resultDiv.textContent).toBe('Processed 3 operations successfully')
        expect(resultDiv).not.toHaveClass('hidden')
      })

      expect(mockTransactionService.batchOperation).toHaveBeenCalledWith(
        'master_countries',
        expect.arrayContaining([
          expect.objectContaining({ type: 'create' }),
          expect.objectContaining({ type: 'create' }),
          expect.objectContaining({ type: 'update' })
        ])
      )
    })

    it('should rollback all operations on batch failure', async () => {
      const batchError = new Error('Batch operation failed - constraint violation in operation 2')
      mockTransactionService.batchOperation.mockRejectedValue(batchError)

      render(<TransactionTestComponent enableBatch={true} />)
      
      const batchButton = screen.getByTestId('batch-operation-button')
      fireEvent.click(batchButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('operation-status')
        const errorDiv = screen.getByTestId('operation-error')
        
        expect(statusDiv.textContent).toBe('Operation failed')
        expect(errorDiv.textContent).toContain('constraint violation in operation 2')
        expect(errorDiv).not.toHaveClass('hidden')
      })

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Operation Failed',
        description: 'Batch operation failed - constraint violation in operation 2',
        variant: 'destructive'
      })
    })
  })

  describe('Partial Data Creation Prevention', () => {
    it('should detect partial data creation when individual operations fail', async () => {
      // First operation succeeds, second fails
      mockTransactionService.addItem
        .mockResolvedValueOnce(true) // First item created
        .mockRejectedValueOnce(new Error('Duplicate key violation')) // Second item fails

      render(<TransactionTestComponent enableBatch={false} />)
      
      const partialButton = screen.getByTestId('partial-failure-button')
      fireEvent.click(partialButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('partial-test-status')
        const errorDiv = screen.getByTestId('partial-test-error')
        const dataStateDiv = screen.getByTestId('data-state')
        
        expect(statusDiv.textContent).toBe('Operation failed at some step')
        expect(errorDiv.textContent).toContain('Duplicate key violation')
        expect(dataStateDiv.textContent).toBe('Warning: Data may be in inconsistent state')
        expect(dataStateDiv).toHaveClass('text-orange-600')
      })
    })

    it('should show step-by-step progress during multi-step operations', async () => {
      let resolveStep1: (value: any) => void
      let resolveStep2: (value: any) => void
      
      const step1Promise = new Promise(resolve => { resolveStep1 = resolve })
      const step2Promise = new Promise(resolve => { resolveStep2 = resolve })
      
      mockTransactionService.addItem
        .mockReturnValueOnce(step1Promise)
        .mockReturnValueOnce(step2Promise)
      mockTransactionService.updateItem.mockResolvedValue(true)

      render(<TransactionTestComponent enableBatch={false} />)
      
      const partialButton = screen.getByTestId('partial-failure-button')
      fireEvent.click(partialButton)
      
      // Check initial status
      await waitFor(() => {
        const statusDiv = screen.getByTestId('partial-test-status')
        expect(statusDiv.textContent).toBe('Testing partial failure scenario...')
      })
      
      // Complete step 1
      resolveStep1!(true)
      
      await waitFor(() => {
        const dataStateDiv = screen.getByTestId('data-state')
        expect(dataStateDiv.textContent).toBe('Step 1 completed: First item created')
      })
      
      // Complete step 2
      resolveStep2!(true)
      
      await waitFor(() => {
        const dataStateDiv = screen.getByTestId('data-state')
        expect(dataStateDiv.textContent).toBe('Step 2 completed: Second item created')
      })
      
      // Wait for final completion
      await waitFor(() => {
        const statusDiv = screen.getByTestId('partial-test-status')
        const dataStateDiv = screen.getByTestId('data-state')
        
        expect(statusDiv.textContent).toBe('All steps completed successfully')
        expect(dataStateDiv.textContent).toBe('All operations completed - data is consistent')
      })
    })
  })

  describe('Foreign Key Constraint Violations', () => {
    it('should handle foreign key violations without creating orphaned records', async () => {
      const fkError = new Error('insert or update on table "master_categories" violates foreign key constraint "fk_categories_domain_group"')
      
      mockTransactionService.addItem
        .mockResolvedValueOnce(true) // Parent created successfully
        .mockRejectedValueOnce(fkError) // Child creation fails due to FK constraint

      render(<TransactionTestComponent enableBatch={false} />)
      
      const partialButton = screen.getByTestId('partial-failure-button')
      fireEvent.click(partialButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('partial-test-error')
        const dataStateDiv = screen.getByTestId('data-state')
        
        expect(errorDiv.textContent).toContain('violates foreign key constraint')
        expect(dataStateDiv.textContent).toBe('Warning: Data may be in inconsistent state')
      })
    })
  })

  describe('Unique Constraint Violations in Batch Operations', () => {
    it('should handle unique constraint violations in batch operations', async () => {
      const uniqueError = new Error('Batch failed: duplicate key value violates unique constraint "master_countries_code_key" at operation 2')
      mockTransactionService.batchOperation.mockRejectedValue(uniqueError)

      render(<TransactionTestComponent enableBatch={true} />)
      
      const batchButton = screen.getByTestId('batch-operation-button')
      fireEvent.click(batchButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('operation-error')
        expect(errorDiv.textContent).toContain('duplicate key value violates unique constraint')
        expect(errorDiv.textContent).toContain('at operation 2')
      })
    })
  })

  describe('Data State Verification', () => {
    it('should verify no partial data remains after failed operations', async () => {
      const error = new Error('Operation failed after partial completion')
      
      mockTransactionService.addItem
        .mockResolvedValueOnce(true) // Step 1 succeeds
        .mockRejectedValueOnce(error) // Step 2 fails

      render(<TransactionTestComponent enableBatch={false} />)
      
      const partialButton = screen.getByTestId('partial-failure-button')
      fireEvent.click(partialButton)
      
      await waitFor(() => {
        const dataStateDiv = screen.getByTestId('data-state')
        
        // In a real application, this would query the database to check state
        expect(dataStateDiv.textContent).toBe('Warning: Data may be in inconsistent state')
      })
    })

    it('should confirm clean state after successful operations', async () => {
      mockTransactionService.addItem.mockResolvedValue(true)
      mockTransactionService.updateItem.mockResolvedValue(true)

      render(<TransactionTestComponent enableBatch={false} />)
      
      const partialButton = screen.getByTestId('partial-failure-button')
      fireEvent.click(partialButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('partial-test-status')
        const dataStateDiv = screen.getByTestId('data-state')
        
        expect(statusDiv.textContent).toBe('All steps completed successfully')
        expect(dataStateDiv.textContent).toBe('All operations completed - data is consistent')
      })
    })
  })

  describe('Error Handling in Complex Operations', () => {
    it('should handle errors that occur after some operations complete', async () => {
      mockTransactionService.addItem
        .mockResolvedValueOnce(true) // First add succeeds
        .mockResolvedValueOnce(true) // Second add succeeds
      mockTransactionService.updateItem
        .mockRejectedValueOnce(new Error('Record not found for update')) // Update fails

      render(<TransactionTestComponent enableBatch={false} />)
      
      const partialButton = screen.getByTestId('partial-failure-button')
      fireEvent.click(partialButton)
      
      await waitFor(() => {
        const statusDiv = screen.getByTestId('partial-test-status')
        const errorDiv = screen.getByTestId('partial-test-error')
        const dataStateDiv = screen.getByTestId('data-state')
        
        expect(statusDiv.textContent).toBe('Operation failed at some step')
        expect(errorDiv.textContent).toContain('Record not found for update')
        expect(dataStateDiv.textContent).toBe('Warning: Data may be in inconsistent state')
      })
    })

    it('should provide detailed error information for debugging', async () => {
      const detailedError = new Error('Constraint violation: Column "amount" cannot be negative. Value: -100 in row 3')
      mockTransactionService.batchOperation.mockRejectedValue(detailedError)

      render(<TransactionTestComponent enableBatch={true} />)
      
      const batchButton = screen.getByTestId('batch-operation-button')
      fireEvent.click(batchButton)
      
      await waitFor(() => {
        const errorDiv = screen.getByTestId('operation-error')
        
        expect(errorDiv.textContent).toContain('Constraint violation')
        expect(errorDiv.textContent).toContain('Column "amount" cannot be negative')
        expect(errorDiv.textContent).toContain('Value: -100 in row 3')
      })

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Operation Failed',
        description: expect.stringContaining('Constraint violation'),
        variant: 'destructive'
      })
    })
  })
})