import { http, HttpResponse } from 'msw'

// Mock data for testing
export const mockMasterData = {
  countries: [
    { id: '1', name: 'United States', code: 'US', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Canada', code: 'CA', created_at: '2024-01-01T00:00:00Z' },
  ],
  currencies: [
    { id: '1', name: 'US Dollar', code: 'USD', symbol: '$', country: 'United States' },
    { id: '2', name: 'Canadian Dollar', code: 'CAD', symbol: 'C$', country: 'Canada' },
  ],
  organizationTypes: [
    { id: '1', name: 'Corporation', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'LLC', created_at: '2024-01-01T00:00:00Z' },
  ],
  entityTypes: [
    { id: '1', name: 'Seeker', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Solver', created_at: '2024-01-01T00:00:00Z' },
  ],
  industrySegments: [
    { id: '1', name: 'Technology', description: 'Tech industry', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Healthcare', description: 'Healthcare industry', created_at: '2024-01-01T00:00:00Z' },
  ],
  domainGroups: [
    { id: '1', name: 'Software Development', industry_segment_id: '1', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Medical Devices', industry_segment_id: '2', created_at: '2024-01-01T00:00:00Z' },
  ],
  categories: [
    { id: '1', name: 'Frontend Development', domain_group_id: '1', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Backend Development', domain_group_id: '1', created_at: '2024-01-01T00:00:00Z' },
  ],
  subCategories: [
    { id: '1', name: 'React Development', category_id: '1', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Vue Development', category_id: '1', created_at: '2024-01-01T00:00:00Z' },
  ],
  departments: [
    { id: '1', name: 'Engineering', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Marketing', created_at: '2024-01-01T00:00:00Z' },
  ],
  subDepartments: [
    { id: '1', name: 'Frontend Team', department_id: '1', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Backend Team', department_id: '1', created_at: '2024-01-01T00:00:00Z' },
  ],
  teamUnits: [
    { id: '1', name: 'React Team', sub_department_id: '1', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Node.js Team', sub_department_id: '2', created_at: '2024-01-01T00:00:00Z' },
  ],
  membershipFees: [
    {
      id: '1',
      country: 'United States',
      organization_type: 'Corporation',
      entity_type: 'Seeker',
      annual_amount: 1000,
      annual_currency: 'USD',
      quarterly_amount: 250,
      quarterly_currency: 'USD',
      created_at: '2024-01-01T00:00:00Z'
    }
  ]
}

export const masterDataHandlers = [
  // Countries
  http.get('/rest/v1/master_countries*', () => {
    return HttpResponse.json(mockMasterData.countries)
  }),
  
  http.post('/rest/v1/master_countries', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.countries.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Currencies
  http.get('/rest/v1/master_currencies*', () => {
    return HttpResponse.json(mockMasterData.currencies)
  }),

  http.post('/rest/v1/master_currencies', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.currencies.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Organization Types
  http.get('/rest/v1/master_organization_types*', () => {
    return HttpResponse.json(mockMasterData.organizationTypes)
  }),

  http.post('/rest/v1/master_organization_types', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.organizationTypes.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Entity Types
  http.get('/rest/v1/master_entity_types*', () => {
    return HttpResponse.json(mockMasterData.entityTypes)
  }),

  http.post('/rest/v1/master_entity_types', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.entityTypes.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Industry Segments
  http.get('/rest/v1/master_industry_segments*', () => {
    return HttpResponse.json(mockMasterData.industrySegments)
  }),

  http.post('/rest/v1/master_industry_segments', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.industrySegments.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Domain Groups
  http.get('/rest/v1/master_domain_groups*', () => {
    return HttpResponse.json(mockMasterData.domainGroups)
  }),

  http.post('/rest/v1/master_domain_groups', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.domainGroups.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Categories
  http.get('/rest/v1/master_categories*', () => {
    return HttpResponse.json(mockMasterData.categories)
  }),

  http.post('/rest/v1/master_categories', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.categories.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Sub Categories
  http.get('/rest/v1/master_sub_categories*', () => {
    return HttpResponse.json(mockMasterData.subCategories)
  }),

  http.post('/rest/v1/master_sub_categories', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.subCategories.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Departments
  http.get('/rest/v1/master_departments*', () => {
    return HttpResponse.json(mockMasterData.departments)
  }),

  http.post('/rest/v1/master_departments', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.departments.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Sub Departments
  http.get('/rest/v1/master_sub_departments*', () => {
    return HttpResponse.json(mockMasterData.subDepartments)
  }),

  http.post('/rest/v1/master_sub_departments', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.subDepartments.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Team Units
  http.get('/rest/v1/master_team_units*', () => {
    return HttpResponse.json(mockMasterData.teamUnits)
  }),

  http.post('/rest/v1/master_team_units', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.teamUnits.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Membership Fees
  http.get('/rest/v1/master_seeker_membership_fees*', () => {
    return HttpResponse.json(mockMasterData.membershipFees)
  }),

  http.post('/rest/v1/master_seeker_membership_fees', async ({ request }) => {
    const newItem = await request.json() as any
    const item = { ...newItem, id: Date.now().toString(), created_at: new Date().toISOString() }
    mockMasterData.membershipFees.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),
]