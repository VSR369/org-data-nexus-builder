
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EnrollmentTabs from './enrollment/EnrollmentTabs';
import BasicInformationTab from './enrollment/BasicInformationTab';
import EnrollmentActions from './enrollment/EnrollmentActions';
import { useFormState } from './enrollment/hooks/useFormState';
import { useEnrollmentSubmission } from './enrollment/hooks/useEnrollmentSubmission';
import { useTabManagement } from './enrollment/hooks/useTabManagement';
import { useFieldValidation } from './enrollment/hooks/useFieldValidation';

const SelfEnrollmentForm = () => {
  const {
    formData,
    updateFormData,
    providerType,
    setProviderType,
    selectedIndustrySegments,
    addIndustrySegment,
    removeIndustrySegment,
    isSubmitted,
    markAsSubmitted,
    resetSubmissionStatus,
    clearDraft,
    saveDraft
  } = useFormState();

  const { activeTab, handleTabChange } = useTabManagement();

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
    selectedIndustrySegments,
    false, // No competency ratings needed
    isSubmitted,
    validateAndHighlightFields,
    markAsSubmitted,
    resetSubmissionStatus,
    () => {
      console.log('Enrollment submitted successfully - data preserved for future edits');
    }
  );

  console.log('SelfEnrollmentForm - selectedIndustrySegments:', selectedIndustrySegments);
  console.log('SelfEnrollmentForm - providerType:', providerType);
  console.log('SelfEnrollmentForm - isSubmitted:', isSubmitted);
  console.log('SelfEnrollmentForm - invalidFields:', Array.from(invalidFields));

  const handleAddIndustrySegment = (value: string) => {
    console.log('Industry segment added:', value);
    addIndustrySegment(value);
    clearFieldValidation('industrySegment');
  };

  const handleRemoveIndustrySegment = (value: string) => {
    console.log('Industry segment removed:', value);
    removeIndustrySegment(value);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solution Provider Enrollment</CardTitle>
          <CardDescription>
            Register as a Solution Provider to showcase your expertise and connect with organizations
            {isSubmitted && (
              <span className="block mt-2 text-green-600 font-medium">
                ✓ Successfully submitted! Your data is preserved and you can edit and resubmit anytime.
              </span>
            )}
            {!isSubmitted && selectedIndustrySegments.length > 0 && (
              <span className="block mt-2 text-blue-600 font-medium">
                💾 Your data is automatically saved. You can safely refresh or return later to continue.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <BasicInformationTab
              selectedIndustrySegments={selectedIndustrySegments}
              onAddIndustrySegment={handleAddIndustrySegment}
              onRemoveIndustrySegment={handleRemoveIndustrySegment}
              providerType={providerType}
              onProviderTypeChange={handleProviderTypeChange}
              formData={formData}
              onFormDataUpdate={handleFormDataUpdate}
              invalidFields={invalidFields}
            />
            
            <EnrollmentActions
              onSubmitEnrollment={isSubmitted ? handleResubmit : handleSubmitEnrollment}
              onSaveDraft={saveDraft}
              isSubmitted={isSubmitted}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
