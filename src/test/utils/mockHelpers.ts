import { vi } from 'vitest'

// Helper functions for creating mock data
export const createMockMasterDataItem = (overrides = {}) => ({
  id: `test-id-${Date.now()}`,
  name: 'Test Item',
  description: 'Test Description',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_user_created: false,
  version: 1,
  created_by: null,
  ...overrides,
})

export const createMockMembershipFee = (overrides = {}) => ({
  id: `test-fee-${Date.now()}`,
  country: 'United States',
  organization_type: 'Corporation',
  entity_type: 'Seeker',
  annual_amount: 1000,
  annual_currency: 'USD',
  quarterly_amount: 250,
  quarterly_currency: 'USD',
  half_yearly_amount: 500,
  half_yearly_currency: 'USD',
  monthly_amount: 100,
  monthly_currency: 'USD',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createMockHierarchicalData = () => ({
  industrySegment: createMockMasterDataItem({
    name: 'Technology',
    description: 'Technology Industry',
  }),
  domainGroup: createMockMasterDataItem({
    name: 'Software Development',
    industry_segment_id: 'test-industry-id',
  }),
  category: createMockMasterDataItem({
    name: 'Frontend Development',
    domain_group_id: 'test-domain-group-id',
  }),
  subCategory: createMockMasterDataItem({
    name: 'React Development',
    category_id: 'test-category-id',
  }),
})

export const createMockDepartmentHierarchy = () => ({
  department: createMockMasterDataItem({
    name: 'Engineering',
  }),
  subDepartment: createMockMasterDataItem({
    name: 'Frontend Team',
    department_id: 'test-department-id',
  }),
  teamUnit: createMockMasterDataItem({
    name: 'React Team',
    sub_department_id: 'test-sub-department-id',
  }),
})

// Mock hook return values
export const createMockUseMasterDataCRUD = (overrides = {}) => ({
  items: [],
  loading: false,
  addItem: vi.fn().mockResolvedValue(true),
  updateItem: vi.fn().mockResolvedValue(true),
  deleteItem: vi.fn().mockResolvedValue(true),
  refreshItems: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

// Mock Supabase client
export const createMockSupabaseClient = () => ({
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      download: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
})

// Toast mock helper
export const createMockToast = () => ({
  toast: vi.fn(),
  dismiss: vi.fn(),
  // Add other toast methods as needed
})