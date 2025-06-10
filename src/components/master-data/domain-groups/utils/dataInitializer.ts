
import { DomainGroup, IndustrySegment } from '../types';
import { defaultDomainGroupsData } from '../data/defaultDomainGroups';
import { lifeSciencesDomainGroups } from '../data/lifeSciencesDomainGroups';
import { manufacturingDomainGroups } from '../data/manufacturingDomainGroups';

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
    
    // Check if this is Healthcare & Life Sciences segment
    const isLifeSciences = segment.name === 'Healthcare & Life Sciences' || 
                          segment.name.toLowerCase().includes('healthcare') ||
                          segment.name.toLowerCase().includes('life sciences');
    
    // Check if this is Manufacturing segment
    const isManufacturing = segment.name === 'Manufacturing (Smart / Discrete / Process)' ||
                           segment.name.toLowerCase().includes('manufacturing');
    
    console.log('Is Life Sciences segment?', isLifeSciences, 'for segment:', segment.name);
    console.log('Is Manufacturing segment?', isManufacturing, 'for segment:', segment.name);
    
    let sourceData = defaultDomainGroupsData;
    
    if (isLifeSciences) {
      sourceData = lifeSciencesDomainGroups;
    } else if (isManufacturing) {
      sourceData = manufacturingDomainGroups;
    }
    
    console.log('Using data source:', isLifeSciences ? 'lifeSciencesDomainGroups' : isManufacturing ? 'manufacturingDomainGroups' : 'defaultDomainGroupsData');
    console.log('Source data has', sourceData.length, 'groups');
    
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
      console.log('Added group:', newGroup.name, 'for segment:', segment.name);
    });
  });
  
  console.log('Total domain groups created:', allData.length);
  return allData;
};

export const initializeDataForAllSegments = (): DomainGroup[] => {
  // Get industry segments from localStorage or use defaults
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

  // Convert to IndustrySegment format
  const industrySegmentObjects: IndustrySegment[] = segments.map((segment, index) => ({
    id: (index + 1).toString(),
    name: segment,
    code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
    description: `Industry segment: ${segment}`
  }));

  return initializeDomainGroupsData(industrySegmentObjects);
};
