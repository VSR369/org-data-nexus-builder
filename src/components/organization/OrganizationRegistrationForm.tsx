import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import { useOrganizationRegistration } from '@/hooks/useOrganizationRegistration';
import { OrganizationPreview } from './OrganizationPreview';
import { useToast } from '@/hooks/use-toast';

type FormStep = 'form' | 'preview' | 'success';

export const OrganizationRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('form');
  const [registrationResult, setRegistrationResult] = useState<{ organizationId?: string; error?: string }>({});
  const { toast } = useToast();

  const {
    formData,
    errors,
    isLoading,
    countries,
    organizationTypes,
    entityTypes,
    industrySegments,
    masterDataLoading,
    handleInputChange,
    handleFileChange,
    validateForm,
    submitRegistration
  } = useOrganizationRegistration();

  // Calculate form completion progress
  const calculateProgress = () => {
    const requiredFields = [
      'organizationName', 'organizationTypeId', 'entityTypeId', 'industrySegmentId',
      'countryId', 'address', 'contactPersonName', 'email', 'phoneNumber', 'password', 'confirmPassword'
    ];
    const completedFields = requiredFields.filter(field => formData[field as keyof typeof formData]);
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const handlePreview = () => {
    if (validateForm()) {
      setCurrentStep('preview');
    }
  };

  const handleRegister = async () => {
    const result = await submitRegistration();
    setRegistrationResult(result);
    if (result.success) {
      setCurrentStep('success');
      toast({
        title: "Registration Successful!",
        description: `Your organization has been registered with ID: ${result.organizationId}`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Registration Failed",
        description: result.error || "An error occurred during registration. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleFileInputChange = (field: 'companyProfileDocument' | 'companyLogo') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(field, file);
  };

  if (masterDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading registration form...</div>
      </div>
    );
  }

  if (currentStep === 'preview') {
    return (
      <OrganizationPreview
        formData={formData}
        countries={countries}
        organizationTypes={organizationTypes}
        entityTypes={entityTypes}
        industrySegments={industrySegments}
        onEdit={() => setCurrentStep('form')}
        onRegister={handleRegister}
        isLoading={isLoading}
      />
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Registration Successful!</h2>
              {registrationResult.organizationId && (
                <p className="text-lg mb-4">
                  Your Organization ID: <span className="font-mono font-bold">{registrationResult.organizationId}</span>
                </p>
              )}
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Your registration has been submitted successfully! 
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  <p className="font-semibold mb-2">✅ Ready to Sign In</p>
                  <p>You can now sign in to your organization account using your email and password.</p>
                </div>
                <div className="mt-6">
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = '/organization-signin'}
                  >
                    Sign In to Organization Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organization Registration</h1>
        <p className="text-muted-foreground mb-4">
          Join our platform as a Solution Seeking organization
        </p>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{calculateProgress()}% complete</span>
          </div>
          <Progress value={calculateProgress()} className="w-full" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1: Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  className={errors.organizationName ? 'border-red-500' : ''}
                />
                {errors.organizationName && (
                  <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="organizationId">Organization ID</Label>
                <Input
                  id="organizationId"
                  value="Auto-generated upon registration"
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="organizationType">Organization Type *</Label>
                <Select
                  value={formData.organizationTypeId}
                  onValueChange={(value) => handleInputChange('organizationTypeId', value)}
                >
                  <SelectTrigger className={errors.organizationTypeId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.organizationTypeId && (
                  <p className="text-red-500 text-sm mt-1">{errors.organizationTypeId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="entityType">Entity Type *</Label>
                <Select
                  value={formData.entityTypeId}
                  onValueChange={(value) => handleInputChange('entityTypeId', value)}
                >
                  <SelectTrigger className={errors.entityTypeId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.entityTypeId && (
                  <p className="text-red-500 text-sm mt-1">{errors.entityTypeId}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="industrySegment">Industry Segment *</Label>
                <Select
                  value={formData.industrySegmentId}
                  onValueChange={(value) => handleInputChange('industrySegmentId', value)}
                >
                  <SelectTrigger className={errors.industrySegmentId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select industry segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {industrySegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industrySegmentId && (
                  <p className="text-red-500 text-sm mt-1">{errors.industrySegmentId}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Company Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Company Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyProfile">Company Profile Document</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <Label htmlFor="companyProfile" className="cursor-pointer text-sm">
                    {formData.companyProfileDocument 
                      ? formData.companyProfileDocument.name 
                      : 'Upload PDF/DOC file'
                    }
                  </Label>
                  <Input
                    id="companyProfile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInputChange('companyProfileDocument')}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="companyLogo">Company Logo</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <Label htmlFor="companyLogo" className="cursor-pointer text-sm">
                    {formData.companyLogo 
                      ? formData.companyLogo.name 
                      : 'Upload PNG/JPG file'
                    }
                  </Label>
                  <Input
                    id="companyLogo"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileInputChange('companyLogo')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Contact & Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Contact & Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.countryId}
                onValueChange={(value) => handleInputChange('countryId', value)}
              >
                <SelectTrigger className={errors.countryId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryId && (
                <p className="text-red-500 text-sm mt-1">{errors.countryId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Contact Person Details */}
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Contact Person Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                <Input
                  id="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                  className={errors.contactPersonName ? 'border-red-500' : ''}
                />
                {errors.contactPersonName && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactPersonName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="countryCode">Country Code</Label>
                <Input
                  id="countryCode"
                  value={formData.countryCode}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-between">
          <Button variant="outline" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handlePreview} className="min-w-32" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>
        </div>

        {/* Error Display Section */}
        {Object.keys(errors).length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <h3 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};