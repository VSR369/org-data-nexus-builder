
import { DomainGroup } from '../types';

export const manufacturingDomainGroups: Omit<DomainGroup, 'industrySegmentId'>[] = [
  {
    id: 'mfg-strategy-innovation-growth',
    name: 'Strategy, Innovation & Growth',
    description: 'Strategic planning, innovation management, and growth initiatives for manufacturing organizations',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-strategic-vision-planning',
        name: 'Strategic Vision & Business Planning',
        description: 'Strategic vision development and comprehensive business planning for manufacturing',
        domainGroupId: 'mfg-strategy-innovation-growth',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-operational-innovation-alignment',
            name: 'Operational and Innovation Strategy Alignment',
            description: 'Aligning vision, efficiency goals, and innovation in production systems.',
            categoryId: 'mfg-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-industry-4-frameworks',
            name: 'Industry 4.0 Strategic Frameworks',
            description: 'Applying maturity models and frameworks (e.g., PESTLE, Lean Digital, Smart Factory Roadmaps).',
            categoryId: 'mfg-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-competitive-positioning',
            name: 'Competitive Manufacturing Positioning',
            description: 'Defining cost, quality, and agility advantages in global manufacturing.',
            categoryId: 'mfg-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-future-ready-foresight',
            name: 'Future-Ready Industrial Foresight',
            description: 'Planning for automation, robotics, supply volatility, and AI-driven manufacturing.',
            categoryId: 'mfg-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-business-model-value-prop',
        name: 'Business Model & Value Proposition Design',
        description: 'Designing comprehensive business models and value propositions for manufacturing',
        domainGroupId: 'mfg-strategy-innovation-growth',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-production-service-revenue',
            name: 'Production & Service Revenue Models',
            description: 'Optimizing recurring revenue through product-as-a-service or predictive maintenance services.',
            categoryId: 'mfg-business-model-value-prop',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-customer-centric-design',
            name: 'Customer-Centric Manufacturing Design',
            description: 'Customization, on-demand manufacturing, and agile delivery models.',
            categoryId: 'mfg-business-model-value-prop',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-partner-supply-ecosystem',
            name: 'Partner Supply Ecosystem Strategy',
            description: 'Building reliable supplier, logistics, and integration networks.',
            categoryId: 'mfg-business-model-value-prop',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sustainable-circular-value',
            name: 'Sustainable & Circular Value Propositions',
            description: 'Designing products for reuse, remanufacturing, and energy-efficient operations.',
            categoryId: 'mfg-business-model-value-prop',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-outcome-measurement-value',
        name: 'Outcome Measurement & Business Value Realization',
        description: 'Measuring outcomes and realizing business value in manufacturing initiatives',
        domainGroupId: 'mfg-strategy-innovation-growth',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-manufacturing-kpis-roi',
            name: 'Manufacturing KPIs & ROI Dashboards',
            description: 'Metrics like OEE, yield, scrap rate, throughput, and return on automation.',
            categoryId: 'mfg-outcome-measurement-value',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-quality-compliance-impact',
            name: 'Quality & Compliance Impact Assessment',
            description: 'Measuring the value of quality control and compliance processes.',
            categoryId: 'mfg-outcome-measurement-value',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-value-based-sourcing',
            name: 'Value-Based Sourcing Contracts',
            description: 'Structuring vendor and production contracts based on delivered outcomes.',
            categoryId: 'mfg-outcome-measurement-value',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-continuous-value-tracking',
            name: 'Continuous Value Tracking & Assurance',
            description: 'Periodic evaluation of plant, line, and supply chain performance.',
            categoryId: 'mfg-outcome-measurement-value',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-operations-delivery-risk',
    name: 'Operations, Delivery, Risk & Sustainability',
    description: 'Operational excellence, delivery management, risk mitigation, and sustainability initiatives',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-product-systems-development',
        name: 'Product & Systems Development Excellence',
        description: 'Excellence in product and systems development for manufacturing',
        domainGroupId: 'mfg-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-bom-process-requirements',
            name: 'BOM & Process Requirements Engineering',
            description: 'Capturing precise input-output specifications and tolerances.',
            categoryId: 'mfg-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-modular-design-mes',
            name: 'Modular Design & MES Integration',
            description: 'Architecting scalable manufacturing processes integrated with digital systems.',
            categoryId: 'mfg-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-digital-twin-prototyping',
            name: 'Digital Twin & Prototyping',
            description: 'Using simulations and digital replicas to iterate quickly.',
            categoryId: 'mfg-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-reliability-engineering-qa',
            name: 'Reliability Engineering & Shop Floor QA',
            description: 'Ensuring performance under real-world stress conditions and quality variability.',
            categoryId: 'mfg-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-manufacturing-customer-experience',
        name: 'Manufacturing & Customer Experience Design',
        description: 'Designing manufacturing processes and customer experiences',
        domainGroupId: 'mfg-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-plant-customer-value-stream',
            name: 'Plant-to-Customer Value Stream Mapping',
            description: 'Mapping flow from raw materials to customer fulfillment.',
            categoryId: 'mfg-manufacturing-customer-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-omni-channel-aftermarket',
            name: 'Omni-Channel Aftermarket Experience',
            description: 'Integrated warranty, servicing, and spare parts across channels.',
            categoryId: 'mfg-manufacturing-customer-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-voice-customer-production',
            name: 'Voice of Customer to Production Feedback',
            description: 'Closing the loop from customer service to production design changes.',
            categoryId: 'mfg-manufacturing-customer-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-human-machine-collaboration',
            name: 'Human-Machine Collaboration Design',
            description: 'Ergonomics, co-working with cobots, and UI for operators.',
            categoryId: 'mfg-manufacturing-customer-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-process-excellence-core',
        name: 'Process Excellence & Core Manufacturing Functions',
        description: 'Excellence in core manufacturing business processes and functions',
        domainGroupId: 'mfg-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-planning-procurement-production',
            name: 'Planning, Procurement, Production, SCM, Maintenance',
            description: 'Optimizing end-to-end supply chain and factory workflows.',
            categoryId: 'mfg-process-excellence-core',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sops-line-documentation',
            name: 'SOPs & Line Documentation Systems',
            description: 'Digital SOPs, eBMRs, and real-time compliance records.',
            categoryId: 'mfg-process-excellence-core',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-process-kpi-okr',
            name: 'Process KPI/OKR Management',
            description: 'Tracking metrics like takt time, downtime, and capacity utilization.',
            categoryId: 'mfg-process-excellence-core',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-lean-six-sigma-tpm',
            name: 'Lean, Six Sigma & TPM',
            description: 'Embedding structured continuous improvement programs.',
            categoryId: 'mfg-process-excellence-core',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-compliance-risk-regulatory',
        name: 'Compliance, Risk & Regulatory Governance',
        description: 'Comprehensive compliance, risk management, and regulatory governance',
        domainGroupId: 'mfg-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-regulatory-conformance-audit',
            name: 'Regulatory Conformance & Audit Readiness',
            description: 'Meeting ISO, OSHA, REACH, RoHS, and other compliance mandates.',
            categoryId: 'mfg-compliance-risk-regulatory',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-esg-sustainability',
        name: 'ESG & Sustainability Strategy',
        description: 'Environmental, social, and governance sustainability strategies',
        domainGroupId: 'mfg-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-energy-efficient-manufacturing',
            name: 'Energy-Efficient Manufacturing',
            description: 'Energy audits, renewables integration, and low-emission technologies.',
            categoryId: 'mfg-esg-sustainability',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-circular-manufacturing-waste',
            name: 'Circular Manufacturing & Waste Reduction',
            description: 'Reverse logistics, scrap management, and cradle-to-cradle practices.',
            categoryId: 'mfg-esg-sustainability',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-ethical-sourcing-labor',
            name: 'Ethical Sourcing & Labor Rights',
            description: 'Transparency in material origin and labor conditions.',
            categoryId: 'mfg-esg-sustainability',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-community-industrial-development',
            name: 'Community Industrial Development Programs',
            description: 'Engaging local communities through employment and upskilling.',
            categoryId: 'mfg-esg-sustainability',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-global-regional-delivery',
        name: 'Global / Regional Delivery Capability',
        description: 'Global and regional delivery capabilities for manufacturing operations',
        domainGroupId: 'mfg-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-multi-plant-country',
            name: 'Multi-Plant & Multi-Country Operations',
            description: 'Harmonizing operations across geographies.',
            categoryId: 'mfg-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-local-regulations-trade',
            name: 'Local Regulations & Trade Compliance',
            description: 'Adhering to export controls, duties, and local labor/environmental laws.',
            categoryId: 'mfg-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-global-manufacturing-network',
            name: 'Global Manufacturing Network Design',
            description: 'Strategic placement of factories, distribution hubs, and service centers.',
            categoryId: 'mfg-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-language-shift-collaboration',
            name: 'Language & Shift Collaboration Tools',
            description: 'Supporting multilingual, multi-shift operations with digital platforms.',
            categoryId: 'mfg-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-people-culture-change',
    name: 'People, Culture & Change',
    description: 'People management, culture development, and change management for manufacturing organizations',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-talent-management-shopfloor',
        name: 'Talent Management & Shopfloor Culture',
        description: 'Comprehensive talent management and shopfloor culture development',
        domainGroupId: 'mfg-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-plant-engineering-workforce',
            name: 'Plant & Engineering Workforce Engagement',
            description: 'Involving operators, technicians, and engineers in transformation.',
            categoryId: 'mfg-talent-management-shopfloor',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-safety-first-communication',
            name: 'Safety-First Communication Culture',
            description: 'Promoting proactive safety behavior and awareness campaigns.',
            categoryId: 'mfg-talent-management-shopfloor',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-manufacturing-excellence-mindset',
            name: 'Manufacturing Excellence Mindset',
            description: 'Building pride and ownership in quality, productivity, and innovation.',
            categoryId: 'mfg-talent-management-shopfloor',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-reskilling-digital-factories',
            name: 'Reskilling for Digital Factories',
            description: 'Upskilling in automation, analytics, and control systems.',
            categoryId: 'mfg-talent-management-shopfloor',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-operating-model-structure',
        name: 'Operating Model & Organizational Structure',
        description: 'Designing operating models and organizational structures for manufacturing',
        domainGroupId: 'mfg-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-plant-level-governance',
            name: 'Plant-Level Governance & Role Alignment',
            description: 'Defining clear accountability at plant, line, and shift level.',
            categoryId: 'mfg-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-authority-quality-escalation',
            name: 'Authority for Quality Escalation',
            description: 'Empowering frontline workers to halt or escalate issues.',
            categoryId: 'mfg-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-central-plant-autonomy',
            name: 'Central vs. Plant Autonomy Balance',
            description: 'Balancing standardized excellence with local customization.',
            categoryId: 'mfg-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-shared-service-hubs',
            name: 'Shared Service Hubs (Maintenance, Safety, QA)',
            description: 'Centralized specialist support structures.',
            categoryId: 'mfg-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-digital-workplace-workforce',
        name: 'Digital Workplace & Workforce Enablement',
        description: 'Digital workplace solutions and workforce enablement for manufacturing',
        domainGroupId: 'mfg-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-digital-work-instructions',
            name: 'Digital Work Instructions & Checklists',
            description: 'Replacing paper with mobile-enabled instructions.',
            categoryId: 'mfg-digital-workplace-workforce',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-remote-equipment-monitoring',
            name: 'Remote Equipment Monitoring & Support',
            description: 'Enabling remote diagnostics and guidance via AR/VR.',
            categoryId: 'mfg-digital-workplace-workforce',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-operator-dashboards-cockpits',
            name: 'Operator Dashboards & Digital Cockpits',
            description: 'Real-time visibility of performance, faults, and alerts.',
            categoryId: 'mfg-digital-workplace-workforce',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-worker-wellness-shift-planning',
            name: 'Worker Wellness & Shift Planning Tools',
            description: 'Apps and analytics to manage fatigue, ergonomics, and morale.',
            categoryId: 'mfg-digital-workplace-workforce',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-technology-digital-transformation',
    name: 'Technology & Digital Transformation',
    description: 'Technology strategy and digital transformation initiatives for manufacturing',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-smart-factory-it-ot',
        name: 'Smart Factory & IT-OT Convergence',
        description: 'Smart factory technologies and IT-OT convergence strategies',
        domainGroupId: 'mfg-technology-digital-transformation',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-manufacturing-it-architecture',
            name: 'Manufacturing IT Architecture (MES, ERP, SCADA)',
            description: 'Integrated enterprise and operations technologies.',
            categoryId: 'mfg-smart-factory-it-ot',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-edge-cloud-infrastructure',
            name: 'Edge & Cloud Infrastructure for Factory Data',
            description: 'Scalable architecture for real-time analytics and control.',
            categoryId: 'mfg-smart-factory-it-ot',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-iot-interoperability-production',
            name: 'IoT & Interoperability in Production Lines',
            description: 'Seamless communication among machines, sensors, and platforms.',
            categoryId: 'mfg-smart-factory-it-ot',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-cybersecurity-industrial-systems',
            name: 'Cybersecurity in Industrial Systems',
            description: 'Protecting OT, PLCs, and production data from threats.',
            categoryId: 'mfg-smart-factory-it-ot',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-data-strategy-decision-intelligence',
        name: 'Data Strategy & Decision Intelligence',
        description: 'Data strategy and decision intelligence for manufacturing organizations',
        domainGroupId: 'mfg-technology-digital-transformation',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-production-intelligence-dashboards',
            name: 'Production Intelligence Dashboards',
            description: 'Aggregated metrics like OEE, line efficiency, maintenance alerts.',
            categoryId: 'mfg-data-strategy-decision-intelligence',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-predictive-analytics-ai-yield',
            name: 'Predictive Analytics & AI for Yield Optimization',
            description: 'Forecasting failures, defects, and process inefficiencies.',
            categoryId: 'mfg-data-strategy-decision-intelligence',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-digital-twin-plant-operations',
            name: 'Digital Twin for Plant Operations',
            description: 'Simulated, real-time model of physical assets and workflows.',
            categoryId: 'mfg-data-strategy-decision-intelligence',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-data-governance-manufacturing',
            name: 'Data Governance for Manufacturing',
            description: 'Ensuring data accuracy, traceability, and compliance.',
            categoryId: 'mfg-data-strategy-decision-intelligence',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
