
import { DomainGroup } from '../types';

export const lifeSciencesDomainGroups: Omit<DomainGroup, 'industrySegmentId'>[] = [
  {
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
  },
  {
    id: 'ls-operations-delivery-risk',
    name: 'Operations, Delivery, Risk & Sustainability',
    description: 'Operational excellence, delivery management, risk mitigation, and sustainability initiatives',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-product-systems-development',
        name: 'Product & Systems Development Excellence',
        description: 'Excellence in product and systems development for life sciences',
        domainGroupId: 'ls-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-clinical-requirements-regulatory',
            name: 'Clinical Requirements & Regulatory Specifications',
            description: 'Documenting functional, ethical, and regulatory needs for clinical systems and trials.',
            categoryId: 'ls-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-life-sciences-systems-architecture',
            name: 'Life Sciences Systems Architecture',
            description: 'Designing validated IT and data systems for pharmacovigilance, LIMS, and regulatory compliance.',
            categoryId: 'ls-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-preclinical-commercial-prototyping',
            name: 'Preclinical to Commercial Prototyping',
            description: 'Rapid modeling and iteration from molecule screening to scale-up and manufacturing.',
            categoryId: 'ls-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-quality-design-gxp-compliance',
            name: 'Quality by Design & GxP Compliance',
            description: 'Embedding Good Practices (GLP, GMP, GCP) into development and operational systems.',
            categoryId: 'ls-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-service-design-patient-experience',
        name: 'Service Design & Patient/Provider Experience',
        description: 'Designing services and experiences for patients and healthcare providers',
        domainGroupId: 'ls-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-clinical-patient-journey-mapping',
            name: 'Clinical & Patient Journey Mapping',
            description: 'Mapping investigator, provider, and patient experiences across the clinical trial lifecycle.',
            categoryId: 'ls-service-design-patient-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-omnichannel-hcp-patient-engagement',
            name: 'Omnichannel HCP/Patient Engagement',
            description: 'Delivering integrated engagement across rep visits, portals, mobile, and care settings.',
            categoryId: 'ls-service-design-patient-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-feedback-loops-epro-edc-hcp',
            name: 'Feedback Loops (ePRO, EDC, HCP)',
            description: 'Integrating real-time data from providers, investigators, and patients into service improvement.',
            categoryId: 'ls-service-design-patient-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-inclusive-accessible-healthcare',
            name: 'Inclusive & Accessible Healthcare Design',
            description: 'Ensuring digital and service solutions are inclusive of diverse patient groups and needs.',
            categoryId: 'ls-service-design-patient-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-process-excellence-core-functions',
        name: 'Process Excellence & Core Life Sciences Functions',
        description: 'Excellence in core life sciences business processes and functions',
        domainGroupId: 'ls-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-rd-clinical-ops-manufacturing',
            name: 'R&D, Clinical Ops, Pharmacovigilance, Manufacturing',
            description: 'Optimizing performance across key life sciences business functions.',
            categoryId: 'ls-process-excellence-core-functions',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-sops-lab-trials-production',
            name: 'SOPs for Lab, Trials, Production',
            description: 'Standardized protocols for regulated processes including trials and manufacturing.',
            categoryId: 'ls-process-excellence-core-functions',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-gxp-aligned-kpi-okrs',
            name: 'GxP-aligned KPI/OKRs',
            description: 'Outcome-based metrics tailored for scientific, regulatory, and operational excellence.',
            categoryId: 'ls-process-excellence-core-functions',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-lean-lab-digital-qms',
            name: 'Lean Lab & Digital QMS',
            description: 'Applying continuous improvement within regulated lab, QA, and manufacturing environments.',
            categoryId: 'ls-process-excellence-core-functions',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-compliance-risk-regulatory',
        name: 'Compliance, Risk & Regulatory Governance',
        description: 'Comprehensive compliance, risk management, and regulatory governance',
        domainGroupId: 'ls-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-multi-stakeholder-regulatory-readiness',
            name: 'Multi-Stakeholder Regulatory Readiness',
            description: 'Engaging sponsors, ethics boards, and regulators proactively in lifecycle planning.',
            categoryId: 'ls-compliance-risk-regulatory',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-esg-sustainability-strategy',
        name: 'ESG & Sustainability Strategy',
        description: 'Environmental, social, and governance sustainability strategies',
        domainGroupId: 'ls-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-green-labs-low-waste-production',
            name: 'Green Labs & Low-Waste Production',
            description: 'Reducing waste and energy usage in R&D, clinical trials, and pharma production.',
            categoryId: 'ls-esg-sustainability-strategy',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-circular-pharma-supply-chain',
            name: 'Circular Pharma Supply Chain',
            description: 'Designing circular practices in packaging, reuse of materials, and return logistics.',
            categoryId: 'ls-esg-sustainability-strategy',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-ethical-trial-governance',
            name: 'Ethical Trial Governance',
            description: 'Ensuring trials uphold human rights, fair access, and ethical data use.',
            categoryId: 'ls-esg-sustainability-strategy',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-health-equity-community-outreach',
            name: 'Health Equity & Community Outreach',
            description: 'Running programs to bridge gaps in health access and literacy across communities.',
            categoryId: 'ls-esg-sustainability-strategy',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-global-regional-delivery',
        name: 'Global / Regional Delivery Capability',
        description: 'Global and regional delivery capabilities for life sciences operations',
        domainGroupId: 'ls-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-multinational-trial-launch',
            name: 'Multinational Trial & Launch Management',
            description: 'Coordinating global drug development and multi-market approvals.',
            categoryId: 'ls-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-country-specific-regulatory',
            name: 'Country-Specific Regulatory Navigation',
            description: 'Managing localization and compliance across drug, device, and diagnostics regulations.',
            categoryId: 'ls-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-gxp-compliant-delivery-center',
            name: 'GxP-Compliant Delivery Center Design',
            description: 'Planning operations aligned with FDA, EMA, and CDSCO requirements.',
            categoryId: 'ls-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-time-zone-language-trial-diversity',
            name: 'Time Zone, Language & Trial Diversity Support',
            description: 'Supporting multinational trials with appropriate tools, language, and participant diversity.',
            categoryId: 'ls-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'ls-people-culture-change',
    name: 'People, Culture & Change',
    description: 'People management, culture development, and change management for life sciences organizations',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'ls-talent-management-culture',
        name: 'Talent Management & Organizational Culture',
        description: 'Comprehensive talent management and organizational culture development',
        domainGroupId: 'ls-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-scientific-stakeholder-engagement',
            name: 'Scientific Stakeholder Engagement',
            description: 'Involving lab teams, clinical staff, and patient advocates in organizational growth.',
            categoryId: 'ls-talent-management-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-change-communications-regulated',
            name: 'Change Communications in Regulated Environments',
            description: 'Designing communications for change initiatives involving regulators, HCPs, and sponsors.',
            categoryId: 'ls-talent-management-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-culture-integrity-innovation',
            name: 'Culture of Integrity & Science-Driven Innovation',
            description: 'Promoting transparency, ethics, and innovation mindset in high-stakes clinical environments.',
            categoryId: 'ls-talent-management-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-trial-team-enablement-gxp',
            name: 'Trial Team Enablement & GxP Training',
            description: 'Training employees and vendors for compliance with clinical, quality, and regulatory standards.',
            categoryId: 'ls-talent-management-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-operating-model-structure',
        name: 'Operating Model & Organizational Structure',
        description: 'Designing operating models and organizational structures for life sciences',
        domainGroupId: 'ls-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-role-clarity-rd-medical-regulatory',
            name: 'Role Clarity Across R&D, Medical, Regulatory',
            description: 'Mapping governance and accountability across functions in a matrixed pharma model.',
            categoryId: 'ls-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-decision-rights-study-ip-safety',
            name: 'Decision Rights for Study, IP, Safety Escalation',
            description: 'Clarifying who holds final say across critical decision paths in life sciences workflows.',
            categoryId: 'ls-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-centralized-lab-ops-distributed',
            name: 'Centralized Lab Ops vs. Distributed Sites',
            description: 'Balancing centralized research capabilities with distributed trial models.',
            categoryId: 'ls-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-shared-service-design-medical-qa',
            name: 'Shared Service Design (e.g., Medical Writing, QA)',
            description: 'Designing shared support hubs for scale and quality in regulated operations.',
            categoryId: 'ls-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'ls-digital-workplace-workforce',
        name: 'Digital Workplace & Workforce Enablement',
        description: 'Digital workplace solutions and workforce enablement for life sciences',
        domainGroupId: 'ls-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'ls-clinical-collaboration-tools',
            name: 'Clinical Collaboration Tools & Digital Platforms',
            description: 'Enabling remote trial teams and lab scientists with digital documentation and workflows.',
            categoryId: 'ls-digital-workplace-workforce',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-remote-clinical-work-monitoring',
            name: 'Remote Clinical Work & Monitoring Enablement',
            description: 'Supporting decentralized trials, remote visits, and digital data capture.',
            categoryId: 'ls-digital-workplace-workforce',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-productivity-analytics-lab-field',
            name: 'Productivity Analytics in Lab & Field Settings',
            description: 'Measuring productivity across R&D, medical affairs, and field operations.',
            categoryId: 'ls-digital-workplace-workforce',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ls-employee-wellness-pharma',
            name: 'Employee Wellness in Pharma Workplaces',
            description: 'Boosting resilience, compliance pressure management, and mental health.',
            categoryId: 'ls-digital-workplace-workforce',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
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
  }
];
