
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DomainGroup, CompetencyCapability, CompetencyAssessment } from './types';
import DomainGroupSection from './DomainGroupSection';

interface CompetencyAssessmentContentProps {
  filteredDomainGroups: DomainGroup[];
  competencyAssessments: Record<string, CompetencyAssessment>;
  activeCapabilities: CompetencyCapability[];
  onUpdateCapability: (groupId: string, categoryId: string, subCategoryId: string, capability: string) => void;
  getCapabilityBadgeColor: (capabilityName: string) => string;
  getIndustrySegmentName: (value: string) => string;
  selectedIndustrySegment: string;
}

const CompetencyAssessmentContent: React.FC<CompetencyAssessmentContentProps> = ({
  filteredDomainGroups,
  competencyAssessments,
  activeCapabilities,
  onUpdateCapability,
  getCapabilityBadgeColor,
  getIndustrySegmentName,
  selectedIndustrySegment
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Competency Assessment Parameters</CardTitle>
        <p className="text-sm text-muted-foreground">
          Assess your capability level for each competency area. Default level is set to Advanced - you can modify as needed.
        </p>
      </CardHeader>
      <CardContent>
        {filteredDomainGroups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No domain groups found for the selected industry segment: {getIndustrySegmentName(selectedIndustrySegment)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDomainGroups.map((group) => (
              <DomainGroupSection
                key={group.id}
                group={group}
                competencyAssessments={competencyAssessments}
                activeCapabilities={activeCapabilities}
                onUpdateCapability={onUpdateCapability}
                getCapabilityBadgeColor={getCapabilityBadgeColor}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetencyAssessmentContent;
