
import { useState, useEffect } from 'react';
import { DomainGroup, IndustrySegment } from '../types';
import { initializeDataForAllSegments } from '../utils/dataInitializer';
import { useDomainGroupOperations } from './useDomainGroupOperations';

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

export const useDomainGroupsData = () => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  const [selectedDomainGroup, setSelectedDomainGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load industry segments from localStorage
  useEffect(() => {
    const loadIndustrySegments = () => {
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

      setIndustrySegments(industrySegmentObjects);
    };

    loadIndustrySegments();

    // Listen for storage changes to update when industry segments are modified
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'industrySegments') {
        loadIndustrySegments();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initialize data for all industry segments
  useEffect(() => {
    if (industrySegments.length > 0) {
      const allData = initializeDataForAllSegments();
      setDomainGroups(allData);
    }
  }, [industrySegments]);

  const getDomainGroupsByIndustry = (industrySegmentId: string) => {
    return domainGroups.filter(group => group.industrySegmentId === industrySegmentId);
  };

  const getCategoriesByDomainGroup = (domainGroupId: string) => {
    const group = domainGroups.find(g => g.id === domainGroupId);
    return group?.categories || [];
  };

  const getSubCategoriesByCategory = (categoryId: string) => {
    for (const group of domainGroups) {
      const category = group.categories.find(c => c.id === categoryId);
      if (category) {
        return category.subCategories;
      }
    }
    return [];
  };

  const operations = useDomainGroupOperations(domainGroups, setDomainGroups);

  return {
    industrySegments,
    selectedIndustrySegment,
    setSelectedIndustrySegment,
    selectedDomainGroup,
    setSelectedDomainGroup,
    selectedCategory,
    setSelectedCategory,
    domainGroups: getDomainGroupsByIndustry(selectedIndustrySegment),
    categories: getCategoriesByDomainGroup(selectedDomainGroup),
    subCategories: getSubCategoriesByCategory(selectedCategory),
    isLoading,
    ...operations
  };
};
