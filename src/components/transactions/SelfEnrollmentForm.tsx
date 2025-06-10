
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EnrollmentTabs from './enrollment/EnrollmentTabs';
import BasicInformationTab from './enrollment/BasicInformationTab';
import CoreCompetenciesTab from './enrollment/CoreCompetenciesTab';
import EnrollmentActions from './enrollment/EnrollmentActions';
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
    isSubmitted,
    markAsSubmitted,
    resetSubmissionStatus,
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
    handleSubmitEnrollment,
    handleResubmit
  } = useEnrollmentSubmission(
    formData,
    providerType,
    selectedIndustrySegment,
    hasCompetencyRatings(),
    isSubmitted,
    validateAndHighlightFields,
    markAsSubmitted,
    resetSubmissionStatus,
    () => {
      clearDraft();
      clearCompetencyData();
      clearAllValidation();
    }
  );

  console.log('SelfEnrollmentForm - selectedIndustrySegment:', selectedIndustrySegment);
  console.log('SelfEnrollmentForm - providerType:', providerType);
  console.log('SelfEnrollmentForm - hasCompetencyRatings:', hasCompetencyRatings());
  console.log('SelfEnrollmentForm - isSubmitted:', isSubmitted);
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
    // Reset submission status if user modifies data after submission
    if (isSubmitted) {
      resetSubmissionStatus();
    }
  };

  const handleCompetencyUpdate = (domainGroup: string, category: string, subCategory: string, rating: number) => {
    updateCompetencyData(domainGroup, category, subCategory, rating);
    // Reset submission status if user modifies competency data after submission
    if (isSubmitted) {
      resetSubmissionStatus();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solution Provider Enrollment</CardTitle>
          <CardDescription>
            Register as a Solution Provider to showcase your expertise and connect with organizations
            {isSubmitted && (
              <span className="block mt-2 text-green-600 font-medium">
                ✓ Successfully submitted! You can still modify and resubmit if needed.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnrollmentTabs activeTab={activeTab} onTabChange={handleTabChange}>
            <BasicInformationTab
              selectedIndustrySegment={selectedIndustrySegment}
              onIndustrySegmentChange={handleIndustrySegmentChange}
              providerType={providerType}
              onProviderTypeChange={handleProviderTypeChange}
              formData={formData}
              onFormDataUpdate={handleFormDataUpdate}
              invalidFields={invalidFields}
            />
            
            <CoreCompetenciesTab
              selectedIndustrySegment={selectedIndustrySegment}
              competencyData={competencyData}
              updateCompetencyData={handleCompetencyUpdate}
            />
            
            <EnrollmentActions
              onSubmitEnrollment={isSubmitted ? handleResubmit : handleSubmitEnrollment}
              onSaveDraft={saveDraft}
              isSubmitted={isSubmitted}
            />
          </EnrollmentTabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
