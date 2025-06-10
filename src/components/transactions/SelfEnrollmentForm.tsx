
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
import { useFormState } from './enrollment/hooks/useFormState';
import { useEnrollmentSubmission } from './enrollment/hooks/useEnrollmentSubmission';
import { useTabManagement } from './enrollment/hooks/useTabManagement';

const SelfEnrollmentForm = () => {
  const {
    formData,
    updateFormData,
    providerType,
    setProviderType,
    selectedIndustrySegment,
    setSelectedIndustrySegment,
    isBasicDetailsComplete,
    clearDraft,
    saveDraft
  } = useFormState();

  const { activeTab, showValidationError, handleTabChange } = useTabManagement(isBasicDetailsComplete);

  const {
    handleSubmitEnrollment
  } = useEnrollmentSubmission(isBasicDetailsComplete, true, clearDraft); // Set competency as always complete

  console.log('SelfEnrollmentForm - selectedIndustrySegment:', selectedIndustrySegment);
  console.log('SelfEnrollmentForm - providerType:', providerType);
  console.log('SelfEnrollmentForm - isBasicDetailsComplete:', isBasicDetailsComplete);

  const handleIndustrySegmentChange = (value: string) => {
    console.log('Industry segment changed to:', value);
    setSelectedIndustrySegment(value);
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
                    <RadioGroup value={providerType} onValueChange={setProviderType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">Individual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="institution" id="institution" />
                        <Label htmlFor="institution">Institution</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Institution Details */}
                  {providerType === 'institution' && (
                    <InstitutionDetailsSection
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                </div>

                <Separator />

                <ProviderDetailsSection
                  formData={formData}
                  updateFormData={updateFormData}
                />

                <BankingDetailsSection
                  formData={formData}
                  updateFormData={updateFormData}
                />

                <Separator />

                <AdditionalInfoSection
                  formData={formData}
                  updateFormData={updateFormData}
                />

                <div className="flex gap-4 pt-6">
                  <Button 
                    type="button" 
                    onClick={handleSubmitEnrollment}
                    className="flex-1"
                    disabled={!isBasicDetailsComplete}
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
                {!isBasicDetailsComplete && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please complete all required fields before submitting.
                  </p>
                )}
              </form>
            </TabsContent>
            
            <TabsContent value="core-competencies" className="space-y-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Core Competencies Assessment</h3>
                <p className="text-muted-foreground">
                  This section will allow you to showcase your expertise and competencies.
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Core competencies content will be implemented here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
