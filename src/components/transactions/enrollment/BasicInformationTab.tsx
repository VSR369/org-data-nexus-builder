
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import IndustrySegmentSection from './IndustrySegmentSection';
import InstitutionDetailsSection from './InstitutionDetailsSection';
import ProviderDetailsSection from './ProviderDetailsSection';
import BankingDetailsSection from './BankingDetailsSection';
import AdditionalInfoSection from './AdditionalInfoSection';
import { FormData } from './types';

interface BasicInformationTabProps {
  selectedIndustrySegments: string[];
  onAddIndustrySegment: (value: string) => void;
  onRemoveIndustrySegment: (value: string) => void;
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  formData: FormData;
  onFormDataUpdate: (field: string, value: string | string[]) => void;
  invalidFields: Set<string>;
}

const BasicInformationTab: React.FC<BasicInformationTabProps> = ({
  selectedIndustrySegments,
  onAddIndustrySegment,
  onRemoveIndustrySegment,
  providerType,
  onProviderTypeChange,
  formData,
  onFormDataUpdate,
  invalidFields
}) => {
  return (
    <TabsContent value="basic-details" className="space-y-8">
      <form className="space-y-8">
        <IndustrySegmentSection
          selectedIndustrySegments={selectedIndustrySegments}
          onAddIndustrySegment={onAddIndustrySegment}
          onRemoveIndustrySegment={onRemoveIndustrySegment}
        />

        <Separator />

        {/* Solution Provider Enrollment Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Solution Provider Enrollment Details</h3>
          
          {/* Individual/Institution Selection */}
          <div className="space-y-3">
            <Label>Provider Type *</Label>
            <RadioGroup value={providerType} onValueChange={onProviderTypeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="institution" id="institution" />
                <Label htmlFor="institution">Institution</Label>
              </div>
            </RadioGroup>
            {invalidFields.has('providerType') && (
              <p className="text-sm text-destructive">Provider Type is required</p>
            )}
          </div>

          {/* Institution Details */}
          {providerType === 'institution' && (
            <InstitutionDetailsSection
              formData={formData}
              updateFormData={onFormDataUpdate}
              invalidFields={invalidFields}
            />
          )}
        </div>

        <Separator />

        <ProviderDetailsSection
          formData={formData}
          updateFormData={onFormDataUpdate}
          invalidFields={invalidFields}
        />

        <BankingDetailsSection
          formData={formData}
          updateFormData={onFormDataUpdate}
        />

        <Separator />

        <AdditionalInfoSection
          formData={formData}
          updateFormData={onFormDataUpdate}
        />
      </form>
    </TabsContent>
  );
};

export default BasicInformationTab;
