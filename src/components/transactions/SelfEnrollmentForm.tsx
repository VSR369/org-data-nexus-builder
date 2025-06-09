
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import SolutionProviderCompetencyTab from './SolutionProviderCompetencyTab';
import IndustrySegmentSection from './enrollment/IndustrySegmentSection';
import InstitutionDetailsSection from './enrollment/InstitutionDetailsSection';
import ProviderDetailsSection from './enrollment/ProviderDetailsSection';
import BankingDetailsSection from './enrollment/BankingDetailsSection';
import AdditionalInfoSection from './enrollment/AdditionalInfoSection';
import { useFormState } from './enrollment/hooks/useFormState';
import { useTabManagement } from './enrollment/hooks/useTabManagement';
import { useEnrollmentSubmission } from './enrollment/hooks/useEnrollmentSubmission';

const SelfEnrollmentForm = () => {
  const [competencyCompleted, setCompetencyCompleted] = useState(false);

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

  const {
    activeTab,
    showValidationError,
    handleTabChange
  } = useTabManagement(isBasicDetailsComplete);

  const {
    handleSubmitEnrollment
  } = useEnrollmentSubmission(isBasicDetailsComplete, competencyCompleted, clearDraft);

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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic-details">Basic Details & Information</TabsTrigger>
              <TabsTrigger 
                value="competency-assessment" 
                disabled={!isBasicDetailsComplete}
                className="data-[state=disabled]:opacity-50 data-[state=disabled]:cursor-not-allowed"
              >
                Competency Assessment
                {!isBasicDetailsComplete && <AlertCircle className="w-4 h-4 ml-2" />}
              </TabsTrigger>
            </TabsList>

            {showValidationError && !isBasicDetailsComplete && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please complete all required fields (marked with *) in Basic Details & Information to access Competency Assessment.
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="basic-details">
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
                    disabled={!isBasicDetailsComplete || !competencyCompleted}
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

            <TabsContent value="competency-assessment">
              <SolutionProviderCompetencyTab 
                selectedIndustrySegment={selectedIndustrySegment}
                onCompetencyComplete={setCompetencyCompleted}
                onSubmitEnrollment={handleSubmitEnrollment}
                onSaveDraft={saveDraft}
                isSubmitEnabled={isBasicDetailsComplete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
