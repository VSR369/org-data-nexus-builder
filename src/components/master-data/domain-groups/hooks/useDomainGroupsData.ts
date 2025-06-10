import { useState, useEffect } from 'react';
import { DomainGroup, Category, SubCategory } from '../types';

const mockIndustrySegments = [
  { id: '1', name: 'Banking, Financial Services and Insurance (BFSI)', description: 'Financial sector including banks, insurance, and investment services' },
  { id: '2', name: 'Information Technology (IT)', description: 'Technology companies, software development, and IT services' },
  { id: '3', name: 'Healthcare', description: 'Medical services, pharmaceuticals, and health technology' },
  { id: '4', name: 'Retail', description: 'Consumer goods, e-commerce, and retail services' },
  { id: '5', name: 'Manufacturing', description: 'Industrial production and manufacturing processes' },
  { id: '6', name: 'Education', description: 'Educational institutions and learning technology' },
  { id: '7', name: 'Government', description: 'Public sector and government services' },
  { id: '8', name: 'Energy & Utilities', description: 'Power generation, utilities, and energy services' },
];

const defaultDomainGroupsData: DomainGroup[] = [
  {
    id: '1',
    name: 'Strategy, Innovation & Growth',
    industrySegmentId: '',
    categories: [
      {
        id: '1-1',
        name: 'Strategic Vision & Business Planning',
        domainGroupId: '1',
        subCategories: [
          {
            id: '1-1-1',
            name: 'Vision, Mission, and Goals Alignment',
            categoryId: '1-1',
            description: 'Ensuring organizational vision, mission, and strategic goals are aligned and clearly communicated.'
          },
          {
            id: '1-1-2',
            name: 'Strategic Planning Frameworks',
            categoryId: '1-1',
            description: 'Using structured tools like SWOT, PESTLE, or Balanced Scorecards for strategic planning.'
          },
          {
            id: '1-1-3',
            name: 'Competitive Positioning',
            categoryId: '1-1',
            description: 'Identifying and strengthening the organization\'s differentiation in the marketplace.'
          },
          {
            id: '1-1-4',
            name: 'Long-Term Scenario Thinking',
            categoryId: '1-1',
            description: 'Planning for various future scenarios to remain resilient and adaptive.'
          }
        ]
      },
      {
        id: '1-2',
        name: 'Business Model & Value Proposition Design',
        domainGroupId: '1',
        subCategories: [
          {
            id: '1-2-1',
            name: 'Revenue Models & Monetization',
            categoryId: '1-2',
            description: 'Designing and optimizing revenue generation strategies.'
          },
          {
            id: '1-2-2',
            name: 'Customer Segments & Value Mapping',
            categoryId: '1-2',
            description: 'Identifying key customer groups and tailoring value propositions for each.'
          },
          {
            id: '1-2-3',
            name: 'Partner Ecosystem Design',
            categoryId: '1-2',
            description: 'Structuring collaborative networks with suppliers, partners, and platforms.'
          },
          {
            id: '1-2-4',
            name: 'Business Sustainability Models',
            categoryId: '1-2',
            description: 'Integrating sustainable practices into business models for long-term viability.'
          }
        ]
      },
      {
        id: '1-3',
        name: 'Outcome Measurement & Business Value Realization',
        domainGroupId: '1',
        subCategories: [
          {
            id: '1-3-1',
            name: 'ROI Analysis & Impact Metrics',
            categoryId: '1-3',
            description: 'Measuring return on investments and defining key impact indicators.'
          },
          {
            id: '1-3-2',
            name: 'Benefits Realization Management',
            categoryId: '1-3',
            description: 'Ensuring projects deliver intended benefits aligned with strategic goals.'
          },
          {
            id: '1-3-3',
            name: 'Outcome-based Contracting',
            categoryId: '1-3',
            description: 'Structuring contracts based on outcome delivery rather than inputs or activities.'
          },
          {
            id: '1-3-4',
            name: 'Value Assurance Reviews',
            categoryId: '1-3',
            description: 'Periodic reviews to ensure value creation throughout project or initiative lifecycles.'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Operations, Delivery, Risk & Sustainability',
    industrySegmentId: '',
    categories: [
      {
        id: '2-1',
        name: 'Product & Systems Development Excellence',
        domainGroupId: '2',
        subCategories: [
          {
            id: '2-1-1',
            name: 'Requirement Analysis & Specification',
            categoryId: '2-1',
            description: 'Capturing and documenting functional and non-functional requirements.'
          },
          {
            id: '2-1-2',
            name: 'System Design Architecture',
            categoryId: '2-1',
            description: 'Designing scalable and robust systems architecture.'
          },
          {
            id: '2-1-3',
            name: 'Prototyping & Iterative Development',
            categoryId: '2-1',
            description: 'Rapid design-build-test cycles to evolve solutions.'
          },
          {
            id: '2-1-4',
            name: 'Quality & Reliability Engineering',
            categoryId: '2-1',
            description: 'Ensuring consistency, safety, and reliability of products/services.'
          }
        ]
      },
      {
        id: '2-2',
        name: 'Service Design & Customer Experience',
        domainGroupId: '2',
        subCategories: [
          {
            id: '2-2-1',
            name: 'Journey Mapping & Service Blueprinting',
            categoryId: '2-2',
            description: 'Visualizing customer interactions and backend systems to improve services.'
          },
          {
            id: '2-2-2',
            name: 'Omnichannel Experience Strategy',
            categoryId: '2-2',
            description: 'Designing seamless experiences across physical and digital channels.'
          },
          {
            id: '2-2-3',
            name: 'Customer Feedback Integration',
            categoryId: '2-2',
            description: 'Embedding user feedback loops into service refinement.'
          },
          {
            id: '2-2-4',
            name: 'Personalization & Accessibility',
            categoryId: '2-2',
            description: 'Customizing experiences and ensuring inclusivity.'
          }
        ]
      },
      {
        id: '2-3',
        name: 'Process Excellence & Core Functions',
        domainGroupId: '2',
        subCategories: [
          {
            id: '2-3-1',
            name: 'Sales, Marketing, Finance, HR, Ops, SCM',
            categoryId: '2-3',
            description: 'Functional performance across all core departments.'
          },
          {
            id: '2-3-2',
            name: 'SOP Development',
            categoryId: '2-3',
            description: 'Creating standard operating procedures to ensure consistency.'
          },
          {
            id: '2-3-3',
            name: 'KPI/OKR Definition',
            categoryId: '2-3',
            description: 'Setting Key Performance Indicators and Objectives & Key Results for teams.'
          },
          {
            id: '2-3-4',
            name: 'Continuous Improvement (Lean, Six Sigma)',
            categoryId: '2-3',
            description: 'Using proven methodologies for process and performance improvement.'
          }
        ]
      },
      {
        id: '2-4',
        name: 'Compliance, Risk & Regulatory Governance',
        domainGroupId: '2',
        subCategories: [
          {
            id: '2-4-1',
            name: 'Stakeholder Engagement',
            categoryId: '2-4',
            description: 'Involving and aligning internal and external stakeholders to mitigate risks.'
          }
        ]
      },
      {
        id: '2-5',
        name: 'ESG & Sustainability Strategy',
        domainGroupId: '2',
        subCategories: [
          {
            id: '2-5-1',
            name: 'Carbon Footprint & Green IT',
            categoryId: '2-5',
            description: 'Reducing environmental impact through sustainable IT and operations.'
          },
          {
            id: '2-5-2',
            name: 'Circular Economy Practices',
            categoryId: '2-5',
            description: 'Promoting reuse, recycling, and cradle-to-cradle design.'
          },
          {
            id: '2-5-3',
            name: 'Ethical Governance Frameworks',
            categoryId: '2-5',
            description: 'Establishing values-driven, transparent decision-making systems.'
          },
          {
            id: '2-5-4',
            name: 'Social Responsibility Programs',
            categoryId: '2-5',
            description: 'Designing and running initiatives for social impact.'
          }
        ]
      },
      {
        id: '2-6',
        name: 'Global / Regional Delivery Capability',
        domainGroupId: '2',
        subCategories: [
          {
            id: '2-6-1',
            name: 'Multi-Region Operations',
            categoryId: '2-6',
            description: 'Managing operations across geographies with consistency.'
          },
          {
            id: '2-6-2',
            name: 'Countries Worked',
            categoryId: '2-6',
            description: 'Select the applicable countries.'
          },
          {
            id: '2-6-3',
            name: 'Regulatory & Localization Readiness',
            categoryId: '2-6',
            description: 'Ensuring compliance with regional regulations and local needs.'
          },
          {
            id: '2-6-4',
            name: 'Delivery Center Strategy',
            categoryId: '2-6',
            description: 'Designing and operating efficient delivery hubs in different regions/countries.'
          },
          {
            id: '2-6-5',
            name: 'Time Zone & Language Support',
            categoryId: '2-6',
            description: 'Supporting global teams and customers across languages and time zones.'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'People, Culture & Change',
    industrySegmentId: '',
    categories: [
      {
        id: '3-1',
        name: 'Talent Management & Organizational Culture',
        domainGroupId: '3',
        subCategories: [
          {
            id: '3-1-1',
            name: 'Stakeholder Engagement',
            categoryId: '3-1',
            description: 'Engaging leadership, employees, and partners during change or growth.'
          },
          {
            id: '3-1-2',
            name: 'Communication Planning',
            categoryId: '3-1',
            description: 'Crafting effective internal and external communication strategies.'
          },
          {
            id: '3-1-3',
            name: 'Cultural Assessment & Transformation',
            categoryId: '3-1',
            description: 'Evaluating and evolving organizational values, beliefs, and behaviors.'
          },
          {
            id: '3-1-4',
            name: 'Adoption & Training Programs',
            categoryId: '3-1',
            description: 'Preparing people to embrace new processes, tools, and mindsets.'
          }
        ]
      },
      {
        id: '3-2',
        name: 'Operating Model & Organizational Structure',
        domainGroupId: '3',
        subCategories: [
          {
            id: '3-2-1',
            name: 'Role Clarity & Governance Structure',
            categoryId: '3-2',
            description: 'Defining responsibilities and decision-making structures.'
          },
          {
            id: '3-2-2',
            name: 'Decision Rights Allocation',
            categoryId: '3-2',
            description: 'Clarifying who decides what and at which level.'
          },
          {
            id: '3-2-3',
            name: 'Centralization vs. Decentralization',
            categoryId: '3-2',
            description: 'Structuring operations to balance autonomy and control.'
          },
          {
            id: '3-2-4',
            name: 'Shared Services Design',
            categoryId: '3-2',
            description: 'Creating internal service hubs for scale and efficiency.'
          }
        ]
      },
      {
        id: '3-3',
        name: 'Digital Workplace & Workforce Enablement',
        domainGroupId: '3',
        subCategories: [
          {
            id: '3-3-1',
            name: 'Collaboration Tools & Digital Adoption',
            categoryId: '3-3',
            description: 'Using tools like Slack, Teams, Notion to boost team collaboration.'
          },
          {
            id: '3-3-2',
            name: 'Hybrid/Remote Work Enablement',
            categoryId: '3-3',
            description: 'Supporting flexible work arrangements with appropriate systems.'
          },
          {
            id: '3-3-3',
            name: 'Workforce Productivity Solutions',
            categoryId: '3-3',
            description: 'Enhancing employee output using automation, apps, and analytics.'
          },
          {
            id: '3-3-4',
            name: 'Employee Experience Platforms',
            categoryId: '3-3',
            description: 'Tools and systems to improve engagement, well-being, and satisfaction.'
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Technology & Digital Transformation',
    industrySegmentId: '',
    categories: [
      {
        id: '4-1',
        name: 'Technology & Digital Transformation',
        domainGroupId: '4',
        subCategories: [
          {
            id: '4-1-1',
            name: 'Enterprise Architecture',
            categoryId: '4-1',
            description: 'Designing IT infrastructure and digital systems aligned to business goals.'
          },
          {
            id: '4-1-2',
            name: 'Cloud & Edge Infrastructure',
            categoryId: '4-1',
            description: 'Leveraging cloud and edge computing for scalability and efficiency.'
          },
          {
            id: '4-1-3',
            name: 'API & Integration Frameworks',
            categoryId: '4-1',
            description: 'Enabling interoperability across systems via robust APIs.'
          },
          {
            id: '4-1-4',
            name: 'DevSecOps & Cybersecurity',
            categoryId: '4-1',
            description: 'Embedding security into the software development lifecycle.'
          }
        ]
      },
      {
        id: '4-2',
        name: 'Data Strategy & Decision Intelligence',
        domainGroupId: '4',
        subCategories: [
          {
            id: '4-2-1',
            name: 'KPI/OKR Definition',
            categoryId: '4-2',
            description: 'Leveraging performance metrics for data-driven decision making.'
          }
        ]
      }
    ]
  }
];

export const useDomainGroupsData = () => {
  const [industrySegments] = useState(mockIndustrySegments);
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize data for all industry segments
  useEffect(() => {
    const initializeData = () => {
      const allData: DomainGroup[] = [];
      
      mockIndustrySegments.forEach(segment => {
        defaultDomainGroupsData.forEach(group => {
          const newGroup: DomainGroup = {
            ...group,
            id: `${segment.id}-${group.id}`,
            industrySegmentId: segment.id,
            categories: group.categories.map(category => ({
              ...category,
              id: `${segment.id}-${category.id}`,
              domainGroupId: `${segment.id}-${group.id}`,
              subCategories: category.subCategories.map(subCategory => ({
                ...subCategory,
                id: `${segment.id}-${subCategory.id}`,
                categoryId: `${segment.id}-${category.id}`
              }))
            }))
          };
          allData.push(newGroup);
        });
      });
      
      setDomainGroups(allData);
    };

    initializeData();
  }, []);

  const getDomainGroupsByIndustry = (industrySegmentId: string) => {
    return domainGroups.filter(group => group.industrySegmentId === industrySegmentId);
  };

  const addDomainGroup = (name: string, industrySegmentId: string) => {
    const newId = `${industrySegmentId}-${Date.now()}`;
    const newGroup: DomainGroup = {
      id: newId,
      name,
      industrySegmentId,
      categories: []
    };
    setDomainGroups(prev => [...prev, newGroup]);
  };

  const updateDomainGroup = (id: string, name: string) => {
    setDomainGroups(prev => prev.map(group => 
      group.id === id ? { ...group, name } : group
    ));
  };

  const deleteDomainGroup = (id: string) => {
    setDomainGroups(prev => prev.filter(group => group.id !== id));
  };

  const addCategory = (domainGroupId: string, name: string) => {
    const newId = `${domainGroupId}-cat-${Date.now()}`;
    const newCategory: Category = {
      id: newId,
      name,
      domainGroupId,
      subCategories: []
    };
    
    setDomainGroups(prev => prev.map(group => 
      group.id === domainGroupId 
        ? { ...group, categories: [...group.categories, newCategory] }
        : group
    ));
  };

  const updateCategory = (categoryId: string, name: string) => {
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.map(cat => 
        cat.id === categoryId ? { ...cat, name } : cat
      )
    })));
  };

  const deleteCategory = (categoryId: string) => {
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.filter(cat => cat.id !== categoryId)
    })));
  };

  const addSubCategory = (categoryId: string, name: string, description?: string) => {
    const newId = `${categoryId}-sub-${Date.now()}`;
    const newSubCategory: SubCategory = {
      id: newId,
      name,
      categoryId,
      description
    };
    
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, subCategories: [...cat.subCategories, newSubCategory] }
          : cat
      )
    })));
  };

  const updateSubCategory = (subCategoryId: string, name: string, description?: string) => {
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.map(cat => ({
        ...cat,
        subCategories: cat.subCategories.map(sub => 
          sub.id === subCategoryId ? { ...sub, name, description } : sub
        )
      }))
    })));
  };

  const deleteSubCategory = (subCategoryId: string) => {
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.map(cat => ({
        ...cat,
        subCategories: cat.subCategories.filter(sub => sub.id !== subCategoryId)
      }))
    })));
  };

  return {
    industrySegments,
    selectedIndustrySegment,
    setSelectedIndustrySegment,
    domainGroups: getDomainGroupsByIndustry(selectedIndustrySegment),
    isLoading,
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
