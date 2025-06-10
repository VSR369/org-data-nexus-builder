
import { DomainGroup } from '../../types';

export const operationsDeliveryRiskGroup: Omit<DomainGroup, 'industrySegmentId'> = {
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
};
