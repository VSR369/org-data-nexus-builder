
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
        name: 'Strategic Vision & Business Planning',
        description: 'Strategic vision and business planning for life sciences organizations',
        domainGroupId: 'ls-dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-1-1-1',
            name: 'Clinical & Scientific Mission Alignment',
            description: 'Ensuring research, clinical, and commercial strategies align with the organization\'s vision and patient-centric goals',
            categoryId: 'ls-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-1-2',
            name: 'Regulatory-Aware Strategic Planning',
            description: 'Applying frameworks (SWOT, PESTLE, Balanced Scorecards) tailored to regulatory and compliance-heavy environments',
            categoryId: 'ls-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-1-3',
            name: 'Therapeutic Area Positioning',
            description: 'Identifying core therapeutic strengths and competitive positioning in global disease segments',
            categoryId: 'ls-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-1-4',
            name: 'Long-Term Scientific Foresight',
            description: 'Anticipating breakthrough technologies, regulatory shifts, and emerging health trends in R&D strategy',
            categoryId: 'ls-cat-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-1-2',
        name: 'Business Model & Value Proposition Design',
        description: 'Designing business models and value propositions for life sciences',
        domainGroupId: 'ls-dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-1-2-1',
            name: 'Drug Development & Commercialization Models',
            description: 'Designing business models for molecule discovery, licensing, trials, and go-to-market phases',
            categoryId: 'ls-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-2-2',
            name: 'Patient Segments & Value Mapping',
            description: 'Tailoring solutions and outcomes based on patient demographics, conditions, and outcomes',
            categoryId: 'ls-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-2-3',
            name: 'Ecosystem Partnerships (CRO, CDMO, Academia)',
            description: 'Structuring collaborative models with contract research, manufacturing, and academic partners',
            categoryId: 'ls-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-2-4',
            name: 'Precision Medicine & Sustainability Models',
            description: 'Integrating personalized medicine, diagnostics, and sustainability into the business model',
            categoryId: 'ls-cat-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-1-3',
        name: 'Outcome Measurement & Business Value Realization',
        description: 'Measuring outcomes and realizing business value in life sciences',
        domainGroupId: 'ls-dg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-1-3-1',
            name: 'Clinical & Commercial ROI Metrics',
            description: 'Defining success measures across R&D investments, trial pipelines, and commercial returns',
            categoryId: 'ls-cat-1-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-3-2',
            name: 'Health Outcomes Realization',
            description: 'Tracking real-world evidence (RWE) and health outcome improvements post-commercialization',
            categoryId: 'ls-cat-1-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-3-3',
            name: 'Outcome-Based Access Agreements',
            description: 'Designing market access or reimbursement contracts based on actual therapeutic outcomes',
            categoryId: 'ls-cat-1-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-1-3-4',
            name: 'Portfolio Value Assurance',
            description: 'Ongoing review of pipeline performance, trial risks, and strategic alignment',
            categoryId: 'ls-cat-1-3',
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
    description: 'Operations, delivery, risk management, and sustainability in life sciences',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-cat-2-1',
        name: 'Product & Systems Development Excellence',
        description: 'Excellence in product and systems development for life sciences',
        domainGroupId: 'ls-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-2-1-1',
            name: 'Clinical Requirements & Regulatory Specifications',
            description: 'Documenting functional, ethical, and regulatory needs for clinical systems and trials',
            categoryId: 'ls-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-1-2',
            name: 'Life Sciences Systems Architecture',
            description: 'Designing validated IT and data systems for pharmacovigilance, LIMS, and regulatory compliance',
            categoryId: 'ls-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-1-3',
            name: 'Preclinical to Commercial Prototyping',
            description: 'Rapid modeling and iteration from molecule screening to scale-up and manufacturing',
            categoryId: 'ls-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-1-4',
            name: 'Quality by Design & GxP Compliance',
            description: 'Embedding Good Practices (GLP, GMP, GCP) into development and operational systems',
            categoryId: 'ls-cat-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-2-2',
        name: 'Service Design & Patient/Provider Experience',
        description: 'Designing services and experiences for patients and providers',
        domainGroupId: 'ls-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-2-2-1',
            name: 'Clinical & Patient Journey Mapping',
            description: 'Mapping investigator, provider, and patient experiences across the clinical trial lifecycle',
            categoryId: 'ls-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-2-2',
            name: 'Omnichannel HCP/Patient Engagement',
            description: 'Delivering integrated engagement across rep visits, portals, mobile, and care settings',
            categoryId: 'ls-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-2-3',
            name: 'Feedback Loops (ePRO, EDC, HCP)',
            description: 'Integrating real-time data from providers, investigators, and patients into service improvement',
            categoryId: 'ls-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-2-4',
            name: 'Inclusive & Accessible Healthcare Design',
            description: 'Ensuring digital and service solutions are inclusive of diverse patient groups and needs',
            categoryId: 'ls-cat-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-2-3',
        name: 'Process Excellence & Core Life Sciences Functions',
        description: 'Excellence in core life sciences processes and functions',
        domainGroupId: 'ls-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-2-3-1',
            name: 'R&D, Clinical Ops, Pharmacovigilance, Manufacturing',
            description: 'Optimizing performance across key life sciences business functions',
            categoryId: 'ls-cat-2-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-3-2',
            name: 'SOPs for Lab, Trials, Production',
            description: 'Standardized protocols for regulated processes including trials and manufacturing',
            categoryId: 'ls-cat-2-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-3-3',
            name: 'GxP-aligned KPI/OKRs',
            description: 'Outcome-based metrics tailored for scientific, regulatory, and operational excellence',
            categoryId: 'ls-cat-2-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-3-4',
            name: 'Lean Lab & Digital QMS',
            description: 'Applying continuous improvement within regulated lab, QA, and manufacturing environments',
            categoryId: 'ls-cat-2-3',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-2-4',
        name: 'Compliance, Risk & Regulatory Governance',
        description: 'Managing compliance, risk, and regulatory governance',
        domainGroupId: 'ls-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-2-4-1',
            name: 'Multi-Stakeholder Regulatory Readiness',
            description: 'Engaging sponsors, ethics boards, and regulators proactively in lifecycle planning',
            categoryId: 'ls-cat-2-4',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-2-5',
        name: 'ESG & Sustainability Strategy',
        description: 'Environmental, social, and governance sustainability strategies',
        domainGroupId: 'ls-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-2-5-1',
            name: 'Green Labs & Low-Waste Production',
            description: 'Reducing waste and energy usage in R&D, clinical trials, and pharma production',
            categoryId: 'ls-cat-2-5',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-5-2',
            name: 'Circular Pharma Supply Chain',
            description: 'Designing circular practices in packaging, reuse of materials, and return logistics',
            categoryId: 'ls-cat-2-5',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-5-3',
            name: 'Ethical Trial Governance',
            description: 'Ensuring trials uphold human rights, fair access, and ethical data use',
            categoryId: 'ls-cat-2-5',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-5-4',
            name: 'Health Equity & Community Outreach',
            description: 'Running programs to bridge gaps in health access and literacy across communities',
            categoryId: 'ls-cat-2-5',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-2-6',
        name: 'Global / Regional Delivery Capability',
        description: 'Global and regional delivery capabilities for life sciences',
        domainGroupId: 'ls-dg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-2-6-1',
            name: 'Multinational Trial & Launch Management',
            description: 'Coordinating global drug development and multi-market approvals',
            categoryId: 'ls-cat-2-6',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-6-2',
            name: 'Country-Specific Regulatory Navigation',
            description: 'Managing localization and compliance across drug, device, and diagnostics regulations',
            categoryId: 'ls-cat-2-6',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-6-3',
            name: 'GxP-Compliant Delivery Center Design',
            description: 'Planning operations aligned with FDA, EMA, and CDSCO requirements',
            categoryId: 'ls-cat-2-6',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-2-6-4',
            name: 'Time Zone, Language & Trial Diversity Support',
            description: 'Supporting multinational trials with appropriate tools, language, and participant diversity',
            categoryId: 'ls-cat-2-6',
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
    description: 'People management, culture development, and change management in life sciences',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-cat-3-1',
        name: 'Talent Management & Organizational Culture',
        description: 'Managing talent and developing organizational culture',
        domainGroupId: 'ls-dg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-3-1-1',
            name: 'Scientific Stakeholder Engagement',
            description: 'Involving lab teams, clinical staff, and patient advocates in organizational growth',
            categoryId: 'ls-cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-1-2',
            name: 'Change Communications in Regulated Environments',
            description: 'Designing communications for change initiatives involving regulators, HCPs, and sponsors',
            categoryId: 'ls-cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-1-3',
            name: 'Culture of Integrity & Science-Driven Innovation',
            description: 'Promoting transparency, ethics, and innovation mindset in high-stakes clinical environments',
            categoryId: 'ls-cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-1-4',
            name: 'Trial Team Enablement & GxP Training',
            description: 'Training employees and vendors for compliance with clinical, quality, and regulatory standards',
            categoryId: 'ls-cat-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-3-2',
        name: 'Operating Model & Organizational Structure',
        description: 'Designing operating models and organizational structures',
        domainGroupId: 'ls-dg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-3-2-1',
            name: 'Role Clarity Across R&D, Medical, Regulatory',
            description: 'Mapping governance and accountability across functions in a matrixed pharma model',
            categoryId: 'ls-cat-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-2-2',
            name: 'Decision Rights for Study, IP, Safety Escalation',
            description: 'Clarifying who holds final say across critical decision paths in life sciences workflows',
            categoryId: 'ls-cat-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-2-3',
            name: 'Centralized Lab Ops vs. Distributed Sites',
            description: 'Balancing centralized research capabilities with distributed trial models',
            categoryId: 'ls-cat-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-2-4',
            name: 'Shared Service Design (e.g., Medical Writing, QA)',
            description: 'Designing shared support hubs for scale and quality in regulated operations',
            categoryId: 'ls-cat-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-3-3',
        name: 'Digital Workplace & Workforce Enablement',
        description: 'Enabling digital workplace and workforce capabilities',
        domainGroupId: 'ls-dg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-3-3-1',
            name: 'Clinical Collaboration Tools & Digital Platforms',
            description: 'Enabling remote trial teams and lab scientists with digital documentation and workflows',
            categoryId: 'ls-cat-3-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-3-2',
            name: 'Remote Clinical Work & Monitoring Enablement',
            description: 'Supporting decentralized trials, remote visits, and digital data capture',
            categoryId: 'ls-cat-3-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-3-3',
            name: 'Productivity Analytics in Lab & Field Settings',
            description: 'Measuring productivity across R&D, medical affairs, and field operations',
            categoryId: 'ls-cat-3-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-3-3-4',
            name: 'Employee Wellness in Pharma Workplaces',
            description: 'Boosting resilience, compliance pressure management, and mental health',
            categoryId: 'ls-cat-3-3',
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
    description: 'Technology and digital transformation initiatives in life sciences',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-cat-4-1',
        name: 'Technology & Digital Transformation',
        description: 'Core technology and digital transformation capabilities',
        domainGroupId: 'ls-dg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-4-1-1',
            name: 'Life Sciences Enterprise Architecture',
            description: 'Designing digital infrastructure that integrates EHR, EDC, CTMS, LIMS, and ERP',
            categoryId: 'ls-cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-4-1-2',
            name: 'Cloud-Based Research & Data Lakes',
            description: 'Using cloud for scalability in bioinformatics, trial data, and genomics',
            categoryId: 'ls-cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-4-1-3',
            name: 'Secure APIs & Interoperability Frameworks',
            description: 'Connecting systems across CROs, regulators, labs, and healthcare institutions',
            categoryId: 'ls-cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sub-4-1-4',
            name: 'Cybersecurity in Clinical & IP Environments',
            description: 'Embedding patient privacy, IP protection, and GxP-compliant cyber safeguards',
            categoryId: 'ls-cat-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-cat-4-2',
        name: 'Data Strategy & Decision Intelligence',
        description: 'Data strategy and decision intelligence for life sciences',
        domainGroupId: 'ls-dg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-sub-4-2-1',
            name: 'R&D Analytics & Trial Insights Dashboards',
            description: 'Using real-time dashboards to monitor recruitment, outcomes, and site performance',
            categoryId: 'ls-cat-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
