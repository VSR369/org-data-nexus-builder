
import { DomainGroup } from '../types';

export const healthcareDomainGroups: DomainGroup[] = [
  {
    id: 'healthcare-1',
    name: 'Digital Health & Telemedicine',
    industrySegment: 'Healthcare & Life Sciences',
    categories: [
      {
        id: 'healthcare-101',
        name: 'Telemedicine Platforms',
        subCategories: [
          { id: 'healthcare-101-1', name: 'Virtual Consultation Systems', description: 'Building secure video consultation platforms for remote patient care.' },
          { id: 'healthcare-101-2', name: 'Remote Patient Monitoring', description: 'IoT-enabled devices and systems for continuous patient monitoring.' },
          { id: 'healthcare-101-3', name: 'Mobile Health Applications', description: 'Patient-facing mobile apps for health tracking and engagement.' },
        ],
      },
      {
        id: 'healthcare-102',
        name: 'Electronic Health Records (EHR)',
        subCategories: [
          { id: 'healthcare-102-1', name: 'EHR System Integration', description: 'Seamless integration of electronic health record systems.' },
          { id: 'healthcare-102-2', name: 'Health Information Exchange', description: 'Secure sharing of patient data across healthcare providers.' },
        ],
      },
    ],
  },
  {
    id: 'healthcare-2',
    name: 'Healthcare Analytics & AI',
    industrySegment: 'Healthcare & Life Sciences',
    categories: [
      {
        id: 'healthcare-201',
        name: 'Medical AI & Diagnostics',
        subCategories: [
          { id: 'healthcare-201-1', name: 'Medical Imaging AI', description: 'AI-powered diagnostic imaging and radiology solutions.' },
          { id: 'healthcare-201-2', name: 'Predictive Healthcare Analytics', description: 'Predictive models for patient outcomes and treatment optimization.' },
          { id: 'healthcare-201-3', name: 'Clinical Decision Support', description: 'AI-assisted clinical decision making and treatment recommendations.' },
        ],
      },
    ],
  },
];
