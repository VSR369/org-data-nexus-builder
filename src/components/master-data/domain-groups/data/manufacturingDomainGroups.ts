
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
            id: 'mfg-manufacturing-strategy-alignment',
            name: 'Manufacturing Strategy Alignment',
            description: 'Ensuring production strategy aligns with market demand, sustainability, and long-term business goals.',
            categoryId: 'mfg-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-industry-4-adoption-planning',
            name: 'Industry 4.0 Adoption Planning',
            description: 'Using frameworks like PESTLE or maturity models to define digital transformation priorities.',
            categoryId: 'mfg-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-competitive-differentiation',
            name: 'Competitive Differentiation in Supply Chains',
            description: 'Identifying ways to stand out in cost, flexibility, delivery, or innovation in global supply networks.',
            categoryId: 'mfg-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-scenario-planning',
            name: 'Scenario Planning for Supply Chain Disruptions',
            description: 'Planning future factory and sourcing configurations under changing regulatory, geo-political, and economic scenarios.',
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
            id: 'mfg-servitization-outcome-models',
            name: 'Servitization & Outcome-Based Manufacturing Models',
            description: 'Transitioning from product sales to service/usage-based models (e.g., "power by the hour").',
            categoryId: 'mfg-business-model-value-prop',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-customer-segmentation-customization',
            name: 'Customer Segmentation & Customization Strategy',
            description: 'Designing production flows to support high-mix, low-volume customer demands.',
            categoryId: 'mfg-business-model-value-prop',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-partner-enabled-value-chains',
            name: 'Partner-Enabled Value Chains',
            description: 'Building co-manufacturing, tiered suppliers, and joint venture ecosystems.',
            categoryId: 'mfg-business-model-value-prop',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sustainable-manufacturing-models',
            name: 'Sustainable Manufacturing Models',
            description: 'Embedding energy efficiency, recyclability, and material reuse into product and plant design.',
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
            id: 'mfg-production-efficiency-metrics',
            name: 'Production Efficiency Metrics (OEE, TEEP)',
            description: 'Measuring plant performance and asset utilization to maximize throughput.',
            categoryId: 'mfg-outcome-measurement-value',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-value-stream-mapping',
            name: 'Value Stream Mapping & Benefit Realization',
            description: 'Mapping end-to-end processes to identify improvement areas and realize transformation benefits.',
            categoryId: 'mfg-outcome-measurement-value',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-performance-based-contracts',
            name: 'Performance-Based Supplier Contracts',
            description: 'Linking external supplier incentives to quality, timeliness, and responsiveness.',
            categoryId: 'mfg-outcome-measurement-value',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-continuous-value-assurance',
            name: 'Continuous Value Assurance',
            description: 'Ongoing monitoring of factory performance, innovation ROI, and transformation KPIs.',
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
            id: 'mfg-dfma',
            name: 'Design for Manufacturability & Assembly (DFMA)',
            description: 'Integrating manufacturability into early product design to reduce cost and complexity.',
            categoryId: 'mfg-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-manufacturing-systems-architecture',
            name: 'Manufacturing Systems Architecture',
            description: 'Configuring MES, SCADA, PLC, and ERP systems for real-time shopfloor integration.',
            categoryId: 'mfg-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-digital-twin-prototyping',
            name: 'Digital Twin & Rapid Prototyping',
            description: 'Using simulation and digital twins to design, test, and refine production processes virtually.',
            categoryId: 'mfg-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-quality-engineering-control',
            name: 'Quality Engineering & Process Control (SPC, 6σ)',
            description: 'Ensuring product and process quality through real-time analytics and root cause analysis.',
            categoryId: 'mfg-product-systems-development',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-service-design-experience',
        name: 'Service Design & Customer Experience',
        description: 'Designing services and customer experiences for manufacturing',
        domainGroupId: 'mfg-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-field-service-optimization',
            name: 'Field Service Optimization',
            description: 'Planning service operations for installed equipment and post-sales support.',
            categoryId: 'mfg-service-design-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-predictive-maintenance-interfaces',
            name: 'Predictive Maintenance Interfaces',
            description: 'Designing interfaces and workflows for proactive asset maintenance and uptime.',
            categoryId: 'mfg-service-design-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-customer-centric-cto',
            name: 'Customer-Centric Configuration-to-Order (CTO)',
            description: 'Personalizing offerings while ensuring manufacturing efficiency.',
            categoryId: 'mfg-service-design-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-design-accessibility-hmi',
            name: 'Design Accessibility in Human-Machine Interfaces (HMI)',
            description: 'Ensuring ergonomic, inclusive, and intuitive user experience on the shop floor.',
            categoryId: 'mfg-service-design-experience',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-process-excellence-core',
        name: 'Process Excellence & Core Functions',
        description: 'Excellence in core manufacturing business processes and functions',
        domainGroupId: 'mfg-operations-delivery-risk',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-manufacturing-procurement-logistics',
            name: 'Manufacturing, Procurement, Logistics, Maintenance',
            description: 'Core operational performance across functional manufacturing pillars.',
            categoryId: 'mfg-process-excellence-core',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-sops-production-inspection',
            name: 'SOPs for Production, Inspection, Safety',
            description: 'Standard operating procedures that guide day-to-day factory activities.',
            categoryId: 'mfg-process-excellence-core',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-kpi-okr-plant-operations',
            name: 'KPI/OKR for Plant Operations',
            description: 'Performance metrics like OEE, yield, scrap rate, and first-pass quality.',
            categoryId: 'mfg-process-excellence-core',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-lean-tpm-kaizen',
            name: 'Lean, TPM, Kaizen, and Agile Manufacturing',
            description: 'Adopting proven improvement methodologies for manufacturing optimization.',
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
            id: 'mfg-industrial-safety-compliance',
            name: 'Industrial Safety & Environment Compliance',
            description: 'Meeting safety, emissions, and occupational health regulations (e.g., OSHA, RoHS).',
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
            id: 'mfg-carbon-neutral-manufacturing',
            name: 'Carbon-Neutral Manufacturing Initiatives',
            description: 'Reducing CO₂ emissions and energy intensity of production.',
            categoryId: 'mfg-esg-sustainability',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-circular-manufacturing-reverse',
            name: 'Circular Manufacturing & Reverse Logistics',
            description: 'Managing product end-of-life, reusability, and closed-loop supply chains.',
            categoryId: 'mfg-esg-sustainability',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-ethical-sourcing-labor',
            name: 'Ethical Sourcing & Labor Practices',
            description: 'Ensuring transparency, compliance, and ethics across global vendor networks.',
            categoryId: 'mfg-esg-sustainability',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-community-worker-welfare',
            name: 'Community & Worker Welfare Programs',
            description: 'Supporting programs for labor education, safety, and surrounding communities.',
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
            id: 'mfg-global-manufacturing-network',
            name: 'Global Manufacturing Network Strategy',
            description: 'Designing global capacity and flexibility for cost, risk, and responsiveness.',
            categoryId: 'mfg-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-localization-production',
            name: 'Localization of Production',
            description: 'Setting up local facilities based on trade, cost, and customer proximity.',
            categoryId: 'mfg-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-trade-customs-compliance',
            name: 'Trade & Customs Compliance',
            description: 'Managing cross-border tariffs, export controls, and certifications.',
            categoryId: 'mfg-global-regional-delivery',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-24x7-global-support',
            name: '24x7 Global Support & Redundancy Planning',
            description: 'Ensuring global delivery continuity through smart redundancy and shift management.',
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
        id: 'mfg-talent-management-culture',
        name: 'Talent Management & Organizational Culture',
        description: 'Comprehensive talent management and organizational culture development',
        domainGroupId: 'mfg-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-worker-engagement-empowerment',
            name: 'Worker Engagement & Shopfloor Empowerment',
            description: 'Engaging frontline workers in problem-solving, safety, and innovation.',
            categoryId: 'mfg-talent-management-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-communication-change-initiatives',
            name: 'Communication for Plant Change Initiatives',
            description: 'Ensuring clear communication of goals, roles, and expectations during transitions.',
            categoryId: 'mfg-talent-management-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-culture-operational-excellence',
            name: 'Culture of Operational Excellence',
            description: 'Promoting ownership, discipline, and collaboration at all levels.',
            categoryId: 'mfg-talent-management-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-digital-skills-training',
            name: 'Digital Skills & Operator Training Programs',
            description: 'Upskilling for automation, IoT, and human-machine collaboration.',
            categoryId: 'mfg-talent-management-culture',
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
            id: 'mfg-shift-structure-governance',
            name: 'Shift Structure & Production Governance',
            description: 'Aligning shifts, teams, and governance structures with output goals.',
            categoryId: 'mfg-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-decision-rights-layers',
            name: 'Decision Rights Across Manufacturing Layers',
            description: 'Defining what decisions happen at line, cell, plant, and corporate levels.',
            categoryId: 'mfg-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-central-vs-plant-control',
            name: 'Central vs. Plant-Level Control Models',
            description: 'Balancing agility with control in centralized vs decentralized ops.',
            categoryId: 'mfg-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-shared-services-qa',
            name: 'Shared Services (QA, Maintenance, Utilities)',
            description: 'Creating centralized support hubs for distributed manufacturing sites.',
            categoryId: 'mfg-operating-model-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-digital-workplace-enablement',
        name: 'Digital Workplace & Workforce Enablement',
        description: 'Digital workplace solutions and workforce enablement for manufacturing',
        domainGroupId: 'mfg-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-smart-workstations-instructions',
            name: 'Smart Workstations & Digital Instructions',
            description: 'Empowering operators with real-time instructions, IoT data, and alerts.',
            categoryId: 'mfg-digital-workplace-enablement',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-remote-plant-monitoring',
            name: 'Remote Plant Monitoring & Control',
            description: 'Enabling remote oversight and escalation for multi-plant operations.',
            categoryId: 'mfg-digital-workplace-enablement',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-worker-productivity-tools',
            name: 'Worker Productivity Tools (e.g., wearables, AR)',
            description: 'Boosting effectiveness with mobile tools and augmented interfaces.',
            categoryId: 'mfg-digital-workplace-enablement',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-wellbeing-safety-monitoring',
            name: 'Well-being & Safety Monitoring Systems',
            description: 'Using sensors and AI to detect safety risks and ensure operator wellness.',
            categoryId: 'mfg-digital-workplace-enablement',
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
        id: 'mfg-technology-digital-transformation-category',
        name: 'Technology & Digital Transformation',
        description: 'Technology strategy and digital transformation for manufacturing',
        domainGroupId: 'mfg-technology-digital-transformation',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-smart-factory-architecture',
            name: 'Smart Factory Architecture',
            description: 'Implementing end-to-end digital connectivity and automation in the plant.',
            categoryId: 'mfg-technology-digital-transformation-category',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-cloud-mes-edge-computing',
            name: 'Cloud MES & Edge Computing',
            description: 'Using cloud for orchestration and edge for latency-critical process controls.',
            categoryId: 'mfg-technology-digital-transformation-category',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-iiot-sensor-integration',
            name: 'IIoT & Sensor Integration Frameworks',
            description: 'Connecting machines, tools, and utilities for real-time insights and alerts.',
            categoryId: 'mfg-technology-digital-transformation-category',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-ot-cybersecurity-segmentation',
            name: 'OT Cybersecurity & Network Segmentation',
            description: 'Protecting industrial control systems from digital threats and breaches.',
            categoryId: 'mfg-technology-digital-transformation-category',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-data-strategy-intelligence',
        name: 'Data Strategy & Decision Intelligence',
        description: 'Data strategy and decision intelligence for manufacturing organizations',
        domainGroupId: 'mfg-technology-digital-transformation',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-realtime-production-analytics',
            name: 'Real-Time Production Analytics',
            description: 'Live dashboards and alerts to monitor throughput, waste, and downtime.',
            categoryId: 'mfg-data-strategy-intelligence',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-ai-ml-optimization',
            name: 'AI/ML for Yield, Demand, and Scheduling Optimization',
            description: 'Using AI to reduce waste, optimize batch scheduling, and forecast maintenance.',
            categoryId: 'mfg-data-strategy-intelligence',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
