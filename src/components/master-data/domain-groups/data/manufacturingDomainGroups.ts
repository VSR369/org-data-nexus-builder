
import { DomainGroup } from '../types';

export const manufacturingDomainGroups: Omit<DomainGroup, 'industrySegmentId'>[] = [
  {
    id: 'mfg-dg-1',
    name: 'Strategy, Innovation & Growth',
    description: 'Strategic planning, product innovation, and market expansion in manufacturing',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-cat-1-1',
        name: 'Product Innovation',
        description: 'New product development and design optimization',
        domainGroupId: 'mfg-dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-sub-1-1-1',
            name: 'Design for Manufacturing',
            description: 'Product design optimization for manufacturability',
            categoryId: 'mfg-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-1-1-2',
            name: 'Rapid Prototyping',
            description: '3D printing and rapid prototype development',
            categoryId: 'mfg-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-1-1-3',
            name: 'Materials Innovation',
            description: 'Advanced materials and composite development',
            categoryId: 'mfg-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-cat-1-2',
        name: 'Market Strategy',
        description: 'Market analysis and competitive positioning',
        domainGroupId: 'mfg-dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-sub-1-2-1',
            name: 'Customer Segmentation',
            description: 'Market segmentation and customer analysis',
            categoryId: 'mfg-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-1-2-2',
            name: 'Global Expansion',
            description: 'International market entry strategies',
            categoryId: 'mfg-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-dg-2',
    name: 'Operations, Delivery, Risk & Sustainability',
    description: 'Manufacturing operations, supply chain, and sustainability',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-cat-2-1',
        name: 'Production Operations',
        description: 'Manufacturing processes and production optimization',
        domainGroupId: 'mfg-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-sub-2-1-1',
            name: 'Lean Manufacturing',
            description: 'Lean principles and waste reduction',
            categoryId: 'mfg-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-2-1-2',
            name: 'Six Sigma',
            description: 'Quality improvement and process optimization',
            categoryId: 'mfg-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-2-1-3',
            name: 'Smart Manufacturing',
            description: 'Industry 4.0 and connected manufacturing',
            categoryId: 'mfg-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-cat-2-2',
        name: 'Supply Chain Management',
        description: 'Supply chain optimization and logistics',
        domainGroupId: 'mfg-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-sub-2-2-1',
            name: 'Supplier Management',
            description: 'Supplier selection and relationship management',
            categoryId: 'mfg-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-2-2-2',
            name: 'Inventory Optimization',
            description: 'Inventory management and demand planning',
            categoryId: 'mfg-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-2-2-3',
            name: 'Sustainable Supply Chain',
            description: 'Green supply chain and circular economy',
            categoryId: 'mfg-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-dg-3',
    name: 'People, Culture & Change',
    description: 'Workforce development and organizational transformation',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-cat-3-1',
        name: 'Workforce Development',
        description: 'Skills training and workforce planning',
        domainGroupId: 'mfg-dg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-sub-3-1-1',
            name: 'Technical Skills Training',
            description: 'Manufacturing and technical skills development',
            categoryId: 'mfg-cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-3-1-2',
            name: 'Safety Training',
            description: 'Workplace safety and compliance training',
            categoryId: 'mfg-cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-dg-4',
    name: 'Technology & Digital Transformation',
    description: 'Digital manufacturing, automation, and IoT solutions',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-cat-4-1',
        name: 'Industrial IoT',
        description: 'Connected devices and sensor networks',
        domainGroupId: 'mfg-dg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-sub-4-1-1',
            name: 'Sensor Networks',
            description: 'Industrial sensor deployment and monitoring',
            categoryId: 'mfg-cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-4-1-2',
            name: 'Predictive Maintenance',
            description: 'AI-powered equipment maintenance optimization',
            categoryId: 'mfg-cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-cat-4-2',
        name: 'Manufacturing Automation',
        description: 'Robotics and automated manufacturing systems',
        domainGroupId: 'mfg-dg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-sub-4-2-1',
            name: 'Robotic Process Automation',
            description: 'Industrial robotics and automation',
            categoryId: 'mfg-cat-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sub-4-2-2',
            name: 'Digital Twins',
            description: 'Digital manufacturing simulation and modeling',
            categoryId: 'mfg-cat-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
