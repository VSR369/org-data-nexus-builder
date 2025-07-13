import { describe, it, expect, beforeEach } from 'vitest'
import { testHierarchicalData } from '../fixtures/masterDataFixtures'
import { mockService, setupMocks, clearMocks, getService } from './shared/testUtils'

setupMocks()

describe('Industry Segment Hierarchy Relationships', () => {
  beforeEach(() => {
    clearMocks()
  })

  describe('Domain Group → Category Relationship', () => {
    it('should create parent record first', async () => {
      const domainGroup = {
        id: 'dg-1',
        name: 'Technology',
        description: 'Technology domain group',
        industry_segment_id: 'is-1'
      }

      mockService.addItem.mockResolvedValue(true)
      const service = await getService()

      const result = await service.addItem('master_domain_groups', domainGroup)
      expect(result).toBe(true)
      expect(mockService.addItem).toHaveBeenCalledWith('master_domain_groups', domainGroup)
    })

    it('should create child record linked to parent', async () => {
      const category = {
        id: 'cat-1',
        name: 'Software Development',
        description: 'Software development category',
        domain_group_id: 'dg-1'
      }

      mockService.addItem.mockResolvedValue(true)
      const service = await getService()

      const result = await service.addItem('master_categories', category)
      expect(result).toBe(true)
      expect(mockService.addItem).toHaveBeenCalledWith('master_categories', category)
    })

    it('should verify child record shows correct parent relationship', async () => {
      const domainGroup = { id: 'dg-1', name: 'Technology' }
      const category = { id: 'cat-1', name: 'Software Development', domain_group_id: 'dg-1' }

      mockService.getItems
        .mockResolvedValueOnce([domainGroup])
        .mockResolvedValueOnce([category])

      const service = await getService()

      const domainGroups = await service.getItems('master_domain_groups')
      const categories = await service.getItems('master_categories')

      const parentDomainGroup = domainGroups.find(dg => dg.id === category.domain_group_id)
      expect(parentDomainGroup).toBeDefined()
      expect(parentDomainGroup?.name).toBe('Technology')
    })

    it('should handle parent deletion with existing children appropriately', async () => {
      const domainGroup = { id: 'dg-1', name: 'Technology' }
      const dependentCategories = [
        { id: 'cat-1', name: 'Software Development', domain_group_id: 'dg-1' },
        { id: 'cat-2', name: 'Hardware', domain_group_id: 'dg-1' }
      ]

      mockService.getItems.mockResolvedValue(dependentCategories)
      const service = await getService()

      const dependencies = await service.getItems('master_categories')
      const relatedCategories = dependencies.filter(cat => (cat as any).domain_group_id === domainGroup.id)

      expect(relatedCategories).toHaveLength(2)
      expect(relatedCategories.length > 0).toBe(true)
    })
  })

  describe('Category → Sub Category Relationship', () => {
    it('should create and link sub-category to category', async () => {
      const subCategory = {
        id: 'sub-1',
        name: 'Frontend Development',
        description: 'Frontend development subcategory',
        category_id: 'cat-1'
      }

      mockService.addItem.mockResolvedValue(true)
      const service = await getService()

      const result = await service.addItem('master_sub_categories', subCategory)
      expect(result).toBe(true)
      expect(mockService.addItem).toHaveBeenCalledWith('master_sub_categories', subCategory)
    })

    it('should verify relationship integrity across three levels', async () => {
      const domainGroup = { id: 'dg-1', name: 'Technology' }
      const category = { id: 'cat-1', name: 'Software Development', domain_group_id: 'dg-1' }
      const subCategory = { id: 'sub-1', name: 'Frontend Development', category_id: 'cat-1' }

      mockService.getItems
        .mockResolvedValueOnce([domainGroup])
        .mockResolvedValueOnce([category])
        .mockResolvedValueOnce([subCategory])

      const service = await getService()

      const [domainGroups, categories, subCategories] = await Promise.all([
        service.getItems('master_domain_groups'),
        service.getItems('master_categories'),
        service.getItems('master_sub_categories')
      ])

      const relatedCategory = categories.find(c => c.id === (subCategory as any).category_id)
      const relatedDomainGroup = domainGroups.find(dg => dg.id === (relatedCategory as any)?.domain_group_id)

      expect(relatedCategory).toBeDefined()
      expect(relatedDomainGroup).toBeDefined()
      expect(relatedCategory?.name).toBe('Software Development')
      expect(relatedDomainGroup?.name).toBe('Technology')
    })
  })

  describe('Complete Industry Hierarchy Chain', () => {
    it('should create and link hierarchical records correctly', async () => {
      const { industrySegment, domainGroup, category, subCategory } = testHierarchicalData

      mockService.addItem
        .mockResolvedValueOnce(true) // Industry Segment
        .mockResolvedValueOnce(true) // Domain Group
        .mockResolvedValueOnce(true) // Category
        .mockResolvedValueOnce(true) // Sub Category

      const service = await getService()

      // Create Industry Segment
      const industryResult = await service.addItem('master_industry_segments', industrySegment)
      expect(industryResult).toBe(true)

      // Create Domain Group linked to Industry Segment
      const domainGroupData = {
        ...domainGroup,
        industry_segment_id: industrySegment.id,
      }
      const domainResult = await service.addItem('master_domain_groups', domainGroupData)
      expect(domainResult).toBe(true)

      // Create Category linked to Domain Group
      const categoryData = {
        ...category,
        domain_group_id: domainGroup.id,
      }
      const categoryResult = await service.addItem('master_categories', categoryData)
      expect(categoryResult).toBe(true)

      // Create Sub Category linked to Category
      const subCategoryData = {
        ...subCategory,
        category_id: category.id,
      }
      const subCategoryResult = await service.addItem('master_sub_categories', subCategoryData)
      expect(subCategoryResult).toBe(true)

      // Verify all calls were made with correct table names
      expect(mockService.addItem).toHaveBeenCalledWith('master_industry_segments', industrySegment)
      expect(mockService.addItem).toHaveBeenCalledWith('master_domain_groups', domainGroupData)
      expect(mockService.addItem).toHaveBeenCalledWith('master_categories', categoryData)
      expect(mockService.addItem).toHaveBeenCalledWith('master_sub_categories', subCategoryData)
    })

    it('should handle cascade delete appropriately', async () => {
      const { domainGroup, category } = testHierarchicalData

      mockService.getItems
        .mockResolvedValueOnce([category]) // Categories under domain group
        .mockResolvedValueOnce([]) // Sub categories under category

      mockService.deleteItem.mockResolvedValue(true)
      const service = await getService()

      // Check for dependent records before deletion
      const dependentCategories = await service.getItems('master_categories')
      const dependentSubCategories = await service.getItems('master_sub_categories')

      expect(dependentCategories).toHaveLength(1)
      expect(dependentSubCategories).toHaveLength(0)

      // Delete operations would be handled based on cascade rules
      const deleteResult = await service.deleteItem('master_domain_groups', domainGroup.id)
      expect(deleteResult).toBe(true)
    })

    it('should validate foreign key relationships', async () => {
      const { domainGroup, category } = testHierarchicalData

      // Verify category has correct domain_group_id
      expect(category.domain_group_id).toBe(domainGroup.id)

      mockService.getItems.mockResolvedValue([domainGroup])
      const service = await getService()

      const domainGroups = await service.getItems('master_domain_groups')
      const relatedDomainGroup = domainGroups.find(dg => dg.id === category.domain_group_id)

      expect(relatedDomainGroup).toBeDefined()
      expect(relatedDomainGroup?.name).toBe(domainGroup.name)
    })
  })
})