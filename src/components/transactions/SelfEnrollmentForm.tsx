
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import IndustrySegmentSection from './enrollment/IndustrySegmentSection';
import InstitutionDetailsSection from './enrollment/InstitutionDetailsSection';
import ProviderDetailsSection from './enrollment/ProviderDetailsSection';
import BankingDetailsSection from './enrollment/BankingDetailsSection';
import AdditionalInfoSection from './enrollment/AdditionalInfoSection';
import { useFormState } from './enrollment/hooks/useFormState';
import { useEnrollmentSubmission } from './enrollment/hooks/useEnrollmentSubmission';

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
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
