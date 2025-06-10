
import { DomainGroup } from '../types';

export const lifeSciencesDomainGroups: DomainGroup[] = [
  {
    id: 'ls-1',
    name: 'Strategy, Innovation & Growth',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-1-1',
        name: 'Strategic Vision & Business Planning',
        domainGroupId: 'ls-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-1-1-1',
            name: 'Clinical & Scientific Mission Alignment',
            categoryId: 'ls-1-1',
            description: 'Ensuring research, clinical, and commercial strategies align with the organization\'s vision and patient-centric goals.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-1-2',
            name: 'Regulatory-Aware Strategic Planning',
            categoryId: 'ls-1-1',
            description: 'Applying frameworks (SWOT, PESTLE, Balanced Scorecards) tailored to regulatory and compliance-heavy environments.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-1-3',
            name: 'Therapeutic Area Positioning',
            categoryId: 'ls-1-1',
            description: 'Identifying core therapeutic strengths and competitive positioning in global disease segments.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-1-4',
            name: 'Long-Term Scientific Foresight',
            categoryId: 'ls-1-1',
            description: 'Anticipating breakthrough technologies, regulatory shifts, and emerging health trends in R&D strategy.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-1-2',
        name: 'Business Model & Value Proposition Design',
        domainGroupId: 'ls-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-1-2-1',
            name: 'Drug Development & Commercialization Models',
            categoryId: 'ls-1-2',
            description: 'Designing business models for molecule discovery, licensing, trials, and go-to-market phases.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-2-2',
            name: 'Patient Segments & Value Mapping',
            categoryId: 'ls-1-2',
            description: 'Tailoring solutions and outcomes based on patient demographics, conditions, and outcomes.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-2-3',
            name: 'Ecosystem Partnerships (CRO, CDMO, Academia)',
            categoryId: 'ls-1-2',
            description: 'Structuring collaborative models with contract research, manufacturing, and academic partners.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-2-4',
            name: 'Precision Medicine & Sustainability Models',
            categoryId: 'ls-1-2',
            description: 'Integrating personalized medicine, diagnostics, and sustainability into the business model.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-1-3',
        name: 'Outcome Measurement & Business Value Realization',
        domainGroupId: 'ls-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-1-3-1',
            name: 'Clinical & Commercial ROI Metrics',
            categoryId: 'ls-1-3',
            description: 'Defining success measures across R&D investments, trial pipelines, and commercial returns.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-3-2',
            name: 'Health Outcomes Realization',
            categoryId: 'ls-1-3',
            description: 'Tracking real-world evidence (RWE) and health outcome improvements post-commercialization.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-3-3',
            name: 'Outcome-Based Access Agreements',
            categoryId: 'ls-1-3',
            description: 'Designing market access or reimbursement contracts based on actual therapeutic outcomes.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-1-3-4',
            name: 'Portfolio Value Assurance',
            categoryId: 'ls-1-3',
            description: 'Ongoing review of pipeline performance, trial risks, and strategic alignment.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'ls-2',
    name: 'Operations, Delivery, Risk & Sustainability',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-2-1',
        name: 'Product & Systems Development Excellence',
        domainGroupId: 'ls-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-2-1-1',
            name: 'Clinical Requirements & Regulatory Specifications',
            categoryId: 'ls-2-1',
            description: 'Documenting functional, ethical, and regulatory needs for clinical systems and trials.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-1-2',
            name: 'Life Sciences Systems Architecture',
            categoryId: 'ls-2-1',
            description: 'Designing validated IT and data systems for pharmacovigilance, LIMS, and regulatory compliance.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-1-3',
            name: 'Preclinical to Commercial Prototyping',
            categoryId: 'ls-2-1',
            description: 'Rapid modeling and iteration from molecule screening to scale-up and manufacturing.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-1-4',
            name: 'Quality by Design & GxP Compliance',
            categoryId: 'ls-2-1',
            description: 'Embedding Good Practices (GLP, GMP, GCP) into development and operational systems.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-2-2',
        name: 'Service Design & Patient/Provider Experience',
        domainGroupId: 'ls-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-2-2-1',
            name: 'Clinical & Patient Journey Mapping',
            categoryId: 'ls-2-2',
            description: 'Mapping investigator, provider, and patient experiences across the clinical trial lifecycle.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-2-2',
            name: 'Omnichannel HCP/Patient Engagement',
            categoryId: 'ls-2-2',
            description: 'Delivering integrated engagement across rep visits, portals, mobile, and care settings.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-2-3',
            name: 'Feedback Loops (ePRO, EDC, HCP)',
            categoryId: 'ls-2-2',
            description: 'Integrating real-time data from providers, investigators, and patients into service improvement.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-2-4',
            name: 'Inclusive & Accessible Healthcare Design',
            categoryId: 'ls-2-2',
            description: 'Ensuring digital and service solutions are inclusive of diverse patient groups and needs.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-2-3',
        name: 'Process Excellence & Core Life Sciences Functions',
        domainGroupId: 'ls-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-2-3-1',
            name: 'R&D, Clinical Ops, Pharmacovigilance, Manufacturing',
            categoryId: 'ls-2-3',
            description: 'Optimizing performance across key life sciences business functions.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-3-2',
            name: 'SOPs for Lab, Trials, Production',
            categoryId: 'ls-2-3',
            description: 'Standardized protocols for regulated processes including trials and manufacturing.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-3-3',
            name: 'GxP-aligned KPI/OKRs',
            categoryId: 'ls-2-3',
            description: 'Outcome-based metrics tailored for scientific, regulatory, and operational excellence.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-3-4',
            name: 'Lean Lab & Digital QMS',
            categoryId: 'ls-2-3',
            description: 'Applying continuous improvement within regulated lab, QA, and manufacturing environments.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-2-4',
        name: 'Compliance, Risk & Regulatory Governance',
        domainGroupId: 'ls-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-2-4-1',
            name: 'Multi-Stakeholder Regulatory Readiness',
            categoryId: 'ls-2-4',
            description: 'Engaging sponsors, ethics boards, and regulators proactively in lifecycle planning.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-2-5',
        name: 'ESG & Sustainability Strategy',
        domainGroupId: 'ls-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-2-5-1',
            name: 'Green Labs & Low-Waste Production',
            categoryId: 'ls-2-5',
            description: 'Reducing waste and energy usage in R&D, clinical trials, and pharma production.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-5-2',
            name: 'Circular Pharma Supply Chain',
            categoryId: 'ls-2-5',
            description: 'Designing circular practices in packaging, reuse of materials, and return logistics.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-5-3',
            name: 'Ethical Trial Governance',
            categoryId: 'ls-2-5',
            description: 'Ensuring trials uphold human rights, fair access, and ethical data use.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-5-4',
            name: 'Health Equity & Community Outreach',
            categoryId: 'ls-2-5',
            description: 'Running programs to bridge gaps in health access and literacy across communities.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-2-6',
        name: 'Global / Regional Delivery Capability',
        domainGroupId: 'ls-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-2-6-1',
            name: 'Multinational Trial & Launch Management',
            categoryId: 'ls-2-6',
            description: 'Coordinating global drug development and multi-market approvals.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-6-2',
            name: 'Country-Specific Regulatory Navigation',
            categoryId: 'ls-2-6',
            description: 'Managing localization and compliance across drug, device, and diagnostics regulations.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-6-3',
            name: 'GxP-Compliant Delivery Center Design',
            categoryId: 'ls-2-6',
            description: 'Planning operations aligned with FDA, EMA, and CDSCO requirements.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-2-6-4',
            name: 'Time Zone, Language & Trial Diversity Support',
            categoryId: 'ls-2-6',
            description: 'Supporting multinational trials with appropriate tools, language, and participant diversity.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'ls-3',
    name: 'People, Culture & Change',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-3-1',
        name: 'Talent Management & Organizational Culture',
        domainGroupId: 'ls-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-3-1-1',
            name: 'Scientific Stakeholder Engagement',
            categoryId: 'ls-3-1',
            description: 'Involving lab teams, clinical staff, and patient advocates in organizational growth.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-1-2',
            name: 'Change Communications in Regulated Environments',
            categoryId: 'ls-3-1',
            description: 'Designing communications for change initiatives involving regulators, HCPs, and sponsors.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-1-3',
            name: 'Culture of Integrity & Science-Driven Innovation',
            categoryId: 'ls-3-1',
            description: 'Promoting transparency, ethics, and innovation mindset in high-stakes clinical environments.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-1-4',
            name: 'Trial Team Enablement & GxP Training',
            categoryId: 'ls-3-1',
            description: 'Training employees and vendors for compliance with clinical, quality, and regulatory standards.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-3-2',
        name: 'Operating Model & Organizational Structure',
        domainGroupId: 'ls-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-3-2-1',
            name: 'Role Clarity Across R&D, Medical, Regulatory',
            categoryId: 'ls-3-2',
            description: 'Mapping governance and accountability across functions in a matrixed pharma model.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-2-2',
            name: 'Decision Rights for Study, IP, Safety Escalation',
            categoryId: 'ls-3-2',
            description: 'Clarifying who holds final say across critical decision paths in life sciences workflows.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-2-3',
            name: 'Centralized Lab Ops vs. Distributed Sites',
            categoryId: 'ls-3-2',
            description: 'Balancing centralized research capabilities with distributed trial models.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-2-4',
            name: 'Shared Service Design (e.g., Medical Writing, QA)',
            categoryId: 'ls-3-2',
            description: 'Designing shared support hubs for scale and quality in regulated operations.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-3-3',
        name: 'Digital Workplace & Workforce Enablement',
        domainGroupId: 'ls-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-3-3-1',
            name: 'Clinical Collaboration Tools & Digital Platforms',
            categoryId: 'ls-3-3',
            description: 'Enabling remote trial teams and lab scientists with digital documentation and workflows.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-3-2',
            name: 'Remote Clinical Work & Monitoring Enablement',
            categoryId: 'ls-3-3',
            description: 'Supporting decentralized trials, remote visits, and digital data capture.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-3-3',
            name: 'Productivity Analytics in Lab & Field Settings',
            categoryId: 'ls-3-3',
            description: 'Measuring productivity across R&D, medical affairs, and field operations.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-3-3-4',
            name: 'Employee Wellness in Pharma Workplaces',
            categoryId: 'ls-3-3',
            description: 'Boosting resilience, compliance pressure management, and mental health.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'ls-4',
    name: 'Technology & Digital Transformation',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-4-1',
        name: 'Technology & Digital Transformation',
        domainGroupId: 'ls-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-4-1-1',
            name: 'Life Sciences Enterprise Architecture',
            categoryId: 'ls-4-1',
            description: 'Designing digital infrastructure that integrates EHR, EDC, CTMS, LIMS, and ERP.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-4-1-2',
            name: 'Cloud-Based Research & Data Lakes',
            categoryId: 'ls-4-1',
            description: 'Using cloud for scalability in bioinformatics, trial data, and genomics.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-4-1-3',
            name: 'Secure APIs & Interoperability Frameworks',
            categoryId: 'ls-4-1',
            description: 'Connecting systems across CROs, regulators, labs, and healthcare institutions.',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-4-1-4',
            name: 'Cybersecurity in Clinical & IP Environments',
            categoryId: 'ls-4-1',
            description: 'Embedding patient privacy, IP protection, and GxP-compliant cyber safeguards.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-4-2',
        name: 'Data Strategy & Decision Intelligence',
        domainGroupId: 'ls-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-4-2-1',
            name: 'R&D Analytics & Trial Insights Dashboards',
            categoryId: 'ls-4-2',
            description: 'Using real-time dashboards to monitor recruitment, outcomes, and site performance.',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
