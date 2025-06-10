
import { DomainGroup } from '../types';

export const defaultDomainGroupsData: Omit<DomainGroup, 'industrySegmentId'>[] = [
  {
    id: 'dg-1',
    name: 'Strategy, Innovation & Growth',
    description: 'Strategic planning, innovation management, and business growth initiatives',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'cat-1-1',
        name: 'Business Strategy',
        description: 'Strategic planning and business model development',
        domainGroupId: 'dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'sub-1-1-1',
            name: 'Market Analysis',
            description: 'Market research and competitive analysis',
            categoryId: 'cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sub-1-1-2',
            name: 'Business Model Innovation',
            description: 'New business model development and optimization',
            categoryId: 'cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'cat-1-2',
        name: 'Innovation Management',
        description: 'Innovation processes and R&D management',
        domainGroupId: 'dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'sub-1-2-1',
            name: 'Product Innovation',
            description: 'New product development and enhancement',
            categoryId: 'cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sub-1-2-2',
            name: 'Process Innovation',
            description: 'Business process improvement and optimization',
            categoryId: 'cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'dg-2',
    name: 'Operations, Delivery, Risk & Sustainability',
    description: 'Operational excellence, service delivery, risk management, and sustainability',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'cat-2-1',
        name: 'Operations Management',
        description: 'Operational processes and efficiency optimization',
        domainGroupId: 'dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'sub-2-1-1',
            name: 'Supply Chain Optimization',
            description: 'Supply chain management and optimization',
            categoryId: 'cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sub-2-1-2',
            name: 'Quality Management',
            description: 'Quality assurance and control processes',
            categoryId: 'cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'cat-2-2',
        name: 'Risk Management',
        description: 'Risk assessment, mitigation, and compliance',
        domainGroupId: 'dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'sub-2-2-1',
            name: 'Compliance Management',
            description: 'Regulatory compliance and governance',
            categoryId: 'cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sub-2-2-2',
            name: 'Business Continuity',
            description: 'Business continuity planning and disaster recovery',
            categoryId: 'cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'dg-3',
    name: 'People, Culture & Change',
    description: 'Human resources, organizational culture, and change management',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'cat-3-1',
        name: 'Human Resources',
        description: 'HR processes, talent management, and employee development',
        domainGroupId: 'dg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'sub-3-1-1',
            name: 'Talent Acquisition',
            description: 'Recruitment and hiring processes',
            categoryId: 'cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sub-3-1-2',
            name: 'Employee Development',
            description: 'Training, learning, and career development',
            categoryId: 'cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'cat-3-2',
        name: 'Change Management',
        description: 'Organizational change and transformation management',
        domainGroupId: 'dg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'sub-3-2-1',
            name: 'Digital Transformation',
            description: 'Digital transformation initiatives and change',
            categoryId: 'cat-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sub-3-2-2',
            name: 'Cultural Change',
            description: 'Organizational culture transformation',
            categoryId: 'cat-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'dg-4',
    name: 'Technology & Digital Transformation',
    description: 'Technology solutions, digital transformation, and IT infrastructure',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'cat-4-1',
        name: 'Digital Solutions',
        description: 'Digital platforms, applications, and solutions',
        domainGroupId: 'dg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'sub-4-1-1',
            name: 'Mobile Applications',
            description: 'Mobile app development and optimization',
            categoryId: 'cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sub-4-1-2',
            name: 'Web Platforms',
            description: 'Web-based platforms and portals',
            categoryId: 'cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'cat-4-2',
        name: 'Data & Analytics',
        description: 'Data management, analytics, and business intelligence',
        domainGroupId: 'dg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'sub-4-2-1',
            name: 'Business Intelligence',
            description: 'BI tools and dashboards for decision making',
            categoryId: 'cat-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sub-4-2-2',
            name: 'Predictive Analytics',
            description: 'Predictive modeling and forecasting',
            categoryId: 'cat-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
