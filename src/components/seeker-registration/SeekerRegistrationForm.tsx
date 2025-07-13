import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSeekerRegistration } from '@/hooks/useSeekerRegistration';
// import RobustOrganizationForm from './RobustOrganizationForm'; // Removed - using Supabase only
import ContactPersonSection from './ContactPersonSection';
import ContactInfoSection from './ContactInfoSection';
import DocumentUploadSection from './DocumentUploadSection';

const SeekerRegistrationForm = () => {
  const {
    formData,
    errors,
    countries,
    industrySegments,
    organizationTypes,
    entityTypes,
    requiresRegistrationDocuments,
    handleInputChange,
    handleFileUpload,
    handleFileRemove,
    handleSubmit
  } = useSeekerRegistration();

  const progress = Object.keys(formData).filter(key => {
    const value = formData[key as keyof typeof formData];
    return value && value !== '';
  }).length / Object.keys(formData).length * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Solution Seeking Organization Details</h1>
        <p className="text-sm text-gray-600">Register your organization to access our platform</p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Organization Information */}
        <div>Organization Form - Now using Supabase master data hooks</div>

        {/* Company Documents */}
        <DocumentUploadSection
          formData={formData}
          requiresRegistrationDocuments={requiresRegistrationDocuments}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
        />

        {/* Contact & Location Information */}
        <ContactInfoSection
          formData={formData}
          countries={countries}
          errors={errors}
          onInputChange={handleInputChange}
        />

        {/* Contact Person Details */}
        <ContactPersonSection
          formData={formData}
          countries={countries}
          errors={errors}
          onInputChange={handleInputChange}
        />

        {/* Submit Buttons */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button 
            type="submit" 
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            Register Organization
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SeekerRegistrationForm;