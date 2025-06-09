
import { useState, useEffect } from 'react';
import { CompetencyAssessment } from '../types';
import { getDomainGroupsByIndustrySegment, industrySegmentMapping } from '../data';

export const useCompetencyAssessment = (selectedIndustrySegment: string, onCompetencyComplete: (isComplete: boolean) => void) => {
  const [competencyAssessments, setCompetencyAssessments] = useState<Record<string, CompetencyAssessment>>({});

  // Map the selected industry segment value to the full industry segment name used in master data
  const getIndustrySegmentName = (value: string) => {
    return industrySegmentMapping[value as keyof typeof industrySegmentMapping] || value;
  };

  const industrySegmentName = getIndustrySegmentName(selectedIndustrySegment);
  console.log('Mapped industry segment name:', industrySegmentName);

  // Use the new helper function to get filtered domain groups
  const filteredDomainGroups = selectedIndustrySegment === 'all' || !selectedIndustrySegment
    ? [] // Don't show any groups if no industry segment is selected
    : getDomainGroupsByIndustrySegment(selectedIndustrySegment);

  console.log('Filtered domain groups:', filteredDomainGroups);
  console.log('Number of filtered groups:', filteredDomainGroups.length);

  useEffect(() => {
    console.log('useEffect triggered with selectedIndustrySegment:', selectedIndustrySegment);
    console.log('Filtered groups in useEffect:', filteredDomainGroups.length);
    
    if (!selectedIndustrySegment || selectedIndustrySegment === 'all') {
      setCompetencyAssessments({});
      onCompetencyComplete(false);
      return;
    }

    const initialAssessments: Record<string, CompetencyAssessment> = {};
    
    filteredDomainGroups.forEach(group => {
      console.log('Processing group:', group.name, 'with', group.categories.length, 'categories');
      group.categories.forEach(category => {
        console.log('Processing category:', category.name, 'with', category.subCategories.length, 'subcategories');
        category.subCategories.forEach(subCategory => {
          const key = `${group.id}-${category.id}-${subCategory.id}`;
          console.log('Creating assessment for key:', key, 'subCategory:', subCategory.name);
          initialAssessments[key] = {
            groupId: group.id,
            categoryId: category.id,
            subCategoryId: subCategory.id,
            capability: 'Advanced'
          };
        });
      });
    });
    
    console.log('Setting initial assessments:', initialAssessments);
    console.log('Total assessments created:', Object.keys(initialAssessments).length);
    setCompetencyAssessments(initialAssessments);
    
    // Consider competency complete if all subcategories have assessments
    const totalSubCategories = filteredDomainGroups.reduce((total, group) => {
      return total + group.categories.reduce((catTotal, category) => {
        return catTotal + category.subCategories.length;
      }, 0);
    }, 0);
    
    console.log('Total subcategories expected:', totalSubCategories);
    const isComplete = Object.keys(initialAssessments).length === totalSubCategories && totalSubCategories > 0;
    console.log('Setting competency complete to:', isComplete);
    onCompetencyComplete(isComplete);
  }, [selectedIndustrySegment, filteredDomainGroups.length, onCompetencyComplete]);

  const updateCapability = (groupId: string, categoryId: string, subCategoryId: string, capability: string) => {
    const key = `${groupId}-${categoryId}-${subCategoryId}`;
    console.log('Updating capability:', { key, capability });
    setCompetencyAssessments(prev => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          groupId,
          categoryId,
          subCategoryId,
          capability: capability
        }
      };
      console.log('Updated assessments:', updated);
      return updated;
    });
  };

  return {
    competencyAssessments,
    filteredDomainGroups,
    getIndustrySegmentName,
    updateCapability
  };
};
