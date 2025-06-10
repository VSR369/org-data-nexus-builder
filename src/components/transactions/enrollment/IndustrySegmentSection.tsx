
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProviderTypeSelection from './components/ProviderTypeSelection';
import IndustrySegmentNotice from './components/IndustrySegmentNotice';
import { getSectionHeading } from './utils/sectionHeadingUtils';

interface IndustrySegmentSectionProps {
  selectedIndustrySegments: string[];
  onAddIndustrySegment: (value: string) => void;
  onRemoveIndustrySegment: (value: string) => void;
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  invalidFields?: Set<string>;
  providerRoles?: string[];
}

const IndustrySegmentSection: React.FC<IndustrySegmentSectionProps> = ({
  providerType,
  onProviderTypeChange,
  invalidFields = new Set(),
  providerRoles = []
}) => {
  const heading = getSectionHeading(providerRoles);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProviderTypeSelection
          providerType={providerType}
          onProviderTypeChange={onProviderTypeChange}
          invalidFields={invalidFields}
        />
        <IndustrySegmentNotice />
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentSection;
