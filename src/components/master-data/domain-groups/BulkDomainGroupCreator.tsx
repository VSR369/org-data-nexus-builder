import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Upload, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroup, Category, SubCategory, DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';
import { Badge } from "@/components/ui/badge";

interface BulkDomainGroupCreatorProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const BulkDomainGroupCreator: React.FC<BulkDomainGroupCreatorProps> = ({ data, onDataUpdate }) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Check if Life Sciences hierarchy already exists - look for any domain group with "Life Sciences" in industry segment name
  const lifeSciencesExists = data.domainGroups.some(
    dg => dg.industrySegmentName === 'Life Sciences' || 
          dg.industrySegmentId === '1' ||
          dg.name.toLowerCase().includes('life sciences')
  );

  console.log('🔍 Checking Life Sciences existence:', {
    domainGroupsCount: data.domainGroups.length,
    lifeSciencesExists,
    domainGroups: data.domainGroups.map(dg => ({ 
      name: dg.name, 
      industrySegmentName: dg.industrySegmentName,
      industrySegmentId: dg.industrySegmentId 
    }))
  });

  // If Life Sciences hierarchy already exists, show confirmation message
  if (lifeSciencesExists) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-900">Life Sciences Hierarchy Already Created</h3>
              <p className="text-sm text-green-700">
                The Life Sciences domain group hierarchy is already configured and ready for use. 
                You can view and manage it in the hierarchies section below.
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Already Available
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const createLifeSciencesHierarchy = () => {
    setIsCreating(true);
    
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

    // Category 1.1: R&D Strategy & Portfolio Management
    const cat1_1Id = `${baseId}_cat1_1`;
    newCategories.push({
      id: cat1_1Id,
      name: 'R&D Strategy & Portfolio Management',
      description: 'Research and development strategy and portfolio optimization',
      domainGroupId: group1Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 1.1
    newSubCategories.push(
      {
        id: `${baseId}_sub1_1_1`,
        name: 'Therapeutic Area Prioritization',
        description: 'Selecting high-impact disease areas based on unmet needs, market opportunity, and scientific feasibility',
        categoryId: cat1_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_1_2`,
        name: 'Pipeline Portfolio Optimization',
        description: 'Balancing risk, cost, and timelines across clinical and preclinical assets',
        categoryId: cat1_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_1_3`,
        name: 'Innovation Sourcing & Partnerships',
        description: 'Leveraging academic, biotech, and technology partnerships for R&D acceleration',
        categoryId: cat1_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_1_4`,
        name: 'Translational Research Strategy',
        description: 'Bridging discovery science with clinical development for faster bench-to-bedside outcomes',
        categoryId: cat1_1Id,
        isActive: true,
        createdAt: timestamp
      }
    );

    // Category 1.2: Commercial Strategy & Market Access
    const cat1_2Id = `${baseId}_cat1_2`;
    newCategories.push({
      id: cat1_2Id,
      name: 'Commercial Strategy & Market Access',
      description: 'Commercial strategy development and market access planning',
      domainGroupId: group1Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 1.2
    newSubCategories.push(
      {
        id: `${baseId}_sub1_2_1`,
        name: 'Launch Planning & Readiness',
        description: 'Designing go-to-market plans for new drug or device launches across geographies',
        categoryId: cat1_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_2_2`,
        name: 'Pricing & Reimbursement Models',
        description: 'Aligning product pricing strategies with payer expectations and HTA requirements',
        categoryId: cat1_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_2_3`,
        name: 'Market Access & Real-World Evidence (RWE)',
        description: 'Generating post-market data to support access and long-term adoption',
        categoryId: cat1_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_2_4`,
        name: 'Patient-Centric Value Proposition',
        description: 'Defining compelling value for patients, caregivers, and clinicians',
        categoryId: cat1_2Id,
        isActive: true,
        createdAt: timestamp
      }
    );

    // Category 1.3: Business Model Innovation & Global Expansion
    const cat1_3Id = `${baseId}_cat1_3`;
    newCategories.push({
      id: cat1_3Id,
      name: 'Business Model Innovation & Global Expansion',
      description: 'Innovation in business models and global market expansion strategies',
      domainGroupId: group1Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 1.3
    newSubCategories.push(
      {
        id: `${baseId}_sub1_3_1`,
        name: 'Precision Medicine & Digital Therapeutics',
        description: 'Integrating personalized healthcare into product offerings',
        categoryId: cat1_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_3_2`,
        name: 'Emerging Market Strategy',
        description: 'Expanding presence and affordability in underserved regions',
        categoryId: cat1_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_3_3`,
        name: 'Ecosystem Collaborations (CROs, Tech, Academia)',
        description: 'Structuring multi-stakeholder collaborations to scale discovery and delivery',
        categoryId: cat1_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub1_3_4`,
        name: 'New Revenue Streams (Companion Apps, Data Licensing)',
        description: 'Monetizing digital and data assets to diversify revenue sources',
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

    // Category 2.1: Clinical & Regulatory Operations
    const cat2_1Id = `${baseId}_cat2_1`;
    newCategories.push({
      id: cat2_1Id,
      name: 'Clinical & Regulatory Operations',
      description: 'Clinical trial operations and regulatory compliance management',
      domainGroupId: group2Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 2.1
    newSubCategories.push(
      {
        id: `${baseId}_sub2_1_1`,
        name: 'Clinical Trial Design & Execution',
        description: 'Managing all trial phases with regulatory and ethical compliance',
        categoryId: cat2_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_1_2`,
        name: 'Regulatory Submissions & Approvals',
        description: 'Navigating FDA, EMA, CDSCO, and other authorities to gain timely approvals',
        categoryId: cat2_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_1_3`,
        name: 'Safety & Pharmacovigilance Operations',
        description: 'Monitoring adverse events and ensuring patient safety across the lifecycle',
        categoryId: cat2_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_1_4`,
        name: 'Clinical Data Management',
        description: 'Capturing, cleaning, and locking data efficiently across trial sites',
        categoryId: cat2_1Id,
        isActive: true,
        createdAt: timestamp
      }
    );

    // Category 2.2: Manufacturing, Quality & Supply Chain
    const cat2_2Id = `${baseId}_cat2_2`;
    newCategories.push({
      id: cat2_2Id,
      name: 'Manufacturing, Quality & Supply Chain',
      description: 'Manufacturing operations, quality management, and supply chain optimization',
      domainGroupId: group2Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 2.2
    newSubCategories.push(
      {
        id: `${baseId}_sub2_2_1`,
        name: 'GMP Manufacturing & Tech Transfer',
        description: 'Adhering to Good Manufacturing Practices and transferring validated processes',
        categoryId: cat2_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_2_2`,
        name: 'Quality Assurance & Control (QA/QC)',
        description: 'Enforcing regulatory-compliant and risk-based quality frameworks',
        categoryId: cat2_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_2_3`,
        name: 'Cold Chain & Global Logistics',
        description: 'Managing temperature-sensitive supply chains across continents',
        categoryId: cat2_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_2_4`,
        name: 'Digital Supply Chain Planning',
        description: 'Leveraging AI/ML for demand forecasting, inventory visibility, and responsiveness',
        categoryId: cat2_2Id,
        isActive: true,
        createdAt: timestamp
      }
    );

    // Category 2.3: ESG & Risk Management in Life Sciences
    const cat2_3Id = `${baseId}_cat2_3`;
    newCategories.push({
      id: cat2_3Id,
      name: 'ESG & Risk Management in Life Sciences',
      description: 'Environmental, social, and governance practices with risk management',
      domainGroupId: group2Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 2.3
    newSubCategories.push(
      {
        id: `${baseId}_sub2_3_1`,
        name: 'Environmental Compliance (Waste, Emissions)',
        description: 'Managing pharmaceutical effluents, emissions, and sustainability targets',
        categoryId: cat2_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_3_2`,
        name: 'Ethical Clinical Practices & Transparency',
        description: 'Upholding integrity in trial disclosures, consent, and publication ethics',
        categoryId: cat2_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_3_3`,
        name: 'Global Regulatory Risk Monitoring',
        description: 'Tracking and mitigating compliance risk across geographies',
        categoryId: cat2_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub2_3_4`,
        name: 'Responsible Sourcing & Supply Assurance',
        description: 'Ensuring ethical and resilient supplier networks',
        categoryId: cat2_3Id,
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

    // Category 3.1: Scientific Talent & Capability Development
    const cat3_1Id = `${baseId}_cat3_1`;
    newCategories.push({
      id: cat3_1Id,
      name: 'Scientific Talent & Capability Development',
      description: 'Development of scientific talent and specialized capabilities',
      domainGroupId: group3Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 3.1
    newSubCategories.push(
      {
        id: `${baseId}_sub3_1_1`,
        name: 'Researcher Upskilling & Certification',
        description: 'Offering continuous training in genomics, biologics, AI for drug discovery, etc',
        categoryId: cat3_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub3_1_2`,
        name: 'Clinical & Regulatory Workforce Training',
        description: 'Building specialized knowledge in trial conduct, GCP, ICH, and local regulations',
        categoryId: cat3_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub3_1_3`,
        name: 'Digital & Data Literacy for Pharma Professionals',
        description: 'Empowering cross-functional teams with analytics and digital capabilities',
        categoryId: cat3_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub3_1_4`,
        name: 'Functional Career Pathways & Mobility',
        description: 'Creating structured career advancement across R&D, commercial, and manufacturing',
        categoryId: cat3_1Id,
        isActive: true,
        createdAt: timestamp
      }
    );

    // Category 3.2: Change Management & Culture Transformation
    const cat3_2Id = `${baseId}_cat3_2`;
    newCategories.push({
      id: cat3_2Id,
      name: 'Change Management & Culture Transformation',
      description: 'Organizational change management and culture transformation initiatives',
      domainGroupId: group3Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 3.2
    newSubCategories.push(
      {
        id: `${baseId}_sub3_2_1`,
        name: 'Organizational Change for Digital Adoption',
        description: 'Driving culture shifts in adopting automation, cloud, and AI systems',
        categoryId: cat3_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub3_2_2`,
        name: 'Diversity in Research & Inclusion Programs',
        description: 'Promoting gender, geography, and population diversity in clinical and organizational roles',
        categoryId: cat3_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub3_2_3`,
        name: 'Leadership Development in Regulated Environments',
        description: 'Cultivating ethical, agile leaders in compliance-driven sectors',
        categoryId: cat3_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub3_2_4`,
        name: 'Global Collaboration Culture',
        description: 'Enhancing virtual and cross-border teamwork in clinical and commercial operations',
        categoryId: cat3_2Id,
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

    // Category 4.1: Digital R&D & Smart Labs
    const cat4_1Id = `${baseId}_cat4_1`;
    newCategories.push({
      id: cat4_1Id,
      name: 'Digital R&D & Smart Labs',
      description: 'Digital research and development with smart laboratory solutions',
      domainGroupId: group4Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 4.1
    newSubCategories.push(
      {
        id: `${baseId}_sub4_1_1`,
        name: 'Electronic Lab Notebooks (ELNs) & LIMS',
        description: 'Digitizing experiment tracking and data recording in research labs',
        categoryId: cat4_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_1_2`,
        name: 'AI in Drug Discovery & Biomarker Research',
        description: 'Applying AI/ML to accelerate molecule identification and precision targeting',
        categoryId: cat4_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_1_3`,
        name: 'Simulation & In Silico Modeling',
        description: 'Reducing wet lab time through predictive modeling and virtual screening',
        categoryId: cat4_1Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_1_4`,
        name: 'Knowledge Graphs & Ontologies',
        description: 'Structuring and connecting biological knowledge for reuse and insight generation',
        categoryId: cat4_1Id,
        isActive: true,
        createdAt: timestamp
      }
    );

    // Category 4.2: Connected Health & Real-World Technologies
    const cat4_2Id = `${baseId}_cat4_2`;
    newCategories.push({
      id: cat4_2Id,
      name: 'Connected Health & Real-World Technologies',
      description: 'Connected health solutions and real-world technology applications',
      domainGroupId: group4Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 4.2
    newSubCategories.push(
      {
        id: `${baseId}_sub4_2_1`,
        name: 'Companion Apps & Smart Devices',
        description: 'Integrating digital tools with therapeutics to improve adherence and outcomes',
        categoryId: cat4_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_2_2`,
        name: 'Real-World Data (RWD) Platforms',
        description: 'Collecting and leveraging longitudinal, observational health data at scale',
        categoryId: cat4_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_2_3`,
        name: 'Digital Biomarkers & Remote Monitoring',
        description: 'Capturing health signals continuously to support trials and care',
        categoryId: cat4_2Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_2_4`,
        name: 'Virtual Trials & Decentralized Study Models',
        description: 'Reaching patients directly through remote participation platforms',
        categoryId: cat4_2Id,
        isActive: true,
        createdAt: timestamp
      }
    );

    // Category 4.3: Core IT, Data & Security in Regulated Environments
    const cat4_3Id = `${baseId}_cat4_3`;
    newCategories.push({
      id: cat4_3Id,
      name: 'Core IT, Data & Security in Regulated Environments',
      description: 'IT infrastructure, data management, and security in regulated environments',
      domainGroupId: group4Id,
      isActive: true,
      createdAt: timestamp
    });

    // Sub-categories for 4.3
    newSubCategories.push(
      {
        id: `${baseId}_sub4_3_1`,
        name: 'GxP-Compliant IT Systems',
        description: 'Implementing validated and auditable systems for compliance-critical operations',
        categoryId: cat4_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_3_2`,
        name: 'Data Privacy & Security (HIPAA, GDPR)',
        description: 'Safeguarding patient and trial data under global data protection laws',
        categoryId: cat4_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_3_3`,
        name: 'Cloud & AI Infrastructure for Life Sciences',
        description: 'Building scalable and secure digital infrastructure for compute-intensive use cases',
        categoryId: cat4_3Id,
        isActive: true,
        createdAt: timestamp
      },
      {
        id: `${baseId}_sub4_3_4`,
        name: 'Interoperability & Integration Frameworks',
        description: 'Ensuring seamless data flow across lab, clinical, commercial, and regulatory systems',
        categoryId: cat4_3Id,
        isActive: true,
        createdAt: timestamp
      }
    );

    // Update data
    const updatedData = {
      domainGroups: [...data.domainGroups, ...newDomainGroups],
      categories: [...data.categories, ...newCategories],
      subCategories: [...data.subCategories, ...newSubCategories]
    };
    
    onDataUpdate(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    setIsCreating(false);
    
    toast({
      title: "Success",
      description: `Created complete Life Sciences hierarchy: 4 domain groups, 12 categories, and 48 sub-categories`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Bulk Create Life Sciences Hierarchy
        </CardTitle>
        <CardDescription>
          Create the complete Life Sciences domain group hierarchy with all groups, categories, and sub-categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This will create:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>4 Domain Groups (Strategy, Operations, People & Culture, Technology)</li>
              <li>12 Categories across all groups</li>
              <li>48 Sub-categories with detailed descriptions</li>
            </ul>
          </div>
          
          <Button 
            onClick={createLifeSciencesHierarchy} 
            disabled={isCreating}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating Hierarchy...' : 'Create Life Sciences Hierarchy'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkDomainGroupCreator;
