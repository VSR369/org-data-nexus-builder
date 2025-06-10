import { DomainGroup, IndustrySegment } from '../types';
import { defaultDomainGroupsData } from '../data/defaultDomainGroups';
import { lifeSciencesDomainGroups } from '../data/lifeSciencesDomainGroups';
import { manufacturingDomainGroups } from '../data/manufacturingDomainGroups';
import { bfsiDomainGroups } from '../../../transactions/competency/data/bfsiDomainGroups';
import { retailDomainGroups } from '../../../transactions/competency/data/retailDomainGroups';
import { itDomainGroups } from '../../../transactions/competency/data/itDomainGroups';
import { healthcareDomainGroups } from '../../../transactions/competency/data/healthcareDomainGroups';

const defaultSegments = [
  'Banking, Financial Services & Insurance (BFSI)',
  'Retail & E-Commerce',
  'Healthcare & Life Sciences',
  'Information Technology & Software Services',
  'Telecommunications',
  'Education & EdTech',
  'Manufacturing (Smart / Discrete / Process)',
  'Logistics & Supply Chain',
  'Media, Entertainment & OTT',
  'Energy & Utilities (Power, Oil & Gas, Renewables)',
  'Automotive & Mobility',
  'Real Estate & Smart Infrastructure',
  'Travel, Tourism & Hospitality',
  'Agriculture & AgriTech',
  'Public Sector & e-Governance'
];

export const initializeDomainGroupsData = (segments: IndustrySegment[]): DomainGroup[] => {
  const allData: DomainGroup[] = [];
  
  segments.forEach(segment => {
    console.log('Processing segment:', segment.name);
    
    let sourceData = defaultDomainGroupsData;
    
    // Map industry segments to their specific data
    if (segment.name === 'Healthcare & Life Sciences' || segment.name.toLowerCase().includes('healthcare')) {
      sourceData = [...lifeSciencesDomainGroups, ...healthcareDomainGroups.map(group => ({
        ...group,
        industrySegment: segment.name
      }))];
    } else if (segment.name === 'Manufacturing (Smart / Discrete / Process)' || segment.name.toLowerCase().includes('manufacturing')) {
      sourceData = manufacturingDomainGroups;
    } else if (segment.name === 'Banking, Financial Services & Insurance (BFSI)' || segment.name.toLowerCase().includes('bfsi')) {
      sourceData = bfsiDomainGroups.map(group => ({
        ...group,
        industrySegment: segment.name
      }));
    } else if (segment.name === 'Retail & E-Commerce' || segment.name.toLowerCase().includes('retail')) {
      sourceData = retailDomainGroups.map(group => ({
        ...group,
        industrySegment: segment.name
      }));
    } else if (segment.name === 'Information Technology & Software Services' || segment.name.toLowerCase().includes('information technology')) {
      sourceData = itDomainGroups.map(group => ({
        ...group,
        industrySegment: segment.name
      }));
    }
    
    console.log('Using data source with', sourceData.length, 'groups');
    
    sourceData.forEach(group => {
      const newGroup: DomainGroup = {
        ...group,
        id: `${segment.id}-${group.id}`,
        industrySegmentId: segment.id,
        categories: group.categories.map(category => ({
          ...category,
          id: `${segment.id}-${category.id}`,
          domainGroupId: `${segment.id}-${group.id}`,
          subCategories: category.subCategories.map(subCategory => ({
            ...subCategory,
            id: `${segment.id}-${subCategory.id}`,
            categoryId: `${segment.id}-${category.id}`
          }))
        }))
      };
      allData.push(newGroup);
    });
  });
  
  console.log('Total domain groups created:', allData.length);
  return allData;
};

export const initializeDataForAllSegments = (): DomainGroup[] => {
  const savedSegments = localStorage.getItem('industrySegments');
  let segments: string[] = [];
  
  if (savedSegments) {
    try {
      segments = JSON.parse(savedSegments);
    } catch (error) {
      console.error('Error parsing saved segments:', error);
      segments = defaultSegments;
    }
  } else {
    segments = defaultSegments;
  }

  const industrySegmentObjects: IndustrySegment[] = segments.map((segment, index) => ({
    id: (index + 1).toString(),
    name: segment,
    code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
    description: `Industry segment: ${segment}`
  }));

  return initializeDomainGroupsData(industrySegmentObjects);
};
