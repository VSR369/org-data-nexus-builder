
import { useState, useEffect } from 'react';
import { DomainGroup } from '../types';
import { mockIndustrySegments } from '../data/mockData';
import { initializeDataForAllSegments } from '../utils/dataInitializer';
import { useDomainGroupOperations } from './useDomainGroupOperations';

export const useDomainGroupsData = () => {
  const [industrySegments] = useState(mockIndustrySegments);
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  const [selectedDomainGroup, setSelectedDomainGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize data for all industry segments
  useEffect(() => {
    const allData = initializeDataForAllSegments();
    setDomainGroups(allData);
  }, []);

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
