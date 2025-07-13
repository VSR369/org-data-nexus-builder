import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { testCountries, testCurrencies, testMembershipFees } from '../fixtures/masterDataFixtures'
import { createMockUseMasterDataCRUD } from '../utils/mockHelpers'

// Mock the CRUD hook
const mockCRUDHook = createMockUseMasterDataCRUD()

vi.mock('@/hooks/useMasterDataCRUD', () => ({
  useMasterDataCRUD: () => mockCRUDHook,
  useCountries: () => ({ items: testCountries, loading: false }),
  useOrganizationTypes: () => ({ items: [], loading: false }),
  useEntityTypes: () => ({ items: [], loading: false }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

// Mock component that simulates a master data management interface
const MockMasterDataInterface = ({ tableName }: { tableName: string }) => {
  const [items, setItems] = React.useState<any[]>([])
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<any>(null)

  React.useEffect(() => {
    // Simulate loading data
    if (tableName === 'master_countries') {
      setItems(testCountries)
    } else if (tableName === 'master_currencies') {
      setItems(testCurrencies)
    }
  }, [tableName])

  const handleAdd = async () => {
    const newItem = {
      name: 'New Item',
      created_at: new Date().toISOString(),
    }
    
    const success = await mockCRUDHook.addItem(newItem)
    if (success) {
      setItems([...items, { ...newItem, id: Date.now().toString() }])
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setIsEditing(true)
  }

  const handleUpdate = async () => {
    if (!editingItem) return
    
    const updates = { name: 'Updated Item' }
    const success = await mockCRUDHook.updateItem(editingItem.id, updates)
    
    if (success) {
      setItems(items.map(item => 
        item.id === editingItem.id ? { ...item, ...updates } : item
      ))
      setIsEditing(false)
      setEditingItem(null)
    }
  }

  const handleDelete = async (itemId: string) => {
    const success = await mockCRUDHook.deleteItem(itemId)
    if (success) {
      setItems(items.filter(item => item.id !== itemId))
    }
  }

  return (
    <div data-testid="master-data-interface">
      <h2>{tableName}</h2>
      
      <button onClick={handleAdd} data-testid="add-button">
        Add Item
      </button>
      
      <div data-testid="items-list">
        {items.map(item => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            <span>{item.name}</span>
            <button 
              onClick={() => handleEdit(item)} 
              data-testid={`edit-${item.id}`}
            >
              Edit
            </button>
            <button 
              onClick={() => handleDelete(item.id)} 
              data-testid={`delete-${item.id}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {isEditing && (
        <div data-testid="edit-form">
          <h3>Editing: {editingItem?.name}</h3>
          <button onClick={handleUpdate} data-testid="save-button">
            Save Changes
          </button>
          <button 
            onClick={() => {
              setIsEditing(false)
              setEditingItem(null)
            }} 
            data-testid="cancel-button"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

describe('CRUD Workflow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock implementations
    mockCRUDHook.addItem.mockResolvedValue(true)
    mockCRUDHook.updateItem.mockResolvedValue(true)
    mockCRUDHook.deleteItem.mockResolvedValue(true)
    mockCRUDHook.refreshItems.mockResolvedValue(undefined)
  })

  describe('Create Operations', () => {
    it('should successfully create a new item', async () => {
      const user = userEvent.setup()
      render(<MockMasterDataInterface tableName="master_countries" />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('items-list')).toBeInTheDocument()
      })

      const initialItemCount = screen.getAllByTestId(/^item-/).length

      // Click add button
      await user.click(screen.getByTestId('add-button'))

      // Verify addItem was called
      expect(mockCRUDHook.addItem).toHaveBeenCalledWith({
        name: 'New Item',
        created_at: expect.any(String),
      })

      // Verify UI updated with new item
      await waitFor(() => {
        const newItemCount = screen.getAllByTestId(/^item-/).length
        expect(newItemCount).toBe(initialItemCount + 1)
      })
    })

    it('should handle create errors gracefully', async () => {
      const user = userEvent.setup()
      mockCRUDHook.addItem.mockResolvedValue(false) // Simulate failure

      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        expect(screen.getByTestId('items-list')).toBeInTheDocument()
      })

      const initialItemCount = screen.getAllByTestId(/^item-/).length

      await user.click(screen.getByTestId('add-button'))

      expect(mockCRUDHook.addItem).toHaveBeenCalled()

      // Verify UI did not update (item count remains same)
      await waitFor(() => {
        const newItemCount = screen.getAllByTestId(/^item-/).length
        expect(newItemCount).toBe(initialItemCount)
      })
    })
  })

  describe('Read Operations', () => {
    it('should display all items from the data source', async () => {
      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        // Should show all test countries
        testCountries.forEach(country => {
          expect(screen.getByText(country.name)).toBeInTheDocument()
        })
      })
    })

    it('should handle empty data sets', async () => {
      render(<MockMasterDataInterface tableName="master_unknown" />)

      await waitFor(() => {
        const itemsList = screen.getByTestId('items-list')
        expect(itemsList).toBeInTheDocument()
        expect(itemsList.children).toHaveLength(0)
      })
    })
  })

  describe('Update Operations', () => {
    it('should successfully update an existing item', async () => {
      const user = userEvent.setup()
      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        expect(screen.getByText(testCountries[0].name)).toBeInTheDocument()
      })

      const firstItem = testCountries[0]

      // Click edit button for first item
      await user.click(screen.getByTestId(`edit-${firstItem.id}`))

      // Verify edit form appears
      expect(screen.getByTestId('edit-form')).toBeInTheDocument()
      expect(screen.getByText(`Editing: ${firstItem.name}`)).toBeInTheDocument()

      // Click save
      await user.click(screen.getByTestId('save-button'))

      // Verify updateItem was called
      expect(mockCRUDHook.updateItem).toHaveBeenCalledWith(
        firstItem.id,
        { name: 'Updated Item' }
      )

      // Verify UI updated
      await waitFor(() => {
        expect(screen.getByText('Updated Item')).toBeInTheDocument()
        expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument()
      })
    })

    it('should allow canceling edit operation', async () => {
      const user = userEvent.setup()
      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        expect(screen.getByText(testCountries[0].name)).toBeInTheDocument()
      })

      const firstItem = testCountries[0]

      // Start editing
      await user.click(screen.getByTestId(`edit-${firstItem.id}`))
      expect(screen.getByTestId('edit-form')).toBeInTheDocument()

      // Cancel editing
      await user.click(screen.getByTestId('cancel-button'))

      // Verify edit form disappears and no update was called
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument()
      expect(mockCRUDHook.updateItem).not.toHaveBeenCalled()
    })

    it('should handle update errors gracefully', async () => {
      const user = userEvent.setup()
      mockCRUDHook.updateItem.mockResolvedValue(false) // Simulate failure

      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        expect(screen.getByText(testCountries[0].name)).toBeInTheDocument()
      })

      const firstItem = testCountries[0]

      await user.click(screen.getByTestId(`edit-${firstItem.id}`))
      await user.click(screen.getByTestId('save-button'))

      expect(mockCRUDHook.updateItem).toHaveBeenCalled()

      // UI should still show edit form since update failed
      await waitFor(() => {
        expect(screen.getByTestId('edit-form')).toBeInTheDocument()
      })
    })
  })

  describe('Delete Operations', () => {
    it('should successfully delete an item', async () => {
      const user = userEvent.setup()
      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        expect(screen.getByText(testCountries[0].name)).toBeInTheDocument()
      })

      const initialItemCount = screen.getAllByTestId(/^item-/).length
      const firstItem = testCountries[0]

      // Click delete button
      await user.click(screen.getByTestId(`delete-${firstItem.id}`))

      // Verify deleteItem was called
      expect(mockCRUDHook.deleteItem).toHaveBeenCalledWith(firstItem.id)

      // Verify item removed from UI
      await waitFor(() => {
        const newItemCount = screen.getAllByTestId(/^item-/).length
        expect(newItemCount).toBe(initialItemCount - 1)
        expect(screen.queryByText(firstItem.name)).not.toBeInTheDocument()
      })
    })

    it('should handle delete errors gracefully', async () => {
      const user = userEvent.setup()
      mockCRUDHook.deleteItem.mockResolvedValue(false) // Simulate failure

      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        expect(screen.getByText(testCountries[0].name)).toBeInTheDocument()
      })

      const initialItemCount = screen.getAllByTestId(/^item-/).length
      const firstItem = testCountries[0]

      await user.click(screen.getByTestId(`delete-${firstItem.id}`))

      expect(mockCRUDHook.deleteItem).toHaveBeenCalledWith(firstItem.id)

      // Verify item still exists in UI since delete failed
      await waitFor(() => {
        const newItemCount = screen.getAllByTestId(/^item-/).length
        expect(newItemCount).toBe(initialItemCount)
        expect(screen.getByText(firstItem.name)).toBeInTheDocument()
      })
    })
  })

  describe('Complete CRUD Workflow', () => {
    it('should handle full create-read-update-delete cycle', async () => {
      const user = userEvent.setup()
      render(<MockMasterDataInterface tableName="master_countries" />)

      // 1. READ: Verify initial data loaded
      await waitFor(() => {
        expect(screen.getByText(testCountries[0].name)).toBeInTheDocument()
      })

      // 2. CREATE: Add new item
      await user.click(screen.getByTestId('add-button'))
      
      await waitFor(() => {
        expect(screen.getByText('New Item')).toBeInTheDocument()
      })

      // 3. UPDATE: Edit the new item
      const newItems = screen.getAllByTestId(/^item-/)
      const newItemId = newItems[newItems.length - 1].getAttribute('data-testid')?.split('-')[1]
      
      if (newItemId) {
        await user.click(screen.getByTestId(`edit-${newItemId}`))
        await user.click(screen.getByTestId('save-button'))
        
        await waitFor(() => {
          expect(screen.getByText('Updated Item')).toBeInTheDocument()
        })

        // 4. DELETE: Remove the item
        await user.click(screen.getByTestId(`delete-${newItemId}`))
        
        await waitFor(() => {
          expect(screen.queryByText('Updated Item')).not.toBeInTheDocument()
        })
      }

      // Verify all CRUD operations were called
      expect(mockCRUDHook.addItem).toHaveBeenCalled()
      expect(mockCRUDHook.updateItem).toHaveBeenCalled()
      expect(mockCRUDHook.deleteItem).toHaveBeenCalled()
    })
  })

  describe('Data Persistence and State Management', () => {
    it('should maintain consistent state across operations', async () => {
      const user = userEvent.setup()
      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        expect(screen.getByTestId('items-list')).toBeInTheDocument()
      })

      // Add multiple items
      await user.click(screen.getByTestId('add-button'))
      await user.click(screen.getByTestId('add-button'))
      
      // Verify state consistency
      await waitFor(() => {
        const items = screen.getAllByTestId(/^item-/)
        expect(items).toHaveLength(testCountries.length + 2)
      })

      // Each operation should maintain data integrity
      expect(mockCRUDHook.addItem).toHaveBeenCalledTimes(2)
    })

    it('should handle concurrent operations correctly', async () => {
      const user = userEvent.setup()
      render(<MockMasterDataInterface tableName="master_countries" />)

      await waitFor(() => {
        expect(screen.getByTestId('items-list')).toBeInTheDocument()
      })

      // Simulate concurrent add operations
      const addPromise1 = user.click(screen.getByTestId('add-button'))
      const addPromise2 = user.click(screen.getByTestId('add-button'))

      await Promise.all([addPromise1, addPromise2])

      // Both operations should complete
      expect(mockCRUDHook.addItem).toHaveBeenCalledTimes(2)
    })
  })
})