
import { CompetencyCapability, CapabilityLevel } from './types';

// Re-export from the new modular structure
export { masterDomainGroups, getDomainGroupsByIndustrySegment, getAvailableIndustrySegments, industrySegmentMapping } from './data';

export const competencyCapabilities: CompetencyCapability[] = [
  {
    id: '1',
    name: 'No/Low Competency',
    description: 'Limited or no experience in this area',
    color: 'bg-red-100 text-red-800 border-red-300',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    name: 'Basic',
    description: 'Fundamental knowledge and basic competency',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    name: 'Advanced',
    description: 'High proficiency with comprehensive understanding',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    name: 'Guru',
    description: 'Expert level with deep knowledge and ability to guide others',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    order: 4,
    isActive: true,
  },
];

export const capabilityLevels: CapabilityLevel[] = [
  {
    id: '1',
    name: 'No/Low Competency',
    description: 'Score range: 0.0 – 2.49999',
    minScore: 0.0,
    maxScore: 2.49999,
    color: 'bg-red-100 text-red-800 border-red-300',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    name: 'Basic',
    description: 'Score range: 2.5 – 4.99999',
    minScore: 2.5,
    maxScore: 4.99999,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    name: 'Advanced',
    description: 'Score range: 5.0 – 7.49999',
    minScore: 5.0,
    maxScore: 7.49999,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    name: 'Guru',
    description: 'Score range: 7.5 – 10.0',
    minScore: 7.5,
    maxScore: 10.0,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    order: 4,
    isActive: true,
  },
];
