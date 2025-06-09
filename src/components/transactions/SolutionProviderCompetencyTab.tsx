
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

  const getIndustrySegmentName = (value: string) => {
    switch (value) {
      case 'bfsi': return 'Banking, Financial Services & Insurance (BFSI)';
      case 'retail': return 'Retail & E-Commerce';
      case 'healthcare': return 'Healthcare & Life Sciences';
      case 'it': return 'Information Technology & Software Services';
      case 'telecom': return 'Telecommunications';
      case 'education': return 'Education & EdTech';
      case 'manufacturing': return 'Manufacturing';
      case 'logistics': return 'Logistics & Supply Chain';
      default: return value;
    }
  };

  const filteredDomainGroups = selectedIndustrySegment === 'all' || !selectedIndustrySegment
    ? masterDomainGroups 
    : masterDomainGroups.filter(group => group.industrySegment === getIndustrySegmentName(selectedIndustrySegment));

  const activeCapabilities = competencyCapabilities
    .filter(cap => cap.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
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
    
    setCompetencyAssessments(initialAssessments);
  }, [selectedIndustrySegment]);

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

  console.log('Selected Industry Segment:', selectedIndustrySegment);
  console.log('Filtered Domain Groups:', filteredDomainGroups);
  console.log('Competency Assessments:', competencyAssessments);

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
