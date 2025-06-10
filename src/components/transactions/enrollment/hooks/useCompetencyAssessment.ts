
import { useState, useEffect } from 'react';
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';

interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
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
    // Load industry segments from shared DataManager
    const loadIndustrySegments = () => {
      console.log('📥 CompetencyAssessmentTab: Loading segments from shared DataManager...');
      
      const segments = industrySegmentsDataManager.loadData();
      console.log('📋 CompetencyAssessmentTab: Loaded segments:', segments);

      // Convert to IndustrySegment format
      const segmentObjects: IndustrySegment[] = segments.map((segment, index) => ({
        id: (index + 1).toString(),
        name: segment,
        code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
        description: `Industry segment: ${segment}`
      }));

      setIndustrySegments(segmentObjects);
    };

    // Load domain groups from master data
    const loadDomainGroups = () => {
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

    loadIndustrySegments();
    loadDomainGroups();

    // Listen for industry segments updates
    const handleIndustrySegmentsUpdated = () => {
      console.log('🔄 CompetencyAssessmentTab: Received industry segments update');
      loadIndustrySegments();
    };

    window.addEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated);

    return () => {
      window.removeEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated);
    };
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

  return {
    industrySegments,
    domainGroups,
    relevantDomainGroups,
    expandedGroups,
    expandedCategories,
    toggleGroupExpansion,
    toggleCategoryExpansion
  };
};
