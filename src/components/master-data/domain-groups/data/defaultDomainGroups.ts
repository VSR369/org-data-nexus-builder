
import { DomainGroup } from '../types';

export const defaultDomainGroupsData: DomainGroup[] = [
  {
    id: '1',
    name: 'Strategy, Innovation & Growth',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: '1-1',
        name: 'Strategic Vision & Business Planning',
        domainGroupId: '1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '1-1-1',
            name: 'Vision, Mission, and Goals Alignment',
            categoryId: '1-1',
            description: 'Ensuring organizational vision, mission, and strategic goals are aligned and clearly communicated.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-1-2',
            name: 'Strategic Planning Frameworks',
            categoryId: '1-1',
            description: 'Using structured tools like SWOT, PESTLE, or Balanced Scorecards for strategic planning.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-1-3',
            name: 'Competitive Positioning',
            categoryId: '1-1',
            description: 'Identifying and strengthening the organization\'s differentiation in the marketplace.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-1-4',
            name: 'Long-Term Scenario Thinking',
            categoryId: '1-1',
            description: 'Planning for various future scenarios to remain resilient and adaptive.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '1-2',
        name: 'Business Model & Value Proposition Design',
        domainGroupId: '1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '1-2-1',
            name: 'Revenue Models & Monetization',
            categoryId: '1-2',
            description: 'Designing and optimizing revenue generation strategies.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-2-2',
            name: 'Customer Segments & Value Mapping',
            categoryId: '1-2',
            description: 'Identifying key customer groups and tailoring value propositions for each.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-2-3',
            name: 'Partner Ecosystem Design',
            categoryId: '1-2',
            description: 'Structuring collaborative networks with suppliers, partners, and platforms.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-2-4',
            name: 'Business Sustainability Models',
            categoryId: '1-2',
            description: 'Integrating sustainable practices into business models for long-term viability.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '1-3',
        name: 'Outcome Measurement & Business Value Realization',
        domainGroupId: '1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '1-3-1',
            name: 'ROI Analysis & Impact Metrics',
            categoryId: '1-3',
            description: 'Measuring return on investments and defining key impact indicators.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-3-2',
            name: 'Benefits Realization Management',
            categoryId: '1-3',
            description: 'Ensuring projects deliver intended benefits aligned with strategic goals.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-3-3',
            name: 'Outcome-based Contracting',
            categoryId: '1-3',
            description: 'Structuring contracts based on outcome delivery rather than inputs or activities.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '1-3-4',
            name: 'Value Assurance Reviews',
            categoryId: '1-3',
            description: 'Periodic reviews to ensure value creation throughout project or initiative lifecycles.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Operations, Delivery, Risk & Sustainability',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: '2-1',
        name: 'Product & Systems Development Excellence',
        domainGroupId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '2-1-1',
            name: 'Requirement Analysis & Specification',
            categoryId: '2-1',
            description: 'Capturing and documenting functional and non-functional requirements.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-1-2',
            name: 'System Design Architecture',
            categoryId: '2-1',
            description: 'Designing scalable and robust systems architecture.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-1-3',
            name: 'Prototyping & Iterative Development',
            categoryId: '2-1',
            description: 'Rapid design-build-test cycles to evolve solutions.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-1-4',
            name: 'Quality & Reliability Engineering',
            categoryId: '2-1',
            description: 'Ensuring consistency, safety, and reliability of products/services.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '2-2',
        name: 'Service Design & Customer Experience',
        domainGroupId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '2-2-1',
            name: 'Journey Mapping & Service Blueprinting',
            categoryId: '2-2',
            description: 'Visualizing customer interactions and backend systems to improve services.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-2-2',
            name: 'Omnichannel Experience Strategy',
            categoryId: '2-2',
            description: 'Designing seamless experiences across physical and digital channels.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-2-3',
            name: 'Customer Feedback Integration',
            categoryId: '2-2',
            description: 'Embedding user feedback loops into service refinement.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-2-4',
            name: 'Personalization & Accessibility',
            categoryId: '2-2',
            description: 'Customizing experiences and ensuring inclusivity.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '2-3',
        name: 'Process Excellence & Core Functions',
        domainGroupId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '2-3-1',
            name: 'Sales, Marketing, Finance, HR, Ops, SCM',
            categoryId: '2-3',
            description: 'Functional performance across all core departments.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-3-2',
            name: 'SOP Development',
            categoryId: '2-3',
            description: 'Creating standard operating procedures to ensure consistency.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-3-3',
            name: 'KPI/OKR Definition',
            categoryId: '2-3',
            description: 'Setting Key Performance Indicators and Objectives & Key Results for teams.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-3-4',
            name: 'Continuous Improvement (Lean, Six Sigma)',
            categoryId: '2-3',
            description: 'Using proven methodologies for process and performance improvement.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '2-4',
        name: 'Compliance, Risk & Regulatory Governance',
        domainGroupId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '2-4-1',
            name: 'Stakeholder Engagement',
            categoryId: '2-4',
            description: 'Involving and aligning internal and external stakeholders to mitigate risks.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '2-5',
        name: 'ESG & Sustainability Strategy',
        domainGroupId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '2-5-1',
            name: 'Carbon Footprint & Green IT',
            categoryId: '2-5',
            description: 'Reducing environmental impact through sustainable IT and operations.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-5-2',
            name: 'Circular Economy Practices',
            categoryId: '2-5',
            description: 'Promoting reuse, recycling, and cradle-to-cradle design.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-5-3',
            name: 'Ethical Governance Frameworks',
            categoryId: '2-5',
            description: 'Establishing values-driven, transparent decision-making systems.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-5-4',
            name: 'Social Responsibility Programs',
            categoryId: '2-5',
            description: 'Designing and running initiatives for social impact.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '2-6',
        name: 'Global / Regional Delivery Capability',
        domainGroupId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '2-6-1',
            name: 'Multi-Region Operations',
            categoryId: '2-6',
            description: 'Managing operations across geographies with consistency.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-6-2',
            name: 'Countries Worked',
            categoryId: '2-6',
            description: 'Select the applicable countries.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-6-3',
            name: 'Regulatory & Localization Readiness',
            categoryId: '2-6',
            description: 'Ensuring compliance with regional regulations and local needs.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-6-4',
            name: 'Delivery Center Strategy',
            categoryId: '2-6',
            description: 'Designing and operating efficient delivery hubs in different regions/countries.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2-6-5',
            name: 'Time Zone & Language Support',
            categoryId: '2-6',
            description: 'Supporting global teams and customers across languages and time zones.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'People, Culture & Change',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: '3-1',
        name: 'Talent Management & Organizational Culture',
        domainGroupId: '3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '3-1-1',
            name: 'Stakeholder Engagement',
            categoryId: '3-1',
            description: 'Engaging leadership, employees, and partners during change or growth.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-1-2',
            name: 'Communication Planning',
            categoryId: '3-1',
            description: 'Crafting effective internal and external communication strategies.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-1-3',
            name: 'Cultural Assessment & Transformation',
            categoryId: '3-1',
            description: 'Evaluating and evolving organizational values, beliefs, and behaviors.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-1-4',
            name: 'Adoption & Training Programs',
            categoryId: '3-1',
            description: 'Preparing people to embrace new processes, tools, and mindsets.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '3-2',
        name: 'Operating Model & Organizational Structure',
        domainGroupId: '3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '3-2-1',
            name: 'Role Clarity & Governance Structure',
            categoryId: '3-2',
            description: 'Defining responsibilities and decision-making structures.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-2-2',
            name: 'Decision Rights Allocation',
            categoryId: '3-2',
            description: 'Clarifying who decides what and at which level.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-2-3',
            name: 'Centralization vs. Decentralization',
            categoryId: '3-2',
            description: 'Structuring operations to balance autonomy and control.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-2-4',
            name: 'Shared Services Design',
            categoryId: '3-2',
            description: 'Creating internal service hubs for scale and efficiency.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '3-3',
        name: 'Digital Workplace & Workforce Enablement',
        domainGroupId: '3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '3-3-1',
            name: 'Collaboration Tools & Digital Adoption',
            categoryId: '3-3',
            description: 'Using tools like Slack, Teams, Notion to boost team collaboration.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-3-2',
            name: 'Hybrid/Remote Work Enablement',
            categoryId: '3-3',
            description: 'Supporting flexible work arrangements with appropriate systems.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-3-3',
            name: 'Workforce Productivity Solutions',
            categoryId: '3-3',
            description: 'Enhancing employee output using automation, apps, and analytics.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3-3-4',
            name: 'Employee Experience Platforms',
            categoryId: '3-3',
            description: 'Tools and systems to improve engagement, well-being, and satisfaction.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Technology & Digital Transformation',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: '4-1',
        name: 'Technology & Digital Transformation',
        domainGroupId: '4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '4-1-1',
            name: 'Enterprise Architecture',
            categoryId: '4-1',
            description: 'Designing IT infrastructure and digital systems aligned to business goals.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '4-1-2',
            name: 'Cloud & Edge Infrastructure',
            categoryId: '4-1',
            description: 'Leveraging cloud and edge computing for scalability and efficiency.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '4-1-3',
            name: 'API & Integration Frameworks',
            categoryId: '4-1',
            description: 'Enabling interoperability across systems via robust APIs.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '4-1-4',
            name: 'DevSecOps & Cybersecurity',
            categoryId: '4-1',
            description: 'Embedding security into the software development lifecycle.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '4-2',
        name: 'Data Strategy & Decision Intelligence',
        domainGroupId: '4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: '4-2-1',
            name: 'KPI/OKR Definition',
            categoryId: '4-2',
            description: 'Leveraging performance metrics for data-driven decision making.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
