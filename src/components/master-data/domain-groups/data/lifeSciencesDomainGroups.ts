
import { DomainGroup } from '../types';

export const lifeSciencesDomainGroups: Omit<DomainGroup, 'industrySegmentId'>[] = [
  {
    id: 'ls-dg-1',
    name: 'Strategy, Innovation & Growth',
    description: 'Strategic planning, R&D innovation, and market expansion in life sciences',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-cat-1-1',
        name: 'Drug Discovery & Development',
        description: 'Pharmaceutical research and drug development processes',
        domainGroupId: 'ls-dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-1-1-1',
            name: 'Target Identification',
            description: 'Identification and validation of drug targets',
            categoryId: 'ls-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-1-2',
            name: 'Lead Optimization',
            description: 'Chemical optimization of lead compounds',
            categoryId: 'ls-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-1-3',
            name: 'Preclinical Testing',
            description: 'In vitro and in vivo testing before clinical trials',
            categoryId: 'ls-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-1-2',
        name: 'Clinical Research',
        description: 'Clinical trials and regulatory affairs',
        domainGroupId: 'ls-dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-1-2-1',
            name: 'Phase I Trials',
            description: 'First-in-human safety and dosage studies',
            categoryId: 'ls-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-2-2',
            name: 'Phase II/III Trials',
            description: 'Efficacy and large-scale safety studies',
            categoryId: 'ls-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-2-3',
            name: 'Regulatory Submissions',
            description: 'FDA/EMA submissions and regulatory strategy',
            categoryId: 'ls-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'ls-dg-2',
    name: 'Operations, Delivery, Risk & Sustainability',
    description: 'Manufacturing, quality control, and regulatory compliance in life sciences',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-cat-2-1',
        name: 'Manufacturing & Production',
        description: 'Pharmaceutical manufacturing and production optimization',
        domainGroupId: 'ls-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-2-1-1',
            name: 'Process Development',
            description: 'Manufacturing process design and optimization',
            categoryId: 'ls-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-1-2',
            name: 'Scale-up Manufacturing',
            description: 'Scaling from lab to commercial production',
            categoryId: 'ls-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-1-3',
            name: 'Biologics Production',
            description: 'Biopharmaceutical manufacturing processes',
            categoryId: 'ls-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-2-2',
        name: 'Quality Assurance & Compliance',
        description: 'GMP compliance, quality control, and regulatory adherence',
        domainGroupId: 'ls-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-2-2-1',
            name: 'GMP Compliance',
            description: 'Good Manufacturing Practices implementation',
            categoryId: 'ls-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-2-2',
            name: 'Analytical Testing',
            description: 'Quality control testing and validation',
            categoryId: 'ls-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-2-3',
            name: 'Pharmacovigilance',
            description: 'Drug safety monitoring and adverse event reporting',
            categoryId: 'ls-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'ls-dg-3',
    name: 'People, Culture & Change',
    description: 'Scientific talent management and organizational development',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-cat-3-1',
        name: 'Scientific Talent Management',
        description: 'Recruitment and development of scientific personnel',
        domainGroupId: 'ls-dg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-3-1-1',
            name: 'Research Scientist Recruitment',
            description: 'Attracting and hiring top scientific talent',
            categoryId: 'ls-cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-1-2',
            name: 'Continuing Education',
            description: 'Scientific training and professional development',
            categoryId: 'ls-cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'ls-dg-4',
    name: 'Technology & Digital Transformation',
    description: 'Digital health, laboratory automation, and health informatics',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-cat-4-1',
        name: 'Digital Health Solutions',
        description: 'Digital therapeutics and health technology platforms',
        domainGroupId: 'ls-dg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-4-1-1',
            name: 'Digital Therapeutics',
            description: 'Software-based therapeutic interventions',
            categoryId: 'ls-cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-4-1-2',
            name: 'Telemedicine Platforms',
            description: 'Remote healthcare delivery systems',
            categoryId: 'ls-cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-4-2',
        name: 'Laboratory Informatics',
        description: 'LIMS, ELN, and laboratory automation systems',
        domainGroupId: 'ls-dg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-4-2-1',
            name: 'LIMS Implementation',
            description: 'Laboratory Information Management Systems',
            categoryId: 'ls-cat-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-4-2-2',
            name: 'Laboratory Automation',
            description: 'Automated laboratory workflows and robotics',
            categoryId: 'ls-cat-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
