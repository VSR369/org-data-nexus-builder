
import { DomainGroup } from '../types';
import { bfsiDomainGroups } from './bfsiDomainGroups';
import { retailDomainGroups } from './retailDomainGroups';
import { itDomainGroups } from './itDomainGroups';
import { healthcareDomainGroups } from './healthcareDomainGroups';

// Industry segment mapping
export const industrySegmentMapping = {
  'bfsi': 'Banking, Financial Services & Insurance (BFSI)',
  'retail': 'Retail & E-Commerce',
  'healthcare': 'Healthcare & Life Sciences',
  'it': 'Information Technology & Software Services',
  'telecom': 'Telecommunications',
  'education': 'Education & EdTech',
  'manufacturing': 'Manufacturing',
  'logistics': 'Logistics & Supply Chain'
};

// Combined master domain groups from all industry-specific files
export const masterDomainGroups: DomainGroup[] = [
  ...bfsiDomainGroups,
  ...retailDomainGroups,
  ...itDomainGroups,
  ...healthcareDomainGroups
  // Add more industry-specific domain groups here as they are created
];

// Helper function to get domain groups by industry segment
export const getDomainGroupsByIndustrySegment = (industrySegment: string): DomainGroup[] => {
  const fullSegmentName = industrySegmentMapping[industrySegment as keyof typeof industrySegmentMapping] || industrySegment;
  return masterDomainGroups.filter(group => group.industrySegment === fullSegmentName);
};

// Helper function to get all available industry segments
export const getAvailableIndustrySegments = (): string[] => {
  return [...new Set(masterDomainGroups.map(group => group.industrySegment))];
};
