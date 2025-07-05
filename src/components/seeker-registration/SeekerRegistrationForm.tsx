import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Building2, User, Phone, MapPin, FileText, Key } from 'lucide-react';
import { useSeekerRegistration } from '@/hooks/useSeekerRegistration';
import OrganizationInfoSection from './OrganizationInfoSection';
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Solution Seeking Organization Registration</h1>
          <p className="text-slate-600 mt-2">Join our platform to connect with solution providers and find innovative solutions for your challenges.</p>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationInfoSection
              formData={formData}
              industrySegments={industrySegments}
              organizationTypes={organizationTypes}
              entityTypes={entityTypes}
              errors={errors}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Contact Person Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Contact Person Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactPersonSection
              formData={formData}
              countries={countries}
              errors={errors}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Contact & Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Contact & Location Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactInfoSection
              formData={formData}
              countries={countries}
              errors={errors}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Document Upload (conditionally shown) */}
        {requiresRegistrationDocuments && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-800 font-medium">Registration Documents Required</p>
                    <p className="text-sm text-orange-700 mt-1">
                      For {formData.entityType} organizations, please upload the required registration documents.
                    </p>
                  </div>
                </div>
              </div>
              <DocumentUploadSection
                formData={formData}
                requiresRegistrationDocuments={requiresRegistrationDocuments}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
              />
            </CardContent>
          </Card>
        )}

        {/* Login Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-600" />
              Login Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                <h3 className="text-lg font-semibold text-indigo-600">Account Setup</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="userId" className={`text-sm font-medium ${errors.userId ? "text-red-500" : "text-slate-700"}`}>
                    User ID *
                  </label>
                  <input
                    id="userId"
                    type="text"
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    placeholder="Choose your User ID"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.userId 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-slate-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.userId && <p className="text-sm text-red-500">{errors.userId}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className={`text-sm font-medium ${errors.password ? "text-red-500" : "text-slate-700"}`}>
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Choose a strong password"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.password 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-slate-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="confirmPassword" className={`text-sm font-medium ${errors.confirmPassword ? "text-red-500" : "text-slate-700"}`}>
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 md:w-1/2 ${
                      errors.confirmPassword 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-slate-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full md:w-auto px-12 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SeekerRegistrationForm;