
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompetencyAssessment } from './competency/types';
import { masterDomainGroups, competencyCapabilities } from './competency/masterData';
import IndustrySegmentDisplay from './competency/IndustrySegmentDisplay';
import CompetencyAssessmentContent from './competency/CompetencyAssessmentContent';

interface SolutionProviderCompetencyTabProps {
  selectedIndustrySegment: string;
  onCompetencyComplete: (isComplete: boolean) => void;
  onSubmitEnrollment: () => void;
  onSaveDraft: () => void;
  isSubmitEnabled: boolean;
}

const SolutionProviderCompetencyTab: React.FC<SolutionProviderCompetencyTabProps> = ({ 
  selectedIndustrySegment,
  onCompetencyComplete,
  onSubmitEnrollment,
  onSaveDraft,
  isSubmitEnabled
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

  // Show all domain groups for every industry segment selection
  const filteredDomainGroups = selectedIndustrySegment === 'all' || !selectedIndustrySegment
    ? [] // Don't show any groups if no industry segment is selected
    : masterDomainGroups; // Show all groups for any selected industry segment

  console.log('Filtered domain groups:', filteredDomainGroups);

  const activeCapabilities = competencyCapabilities
    .filter(cap => cap.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    console.log('useEffect triggered with selectedIndustrySegment:', selectedIndustrySegment);
    
    if (!selectedIndustrySegment || selectedIndustrySegment === 'all') {
      setCompetencyAssessments({});
      onCompetencyComplete(false);
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
    
    // Consider competency complete if all subcategories have assessments
    const totalSubCategories = filteredDomainGroups.reduce((total, group) => {
      return total + group.categories.reduce((catTotal, category) => {
        return catTotal + category.subCategories.length;
      }, 0);
    }, 0);
    
    onCompetencyComplete(Object.keys(initialAssessments).length === totalSubCategories && totalSubCategories > 0);
  }, [selectedIndustrySegment, filteredDomainGroups, onCompetencyComplete]);

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

  // Check if competency is truly complete (all assessments exist and are not default)
  const totalExpectedAssessments = filteredDomainGroups.reduce((total, group) => {
    return total + group.categories.reduce((catTotal, category) => {
      return catTotal + category.subCategories.length;
    }, 0);
  }, 0);

  const isCompetencyComplete = Object.keys(competencyAssessments).length === totalExpectedAssessments && totalExpectedAssessments > 0;

  console.log('Competency completion check:', {
    totalExpected: totalExpectedAssessments,
    actualAssessments: Object.keys(competencyAssessments).length,
    isComplete: isCompetencyComplete
  });

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

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button 
              onClick={onSubmitEnrollment}
              className="flex-1"
              disabled={!isSubmitEnabled || !isCompetencyComplete}
            >
              Submit Enrollment
            </Button>
            <Button 
              variant="outline" 
              onClick={onSaveDraft}
              className="flex-1"
            >
              Save as Draft
            </Button>
          </div>
          {(!isSubmitEnabled || !isCompetencyComplete) && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {!isSubmitEnabled && "Complete Basic Details & Information first. "}
              {!isCompetencyComplete && "Please review and confirm your capability levels for all competency areas before submitting."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionProviderCompetencyTab;
