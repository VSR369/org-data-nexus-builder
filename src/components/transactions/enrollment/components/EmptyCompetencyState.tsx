
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface EmptyCompetencyStateProps {
  hasSelectedSegment: boolean;
  hasDomainGroups: boolean;
}

const EmptyCompetencyState: React.FC<EmptyCompetencyStateProps> = ({
  hasSelectedSegment,
  hasDomainGroups
}) => {
  if (!hasSelectedSegment) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Core Competencies Assessment</h3>
        <p className="text-muted-foreground">
          Please select an Industry Segment in Basic Information to enable competency ratings.
        </p>
      </div>
    );
  }

  if (!hasDomainGroups) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Competency Structure</h3>
          <p className="text-muted-foreground">
            No domain groups found for this industry segment. 
            Please configure domain groups for this industry segment in the master data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default EmptyCompetencyState;
