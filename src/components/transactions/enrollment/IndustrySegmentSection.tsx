
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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

  // Determine the heading based on selected roles
  const getHeading = () => {
    const currentRoles = providerRoles || [];
    const hasProvider = currentRoles.includes('solution-provider');
    const hasAssessor = currentRoles.includes('solution-assessor');
    const hasBoth = currentRoles.includes('both') || (hasProvider && hasAssessor);

    if (hasBoth) {
      return "Provider & Assessor Both Roles Information";
    } else if (hasAssessor) {
      return "Assessor Information";
    } else if (hasProvider) {
      return "Provider Information";
    } else {
      return "Provider Information"; // Default heading
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getHeading()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Type Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Representation *</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select whether you are registering as an individual or organization
            </p>
          </div>
          
          <RadioGroup 
            value={providerType} 
            onValueChange={onProviderTypeChange}
            className={invalidFields.has('providerType') ? 'border border-destructive rounded-md p-2' : ''}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="font-normal">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organization" id="organization" />
              <Label htmlFor="organization" className="font-normal">Organization</Label>
            </div>
          </RadioGroup>
          
          {invalidFields.has('providerType') && (
            <p className="text-sm text-destructive">Please select a representation type</p>
          )}
        </div>

        {/* Industry Segments Notice */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Industry segments configuration has been removed. You can proceed with the registration without selecting specific industry segments.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentSection;
