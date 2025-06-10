
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndustrySegmentSection from './IndustrySegmentSection';
import InstitutionDetailsSection from './InstitutionDetailsSection';
import ProviderDetailsSection from './ProviderDetailsSection';
import BankingDetailsSection from './BankingDetailsSection';
import AdditionalInfoSection from './AdditionalInfoSection';
import ProviderIdSection from './ProviderIdSection';
import { FormData } from './types';

interface BasicInformationTabProps {
  selectedIndustrySegments: string[];
  onAddIndustrySegment: (value: string) => void;
  onRemoveIndustrySegment: (value: string) => void;
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  formData: FormData;
  onFormDataUpdate: (field: string, value: string | string[]) => void;
  invalidFields?: Set<string>;
}

const BasicInformationTab: React.FC<BasicInformationTabProps> = ({
  selectedIndustrySegments,
  onAddIndustrySegment,
  onRemoveIndustrySegment,
  providerType,
  onProviderTypeChange,
  formData,
  onFormDataUpdate,
  invalidFields = new Set()
}) => {
  return (
    <div className="space-y-6">
      <ProviderIdSection providerId={formData.providerId} />
      
      <IndustrySegmentSection
        selectedIndustrySegments={selectedIndustrySegments}
        onAddIndustrySegment={onAddIndustrySegment}
        onRemoveIndustrySegment={onRemoveIndustrySegment}
        providerType={providerType}
        onProviderTypeChange={onProviderTypeChange}
        invalidFields={invalidFields}
      />

      <Tabs defaultValue="provider-details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="provider-details">Provider Details</TabsTrigger>
          <TabsTrigger value="institution-details">Institution Details</TabsTrigger>
          <TabsTrigger value="banking-details">Banking Details</TabsTrigger>
          <TabsTrigger value="additional-info">Additional Info</TabsTrigger>
        </TabsList>

        <TabsContent value="provider-details" className="mt-6">
          <ProviderDetailsSection
            formData={formData}
            updateFormData={onFormDataUpdate}
            invalidFields={invalidFields}
          />
        </TabsContent>

        <TabsContent value="institution-details" className="mt-6">
          <InstitutionDetailsSection
            formData={formData}
            updateFormData={onFormDataUpdate}
            providerType={providerType}
            invalidFields={invalidFields}
          />
        </TabsContent>

        <TabsContent value="banking-details" className="mt-6">
          <BankingDetailsSection
            formData={formData}
            updateFormData={onFormDataUpdate}
          />
        </TabsContent>

        <TabsContent value="additional-info" className="mt-6">
          <AdditionalInfoSection
            formData={formData}
            updateFormData={onFormDataUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BasicInformationTab;
