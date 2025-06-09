
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';
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
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> All competency areas are pre-set to "Advanced" level by default. Please review each area carefully and select your actual capability level to ensure accurate assessment. This helps us match you with the most suitable opportunities and ensures transparent expectations with potential clients.
          </AlertDescription>
        </Alert>
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
