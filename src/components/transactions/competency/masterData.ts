
import { CompetencyCapability } from './types';

// Re-export from the new modular structure
export { masterDomainGroups, getDomainGroupsByIndustrySegment, getAvailableIndustrySegments, industrySegmentMapping } from './data';

export const competencyCapabilities: CompetencyCapability[] = [
  {
    id: '1',
    name: 'Guru',
    description: 'Expert level with deep knowledge and ability to guide others',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    name: 'Advanced',
    description: 'High proficiency with comprehensive understanding',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    name: 'Basic',
    description: 'Fundamental knowledge and basic competency',
    color: 'bg-green-100 text-green-800 border-green-300',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    name: 'Not Applicable',
    description: 'This competency area is not relevant or applicable',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    order: 4,
    isActive: true,
  },
];
