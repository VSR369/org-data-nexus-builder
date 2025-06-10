
import { useState, useEffect } from 'react';
import { IndustrySegment, DomainGroup, Category, SubCategory } from '../types';

// Mock industry segments data - in real app, this would come from API
const mockIndustrySegments: IndustrySegment[] = [
  { id: '1', name: 'Banking, Financial Services & Insurance (BFSI)', code: 'bfsi' },
  { id: '2', name: 'Retail & E-Commerce', code: 'retail' },
  { id: '3', name: 'Healthcare & Life Sciences', code: 'healthcare' },
  { id: '4', name: 'Information Technology & Software Services', code: 'it' },
  { id: '5', name: 'Telecommunications', code: 'telecom' },
  { id: '6', name: 'Education & EdTech', code: 'education' },
  { id: '7', name: 'Manufacturing', code: 'manufacturing' },
  { id: '8', name: 'Logistics & Supply Chain', code: 'logistics' }
];

// Default structure that will be replicated for all industry segments
const createDefaultStructure = (industrySegmentId: string): { domainGroups: DomainGroup[], categories: Category[], subCategories: SubCategory[] } => {
  const timestamp = new Date().toISOString();
  
  // Domain Groups
  const domainGroups: DomainGroup[] = [
    { id: `${industrySegmentId}-dg-1`, name: 'Strategy, Innovation & Growth', description: 'Strategic planning, innovation, and business growth initiatives', industrySegmentId, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-dg-2`, name: 'Operations, Delivery, Risk & Sustainability', description: 'Operational excellence, delivery management, risk mitigation, and sustainability practices', industrySegmentId, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-dg-3`, name: 'People, Culture & Change', description: 'Human resources, organizational culture, and change management', industrySegmentId, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-dg-4`, name: 'Technology & Digital Transformation', description: 'Technology implementation, digital transformation, and IT strategy', industrySegmentId, isActive: true, createdAt: timestamp }
  ];

  // Categories
  const categories: Category[] = [
    // Group 1: Strategy, Innovation & Growth
    { id: `${industrySegmentId}-cat-1-1`, name: 'Strategic Vision & Business Planning', description: 'Vision alignment and strategic planning frameworks', domainGroupId: `${industrySegmentId}-dg-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-1-2`, name: 'Business Model & Value Proposition Design', description: 'Revenue models and value proposition development', domainGroupId: `${industrySegmentId}-dg-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-1-3`, name: 'Outcome Measurement & Business Value Realization', description: 'ROI analysis and benefits realization management', domainGroupId: `${industrySegmentId}-dg-1`, isActive: true, createdAt: timestamp },
    
    // Group 2: Operations, Delivery, Risk & Sustainability
    { id: `${industrySegmentId}-cat-2-1`, name: 'Product & Systems Development Excellence', description: 'Product development and systems architecture', domainGroupId: `${industrySegmentId}-dg-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-2-2`, name: 'Service Design & Customer Experience', description: 'Customer journey and service design', domainGroupId: `${industrySegmentId}-dg-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-2-3`, name: 'Process Excellence & Core Functions', description: 'Process optimization and functional excellence', domainGroupId: `${industrySegmentId}-dg-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-2-4`, name: 'Compliance, Risk & Regulatory Governance', description: 'Risk management and regulatory compliance', domainGroupId: `${industrySegmentId}-dg-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-2-5`, name: 'ESG & Sustainability Strategy', description: 'Environmental, social, and governance initiatives', domainGroupId: `${industrySegmentId}-dg-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-2-6`, name: 'Global / Regional Delivery Capability', description: 'Multi-region operations and delivery capabilities', domainGroupId: `${industrySegmentId}-dg-2`, isActive: true, createdAt: timestamp },
    
    // Group 3: People, Culture & Change
    { id: `${industrySegmentId}-cat-3-1`, name: 'Talent Management & Organizational Culture', description: 'Talent development and cultural transformation', domainGroupId: `${industrySegmentId}-dg-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-3-2`, name: 'Operating Model & Organizational Structure', description: 'Organizational design and governance structures', domainGroupId: `${industrySegmentId}-dg-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-3-3`, name: 'Digital Workplace & Workforce Enablement', description: 'Digital tools and workforce productivity solutions', domainGroupId: `${industrySegmentId}-dg-3`, isActive: true, createdAt: timestamp },
    
    // Group 4: Technology & Digital Transformation
    { id: `${industrySegmentId}-cat-4-1`, name: 'Technology & Digital Transformation', description: 'Technology infrastructure and digital transformation', domainGroupId: `${industrySegmentId}-dg-4`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-cat-4-2`, name: 'Data Strategy & Decision Intelligence', description: 'Data analytics and decision intelligence systems', domainGroupId: `${industrySegmentId}-dg-4`, isActive: true, createdAt: timestamp }
  ];

  // Sub-Categories
  const subCategories: SubCategory[] = [
    // Strategic Vision & Business Planning
    { id: `${industrySegmentId}-sub-1-1-1`, name: 'Vision, Mission, and Goals Alignment', description: 'Ensuring organizational vision, mission, and strategic goals are aligned and clearly communicated', categoryId: `${industrySegmentId}-cat-1-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-1-2`, name: 'Strategic Planning Frameworks', description: 'Using structured tools like SWOT, PESTLE, or Balanced Scorecards for strategic planning', categoryId: `${industrySegmentId}-cat-1-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-1-3`, name: 'Competitive Positioning', description: 'Identifying and strengthening the organization\'s differentiation in the marketplace', categoryId: `${industrySegmentId}-cat-1-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-1-4`, name: 'Long-Term Scenario Thinking', description: 'Planning for various future scenarios to remain resilient and adaptive', categoryId: `${industrySegmentId}-cat-1-1`, isActive: true, createdAt: timestamp },
    
    // Business Model & Value Proposition Design
    { id: `${industrySegmentId}-sub-1-2-1`, name: 'Revenue Models & Monetization', description: 'Designing and optimizing revenue generation strategies', categoryId: `${industrySegmentId}-cat-1-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-2-2`, name: 'Customer Segments & Value Mapping', description: 'Identifying key customer groups and tailoring value propositions for each', categoryId: `${industrySegmentId}-cat-1-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-2-3`, name: 'Partner Ecosystem Design', description: 'Structuring collaborative networks with suppliers, partners, and platforms', categoryId: `${industrySegmentId}-cat-1-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-2-4`, name: 'Business Sustainability Models', description: 'Integrating sustainable practices into business models for long-term viability', categoryId: `${industrySegmentId}-cat-1-2`, isActive: true, createdAt: timestamp },
    
    // Outcome Measurement & Business Value Realization
    { id: `${industrySegmentId}-sub-1-3-1`, name: 'ROI Analysis & Impact Metrics', description: 'Measuring return on investments and defining key impact indicators', categoryId: `${industrySegmentId}-cat-1-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-3-2`, name: 'Benefits Realization Management', description: 'Ensuring projects deliver intended benefits aligned with strategic goals', categoryId: `${industrySegmentId}-cat-1-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-3-3`, name: 'Outcome-based Contracting', description: 'Structuring contracts based on outcome delivery rather than inputs or activities', categoryId: `${industrySegmentId}-cat-1-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-1-3-4`, name: 'Value Assurance Reviews', description: 'Periodic reviews to ensure value creation throughout project or initiative lifecycles', categoryId: `${industrySegmentId}-cat-1-3`, isActive: true, createdAt: timestamp },
    
    // Product & Systems Development Excellence
    { id: `${industrySegmentId}-sub-2-1-1`, name: 'Requirement Analysis & Specification', description: 'Capturing and documenting functional and non-functional requirements', categoryId: `${industrySegmentId}-cat-2-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-1-2`, name: 'System Design Architecture', description: 'Designing scalable and robust systems architecture', categoryId: `${industrySegmentId}-cat-2-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-1-3`, name: 'Prototyping & Iterative Development', description: 'Rapid design-build-test cycles to evolve solutions', categoryId: `${industrySegmentId}-cat-2-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-1-4`, name: 'Quality & Reliability Engineering', description: 'Ensuring consistency, safety, and reliability of products/services', categoryId: `${industrySegmentId}-cat-2-1`, isActive: true, createdAt: timestamp },
    
    // Service Design & Customer Experience
    { id: `${industrySegmentId}-sub-2-2-1`, name: 'Journey Mapping & Service Blueprinting', description: 'Visualizing customer interactions and backend systems to improve services', categoryId: `${industrySegmentId}-cat-2-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-2-2`, name: 'Omnichannel Experience Strategy', description: 'Designing seamless experiences across physical and digital channels', categoryId: `${industrySegmentId}-cat-2-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-2-3`, name: 'Customer Feedback Integration', description: 'Embedding user feedback loops into service refinement', categoryId: `${industrySegmentId}-cat-2-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-2-4`, name: 'Personalization & Accessibility', description: 'Customizing experiences and ensuring inclusivity', categoryId: `${industrySegmentId}-cat-2-2`, isActive: true, createdAt: timestamp },
    
    // Process Excellence & Core Functions
    { id: `${industrySegmentId}-sub-2-3-1`, name: 'Sales, Marketing, Finance, HR, Ops, SCM', description: 'Functional performance across all core departments', categoryId: `${industrySegmentId}-cat-2-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-3-2`, name: 'SOP Development', description: 'Creating standard operating procedures to ensure consistency', categoryId: `${industrySegmentId}-cat-2-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-3-3`, name: 'KPI/OKR Definition', description: 'Setting Key Performance Indicators and Objectives & Key Results for teams', categoryId: `${industrySegmentId}-cat-2-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-3-4`, name: 'Continuous Improvement (Lean, Six Sigma)', description: 'Using proven methodologies for process and performance improvement', categoryId: `${industrySegmentId}-cat-2-3`, isActive: true, createdAt: timestamp },
    
    // Compliance, Risk & Regulatory Governance
    { id: `${industrySegmentId}-sub-2-4-1`, name: 'Stakeholder Engagement', description: 'Involving and aligning internal and external stakeholders to mitigate risks', categoryId: `${industrySegmentId}-cat-2-4`, isActive: true, createdAt: timestamp },
    
    // ESG & Sustainability Strategy
    { id: `${industrySegmentId}-sub-2-5-1`, name: 'Carbon Footprint & Green IT', description: 'Reducing environmental impact through sustainable IT and operations', categoryId: `${industrySegmentId}-cat-2-5`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-5-2`, name: 'Circular Economy Practices', description: 'Promoting reuse, recycling, and cradle-to-cradle design', categoryId: `${industrySegmentId}-cat-2-5`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-5-3`, name: 'Ethical Governance Frameworks', description: 'Establishing values-driven, transparent decision-making systems', categoryId: `${industrySegmentId}-cat-2-5`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-5-4`, name: 'Social Responsibility Programs', description: 'Designing and running initiatives for social impact', categoryId: `${industrySegmentId}-cat-2-5`, isActive: true, createdAt: timestamp },
    
    // Global / Regional Delivery Capability
    { id: `${industrySegmentId}-sub-2-6-1`, name: 'Multi-Region Operations', description: 'Managing operations across geographies with consistency', categoryId: `${industrySegmentId}-cat-2-6`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-6-2`, name: 'Countries Worked', description: 'Select the applicable countries', categoryId: `${industrySegmentId}-cat-2-6`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-6-3`, name: 'Regulatory & Localization Readiness', description: 'Ensuring compliance with regional regulations and local needs', categoryId: `${industrySegmentId}-cat-2-6`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-6-4`, name: 'Delivery Center Strategy', description: 'Designing and operating efficient delivery hubs in different regions/countries', categoryId: `${industrySegmentId}-cat-2-6`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-2-6-5`, name: 'Time Zone & Language Support', description: 'Supporting global teams and customers across languages and time zones', categoryId: `${industrySegmentId}-cat-2-6`, isActive: true, createdAt: timestamp },
    
    // Talent Management & Organizational Culture
    { id: `${industrySegmentId}-sub-3-1-1`, name: 'Stakeholder Engagement', description: 'Engaging leadership, employees, and partners during change or growth', categoryId: `${industrySegmentId}-cat-3-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-1-2`, name: 'Communication Planning', description: 'Crafting effective internal and external communication strategies', categoryId: `${industrySegmentId}-cat-3-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-1-3`, name: 'Cultural Assessment & Transformation', description: 'Evaluating and evolving organizational values, beliefs, and behaviors', categoryId: `${industrySegmentId}-cat-3-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-1-4`, name: 'Adoption & Training Programs', description: 'Preparing people to embrace new processes, tools, and mindsets', categoryId: `${industrySegmentId}-cat-3-1`, isActive: true, createdAt: timestamp },
    
    // Operating Model & Organizational Structure
    { id: `${industrySegmentId}-sub-3-2-1`, name: 'Role Clarity & Governance Structure', description: 'Defining responsibilities and decision-making structures', categoryId: `${industrySegmentId}-cat-3-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-2-2`, name: 'Decision Rights Allocation', description: 'Clarifying who decides what and at which level', categoryId: `${industrySegmentId}-cat-3-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-2-3`, name: 'Centralization vs. Decentralization', description: 'Structuring operations to balance autonomy and control', categoryId: `${industrySegmentId}-cat-3-2`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-2-4`, name: 'Shared Services Design', description: 'Creating internal service hubs for scale and efficiency', categoryId: `${industrySegmentId}-cat-3-2`, isActive: true, createdAt: timestamp },
    
    // Digital Workplace & Workforce Enablement
    { id: `${industrySegmentId}-sub-3-3-1`, name: 'Collaboration Tools & Digital Adoption', description: 'Using tools like Slack, Teams, Notion to boost team collaboration', categoryId: `${industrySegmentId}-cat-3-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-3-2`, name: 'Hybrid/Remote Work Enablement', description: 'Supporting flexible work arrangements with appropriate systems', categoryId: `${industrySegmentId}-cat-3-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-3-3`, name: 'Workforce Productivity Solutions', description: 'Enhancing employee output using automation, apps, and analytics', categoryId: `${industrySegmentId}-cat-3-3`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-3-3-4`, name: 'Employee Experience Platforms', description: 'Tools and systems to improve engagement, well-being, and satisfaction', categoryId: `${industrySegmentId}-cat-3-3`, isActive: true, createdAt: timestamp },
    
    // Technology & Digital Transformation
    { id: `${industrySegmentId}-sub-4-1-1`, name: 'Enterprise Architecture', description: 'Designing IT infrastructure and digital systems aligned to business goals', categoryId: `${industrySegmentId}-cat-4-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-4-1-2`, name: 'Cloud & Edge Infrastructure', description: 'Leveraging cloud and edge computing for scalability and efficiency', categoryId: `${industrySegmentId}-cat-4-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-4-1-3`, name: 'API & Integration Frameworks', description: 'Enabling interoperability across systems via robust APIs', categoryId: `${industrySegmentId}-cat-4-1`, isActive: true, createdAt: timestamp },
    { id: `${industrySegmentId}-sub-4-1-4`, name: 'DevSecOps & Cybersecurity', description: 'Embedding security into the software development lifecycle', categoryId: `${industrySegmentId}-cat-4-1`, isActive: true, createdAt: timestamp },
    
    // Data Strategy & Decision Intelligence
    { id: `${industrySegmentId}-sub-4-2-1`, name: 'KPI/OKR Definition', description: 'Leveraging performance metrics for data-driven decision making', categoryId: `${industrySegmentId}-cat-4-2`, isActive: true, createdAt: timestamp }
  ];

  return { domainGroups, categories, subCategories };
};

export const useDomainGroupsData = () => {
  const [industrySegments] = useState<IndustrySegment[]>(mockIndustrySegments);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  const [selectedDomainGroup, setSelectedDomainGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Initialize default data for all industry segments
  useEffect(() => {
    let allDomainGroups: DomainGroup[] = [];
    let allCategories: Category[] = [];
    let allSubCategories: SubCategory[] = [];

    industrySegments.forEach(segment => {
      const defaultData = createDefaultStructure(segment.id);
      allDomainGroups = [...allDomainGroups, ...defaultData.domainGroups];
      allCategories = [...allCategories, ...defaultData.categories];
      allSubCategories = [...allSubCategories, ...defaultData.subCategories];
    });

    setDomainGroups(allDomainGroups);
    setCategories(allCategories);
    setSubCategories(allSubCategories);
  }, []);

  // Filter data based on selections
  const filteredDomainGroups = domainGroups.filter(
    group => !selectedIndustrySegment || group.industrySegmentId === selectedIndustrySegment
  );

  const filteredCategories = categories.filter(
    category => !selectedDomainGroup || category.domainGroupId === selectedDomainGroup
  );

  const filteredSubCategories = subCategories.filter(
    subCategory => !selectedCategory || subCategory.categoryId === selectedCategory
  );

  // Domain Group operations
  const addDomainGroup = (group: Omit<DomainGroup, 'id' | 'createdAt'>) => {
    const newGroup: DomainGroup = {
      ...group,
      id: `${group.industrySegmentId}-dg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDomainGroups(prev => [...prev, newGroup]);
  };

  const updateDomainGroup = (id: string, updates: Partial<DomainGroup>) => {
    setDomainGroups(prev => prev.map(group => 
      group.id === id ? { ...group, ...updates } : group
    ));
  };

  const deleteDomainGroup = (id: string) => {
    setDomainGroups(prev => prev.filter(group => group.id !== id));
    // Also delete related categories and sub-categories
    const relatedCategories = categories.filter(cat => cat.domainGroupId === id);
    relatedCategories.forEach(cat => {
      setSubCategories(prev => prev.filter(sub => sub.categoryId !== cat.id));
    });
    setCategories(prev => prev.filter(cat => cat.domainGroupId !== id));
  };

  // Category operations
  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: `${category.domainGroupId}-cat-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    // Also delete related sub-categories
    setSubCategories(prev => prev.filter(sub => sub.categoryId !== id));
  };

  // Sub-Category operations
  const addSubCategory = (subCategory: Omit<SubCategory, 'id' | 'createdAt'>) => {
    const newSubCategory: SubCategory = {
      ...subCategory,
      id: `${subCategory.categoryId}-sub-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSubCategories(prev => [...prev, newSubCategory]);
  };

  const updateSubCategory = (id: string, updates: Partial<SubCategory>) => {
    setSubCategories(prev => prev.map(subCategory => 
      subCategory.id === id ? { ...subCategory, ...updates } : subCategory
    ));
  };

  const deleteSubCategory = (id: string) => {
    setSubCategories(prev => prev.filter(subCategory => subCategory.id !== id));
  };

  return {
    industrySegments,
    domainGroups: filteredDomainGroups,
    categories: filteredCategories,
    subCategories: filteredSubCategories,
    selectedIndustrySegment,
    selectedDomainGroup,
    selectedCategory,
    setSelectedIndustrySegment,
    setSelectedDomainGroup,
    setSelectedCategory,
    addDomainGroup,
    updateDomainGroup,
    deleteDomainGroup,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  };
};
