
import { DomainGroup } from '../types';

export const logisticsDomainGroups: Omit<DomainGroup, 'industrySegmentId'>[] = [
  {
    id: 'logistics-strategy-innovation-growth',
    name: 'Strategy, Innovation & Growth',
    description: 'Strategic planning, business model innovation, and outcome measurement for logistics operations',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'logistics-strategic-vision-planning',
        name: 'Strategic Vision & Business Planning',
        description: 'Long-term strategic planning and vision alignment for logistics operations',
        domainGroupId: 'logistics-strategy-innovation-growth',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'integrated-supply-chain-visioning',
            name: 'Integrated Supply Chain Visioning',
            description: 'Aligning supply chain strategy with corporate goals, sustainability mandates, and resilience planning',
            categoryId: 'logistics-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'global-logistics-strategy-alignment',
            name: 'Global Logistics Strategy Alignment',
            description: 'Ensuring alignment of freight, warehousing, customs, and trade strategies across regions',
            categoryId: 'logistics-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'scenario-planning-disruption-management',
            name: 'Scenario Planning for Disruption Management',
            description: 'Preparing for geopolitical shifts, pandemics, climate impact, and sourcing disruption',
            categoryId: 'logistics-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'innovation-roadmaps-logistics-delivery',
            name: 'Innovation Roadmaps in Logistics & Delivery',
            description: 'Structuring innovation portfolios around automation, last-mile, AI-driven route optimization',
            categoryId: 'logistics-strategic-vision-planning',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'logistics-business-model-value-proposition',
        name: 'Business Model & Value Proposition Design',
        description: 'Designing new business models and value propositions for logistics services',
        domainGroupId: 'logistics-strategy-innovation-growth',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'as-a-service-logistics-models',
            name: 'As-a-Service Logistics Models',
            description: 'Developing Transportation/Distribution-as-a-Service, warehousing on-demand, shared assets',
            categoryId: 'logistics-business-model-value-proposition',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'multi-sided-freight-platforms',
            name: 'Multi-Sided Freight Platforms',
            description: 'Connecting shippers, carriers, and brokers through digital marketplaces',
            categoryId: 'logistics-business-model-value-proposition',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'partner-ecosystem-3pl-4pl-strategy',
            name: 'Partner Ecosystem & 3PL/4PL Strategy',
            description: 'Designing collaborative logistics frameworks with 3PLs, 4PLs, forwarders, and tech partners',
            categoryId: 'logistics-business-model-value-proposition',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'green-logistics-sustainable-value',
            name: 'Green Logistics & Sustainable Value Propositions',
            description: 'Offering CO2-neutral delivery, modal shift incentives, and green packaging',
            categoryId: 'logistics-business-model-value-proposition',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'logistics-outcome-measurement-value-realization',
        name: 'Outcome Measurement & Business Value Realization',
        description: 'Measuring performance and realizing value from logistics investments',
        domainGroupId: 'logistics-strategy-innovation-growth',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'logistics-performance-dashboards',
            name: 'Logistics Performance Dashboards (OTIF, Fill Rate)',
            description: 'Tracking fulfillment accuracy, cost per delivery, dwell time, and SLA compliance',
            categoryId: 'logistics-outcome-measurement-value-realization',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'roi-logistics-tech-investments',
            name: 'ROI on Logistics Tech Investments',
            description: 'Evaluating payback from TMS, WMS, IoT, fleet management, and control towers',
            categoryId: 'logistics-outcome-measurement-value-realization',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'customer-value-metrics-delivery',
            name: 'Customer Value Metrics in Delivery Services',
            description: 'Measuring end-user experience, transparency, and delivery satisfaction',
            categoryId: 'logistics-outcome-measurement-value-realization',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'continuous-improvement-freight-fulfillment',
            name: 'Continuous Improvement in Freight & Fulfillment',
            description: 'Using PDCA, Kaizen, and lean tools for logistics cost reduction and agility',
            categoryId: 'logistics-outcome-measurement-value-realization',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'logistics-operations-delivery-risk-sustainability',
    name: 'Operations, Delivery, Risk & Sustainability',
    description: 'Core operational excellence, risk management, and sustainability in logistics',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'logistics-network-design-optimization',
        name: 'Logistics Network Design & Optimization',
        description: 'Strategic design and optimization of logistics networks',
        domainGroupId: 'logistics-operations-delivery-risk-sustainability',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'strategic-network-footprint-design',
            name: 'Strategic Network Footprint Design',
            description: 'Optimizing location and number of DCs, warehouses, cross-docks, and hubs',
            categoryId: 'logistics-network-design-optimization',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'last-mile-delivery-optimization',
            name: 'Last-Mile Delivery Optimization',
            description: 'Designing hyperlocal networks, crowd-shipping, and electric fleets for last-mile efficiency',
            categoryId: 'logistics-network-design-optimization',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'freight-mode-mix-planning',
            name: 'Freight Mode Mix Planning',
            description: 'Choosing between air, ocean, rail, and trucking for cost, speed, and carbon trade-offs',
            categoryId: 'logistics-network-design-optimization',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'reverse-logistics-returns-strategy',
            name: 'Reverse Logistics & Returns Strategy',
            description: 'Designing reverse supply chains with minimal cost and maximum product recovery',
            categoryId: 'logistics-network-design-optimization',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'warehousing-fulfillment-excellence',
        name: 'Warehousing & Fulfillment Excellence',
        description: 'Optimization of warehouse operations and fulfillment processes',
        domainGroupId: 'logistics-operations-delivery-risk-sustainability',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'inventory-slotting-pick-path-optimization',
            name: 'Inventory Slotting & Pick Path Optimization',
            description: 'Configuring high-throughput warehouse layouts and minimizing travel time',
            categoryId: 'warehousing-fulfillment-excellence',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'automation-fulfillment-asrs-amrs',
            name: 'Automation in Fulfillment (AS/RS, AMRs)',
            description: 'Implementing robotics, conveyors, and smart storage solutions',
            categoryId: 'warehousing-fulfillment-excellence',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'warehouse-kpi-management',
            name: 'Warehouse KPI Management',
            description: 'Tracking throughput, putaway time, picking accuracy, and dock-to-stock speed',
            categoryId: 'warehousing-fulfillment-excellence',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'omnichannel-fulfillment-capabilities',
            name: 'Omnichannel Fulfillment Capabilities',
            description: 'Supporting B2B, B2C, and D2C fulfillment from integrated facilities',
            categoryId: 'warehousing-fulfillment-excellence',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'transportation-fleet-operations',
        name: 'Transportation & Fleet Operations',
        description: 'Management and optimization of transportation and fleet operations',
        domainGroupId: 'logistics-operations-delivery-risk-sustainability',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'dynamic-routing-load-optimization',
            name: 'Dynamic Routing & Load Optimization',
            description: 'Real-time vehicle routing based on demand, traffic, and asset availability',
            categoryId: 'transportation-fleet-operations',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'telematics-fleet-monitoring-systems',
            name: 'Telematics & Fleet Monitoring Systems',
            description: 'Using GPS, ELD, and IoT for safety, compliance, and asset tracking',
            categoryId: 'transportation-fleet-operations',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'delivery-sla-otif-management',
            name: 'Delivery SLA & OTIF Management',
            description: 'Ensuring service-level adherence across first, middle, and last mile',
            categoryId: 'transportation-fleet-operations',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ev-alternative-fuel-fleet-strategy',
            name: 'EV & Alternative Fuel Fleet Strategy',
            description: 'Transitioning to sustainable fleets with TCO and emission tracking',
            categoryId: 'transportation-fleet-operations',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'risk-compliance-trade',
        name: 'Risk, Compliance & Trade',
        description: 'Managing risks, compliance, and trade regulations in logistics',
        domainGroupId: 'logistics-operations-delivery-risk-sustainability',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'customs-cross-border-logistics',
            name: 'Customs & Cross-Border Logistics',
            description: 'Managing documentation, duties, and local regulations',
            categoryId: 'risk-compliance-trade',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'supply-chain-risk-mapping',
            name: 'Supply Chain Risk Mapping',
            description: 'Visualizing supplier, geopolitical, and transport risks',
            categoryId: 'risk-compliance-trade',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'incident-management-business-continuity',
            name: 'Incident Management & Business Continuity',
            description: 'Setting up protocols and buffers for unplanned disruptions',
            categoryId: 'risk-compliance-trade',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'regulatory-compliance-transport',
            name: 'Regulatory Compliance in Transport (ADR, IMO, DOT)',
            description: 'Adhering to mode-specific safety, environmental, and data laws',
            categoryId: 'risk-compliance-trade',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'esg-sustainability-logistics',
        name: 'ESG & Sustainability in Logistics',
        description: 'Environmental, social, and governance practices in logistics operations',
        domainGroupId: 'logistics-operations-delivery-risk-sustainability',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'carbon-accounting-transportation',
            name: 'Carbon Accounting in Transportation',
            description: 'Measuring and reducing CO2 emissions across legs and modes',
            categoryId: 'esg-sustainability-logistics',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'circular-packaging-asset-reuse',
            name: 'Circular Packaging & Asset Reuse',
            description: 'Designing reusable pallets, totes, and reverse packaging flows',
            categoryId: 'esg-sustainability-logistics',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'inclusive-workforce-logistics',
            name: 'Inclusive Workforce in Logistics',
            description: 'Promoting local hiring, women in logistics, and fair labor practices',
            categoryId: 'esg-sustainability-logistics',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'green-certifications-leed-smartway',
            name: 'Green Certifications (LEED, SmartWay)',
            description: 'Achieving standards for sustainable warehouses and fleets',
            categoryId: 'esg-sustainability-logistics',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'logistics-people-culture-change',
    name: 'People, Culture & Change',
    description: 'Human resources, organizational culture, and change management in logistics',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'workforce-engagement-logistics-culture',
        name: 'Workforce Engagement & Logistics Culture',
        description: 'Building engagement and culture within logistics workforce',
        domainGroupId: 'logistics-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'driver-handler-engagement-programs',
            name: 'Driver & Handler Engagement Programs',
            description: 'Rewarding safety, punctuality, and efficiency through gamification',
            categoryId: 'workforce-engagement-logistics-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'culture-safety-compliance',
            name: 'Culture of Safety & Compliance',
            description: 'Embedding behavioral safety and transport ethics',
            categoryId: 'workforce-engagement-logistics-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'logistics-leadership-development',
            name: 'Logistics Leadership Development',
            description: 'Preparing line managers for digital tools, analytics, and ESG',
            categoryId: 'workforce-engagement-logistics-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'shift-planning-fatigue-management',
            name: 'Shift Planning & Fatigue Management',
            description: 'Designing ergonomic schedules for warehouse and delivery staff',
            categoryId: 'workforce-engagement-logistics-culture',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'operating-model-organizational-structure',
        name: 'Operating Model & Organizational Structure',
        description: 'Organizational design and operating models for logistics operations',
        domainGroupId: 'logistics-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'centralized-vs-regional-logistics-control',
            name: 'Centralized vs. Regional Logistics Control',
            description: 'Balancing global optimization with regional responsiveness',
            categoryId: 'operating-model-organizational-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'role-clarity-3pl-transport-planning',
            name: 'Role Clarity across 3PL, Transport, & Planning',
            description: 'Defining accountabilities in multi-partner networks',
            categoryId: 'operating-model-organizational-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'logistics-governance-escalation-paths',
            name: 'Logistics Governance Bodies & Escalation Paths',
            description: 'Ensuring decisions and issues are resolved rapidly',
            categoryId: 'operating-model-organizational-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'shared-services-trade-claims-support',
            name: 'Shared Services for Trade, Claims, Customer Support',
            description: 'Integrating back-office functions across logistics streams',
            categoryId: 'operating-model-organizational-structure',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'digital-workforce-enablement',
        name: 'Digital Workforce & Enablement',
        description: 'Digital skills and tools for logistics workforce',
        domainGroupId: 'logistics-people-culture-change',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'tms-wms-route-planning-training',
            name: 'TMS, WMS, and Route Planning Training',
            description: 'Equipping logistics teams with necessary digital skills',
            categoryId: 'digital-workforce-enablement',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'mobile-apps-drivers-supervisors',
            name: 'Mobile Apps for Drivers & Supervisors',
            description: 'Using handhelds for POD, instructions, and alerts',
            categoryId: 'digital-workforce-enablement',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'control-tower-operations-training',
            name: 'Control Tower Operations Training',
            description: 'Training teams in exception handling and dashboards',
            categoryId: 'digital-workforce-enablement',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'workforce-wellbeing-logistics',
            name: 'Workforce Wellbeing in Logistics',
            description: 'Programs to manage stress, health, and remote working fatigue',
            categoryId: 'digital-workforce-enablement',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'logistics-technology-digital-transformation',
    name: 'Technology & Digital Transformation',
    description: 'Technology implementation and digital transformation in logistics',
    isActive: true,
    createdAt: new Date().toISOString(),
    categories: [
      {
        id: 'logistics-tech-architecture',
        name: 'Logistics Tech Architecture',
        description: 'Core technology systems for logistics operations',
        domainGroupId: 'logistics-technology-digital-transformation',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'transportation-management-systems-tms',
            name: 'Transportation Management Systems (TMS)',
            description: 'Core logistics control system managing carrier, cost, and routing',
            categoryId: 'logistics-tech-architecture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'warehouse-management-systems-wms',
            name: 'Warehouse Management Systems (WMS)',
            description: 'Governing inventory, picking, labor, and space utilization',
            categoryId: 'logistics-tech-architecture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'iot-visibility-platforms',
            name: 'IoT & Visibility Platforms',
            description: 'Real-time tracking across multimodal networks',
            categoryId: 'logistics-tech-architecture',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'blockchain-supply-chain',
            name: 'Blockchain in Supply Chain',
            description: 'Enabling tamper-proof tracking of goods and compliance',
            categoryId: 'logistics-tech-architecture',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'data-strategy-ai-powered-logistics',
        name: 'Data Strategy & AI-Powered Logistics',
        description: 'Data analytics and AI applications in logistics',
        domainGroupId: 'logistics-technology-digital-transformation',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'predictive-eta-delay-forecasting',
            name: 'Predictive ETA & Delay Forecasting',
            description: 'Machine learning to estimate delivery times under uncertainty',
            categoryId: 'data-strategy-ai-powered-logistics',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'freight-cost-optimization-analytics',
            name: 'Freight Cost Optimization Analytics',
            description: 'Using AI to simulate cost savings in multi-leg options',
            categoryId: 'data-strategy-ai-powered-logistics',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'inventory-planning-demand-forecasting',
            name: 'Inventory Planning & Demand Forecasting',
            description: 'Ensuring accurate planning with seasonality and trends',
            categoryId: 'data-strategy-ai-powered-logistics',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'control-tower-exceptions-management',
            name: 'Control Tower & Exceptions Management',
            description: 'Real-time coordination across disruptions, reroutes, and exceptions',
            categoryId: 'data-strategy-ai-powered-logistics',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'cybersecurity-compliance',
        name: 'Cybersecurity & Compliance',
        description: 'Security and compliance in logistics technology systems',
        domainGroupId: 'logistics-technology-digital-transformation',
        isActive: true,
        createdAt: new Date().toISOString(),
        subCategories: [
          {
            id: 'data-security-logistics-it-systems',
            name: 'Data Security in Logistics IT Systems',
            description: 'Protecting transport, location, and customer data',
            categoryId: 'cybersecurity-compliance',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'regulatory-compliance-gdpr-ccpa',
            name: 'Regulatory Compliance (GDPR, CCPA, etc.)',
            description: 'Ensuring privacy and data compliance in platform-based logistics',
            categoryId: 'cybersecurity-compliance',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'it-ot-convergence-risk-controls',
            name: 'IT-OT Convergence Risk Controls',
            description: 'Ensuring safe interfaces between warehouse systems and enterprise IT',
            categoryId: 'cybersecurity-compliance',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'vendor-cybersecurity-standards',
            name: 'Vendor Cybersecurity Standards',
            description: 'Mandating infosec audits and protocols for digital partners',
            categoryId: 'cybersecurity-compliance',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  }
];
