
import { DomainGroup, Category, SubCategory } from '@/types/domainGroups';

export const createLifeSciencesHierarchyData = () => {
  const timestamp = new Date().toISOString();
  const baseId = Date.now();
  
  const newDomainGroups: DomainGroup[] = [];
  const newCategories: Category[] = [];
  const newSubCategories: SubCategory[] = [];

  // GROUP 1: Strategy, Innovation & Growth (Life Sciences & Pharma)
  const group1Id = `${baseId}_group1`;
  newDomainGroups.push({
    id: group1Id,
    name: 'Strategy, Innovation & Growth (Life Sciences & Pharma)',
    description: 'Strategic planning, innovation management, and growth initiatives in life sciences and pharmaceutical industry',
    industrySegmentId: '1',
    industrySegmentName: 'Life Sciences',
    isActive: true,
    createdAt: timestamp
  });

  // Category 1.1: Strategic Vision & Portfolio Planning
  const cat1_1Id = `${baseId}_cat1_1`;
  newCategories.push({
    id: cat1_1Id,
    name: 'Strategic Vision & Portfolio Planning',
    description: 'Strategic planning and portfolio optimization for life sciences',
    domainGroupId: group1Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub1_1_1`,
      name: 'Therapeutic Area Strategy',
      description: 'Aligning R&D and commercial focus areas with unmet medical needs and global health priorities',
      categoryId: cat1_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_1_2`,
      name: 'Pipeline & Portfolio Management',
      description: 'Balancing short-term commercial products with long-term R&D pipeline across discovery, preclinical, and clinical stages',
      categoryId: cat1_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_1_3`,
      name: 'Global Market Access Strategy',
      description: 'Planning for differentiated access and reimbursement across regulated and emerging markets',
      categoryId: cat1_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_1_4`,
      name: 'Scenario Planning for Health Trends',
      description: 'Preparing for disruptions due to pandemics, healthcare reforms, or demographic shifts',
      categoryId: cat1_1Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // Category 1.2: Business Model Innovation in Healthcare Delivery
  const cat1_2Id = `${baseId}_cat1_2`;
  newCategories.push({
    id: cat1_2Id,
    name: 'Business Model Innovation in Healthcare Delivery',
    description: 'Innovation in healthcare delivery models and business approaches',
    domainGroupId: group1Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub1_2_1`,
      name: 'Value-Based Healthcare Models',
      description: 'Designing commercial models linked to patient outcomes and therapy effectiveness',
      categoryId: cat1_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_2_2`,
      name: 'Precision Medicine & Companion Diagnostics',
      description: 'Integrating biomarkers, genomics, and AI into therapeutic product development',
      categoryId: cat1_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_2_3`,
      name: 'Partner Ecosystem (CDMOs, CROs, HealthTech)',
      description: 'Structuring collaborations across outsourced R&D, manufacturing, and digital health enablers',
      categoryId: cat1_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_2_4`,
      name: 'Sustainability in Pharma Supply Chain',
      description: 'Reducing environmental impact across packaging, cold chain, and waste disposal',
      categoryId: cat1_2Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // Category 1.3: Health Outcomes & Value Realization
  const cat1_3Id = `${baseId}_cat1_3`;
  newCategories.push({
    id: cat1_3Id,
    name: 'Health Outcomes & Value Realization',
    description: 'Measuring and optimizing health outcomes and value delivery',
    domainGroupId: group1Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub1_3_1`,
      name: 'Real-World Evidence & HEOR',
      description: 'Leveraging real-world data for pricing, access, and post-market surveillance',
      categoryId: cat1_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_3_2`,
      name: 'Patient-Centric Trial Design',
      description: 'Designing clinical trials around convenience, safety, and real-world adherence',
      categoryId: cat1_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_3_3`,
      name: 'Risk-Sharing Agreements',
      description: 'Structuring payor contracts based on therapeutic efficacy or usage-based pricing',
      categoryId: cat1_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub1_3_4`,
      name: 'Therapy Lifecycle Value Assessment',
      description: 'Measuring value across discovery, development, launch, and maturity stages',
      categoryId: cat1_3Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // GROUP 2: Operations, Delivery, Risk & Sustainability (Life Sciences & Pharma)
  const group2Id = `${baseId}_group2`;
  newDomainGroups.push({
    id: group2Id,
    name: 'Operations, Delivery, Risk & Sustainability (Life Sciences & Pharma)',
    description: 'Operational excellence, delivery management, risk mitigation, and sustainability initiatives',
    industrySegmentId: '1',
    industrySegmentName: 'Life Sciences',
    isActive: true,
    createdAt: timestamp
  });

  // Category 2.1: R&D and Clinical Development Excellence
  const cat2_1Id = `${baseId}_cat2_1`;
  newCategories.push({
    id: cat2_1Id,
    name: 'R&D and Clinical Development Excellence',
    description: 'Research and development and clinical trial excellence',
    domainGroupId: group2Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub2_1_1`,
      name: 'Clinical Trial Operations',
      description: 'Managing site selection, patient recruitment, and trial logistics globally',
      categoryId: cat2_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_1_2`,
      name: 'Pharmacovigilance & Safety Monitoring',
      description: 'Ensuring ongoing drug safety through surveillance and compliance',
      categoryId: cat2_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_1_3`,
      name: 'Regulatory Affairs & Submissions',
      description: 'Preparing and managing global regulatory filings and interactions',
      categoryId: cat2_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_1_4`,
      name: 'Lab Information Management Systems (LIMS)',
      description: 'Managing experimental data and digital lab workflows',
      categoryId: cat2_1Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // Category 2.2: Manufacturing & Supply Chain Operations
  const cat2_2Id = `${baseId}_cat2_2`;
  newCategories.push({
    id: cat2_2Id,
    name: 'Manufacturing & Supply Chain Operations',
    description: 'Manufacturing operations and supply chain management',
    domainGroupId: group2Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub2_2_1`,
      name: 'GMP Compliance & Quality Control',
      description: 'Ensuring all production processes meet Good Manufacturing Practices',
      categoryId: cat2_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_2_2`,
      name: 'Technology Transfer & Scale-Up',
      description: 'Transitioning from lab-scale to commercial-scale production seamlessly',
      categoryId: cat2_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_2_3`,
      name: 'Cold Chain & Specialty Logistics',
      description: 'Managing temperature-sensitive biologics and vaccines across geographies',
      categoryId: cat2_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_2_4`,
      name: 'Supply Chain Risk Management',
      description: 'Mitigating disruptions due to regulatory, geopolitical, or supplier risks',
      categoryId: cat2_2Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // Category 2.3: Commercial & Market Operations
  const cat2_3Id = `${baseId}_cat2_3`;
  newCategories.push({
    id: cat2_3Id,
    name: 'Commercial & Market Operations',
    description: 'Commercial operations and market engagement strategies',
    domainGroupId: group2Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub2_3_1`,
      name: 'Omnichannel HCP Engagement',
      description: 'Creating integrated digital and in-person strategies for physician engagement',
      categoryId: cat2_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_3_2`,
      name: 'Medical Affairs & Scientific Communications',
      description: 'Providing accurate, compliant, and evidence-based scientific content',
      categoryId: cat2_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_3_3`,
      name: 'KOL & Investigator Relationship Management',
      description: 'Building and managing expert networks to guide development and education',
      categoryId: cat2_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_3_4`,
      name: 'Market Access Execution & Pricing',
      description: 'Implementing reimbursement, tendering, and value-pricing strategies globally',
      categoryId: cat2_3Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // Category 2.4: Risk, Compliance & Sustainability
  const cat2_4Id = `${baseId}_cat2_4`;
  newCategories.push({
    id: cat2_4Id,
    name: 'Risk, Compliance & Sustainability',
    description: 'Risk management, compliance, and sustainability practices',
    domainGroupId: group2Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub2_4_1`,
      name: 'GxP Audits & Regulatory Readiness',
      description: 'Conducting internal audits and preparing for global regulatory inspections',
      categoryId: cat2_4Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_4_2`,
      name: 'Ethical Clinical Research Governance',
      description: 'Ensuring ethical approvals, informed consent, and patient rights',
      categoryId: cat2_4Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_4_3`,
      name: 'Green Chemistry & Sustainable Manufacturing',
      description: 'Minimizing environmental harm in formulation and packaging',
      categoryId: cat2_4Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub2_4_4`,
      name: 'Product Stewardship & Traceability',
      description: 'Tracking products through serialization, anti-counterfeiting, and recall readiness',
      categoryId: cat2_4Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // GROUP 3: People, Culture & Change (Life Sciences & Pharma)
  const group3Id = `${baseId}_group3`;
  newDomainGroups.push({
    id: group3Id,
    name: 'People, Culture & Change (Life Sciences & Pharma)',
    description: 'Human resources, culture development, and organizational change management',
    industrySegmentId: '1',
    industrySegmentName: 'Life Sciences',
    isActive: true,
    createdAt: timestamp
  });

  // Category 3.1: Scientific Talent & Workforce Management
  const cat3_1Id = `${baseId}_cat3_1`;
  newCategories.push({
    id: cat3_1Id,
    name: 'Scientific Talent & Workforce Management',
    description: 'Scientific talent development and workforce management',
    domainGroupId: group3Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub3_1_1`,
      name: 'Functional Capability Building (R&D, Regulatory, PV)',
      description: 'Training teams in scientific writing, safety, compliance, and discovery',
      categoryId: cat3_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_1_2`,
      name: 'Cross-Functional Collaboration Models',
      description: 'Enabling effective collaboration across Clinical, Regulatory, Commercial, and Medical',
      categoryId: cat3_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_1_3`,
      name: 'Culture of Quality & Integrity',
      description: 'Embedding ethical and patient-first culture in all operations',
      categoryId: cat3_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_1_4`,
      name: 'Scientific Leadership Development',
      description: 'Grooming future leaders with both technical and strategic acumen',
      categoryId: cat3_1Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // Category 3.2: Organizational Design & Change Enablement
  const cat3_2Id = `${baseId}_cat3_2`;
  newCategories.push({
    id: cat3_2Id,
    name: 'Organizational Design & Change Enablement',
    description: 'Organizational design and change management capabilities',
    domainGroupId: group3Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub3_2_1`,
      name: 'Functional & Matrix Governance Models',
      description: 'Structuring high-regulation orgs to ensure accountability and speed',
      categoryId: cat3_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_2_2`,
      name: 'Regulatory Communication Protocols',
      description: 'Standardizing communication with internal QA, legal, and external agencies',
      categoryId: cat3_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_2_3`,
      name: 'Shared GxP Services',
      description: 'Centralizing Quality, Compliance, and Document Control functions for consistency',
      categoryId: cat3_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_2_4`,
      name: 'Change Management in Global Trials & Launches',
      description: 'Managing transitions during global trial rollouts or therapeutic launches',
      categoryId: cat3_2Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // Category 3.3: Digital Upskilling & Adoption in Pharma
  const cat3_3Id = `${baseId}_cat3_3`;
  newCategories.push({
    id: cat3_3Id,
    name: 'Digital Upskilling & Adoption in Pharma',
    description: 'Digital transformation and upskilling initiatives',
    domainGroupId: group3Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub3_3_1`,
      name: 'Scientific Informatics Tools Training',
      description: 'Training on ELNs, LIMS, SAS, and molecular modeling software',
      categoryId: cat3_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_3_2`,
      name: 'Digital Lab & Virtual Trials Enablement',
      description: 'Supporting digitalization of labs and patient-centric trial operations',
      categoryId: cat3_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_3_3`,
      name: 'Workforce Automation in Regulatory & Safety',
      description: 'Implementing automation in document review, case processing, and labelling',
      categoryId: cat3_3Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub3_3_4`,
      name: 'Employee Engagement in Remote Research Teams',
      description: 'Tools and practices to keep distributed scientific teams productive and connected',
      categoryId: cat3_3Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // GROUP 4: Technology & Digital Transformation (Life Sciences & Pharma)
  const group4Id = `${baseId}_group4`;
  newDomainGroups.push({
    id: group4Id,
    name: 'Technology & Digital Transformation (Life Sciences & Pharma)',
    description: 'Technology solutions and digital transformation initiatives in life sciences',
    industrySegmentId: '1',
    industrySegmentName: 'Life Sciences',
    isActive: true,
    createdAt: timestamp
  });

  // Category 4.1: Life Sciences Digital Architecture
  const cat4_1Id = `${baseId}_cat4_1`;
  newCategories.push({
    id: cat4_1Id,
    name: 'Life Sciences Digital Architecture',
    description: 'Digital architecture and platform solutions for life sciences',
    domainGroupId: group4Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub4_1_1`,
      name: 'GxP-Compliant Cloud Platforms',
      description: 'Designing secure, validated cloud environments for R&D and clinical operations',
      categoryId: cat4_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub4_1_2`,
      name: 'IoT & Smart Factory Enablement',
      description: 'Using IoT for real-time visibility into production, utilities, and equipment',
      categoryId: cat4_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub4_1_3`,
      name: 'Data Lakes for Clinical & Safety Data',
      description: 'Integrating structured/unstructured data from diverse trial and lab systems',
      categoryId: cat4_1Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub4_1_4`,
      name: 'Digital Twin in Bioprocessing',
      description: 'Simulating biological systems for faster scale-up and quality control',
      categoryId: cat4_1Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  // Category 4.2: AI, Analytics & Decision Intelligence
  const cat4_2Id = `${baseId}_cat4_2`;
  newCategories.push({
    id: cat4_2Id,
    name: 'AI, Analytics & Decision Intelligence',
    description: 'Artificial intelligence, analytics, and decision support systems',
    domainGroupId: group4Id,
    isActive: true,
    createdAt: timestamp
  });

  newSubCategories.push(
    {
      id: `${baseId}_sub4_2_1`,
      name: 'Predictive Analytics for Trial Outcomes',
      description: 'Forecasting trial success, patient dropout, and protocol adherence',
      categoryId: cat4_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub4_2_2`,
      name: 'NLP for Regulatory Intelligence',
      description: 'Extracting insights from global regulatory guidelines and peer-reviewed literature',
      categoryId: cat4_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub4_2_3`,
      name: 'Companion Algorithms & Digital Therapeutics',
      description: 'Developing software-as-a-medical-device (SaMD) for clinical support',
      categoryId: cat4_2Id,
      isActive: true,
      createdAt: timestamp
    },
    {
      id: `${baseId}_sub4_2_4`,
      name: 'Real-Time Dashboards for PV, Clinical, QA',
      description: 'Operational dashboards for near real-time insights and compliance metrics',
      categoryId: cat4_2Id,
      isActive: true,
      createdAt: timestamp
    }
  );

  return { newDomainGroups, newCategories, newSubCategories };
};
