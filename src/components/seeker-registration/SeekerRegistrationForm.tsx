
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeekerRegistration } from '@/hooks/useSeekerRegistration';
import OrganizationInfoSection from './OrganizationInfoSection';
import DocumentUploadSection from './DocumentUploadSection';
import ContactInfoSection from './ContactInfoSection';
import ContactPersonSection from './ContactPersonSection';

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
    handleSubmit
  } = useSeekerRegistration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link to="/signup">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold">Solution Seeking Organization Details</CardTitle>
                  <p className="text-muted-foreground">Register your organization to start seeking solutions</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <OrganizationInfoSection
                formData={formData}
                industrySegments={industrySegments}
                organizationTypes={organizationTypes}
                entityTypes={entityTypes}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <DocumentUploadSection
                formData={formData}
                requiresRegistrationDocuments={requiresRegistrationDocuments}
                onFileUpload={handleFileUpload}
              />

              <ContactInfoSection
                formData={formData}
                countries={countries}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <ContactPersonSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Register Organization
                </Button>
                <Link to="/signup">
                  <Button type="button" variant="outline" className="px-8">
                    Back
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerRegistrationForm;
