// Test fixtures for master data entities
export const testCountries = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'United States',
    code: 'US',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Canada',
    code: 'CA',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testCurrencies = [
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'US Dollar',
    code: 'USD',
    symbol: '$',
    country: 'United States',
    country_code: 'US',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Canadian Dollar',
    code: 'CAD',
    symbol: 'C$',
    country: 'Canada',
    country_code: 'CA',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testOrganizationTypes = [
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Corporation',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'LLC',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testEntityTypes = [
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Seeker',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Solver',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testIndustrySegments = [
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Technology',
    description: 'Technology and software industry',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Healthcare',
    description: 'Healthcare and medical industry',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testDomainGroups = [
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'Software Development',
    description: 'Software development and engineering',
    industry_segment_id: '550e8400-e29b-41d4-a716-446655440009',
    hierarchy: { categories: [] },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testCategories = [
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'Frontend Development',
    description: 'Frontend web development',
    domain_group_id: '550e8400-e29b-41d4-a716-446655440011',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testSubCategories = [
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'React Development',
    description: 'React.js development',
    category_id: '550e8400-e29b-41d4-a716-446655440012',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testDepartments = [
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    name: 'Engineering',
    description: 'Engineering department',
    organization_name: 'Test Company',
    organization_id: 'test-org-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testSubDepartments = [
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    name: 'Frontend Team',
    description: 'Frontend development team',
    department_id: '550e8400-e29b-41d4-a716-446655440014',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testTeamUnits = [
  {
    id: '550e8400-e29b-41d4-a716-446655440016',
    name: 'React Team',
    description: 'React development team',
    sub_department_id: '550e8400-e29b-41d4-a716-446655440015',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

export const testMembershipFees = [
  {
    id: '550e8400-e29b-41d4-a716-446655440017',
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
    description: 'Standard membership fee',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_user_created: false,
    version: 1,
    created_by: null,
  },
]

// Complete hierarchical test data
export const testHierarchicalData = {
  industrySegment: testIndustrySegments[0],
  domainGroup: testDomainGroups[0],
  category: testCategories[0],
  subCategory: testSubCategories[0],
}

export const testDepartmentHierarchy = {
  department: testDepartments[0],
  subDepartment: testSubDepartments[0],
  teamUnit: testTeamUnits[0],
}

export const testCountryCurrencyRelation = {
  country: testCountries[0],
  currency: testCurrencies[0],
}