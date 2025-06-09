
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { competencyCapabilities } from './competency/masterData';
import IndustrySegmentDisplay from './competency/IndustrySegmentDisplay';
import CompetencyAssessmentContent from './competency/CompetencyAssessmentContent';
import { useCompetencyAssessment } from './competency/hooks/useCompetencyAssessment';

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
  const {
    competencyAssessments,
    filteredDomainGroups,
    getIndustrySegmentName,
    updateCapability
  } = useCompetencyAssessment(selectedIndustrySegment, onCompetencyComplete);

  console.log('SolutionProviderCompetencyTab - Received selectedIndustrySegment:', selectedIndustrySegment);

  const activeCapabilities = competencyCapabilities
    .filter(cap => cap.isActive)
    .sort((a, b) => a.order - b.order);

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
    isComplete: isCompetencyComplete,
    filteredGroupsCount: filteredDomainGroups.length
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
