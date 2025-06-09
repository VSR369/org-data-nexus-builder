
import { DomainGroup } from '../types';

export const bfsiDomainGroups: DomainGroup[] = [
  {
    id: 'bfsi-1',
    name: 'Financial Strategy & Innovation',
    industrySegment: 'Banking, Financial Services & Insurance (BFSI)',
    categories: [
      {
        id: 'bfsi-101',
        name: 'Digital Banking Strategy',
        subCategories: [
          { id: 'bfsi-101-1', name: 'Mobile Banking Innovation', description: 'Developing cutting-edge mobile banking solutions and user experiences.' },
          { id: 'bfsi-101-2', name: 'Open Banking Integration', description: 'Implementing open banking APIs and third-party integrations.' },
          { id: 'bfsi-101-3', name: 'Fintech Partnership Strategy', description: 'Building strategic partnerships with fintech companies and startups.' },
          { id: 'bfsi-101-4', name: 'Digital Wallet & Payment Solutions', description: 'Creating comprehensive digital payment ecosystems.' },
        ],
      },
      {
        id: 'bfsi-102',
        name: 'Risk Management & Compliance',
        subCategories: [
          { id: 'bfsi-102-1', name: 'Regulatory Compliance (Basel III, GDPR)', description: 'Ensuring adherence to banking regulations and data protection laws.' },
          { id: 'bfsi-102-2', name: 'Credit Risk Assessment', description: 'Advanced credit scoring and risk evaluation methodologies.' },
          { id: 'bfsi-102-3', name: 'Anti-Money Laundering (AML)', description: 'Implementing robust AML detection and prevention systems.' },
          { id: 'bfsi-102-4', name: 'Fraud Detection & Prevention', description: 'Real-time fraud monitoring and prevention mechanisms.' },
        ],
      },
    ],
  },
  {
    id: 'bfsi-2',
    name: 'Customer Experience & Digital Transformation',
    industrySegment: 'Banking, Financial Services & Insurance (BFSI)',
    categories: [
      {
        id: 'bfsi-201',
        name: 'Customer Journey Optimization',
        subCategories: [
          { id: 'bfsi-201-1', name: 'Omnichannel Banking Experience', description: 'Seamless customer experience across all banking channels.' },
          { id: 'bfsi-201-2', name: 'Personalized Financial Services', description: 'AI-driven personalization for banking products and services.' },
          { id: 'bfsi-201-3', name: 'Customer Onboarding Automation', description: 'Streamlined digital onboarding processes for new customers.' },
        ],
      },
      {
        id: 'bfsi-202',
        name: 'Wealth Management & Advisory',
        subCategories: [
          { id: 'bfsi-202-1', name: 'Robo-Advisory Platforms', description: 'Automated investment advisory and portfolio management.' },
          { id: 'bfsi-202-2', name: 'Private Banking Solutions', description: 'Exclusive wealth management services for high-net-worth individuals.' },
        ],
      },
    ],
  },
];
