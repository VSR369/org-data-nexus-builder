import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const handleProviderRoleChange = (role: string, checked: boolean) => {
    const currentRoles = formData.providerRoles || [];
    
    if (role === 'both') {
      // If "Both" is selected, set both roles or clear all
      if (checked) {
        onFormDataUpdate('providerRoles', ['solution-provider', 'solution-assessor']);
      } else {
        onFormDataUpdate('providerRoles', []);
      }
    } else {
      // Handle individual role selection
      let newRoles;
      if (checked) {
        newRoles = [...currentRoles.filter(r => r !== 'both'), role];
      } else {
        newRoles = currentRoles.filter(r => r !== role && r !== 'both');
      }
      
      // If both individual roles are selected, also check "both"
      if (newRoles.includes('solution-provider') && newRoles.includes('solution-assessor')) {
        newRoles = ['solution-provider', 'solution-assessor', 'both'];
      }
      
      onFormDataUpdate('providerRoles', newRoles);
    }
  };

  const handleInstitutionTabClick = () => {
    if (providerType === 'individual') {
      toast({
        title: "Institution Details Not Available",
        description: "You have chosen as an individual solution provider. Institution details are only available for organizations.",
        variant: "default"
      });
    }
  };

  const currentRoles = formData.providerRoles || [];
  const isBothSelected = currentRoles.includes('both') || 
    (currentRoles.includes('solution-provider') && currentRoles.includes('solution-assessor'));

  const isInstitutionTabDisabled = providerType === 'individual';

  return (
    <div className="space-y-6">
      {/* Provider Role Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Role</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select your role(s) on the platform
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="solution-provider"
              checked={currentRoles.includes('solution-provider')}
              onCheckedChange={(checked) => 
                handleProviderRoleChange('solution-provider', checked as boolean)
              }
              className={invalidFields.has('providerRoles') ? 'border-destructive' : ''}
            />
            <Label htmlFor="solution-provider" className="font-normal">
              Solution Provider
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="solution-assessor"
              checked={currentRoles.includes('solution-assessor')}
              onCheckedChange={(checked) => 
                handleProviderRoleChange('solution-assessor', checked as boolean)
              }
              className={invalidFields.has('providerRoles') ? 'border-destructive' : ''}
            />
            <Label htmlFor="solution-assessor" className="font-normal">
              Solution Assessor
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="both-roles"
              checked={isBothSelected}
              onCheckedChange={(checked) => 
                handleProviderRoleChange('both', checked as boolean)
              }
              className={invalidFields.has('providerRoles') ? 'border-destructive' : ''}
            />
            <Label htmlFor="both-roles" className="font-normal">
              Both
            </Label>
          </div>
        </div>
        
        {invalidFields.has('providerRoles') && (
          <p className="text-sm text-destructive">Please select at least one provider role</p>
        )}
      </div>

      <IndustrySegmentSection
        selectedIndustrySegments={selectedIndustrySegments}
        onAddIndustrySegment={onAddIndustrySegment}
        onRemoveIndustrySegment={onRemoveIndustrySegment}
        providerType={providerType}
        onProviderTypeChange={onProviderTypeChange}
        invalidFields={invalidFields}
        providerRoles={formData.providerRoles}
      />

      <Tabs defaultValue="provider-details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="provider-details">Provider Details</TabsTrigger>
          <TabsTrigger 
            value="institution-details" 
            disabled={isInstitutionTabDisabled}
            onClick={handleInstitutionTabClick}
            className={isInstitutionTabDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Institution Details
          </TabsTrigger>
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
            providerType={providerType}
            invalidFields={invalidFields}
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
