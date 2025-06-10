
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndustrySegmentSection from './enrollment/IndustrySegmentSection';
import InstitutionDetailsSection from './enrollment/InstitutionDetailsSection';
import ProviderDetailsSection from './enrollment/ProviderDetailsSection';
import BankingDetailsSection from './enrollment/BankingDetailsSection';
import AdditionalInfoSection from './enrollment/AdditionalInfoSection';
import CompetencyAssessmentTab from './enrollment/CompetencyAssessmentTab';
import { useFormState } from './enrollment/hooks/useFormState';
import { useCompetencyState } from './enrollment/hooks/useCompetencyState';
import { useEnrollmentSubmission } from './enrollment/hooks/useEnrollmentSubmission';
import { useTabManagement } from './enrollment/hooks/useTabManagement';
import { useFieldValidation } from './enrollment/hooks/useFieldValidation';

const SelfEnrollmentForm = () => {
  const {
    formData,
    updateFormData,
    providerType,
    setProviderType,
    selectedIndustrySegment,
    setSelectedIndustrySegment,
    clearDraft,
    saveDraft
  } = useFormState();

  const {
    competencyData,
    updateCompetencyData,
    hasCompetencyRatings,
    clearCompetencyData
  } = useCompetencyState();

  const { activeTab, handleTabChange } = useTabManagement(selectedIndustrySegment);

  const {
    invalidFields,
    validateAndHighlightFields,
    clearFieldValidation,
    clearAllValidation
  } = useFieldValidation();

  const {
    handleSubmitEnrollment
  } = useEnrollmentSubmission(
    formData,
    providerType,
    selectedIndustrySegment,
    hasCompetencyRatings(),
    validateAndHighlightFields,
    () => {
      clearDraft();
      clearCompetencyData();
      clearAllValidation();
    }
  );

  console.log('SelfEnrollmentForm - selectedIndustrySegment:', selectedIndustrySegment);
  console.log('SelfEnrollmentForm - providerType:', providerType);
  console.log('SelfEnrollmentForm - hasCompetencyRatings:', hasCompetencyRatings());
  console.log('SelfEnrollmentForm - invalidFields:', Array.from(invalidFields));

  const handleIndustrySegmentChange = (value: string) => {
    console.log('Industry segment changed to:', value);
    setSelectedIndustrySegment(value);
    clearFieldValidation('industrySegment');
  };

  const handleProviderTypeChange = (value: string) => {
    setProviderType(value);
    clearFieldValidation('providerType');
  };

  const handleFormDataUpdate = (field: string, value: string | string[]) => {
    updateFormData(field, value);
    clearFieldValidation(field);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solution Provider Enrollment</CardTitle>
          <CardDescription>
            Register as a Solution Provider to showcase your expertise and connect with organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic-details">Basic Information</TabsTrigger>
              <TabsTrigger value="core-competencies">Core Competencies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-details" className="space-y-8">
              <form className="space-y-8">
                <IndustrySegmentSection
                  selectedIndustrySegment={selectedIndustrySegment}
                  onIndustrySegmentChange={handleIndustrySegmentChange}
                />

                <Separator />

                {/* Solution Provider Enrollment Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Solution Provider Enrollment Details</h3>
                  
                  {/* Individual/Institution Selection */}
                  <div className="space-y-3">
                    <Label>Provider Type *</Label>
                    <RadioGroup value={providerType} onValueChange={handleProviderTypeChange}>
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
                      updateFormData={handleFormDataUpdate}
                      invalidFields={invalidFields}
                    />
                  )}
                </div>

                <Separator />

                <ProviderDetailsSection
                  formData={formData}
                  updateFormData={handleFormDataUpdate}
                  invalidFields={invalidFields}
                />

                <BankingDetailsSection
                  formData={formData}
                  updateFormData={handleFormDataUpdate}
                />

                <Separator />

                <AdditionalInfoSection
                  formData={formData}
                  updateFormData={handleFormDataUpdate}
                />

                <div className="flex gap-4 pt-6">
                  <Button 
                    type="button" 
                    onClick={handleSubmitEnrollment}
                    className="flex-1"
                  >
                    Submit Enrollment
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={saveDraft}
                  >
                    Save as Draft
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="core-competencies" className="space-y-6">
              <CompetencyAssessmentTab
                selectedIndustrySegment={selectedIndustrySegment}
                competencyData={competencyData}
                updateCompetencyData={updateCompetencyData}
              />
              
              <div className="flex gap-4 pt-6">
                <Button 
                  type="button" 
                  onClick={handleSubmitEnrollment}
                  className="flex-1"
                >
                  Submit Enrollment
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={saveDraft}
                >
                  Save as Draft
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
