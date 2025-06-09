
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
          { id: '101-1', name: 'Vision, Mission, and Goals Alignment', description: 'Ensuring organizational vision, mission, and strategic goals are aligned and clearly communicated.' },
          { id: '101-2', name: 'Strategic Planning Frameworks', description: 'Using structured tools like SWOT, PESTLE, or Balanced Scorecards for strategic planning.' },
          { id: '101-3', name: 'Competitive Positioning', description: 'Identifying and strengthening the organization\'s differentiation in the marketplace.' },
          { id: '101-4', name: 'Long-Term Scenario Thinking', description: 'Planning for various future scenarios to remain resilient and adaptive.' },
        ],
      },
      {
        id: '102',
        name: 'Business Model & Value Proposition Design',
        subCategories: [
          { id: '102-1', name: 'Revenue Models & Monetization', description: 'Designing and optimizing revenue generation strategies.' },
          { id: '102-2', name: 'Customer Segments & Value Mapping', description: 'Identifying key customer groups and tailoring value propositions for each.' },
          { id: '102-3', name: 'Partner Ecosystem Design', description: 'Structuring collaborative networks with suppliers, partners, and platforms.' },
          { id: '102-4', name: 'Business Sustainability Models', description: 'Integrating sustainable practices into business models for long-term viability.' },
        ],
      },
      {
        id: '103',
        name: 'Outcome Measurement & Business Value Realization',
        subCategories: [
          { id: '103-1', name: 'ROI Analysis & Impact Metrics', description: 'Measuring return on investments and defining key impact indicators.' },
          { id: '103-2', name: 'Benefits Realization Management', description: 'Ensuring projects deliver intended benefits aligned with strategic goals.' },
          { id: '103-3', name: 'Outcome-based Contracting', description: 'Structuring contracts based on outcome delivery rather than inputs or activities.' },
          { id: '103-4', name: 'Value Assurance Reviews', description: 'Periodic reviews to ensure value creation throughout project or initiative lifecycles.' },
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
          { id: '201-1', name: 'Requirement Analysis & Specification', description: 'Capturing and documenting functional and non-functional requirements.' },
          { id: '201-2', name: 'System Design Architecture', description: 'Designing scalable and robust systems architecture.' },
          { id: '201-3', name: 'Prototyping & Iterative Development', description: 'Rapid design-build-test cycles to evolve solutions.' },
          { id: '201-4', name: 'Quality & Reliability Engineering', description: 'Ensuring consistency, safety, and reliability of products/services.' },
        ],
      },
      {
        id: '202',
        name: 'Service Design & Customer Experience',
        subCategories: [
          { id: '202-1', name: 'Journey Mapping & Service Blueprinting', description: 'Visualizing customer interactions and backend systems to improve services.' },
          { id: '202-2', name: 'Omnichannel Experience Strategy', description: 'Designing seamless experiences across physical and digital channels.' },
          { id: '202-3', name: 'Customer Feedback Integration', description: 'Embedding user feedback loops into service refinement.' },
          { id: '202-4', name: 'Personalization & Accessibility', description: 'Customizing experiences and ensuring inclusivity.' },
        ],
      },
      {
        id: '203',
        name: 'Process Excellence & Core Functions',
        subCategories: [
          { id: '203-1', name: 'Sales, Marketing, Finance, HR, Ops, SCM', description: 'Functional performance across all core departments.' },
          { id: '203-2', name: 'SOP Development', description: 'Creating standard operating procedures to ensure consistency.' },
          { id: '203-3', name: 'KPI/OKR Definition', description: 'Setting Key Performance Indicators and Objectives & Key Results for teams.' },
          { id: '203-4', name: 'Continuous Improvement (Lean, Six Sigma)', description: 'Using proven methodologies for process and performance improvement.' },
        ],
      },
      {
        id: '204',
        name: 'Compliance, Risk & Regulatory Governance',
        subCategories: [
          { id: '204-1', name: 'Stakeholder Engagement', description: 'Involving and aligning internal and external stakeholders to mitigate risks.' },
        ],
      },
      {
        id: '205',
        name: 'ESG & Sustainability Strategy',
        subCategories: [
          { id: '205-1', name: 'Carbon Footprint & Green IT', description: 'Reducing environmental impact through sustainable IT and operations.' },
          { id: '205-2', name: 'Circular Economy Practices', description: 'Promoting reuse, recycling, and cradle-to-cradle design.' },
          { id: '205-3', name: 'Ethical Governance Frameworks', description: 'Establishing values-driven, transparent decision-making systems.' },
          { id: '205-4', name: 'Social Responsibility Programs', description: 'Designing and running initiatives for social impact.' },
        ],
      },
      {
        id: '206',
        name: 'Global / Regional Delivery Capability',
        subCategories: [
          { id: '206-1', name: 'Multi-Region Operations', description: 'Managing operations across geographies with consistency.' },
          { id: '206-2', name: 'Countries Worked', description: 'Select the applicable countries.' },
          { id: '206-3', name: 'Regulatory & Localization Readiness', description: 'Ensuring compliance with regional regulations and local needs.' },
          { id: '206-4', name: 'Delivery Center Strategy', description: 'Designing and operating efficient delivery hubs in different regions/countries.' },
          { id: '206-5', name: 'Time Zone & Language Support', description: 'Supporting global teams and customers across languages and time zones.' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'People, Culture & Change',
    industrySegment: 'Information Technology & Software Services',
    categories: [
      {
        id: '301',
        name: 'Talent Management & Organizational Culture',
        subCategories: [
          { id: '301-1', name: 'Stakeholder Engagement', description: 'Engaging leadership, employees, and partners during change or growth.' },
          { id: '301-2', name: 'Communication Planning', description: 'Crafting effective internal and external communication strategies.' },
          { id: '301-3', name: 'Cultural Assessment & Transformation', description: 'Evaluating and evolving organizational values, beliefs, and behaviors.' },
          { id: '301-4', name: 'Adoption & Training Programs', description: 'Preparing people to embrace new processes, tools, and mindsets.' },
        ],
      },
      {
        id: '302',
        name: 'Operating Model & Organizational Structure',
        subCategories: [
          { id: '302-1', name: 'Role Clarity & Governance Structure', description: 'Defining responsibilities and decision-making structures.' },
          { id: '302-2', name: 'Decision Rights Allocation', description: 'Clarifying who decides what and at which level.' },
          { id: '302-3', name: 'Centralization vs. Decentralization', description: 'Structuring operations to balance autonomy and control.' },
          { id: '302-4', name: 'Shared Services Design', description: 'Creating internal service hubs for scale and efficiency.' },
        ],
      },
      {
        id: '303',
        name: 'Digital Workplace & Workforce Enablement',
        subCategories: [
          { id: '303-1', name: 'Collaboration Tools & Digital Adoption', description: 'Using tools like Slack, Teams, Notion to boost team collaboration.' },
          { id: '303-2', name: 'Hybrid/Remote Work Enablement', description: 'Supporting flexible work arrangements with appropriate systems.' },
          { id: '303-3', name: 'Workforce Productivity Solutions', description: 'Enhancing employee output using automation, apps, and analytics.' },
          { id: '303-4', name: 'Employee Experience Platforms', description: 'Tools and systems to improve engagement, well-being, and satisfaction.' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Technology & Digital Transformation',
    industrySegment: 'Information Technology & Software Services',
    categories: [
      {
        id: '401',
        name: 'Digital Architecture & Infrastructure',
        subCategories: [
          { id: '401-1', name: 'Enterprise Architecture', description: 'Designing IT infrastructure and digital systems aligned to business goals.' },
          { id: '401-2', name: 'Cloud & Edge Infrastructure', description: 'Leveraging cloud and edge computing for scalability and efficiency.' },
          { id: '401-3', name: 'API & Integration Frameworks', description: 'Enabling interoperability across systems via robust APIs.' },
          { id: '401-4', name: 'DevSecOps & Cybersecurity', description: 'Embedding security into the software development lifecycle.' },
        ],
      },
      {
        id: '402',
        name: 'Data Strategy & Decision Intelligence',
        subCategories: [
          { id: '402-1', name: 'Data Architecture & Governance', description: 'Designing robust data infrastructure and governance frameworks.' },
          { id: '402-2', name: 'Analytics & Business Intelligence', description: 'Implementing analytics solutions for data-driven decision making.' },
          { id: '402-3', name: 'AI & Machine Learning Implementation', description: 'Developing and deploying AI/ML solutions for business value.' },
          { id: '402-4', name: 'Real-time Data Processing', description: 'Building systems for real-time data processing and insights.' },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Customer Experience & Digital Marketing',
    industrySegment: 'Retail & E-Commerce',
    categories: [
      {
        id: '501',
        name: 'Customer Journey & Experience Design',
        subCategories: [
          { id: '501-1', name: 'Customer Journey Mapping', description: 'Skills in mapping and optimizing customer journeys' },
          { id: '501-2', name: 'User Experience (UX) Design', description: 'Expertise in UX design principles and practices' },
          { id: '501-3', name: 'Customer Feedback & Analytics', description: 'Knowledge of customer feedback analysis and actionable insights' },
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
