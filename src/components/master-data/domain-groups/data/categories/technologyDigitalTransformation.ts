
import { DomainGroup } from '../../types';

export const technologyDigitalTransformationGroup: Omit<DomainGroup, 'industrySegmentId'> = {
  id: 'ls-technology-digital-transformation',
  name: 'Technology & Digital Transformation',
  description: 'Technology strategy and digital transformation initiatives for life sciences',
  isActive: true,
  createdAt: new Date().toISOString(),
  categories: [
    {
      id: 'ls-technology-digital-transformation-cat',
      name: 'Technology & Digital Transformation',
      description: 'Comprehensive technology and digital transformation strategies',
      domainGroupId: 'ls-technology-digital-transformation',
      isActive: true,
      createdAt: new Date().toISOString(),
      subCategories: [
        {
          id: 'ls-life-sciences-enterprise-architecture',
          name: 'Life Sciences Enterprise Architecture',
          description: 'Designing digital infrastructure that integrates EHR, EDC, CTMS, LIMS, and ERP.',
          categoryId: 'ls-technology-digital-transformation-cat',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-cloud-based-research-data-lakes',
          name: 'Cloud-Based Research & Data Lakes',
          description: 'Using cloud for scalability in bioinformatics, trial data, and genomics.',
          categoryId: 'ls-technology-digital-transformation-cat',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-secure-apis-interoperability',
          name: 'Secure APIs & Interoperability Frameworks',
          description: 'Connecting systems across CROs, regulators, labs, and healthcare institutions.',
          categoryId: 'ls-technology-digital-transformation-cat',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-cybersecurity-clinical-ip',
          name: 'Cybersecurity in Clinical & IP Environments',
          description: 'Embedding patient privacy, IP protection, and GxP-compliant cyber safeguards.',
          categoryId: 'ls-technology-digital-transformation-cat',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 'ls-data-strategy-decision-intelligence',
      name: 'Data Strategy & Decision Intelligence',
      description: 'Data strategy and decision intelligence for life sciences organizations',
      domainGroupId: 'ls-technology-digital-transformation',
      isActive: true,
      createdAt: new Date().toISOString(),
      subCategories: [
        {
          id: 'ls-rd-analytics-trial-insights',
          name: 'R&D Analytics & Trial Insights Dashboards',
          description: 'Using real-time dashboards to monitor recruitment, outcomes, and site performance.',
          categoryId: 'ls-data-strategy-decision-intelligence',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    }
  ]
};
