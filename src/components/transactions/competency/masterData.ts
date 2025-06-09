
import { DomainGroup, CompetencyCapability } from './types';

export const masterDomainGroups: DomainGroup[] = [
  {
    id: '1',
    name: 'Strategy, Innovation & Growth',
    industrySegment: 'Banking, Financial Services & Insurance (BFSI)',
    categories: [
      {
        id: '101',
        name: 'Strategic Vision & Business Planning',
        subCategories: [
          { id: '101-1', name: 'Vision, Mission, and Goals Alignment', description: 'Ability to align organizational vision with strategic goals' },
          { id: '101-2', name: 'Strategic Planning Frameworks', description: 'Expertise in strategic planning methodologies and frameworks' },
          { id: '101-3', name: 'Competitive Positioning', description: 'Skills in market analysis and competitive positioning' },
          { id: '101-4', name: 'Long-Term Scenario Thinking', description: 'Capability for long-term strategic scenario planning' },
        ],
      },
      {
        id: '102',
        name: 'Business Model & Value Proposition Design',
        subCategories: [
          { id: '102-1', name: 'Revenue Models & Monetization', description: 'Expertise in designing revenue models and monetization strategies' },
          { id: '102-2', name: 'Customer Segments & Value Mapping', description: 'Skills in customer segmentation and value proposition mapping' },
          { id: '102-3', name: 'Partner Ecosystem Design', description: 'Ability to design and manage partner ecosystems' },
          { id: '102-4', name: 'Business Sustainability Models', description: 'Knowledge of sustainable business model design' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Operations, Delivery, Risk & Sustainability',
    industrySegment: 'Banking, Financial Services & Insurance (BFSI)',
    categories: [
      {
        id: '201',
        name: 'Product & Systems Development Excellence',
        subCategories: [
          { id: '201-1', name: 'Requirement Analysis & Specification', description: 'Skills in analyzing and documenting system requirements' },
          { id: '201-2', name: 'System Design Architecture', description: 'Expertise in designing scalable system architectures' },
          { id: '201-3', name: 'Prototyping & Iterative Development', description: 'Capability for agile prototyping and iterative development' },
          { id: '201-4', name: 'Quality & Reliability Engineering', description: 'Knowledge of quality assurance and reliability engineering' },
        ],
      },
      {
        id: '202',
        name: 'Risk Management & Compliance',
        subCategories: [
          { id: '202-1', name: 'Regulatory Compliance Management', description: 'Expertise in managing regulatory compliance requirements' },
          { id: '202-2', name: 'Risk Assessment & Mitigation', description: 'Skills in risk assessment and mitigation strategies' },
          { id: '202-3', name: 'Internal Controls & Audit', description: 'Knowledge of internal controls and audit processes' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Technology & Digital Transformation',
    industrySegment: 'Information Technology & Software Services',
    categories: [
      {
        id: '301',
        name: 'Digital Architecture & Infrastructure',
        subCategories: [
          { id: '301-1', name: 'Enterprise Architecture', description: 'Expertise in enterprise architecture design and implementation' },
          { id: '301-2', name: 'Cloud & Edge Infrastructure', description: 'Skills in cloud and edge computing infrastructure' },
          { id: '301-3', name: 'API & Integration Frameworks', description: 'Knowledge of API design and integration frameworks' },
          { id: '301-4', name: 'DevSecOps & Cybersecurity', description: 'Expertise in DevSecOps practices and cybersecurity' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Customer Experience & Digital Marketing',
    industrySegment: 'Retail & E-Commerce',
    categories: [
      {
        id: '401',
        name: 'Customer Journey & Experience Design',
        subCategories: [
          { id: '401-1', name: 'Customer Journey Mapping', description: 'Skills in mapping and optimizing customer journeys' },
          { id: '401-2', name: 'User Experience (UX) Design', description: 'Expertise in UX design principles and practices' },
          { id: '401-3', name: 'Customer Feedback & Analytics', description: 'Knowledge of customer feedback analysis and actionable insights' },
        ],
      },
    ],
  },
];

export const competencyCapabilities: CompetencyCapability[] = [
  {
    id: '1',
    name: 'Guru',
    description: 'Expert level with deep knowledge and ability to guide others',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    name: 'Advanced',
    description: 'High proficiency with comprehensive understanding',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    name: 'Basic',
    description: 'Fundamental knowledge and basic competency',
    color: 'bg-green-100 text-green-800 border-green-300',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    name: 'Not Applicable',
    description: 'This competency area is not relevant or applicable',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    order: 4,
    isActive: true,
  },
];
