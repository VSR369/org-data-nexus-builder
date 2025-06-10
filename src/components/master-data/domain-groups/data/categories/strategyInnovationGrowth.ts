
import { DomainGroup } from '../../types';

export const strategyInnovationGrowthGroup: Omit<DomainGroup, 'industrySegmentId'> = {
  id: 'ls-strategy-innovation-growth',
  name: 'Strategy, Innovation & Growth',
  description: 'Strategic planning, innovation management, and growth initiatives for life sciences organizations',
  isActive: true,
  createdAt: new Date().toISOString(),
  categories: [
    {
      id: 'ls-strategic-vision-planning',
      name: 'Strategic Vision & Business Planning',
      description: 'Strategic vision development and comprehensive business planning for life sciences',
      domainGroupId: 'ls-strategy-innovation-growth',
      isActive: true,
      createdAt: new Date().toISOString(),
      subCategories: [
        {
          id: 'ls-clinical-scientific-mission',
          name: 'Clinical & Scientific Mission Alignment',
          description: 'Ensuring research, clinical, and commercial strategies align with the organization\'s vision and patient-centric goals.',
          categoryId: 'ls-strategic-vision-planning',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-regulatory-aware-planning',
          name: 'Regulatory-Aware Strategic Planning',
          description: 'Applying frameworks (SWOT, PESTLE, Balanced Scorecards) tailored to regulatory and compliance-heavy environments.',
          categoryId: 'ls-strategic-vision-planning',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-therapeutic-area-positioning',
          name: 'Therapeutic Area Positioning',
          description: 'Identifying core therapeutic strengths and competitive positioning in global disease segments.',
          categoryId: 'ls-strategic-vision-planning',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-long-term-scientific-foresight',
          name: 'Long-Term Scientific Foresight',
          description: 'Anticipating breakthrough technologies, regulatory shifts, and emerging health trends in R&D strategy.',
          categoryId: 'ls-strategic-vision-planning',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 'ls-business-model-value-prop',
      name: 'Business Model & Value Proposition Design',
      description: 'Designing comprehensive business models and value propositions for life sciences',
      domainGroupId: 'ls-strategy-innovation-growth',
      isActive: true,
      createdAt: new Date().toISOString(),
      subCategories: [
        {
          id: 'ls-drug-dev-commercialization',
          name: 'Drug Development & Commercialization Models',
          description: 'Designing business models for molecule discovery, licensing, trials, and go-to-market phases.',
          categoryId: 'ls-business-model-value-prop',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-patient-segments-value-mapping',
          name: 'Patient Segments & Value Mapping',
          description: 'Tailoring solutions and outcomes based on patient demographics, conditions, and outcomes.',
          categoryId: 'ls-business-model-value-prop',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-ecosystem-partnerships',
          name: 'Ecosystem Partnerships (CRO, CDMO, Academia)',
          description: 'Structuring collaborative models with contract research, manufacturing, and academic partners.',
          categoryId: 'ls-business-model-value-prop',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-precision-medicine-sustainability',
          name: 'Precision Medicine & Sustainability Models',
          description: 'Integrating personalized medicine, diagnostics, and sustainability into the business model.',
          categoryId: 'ls-business-model-value-prop',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 'ls-outcome-measurement-value',
      name: 'Outcome Measurement & Business Value Realization',
      description: 'Measuring outcomes and realizing business value in life sciences initiatives',
      domainGroupId: 'ls-strategy-innovation-growth',
      isActive: true,
      createdAt: new Date().toISOString(),
      subCategories: [
        {
          id: 'ls-clinical-commercial-roi',
          name: 'Clinical & Commercial ROI Metrics',
          description: 'Defining success measures across R&D investments, trial pipelines, and commercial returns.',
          categoryId: 'ls-outcome-measurement-value',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-health-outcomes-realization',
          name: 'Health Outcomes Realization',
          description: 'Tracking real-world evidence (RWE) and health outcome improvements post-commercialization.',
          categoryId: 'ls-outcome-measurement-value',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-outcome-based-access',
          name: 'Outcome-Based Access Agreements',
          description: 'Designing market access or reimbursement contracts based on actual therapeutic outcomes.',
          categoryId: 'ls-outcome-measurement-value',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-portfolio-value-assurance',
          name: 'Portfolio Value Assurance',
          description: 'Ongoing review of pipeline performance, trial risks, and strategic alignment.',
          categoryId: 'ls-outcome-measurement-value',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    }
  ]
};
