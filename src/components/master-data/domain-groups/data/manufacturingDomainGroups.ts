
import { DomainGroup } from '../types';

export const manufacturingDomainGroups: DomainGroup[] = [
  {
    id: 'mfg-1',
    name: 'Strategy, Innovation & Growth',
    description: 'Strategic planning and innovation frameworks for manufacturing excellence',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-1-1',
        name: 'Strategic Vision & Business Planning',
        description: 'Strategic alignment and planning capabilities',
        domainGroupId: 'mfg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-1-1-1',
            name: 'Manufacturing Strategy Alignment',
            description: 'Ensuring production strategy aligns with market demand, sustainability, and long-term business goals.',
            categoryId: 'mfg-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-1-2',
            name: 'Industry 4.0 Adoption Planning',
            description: 'Using frameworks like PESTLE or maturity models to define digital transformation priorities.',
            categoryId: 'mfg-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-1-3',
            name: 'Competitive Differentiation in Supply Chains',
            description: 'Identifying ways to stand out in cost, flexibility, delivery, or innovation in global supply networks.',
            categoryId: 'mfg-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-1-4',
            name: 'Scenario Planning for Supply Chain Disruptions',
            description: 'Planning future factory and sourcing configurations under changing regulatory, geo-political, and economic scenarios.',
            categoryId: 'mfg-1-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-1-2',
        name: 'Business Model & Value Proposition Design',
        description: 'Innovative business models and value propositions',
        domainGroupId: 'mfg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-1-2-1',
            name: 'Servitization & Outcome-Based Manufacturing Models',
            description: 'Transitioning from product sales to service/usage-based models (e.g., "power by the hour").',
            categoryId: 'mfg-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-2-2',
            name: 'Customer Segmentation & Customization Strategy',
            description: 'Designing production flows to support high-mix, low-volume customer demands.',
            categoryId: 'mfg-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-2-3',
            name: 'Partner-Enabled Value Chains',
            description: 'Building co-manufacturing, tiered suppliers, and joint venture ecosystems.',
            categoryId: 'mfg-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-2-4',
            name: 'Sustainable Manufacturing Models',
            description: 'Embedding energy efficiency, recyclability, and material reuse into product and plant design.',
            categoryId: 'mfg-1-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-1-3',
        name: 'Outcome Measurement & Business Value Realization',
        description: 'Performance measurement and value realization frameworks',
        domainGroupId: 'mfg-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-1-3-1',
            name: 'Production Efficiency Metrics (OEE, TEEP)',
            description: 'Measuring plant performance and asset utilization to maximize throughput.',
            categoryId: 'mfg-1-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-3-2',
            name: 'Value Stream Mapping & Benefit Realization',
            description: 'Mapping end-to-end processes to identify improvement areas and realize transformation benefits.',
            categoryId: 'mfg-1-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-3-3',
            name: 'Performance-Based Supplier Contracts',
            description: 'Linking external supplier incentives to quality, timeliness, and responsiveness.',
            categoryId: 'mfg-1-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-1-3-4',
            name: 'Continuous Value Assurance',
            description: 'Ongoing monitoring of factory performance, innovation ROI, and transformation KPIs.',
            categoryId: 'mfg-1-3',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-2',
    name: 'Operations, Delivery, Risk & Sustainability',
    description: 'Operational excellence, delivery capabilities, and sustainability practices',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-2-1',
        name: 'Product & Systems Development Excellence',
        description: 'Product development and systems excellence',
        domainGroupId: 'mfg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-2-1-1',
            name: 'Design for Manufacturability & Assembly (DFMA)',
            description: 'Integrating manufacturability into early product design to reduce cost and complexity.',
            categoryId: 'mfg-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-1-2',
            name: 'Manufacturing Systems Architecture',
            description: 'Configuring MES, SCADA, PLC, and ERP systems for real-time shopfloor integration.',
            categoryId: 'mfg-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-1-3',
            name: 'Digital Twin & Rapid Prototyping',
            description: 'Using simulation and digital twins to design, test, and refine production processes virtually.',
            categoryId: 'mfg-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-1-4',
            name: 'Quality Engineering & Process Control (SPC, 6σ)',
            description: 'Ensuring product and process quality through real-time analytics and root cause analysis.',
            categoryId: 'mfg-2-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-2-2',
        name: 'Service Design & Customer Experience',
        description: 'Service design and customer experience optimization',
        domainGroupId: 'mfg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-2-2-1',
            name: 'Field Service Optimization',
            description: 'Planning service operations for installed equipment and post-sales support.',
            categoryId: 'mfg-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-2-2',
            name: 'Predictive Maintenance Interfaces',
            description: 'Designing interfaces and workflows for proactive asset maintenance and uptime.',
            categoryId: 'mfg-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-2-3',
            name: 'Customer-Centric Configuration-to-Order (CTO)',
            description: 'Personalizing offerings while ensuring manufacturing efficiency.',
            categoryId: 'mfg-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-2-4',
            name: 'Design Accessibility in Human-Machine Interfaces (HMI)',
            description: 'Ensuring ergonomic, inclusive, and intuitive user experience on the shop floor.',
            categoryId: 'mfg-2-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-2-3',
        name: 'Process Excellence & Core Functions',
        description: 'Core operational processes and excellence frameworks',
        domainGroupId: 'mfg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-2-3-1',
            name: 'Manufacturing, Procurement, Logistics, Maintenance',
            description: 'Core operational performance across functional manufacturing pillars.',
            categoryId: 'mfg-2-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-3-2',
            name: 'SOPs for Production, Inspection, Safety',
            description: 'Standard operating procedures that guide day-to-day factory activities.',
            categoryId: 'mfg-2-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-3-3',
            name: 'KPI/OKR for Plant Operations',
            description: 'Performance metrics like OEE, yield, scrap rate, and first-pass quality.',
            categoryId: 'mfg-2-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-3-4',
            name: 'Lean, TPM, Kaizen, and Agile Manufacturing',
            description: 'Adopting proven improvement methodologies for manufacturing optimization.',
            categoryId: 'mfg-2-3',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-2-4',
        name: 'Compliance, Risk & Regulatory Governance',
        description: 'Compliance and risk management frameworks',
        domainGroupId: 'mfg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-2-4-1',
            name: 'Industrial Safety & Environment Compliance',
            description: 'Meeting safety, emissions, and occupational health regulations (e.g., OSHA, RoHS).',
            categoryId: 'mfg-2-4',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-2-5',
        name: 'ESG & Sustainability Strategy',
        description: 'Environmental, social, and governance sustainability',
        domainGroupId: 'mfg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-2-5-1',
            name: 'Carbon-Neutral Manufacturing Initiatives',
            description: 'Reducing CO₂ emissions and energy intensity of production.',
            categoryId: 'mfg-2-5',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-5-2',
            name: 'Circular Manufacturing & Reverse Logistics',
            description: 'Managing product end-of-life, reusability, and closed-loop supply chains.',
            categoryId: 'mfg-2-5',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-5-3',
            name: 'Ethical Sourcing & Labor Practices',
            description: 'Ensuring transparency, compliance, and ethics across global vendor networks.',
            categoryId: 'mfg-2-5',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-5-4',
            name: 'Community & Worker Welfare Programs',
            description: 'Supporting programs for labor education, safety, and surrounding communities.',
            categoryId: 'mfg-2-5',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-2-6',
        name: 'Global / Regional Delivery Capability',
        description: 'Global and regional delivery capabilities',
        domainGroupId: 'mfg-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-2-6-1',
            name: 'Global Manufacturing Network Strategy',
            description: 'Designing global capacity and flexibility for cost, risk, and responsiveness.',
            categoryId: 'mfg-2-6',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-6-2',
            name: 'Localization of Production',
            description: 'Setting up local facilities based on trade, cost, and customer proximity.',
            categoryId: 'mfg-2-6',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-6-3',
            name: 'Trade & Customs Compliance',
            description: 'Managing cross-border tariffs, export controls, and certifications.',
            categoryId: 'mfg-2-6',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-2-6-4',
            name: '24x7 Global Support & Redundancy Planning',
            description: 'Ensuring global delivery continuity through smart redundancy and shift management.',
            categoryId: 'mfg-2-6',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-3',
    name: 'People, Culture & Change',
    description: 'Human capital management, culture transformation, and change management',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-3-1',
        name: 'Talent Management & Organizational Culture',
        description: 'Talent development and culture building',
        domainGroupId: 'mfg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-3-1-1',
            name: 'Worker Engagement & Shopfloor Empowerment',
            description: 'Engaging frontline workers in problem-solving, safety, and innovation.',
            categoryId: 'mfg-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-1-2',
            name: 'Communication for Plant Change Initiatives',
            description: 'Ensuring clear communication of goals, roles, and expectations during transitions.',
            categoryId: 'mfg-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-1-3',
            name: 'Culture of Operational Excellence',
            description: 'Promoting ownership, discipline, and collaboration at all levels.',
            categoryId: 'mfg-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-1-4',
            name: 'Digital Skills & Operator Training Programs',
            description: 'Upskilling for automation, IoT, and human-machine collaboration.',
            categoryId: 'mfg-3-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-3-2',
        name: 'Operating Model & Organizational Structure',
        description: 'Organizational design and operating models',
        domainGroupId: 'mfg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-3-2-1',
            name: 'Shift Structure & Production Governance',
            description: 'Aligning shifts, teams, and governance structures with output goals.',
            categoryId: 'mfg-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-2-2',
            name: 'Decision Rights Across Manufacturing Layers',
            description: 'Defining what decisions happen at line, cell, plant, and corporate levels.',
            categoryId: 'mfg-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-2-3',
            name: 'Central vs. Plant-Level Control Models',
            description: 'Balancing agility with control in centralized vs decentralized ops.',
            categoryId: 'mfg-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-2-4',
            name: 'Shared Services (QA, Maintenance, Utilities)',
            description: 'Creating centralized support hubs for distributed manufacturing sites.',
            categoryId: 'mfg-3-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-3-3',
        name: 'Digital Workplace & Workforce Enablement',
        description: 'Digital workplace and workforce empowerment',
        domainGroupId: 'mfg-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-3-3-1',
            name: 'Smart Workstations & Digital Instructions',
            description: 'Empowering operators with real-time instructions, IoT data, and alerts.',
            categoryId: 'mfg-3-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-3-2',
            name: 'Remote Plant Monitoring & Control',
            description: 'Enabling remote oversight and escalation for multi-plant operations.',
            categoryId: 'mfg-3-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-3-3',
            name: 'Worker Productivity Tools (e.g., wearables, AR)',
            description: 'Boosting effectiveness with mobile tools and augmented interfaces.',
            categoryId: 'mfg-3-3',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-3-3-4',
            name: 'Well-being & Safety Monitoring Systems',
            description: 'Using sensors and AI to detect safety risks and ensure operator wellness.',
            categoryId: 'mfg-3-3',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'mfg-4',
    name: 'Technology & Digital Transformation',
    description: 'Technology infrastructure and digital transformation capabilities',
    industrySegmentId: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'mfg-4-1',
        name: 'Technology & Digital Transformation',
        description: 'Digital transformation and technology capabilities',
        domainGroupId: 'mfg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-4-1-1',
            name: 'Smart Factory Architecture',
            description: 'Implementing end-to-end digital connectivity and automation in the plant.',
            categoryId: 'mfg-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-4-1-2',
            name: 'Cloud MES & Edge Computing',
            description: 'Using cloud for orchestration and edge for latency-critical process controls.',
            categoryId: 'mfg-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-4-1-3',
            name: 'IIoT & Sensor Integration Frameworks',
            description: 'Connecting machines, tools, and utilities for real-time insights and alerts.',
            categoryId: 'mfg-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-4-1-4',
            name: 'OT Cybersecurity & Network Segmentation',
            description: 'Protecting industrial control systems from digital threats and breaches.',
            categoryId: 'mfg-4-1',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'mfg-4-2',
        name: 'Data Strategy & Decision Intelligence',
        description: 'Data analytics and decision intelligence capabilities',
        domainGroupId: 'mfg-4',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'mfg-4-2-1',
            name: 'Real-Time Production Analytics',
            description: 'Live dashboards and alerts to monitor throughput, waste, and downtime.',
            categoryId: 'mfg-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mfg-4-2-2',
            name: 'AI/ML for Yield, Demand, and Scheduling Optimization',
            description: 'Using AI to reduce waste, optimize batch scheduling, and forecast maintenance.',
            categoryId: 'mfg-4-2',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
