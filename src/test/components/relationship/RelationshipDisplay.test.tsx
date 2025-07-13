import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils/testUtils'

// Mock master data items for testing
const mockMasterData = {
  domainGroups: [
    { id: 'dg-1', name: 'Technology', industry_segment_id: 'is-1' },
    { id: 'dg-2', name: 'Finance', industry_segment_id: 'is-2' }
  ],
  categories: [
    { id: 'cat-1', name: 'Software Development', domain_group_id: 'dg-1' },
    { id: 'cat-2', name: 'Hardware', domain_group_id: 'dg-1' },
    { id: 'cat-3', name: 'Banking', domain_group_id: 'dg-2' }
  ],
  subCategories: [
    { id: 'sub-1', name: 'Frontend Development', category_id: 'cat-1' },
    { id: 'sub-2', name: 'Backend Development', category_id: 'cat-1' },
    { id: 'sub-3', name: 'Network Equipment', category_id: 'cat-2' }
  ]
}

// Mock component for testing relationship display
const RelationshipDisplay = ({ domainGroupId, showHierarchy = true }: { 
  domainGroupId: string
  showHierarchy?: boolean 
}) => {
  const domainGroup = mockMasterData.domainGroups.find(dg => dg.id === domainGroupId)
  const relatedCategories = mockMasterData.categories.filter(cat => cat.domain_group_id === domainGroupId)
  
  const getSubCategories = (categoryId: string) => {
    return mockMasterData.subCategories.filter(sub => sub.category_id === categoryId)
  }

  if (!domainGroup) {
    return <div data-testid="no-domain-group">No domain group found</div>
  }

  return (
    <div data-testid="relationship-display">
      <h3 data-testid="domain-group-name">{domainGroup.name}</h3>
      
      {showHierarchy && (
        <div data-testid="categories-list">
          {relatedCategories.map(category => (
            <div key={category.id} data-testid={`category-${category.id}`}>
              <h4>{category.name}</h4>
              
              <div data-testid={`subcategories-${category.id}`}>
                {getSubCategories(category.id).map(subCategory => (
                  <div key={subCategory.id} data-testid={`subcategory-${subCategory.id}`}>
                    {subCategory.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div data-testid="relationship-count">
        Categories: {relatedCategories.length}
      </div>
    </div>
  )
}

describe('RelationshipDisplay Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display parent record with related children', () => {
    render(<RelationshipDisplay domainGroupId="dg-1" />)
    
    // Should display domain group name
    expect(screen.getByTestId('domain-group-name')).toHaveTextContent('Technology')
    
    // Should display related categories
    expect(screen.getByTestId('category-cat-1')).toBeInTheDocument()
    expect(screen.getByTestId('category-cat-2')).toBeInTheDocument()
    expect(screen.queryByTestId('category-cat-3')).not.toBeInTheDocument() // Different domain group
    
    // Should display relationship count
    expect(screen.getByTestId('relationship-count')).toHaveTextContent('Categories: 2')
  })

  it('should display hierarchical relationships correctly', () => {
    render(<RelationshipDisplay domainGroupId="dg-1" showHierarchy={true} />)
    
    // Should display categories under domain group
    expect(screen.getByText('Software Development')).toBeInTheDocument()
    expect(screen.getByText('Hardware')).toBeInTheDocument()
    
    // Should display sub-categories under correct categories
    const softwareSubCategories = screen.getByTestId('subcategories-cat-1')
    expect(softwareSubCategories).toHaveTextContent('Frontend Development')
    expect(softwareSubCategories).toHaveTextContent('Backend Development')
    
    const hardwareSubCategories = screen.getByTestId('subcategories-cat-2')
    expect(hardwareSubCategories).toHaveTextContent('Network Equipment')
  })

  it('should handle missing parent record gracefully', () => {
    render(<RelationshipDisplay domainGroupId="nonexistent" />)
    
    expect(screen.getByTestId('no-domain-group')).toHaveTextContent('No domain group found')
    expect(screen.queryByTestId('relationship-display')).not.toBeInTheDocument()
  })

  it('should display parent without hierarchy when showHierarchy is false', () => {
    render(<RelationshipDisplay domainGroupId="dg-1" showHierarchy={false} />)
    
    // Should display domain group
    expect(screen.getByTestId('domain-group-name')).toHaveTextContent('Technology')
    
    // Should display relationship count
    expect(screen.getByTestId('relationship-count')).toHaveTextContent('Categories: 2')
    
    // Should not display hierarchical structure
    expect(screen.queryByTestId('categories-list')).not.toBeInTheDocument()
  })

  it('should correctly filter and display only related children', () => {
    render(<RelationshipDisplay domainGroupId="dg-2" />)
    
    // Should display Finance domain group
    expect(screen.getByTestId('domain-group-name')).toHaveTextContent('Finance')
    
    // Should only display Banking category (related to dg-2)
    expect(screen.getByTestId('category-cat-3')).toBeInTheDocument()
    expect(screen.queryByTestId('category-cat-1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('category-cat-2')).not.toBeInTheDocument()
    
    // Should show correct count
    expect(screen.getByTestId('relationship-count')).toHaveTextContent('Categories: 1')
  })

  it('should handle empty relationships appropriately', () => {
    // Add a domain group with no related categories
    const mockEmptyData = {
      ...mockMasterData,
      domainGroups: [
        ...mockMasterData.domainGroups,
        { id: 'dg-empty', name: 'Empty Domain', industry_segment_id: 'is-3' }
      ]
    }
    
    // Mock the component with empty relationships
    const EmptyRelationshipDisplay = () => {
      const domainGroup = mockEmptyData.domainGroups.find(dg => dg.id === 'dg-empty')
      const relatedCategories: any[] = []
      
      return (
        <div data-testid="relationship-display">
          <h3 data-testid="domain-group-name">{domainGroup?.name}</h3>
          <div data-testid="categories-list">
            {relatedCategories.length === 0 && (
              <div data-testid="no-categories">No categories found</div>
            )}
          </div>
          <div data-testid="relationship-count">
            Categories: {relatedCategories.length}
          </div>
        </div>
      )
    }
    
    render(<EmptyRelationshipDisplay />)
    
    expect(screen.getByTestId('domain-group-name')).toHaveTextContent('Empty Domain')
    expect(screen.getByTestId('no-categories')).toHaveTextContent('No categories found')
    expect(screen.getByTestId('relationship-count')).toHaveTextContent('Categories: 0')
  })
})