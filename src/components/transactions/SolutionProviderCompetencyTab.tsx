
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CompetencyAssessment } from './competency/types';
import { masterDomainGroups, competencyCapabilities } from './competency/masterData';
import IndustrySegmentDisplay from './competency/IndustrySegmentDisplay';
import CompetencyAssessmentContent from './competency/CompetencyAssessmentContent';

interface SolutionProviderCompetencyTabProps {
  selectedIndustrySegment: string;
}

const SolutionProviderCompetencyTab: React.FC<SolutionProviderCompetencyTabProps> = ({ 
  selectedIndustrySegment 
}) => {
  const [competencyAssessments, setCompetencyAssessments] = useState<Record<string, CompetencyAssessment>>({});

  console.log('SolutionProviderCompetencyTab - Received selectedIndustrySegment:', selectedIndustrySegment);
  console.log('SolutionProviderCompetencyTab - masterDomainGroups:', masterDomainGroups);

  const getIndustrySegmentName = (value: string) => {
    const mapping = {
      'bfsi': 'Banking, Financial Services & Insurance (BFSI)',
      'retail': 'Retail & E-Commerce',
      'healthcare': 'Healthcare & Life Sciences',
      'it': 'Information Technology & Software Services',
      'telecom': 'Telecommunications',
      'education': 'Education & EdTech',
      'manufacturing': 'Manufacturing',
      'logistics': 'Logistics & Supply Chain'
    };
    return mapping[value as keyof typeof mapping] || value;
  };

  const industrySegmentName = getIndustrySegmentName(selectedIndustrySegment);
  console.log('Industry segment name:', industrySegmentName);

  const filteredDomainGroups = selectedIndustrySegment === 'all' || !selectedIndustrySegment
    ? masterDomainGroups 
    : masterDomainGroups.filter(group => {
        console.log('Checking group:', group.name, 'industrySegment:', group.industrySegment);
        return group.industrySegment === industrySegmentName;
      });

  console.log('Filtered domain groups:', filteredDomainGroups);

  const activeCapabilities = competencyCapabilities
    .filter(cap => cap.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    console.log('useEffect triggered with selectedIndustrySegment:', selectedIndustrySegment);
    
    if (!selectedIndustrySegment || selectedIndustrySegment === 'all') {
      setCompetencyAssessments({});
      return;
    }

    const initialAssessments: Record<string, CompetencyAssessment> = {};
    
    filteredDomainGroups.forEach(group => {
      group.categories.forEach(category => {
        category.subCategories.forEach(subCategory => {
          const key = `${group.id}-${category.id}-${subCategory.id}`;
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
    setCompetencyAssessments(initialAssessments);
  }, [selectedIndustrySegment, filteredDomainGroups]);

  const updateCapability = (groupId: string, categoryId: string, subCategoryId: string, capability: string) => {
    const key = `${groupId}-${categoryId}-${subCategoryId}`;
    setCompetencyAssessments(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        capability: capability
      }
    }));
  };

  const getCapabilityBadgeColor = (capabilityName: string) => {
    const capability = competencyCapabilities.find(cap => cap.name === capabilityName);
    return capability ? capability.color : 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (!selectedIndustrySegment || selectedIndustrySegment === 'all') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select an industry segment in the Basic Details & Information tab to view competency assessment parameters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <IndustrySegmentDisplay 
        selectedIndustrySegment={selectedIndustrySegment}
        getIndustrySegmentName={getIndustrySegmentName}
      />
      
      <CompetencyAssessmentContent
        filteredDomainGroups={filteredDomainGroups}
        competencyAssessments={competencyAssessments}
        activeCapabilities={activeCapabilities}
        onUpdateCapability={updateCapability}
        getCapabilityBadgeColor={getCapabilityBadgeColor}
        getIndustrySegmentName={getIndustrySegmentName}
        selectedIndustrySegment={selectedIndustrySegment}
      />
    </div>
  );
};

export default SolutionProviderCompetencyTab;
