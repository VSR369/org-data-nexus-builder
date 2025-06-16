
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeekerRegistration } from '@/hooks/useSeekerRegistration';

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
              {/* Organization Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <h3 className="text-lg font-semibold text-blue-600">Organization Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industrySegment">Industry Segment *</Label>
                    <Select
                      value={formData.industrySegment}
                      onValueChange={(value) => handleInputChange('industrySegment', value)}
                    >
                      <SelectTrigger>
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
                    {errors.industrySegment && <p className="text-sm text-red-500">{errors.industrySegment}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="Enter organization name"
                    />
                    {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationId">Organization ID</Label>
                    <Input
                      id="organizationId"
                      value={formData.organizationId}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select
                      value={formData.organizationType}
                      onValueChange={(value) => handleInputChange('organizationType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.organizationType && <p className="text-sm text-red-500">{errors.organizationType}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="entityType">Entity Type *</Label>
                    <Select
                      value={formData.entityType}
                      onValueChange={(value) => handleInputChange('entityType', value)}
                    >
                      <SelectTrigger className="md:w-1/2">
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {entityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.entityType && <p className="text-sm text-red-500">{errors.entityType}</p>}
                  </div>
                </div>
              </div>

              {/* Company Documents */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <h3 className="text-lg font-semibold text-blue-600">Company Documents</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Company Profile Document</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('companyProfile', e.target.files)}
                        className="hidden"
                        id="companyProfile"
                        accept=".pdf,.doc,.docx"
                      />
                      <Label htmlFor="companyProfile" className="cursor-pointer text-blue-600 hover:underline">
                        Choose File
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">No file chosen</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('companyLogo', e.target.files)}
                        className="hidden"
                        id="companyLogo"
                        accept="image/*"
                      />
                      <Label htmlFor="companyLogo" className="cursor-pointer text-blue-600 hover:underline">
                        Choose File
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">No file chosen</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Location Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <h3 className="text-lg font-semibold text-blue-600">Contact & Location Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange('country', value)}
                    >
                      <SelectTrigger>
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
                    {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Person Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <h3 className="text-lg font-semibold text-blue-600">Contact Person Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                    <Input
                      id="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPersonName && <p className="text-sm text-red-500">{errors.contactPersonName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email ID *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryCode">Country Code *</Label>
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => handleInputChange('countryCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select code" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.countryCode && <p className="text-sm text-red-500">{errors.countryCode}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter phone number"
                    />
                    {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userId">User ID *</Label>
                    <Input
                      id="userId"
                      value={formData.userId}
                      onChange={(e) => handleInputChange('userId', e.target.value)}
                      placeholder="Enter user ID"
                    />
                    {errors.userId && <p className="text-sm text-red-500">{errors.userId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password"
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm password"
                      className="md:w-1/2"
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
