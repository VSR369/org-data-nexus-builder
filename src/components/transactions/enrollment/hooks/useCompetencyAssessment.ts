
import { useState, useEffect } from 'react';

interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industrySegmentId: string;
  isActive: boolean;
  createdAt: string;
  categories: any[];
}

export const useCompetencyAssessment = (selectedIndustrySegment: string) => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load industry segments and domain groups from master data
    const loadData = () => {
      // Load industry segments from master data manager
      const savedIndustrySegments = localStorage.getItem('master_data_industry_segments');
      if (savedIndustrySegments) {
        try {
          const industrySegmentsData: IndustrySegment[] = JSON.parse(savedIndustrySegments);
          console.log('Loaded industry segments from master data:', industrySegmentsData);
          setIndustrySegments(industrySegmentsData.filter(segment => segment.isActive));
        } catch (error) {
          console.error('Error parsing industry segments data:', error);
          setIndustrySegments([]);
        }
      } else {
        console.log('No industry segments data found in master data');
        setIndustrySegments([]);
      }

      // Load domain groups from master data
      const savedDomainGroups = localStorage.getItem('domainGroupsData');
      if (savedDomainGroups) {
        try {
          const domainGroupsData: DomainGroup[] = JSON.parse(savedDomainGroups);
          console.log('Loaded domain groups from master data:', domainGroupsData);
          setDomainGroups(domainGroupsData);
          
          // Initialize all groups and categories as expanded
          const allGroupIds = new Set(domainGroupsData.map(group => group.id));
          const allCategoryIds = new Set(
            domainGroupsData.flatMap(group => 
              group.categories.map(category => category.id)
            )
          );
          
          setExpandedGroups(allGroupIds);
          setExpandedCategories(allCategoryIds);
          
        } catch (error) {
          console.error('Error parsing domain groups data:', error);
          setDomainGroups([]);
        }
      } else {
        console.log('No domain groups data found in localStorage');
        setDomainGroups([]);
      }
    };

    loadData();
  }, []);

  // Get relevant domain groups for the selected industry segment
  const relevantDomainGroups = domainGroups.filter(group => {
    const matches = group.industrySegmentId === selectedIndustrySegment;
    console.log(`Checking domain group ${group.name} with industrySegmentId ${group.industrySegmentId} against ${selectedIndustrySegment}: ${matches}`);
    return matches;
  });

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Helper function to get industry segment name
  const getIndustrySegmentName = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : `Industry Segment ${segmentId}`;
  };

  return {
    industrySegments,
    domainGroups,
    relevantDomainGroups,
    expandedGroups,
    expandedCategories,
    toggleGroupExpansion,
    toggleCategoryExpansion,
    getIndustrySegmentName
  };
};
