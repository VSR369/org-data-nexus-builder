
import { DomainGroup } from '../types';
import { mockIndustrySegments } from '../data/mockData';
import { defaultDomainGroupsData } from '../data/defaultDomainGroups';

export const initializeDataForAllSegments = (): DomainGroup[] => {
  const allData: DomainGroup[] = [];
  
  mockIndustrySegments.forEach(segment => {
    defaultDomainGroupsData.forEach(group => {
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
  
  return allData;
};
