
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building, Upload, Globe, Users, Phone, Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { countriesDataManager } from '@/utils/sharedDataManagers';
import { DataManager } from '@/utils/dataManager';
import { industrySegmentDataManager } from '@/components/master-data/industry-segments/industrySegmentDataManager';

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

interface IndustrySegment {
  id: string;
  industrySegment: string;
  description?: string;
}

interface FormData {
  industrySegment: string;
  organizationName: string;
  organizationId: string;
  entityType: string;
  registrationDocuments: File[];
  companyProfile: File | null;
  companyLogo: File | null;
  website: string;
  country: string;
  address: string;
  contactPersonName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  userId: string;
  password: string;
  confirmPassword: string;
}

// Data manager for entity types
const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'],
  version: 1
});

const SeekerRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    industrySegment: '',
    organizationName: '',
    organizationId: generateOrganizationId(),
    entityType: '',
    registrationDocuments: [],
    companyProfile: null,
    companyLogo: null,
    website: '',
    country: '',
    address: '',
    contactPersonName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    userId: '',
    password: '',
    confirmPassword: ''
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // Generate unique organization ID
  function generateOrganizationId(): string {
    return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  // Load master data
  useEffect(() => {
    const loadedCountries = countriesDataManager.loadData();
    const loadedIndustrySegmentData = industrySegmentDataManager.loadData();
    const loadedEntityTypes = entityTypeDataManager.loadData();

    console.log('🔍 SeekerRegistration - Loaded industry segment data from master data:', loadedIndustrySegmentData);
    console.log('🔍 SeekerRegistration - Loaded countries from master data:', loadedCountries);
    console.log('🔍 SeekerRegistration - Loaded entity types from master data:', loadedEntityTypes);

    setCountries(loadedCountries);
    // Extract the industrySegments array from the loaded data structure
    setIndustrySegments(loadedIndustrySegmentData.industrySegments || []);
    setEntityTypes(loadedEntityTypes);
  }, []);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // URL is optional
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required field validations
    if (!formData.industrySegment) newErrors.industrySegment = 'Industry segment is required';
    if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
    if (!formData.entityType) newErrors.entityType = 'Entity type is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.countryCode) newErrors.countryCode = 'Country code is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // URL validation
    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    // Phone number validation
    if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must contain only digits';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', files: FileList | null) => {
    if (!files) return;

    if (field === 'registrationDocuments') {
      const newFiles = Array.from(files).slice(0, 3);
      setFormData(prev => ({ ...prev, registrationDocuments: newFiles }));
    } else {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // Save registered user data to localStorage for login authentication
    try {
      const registeredUser = {
        userId: formData.userId,
        password: formData.password,
        organizationName: formData.organizationName,
        entityType: formData.entityType,
        country: formData.country,
        email: formData.email,
        contactPersonName: formData.contactPersonName,
        industrySegment: formData.industrySegment,
        organizationId: formData.organizationId
      };

      // Get existing registered users or create new array
      const existingUsersData = localStorage.getItem('registered_users');
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];
      
      // Check if user already exists
      const userExists = existingUsers.find((user: any) => user.userId === formData.userId);
      if (userExists) {
        toast({
          title: "Registration Error",
          description: "User ID already exists. Please choose a different User ID.",
          variant: "destructive",
        });
        return;
      }

      // Add new user to the list
      existingUsers.push(registeredUser);
      
      // Save back to localStorage
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));
      
      console.log('💾 Saved registered user to localStorage:', registeredUser);
      console.log('📋 All registered users:', existingUsers);
      
    } catch (error) {
      console.error('❌ Error saving registration data:', error);
    }

    // Here you would typically submit to your backend
    console.log('Form submitted:', formData);
    
    toast({
      title: "Registration Submitted",
      description: "Your organization registration has been submitted successfully! You can now login with your credentials.",
    });
  };

  const requiresRegistrationDocuments = ['Non-Profit Organization', 'Society', 'Trust'].includes(formData.entityType);

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
              {/* Organization Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="industrySegment">Industry Segment *</Label>
                    <Select value={formData.industrySegment} onValueChange={(value) => handleInputChange('industrySegment', value)}>
                      <SelectTrigger className={errors.industrySegment ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select industry segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {industrySegments.map((segment) => (
                          <SelectItem key={segment.id} value={segment.industrySegment}>
                            {segment.industrySegment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.industrySegment && <p className="text-red-500 text-sm mt-1">{errors.industrySegment}</p>}
                  </div>

                  <div>
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      className={errors.organizationName ? 'border-red-500' : ''}
                      placeholder="Enter organization name"
                    />
                    {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="organizationId">Organization ID</Label>
                    <Input
                      id="organizationId"
                      value={formData.organizationId}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="entityType">Entity Type *</Label>
                    <Select value={formData.entityType} onValueChange={(value) => handleInputChange('entityType', value)}>
                      <SelectTrigger className={errors.entityType ? 'border-red-500' : ''}>
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
                    {errors.entityType && <p className="text-red-500 text-sm mt-1">{errors.entityType}</p>}
                  </div>
                </div>
              </div>

              {/* Registration Documents (Conditional) */}
              {requiresRegistrationDocuments && (
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Registration Documents
                  </h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <Label htmlFor="registrationDocuments">Upload Registration Certificate and Supporting Documents (Max 3 files)</Label>
                    <Input
                      id="registrationDocuments"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('registrationDocuments', e.target.files)}
                      className="mt-2"
                    />
                    {formData.registrationDocuments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected files:</p>
                        <ul className="text-sm text-gray-500">
                          {formData.registrationDocuments.map((file, index) => (
                            <li key={index}>• {file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* File Uploads */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Company Documents
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyProfile">Company Profile Document</Label>
                    <Input
                      id="companyProfile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload('companyProfile', e.target.files)}
                      className="mt-2"
                    />
                    {formData.companyProfile && <p className="text-sm text-gray-500 mt-1">Selected: {formData.companyProfile.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="companyLogo">Company Logo</Label>
                    <Input
                      id="companyLogo"
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      onChange={(e) => handleFileUpload('companyLogo', e.target.files)}
                      className="mt-2"
                    />
                    {formData.companyLogo && <p className="text-sm text-gray-500 mt-1">Selected: {formData.companyLogo.name}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Contact & Location Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className={errors.website ? 'border-red-500' : ''}
                      placeholder="https://www.example.com"
                    />
                    {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.name}>
                            {country.name} ({country.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'border-red-500' : ''}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Person Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                    <Input
                      id="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                      className={errors.contactPersonName ? 'border-red-500' : ''}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPersonName && <p className="text-red-500 text-sm mt-1">{errors.contactPersonName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email ID *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="countryCode">Country Code *</Label>
                    <Select value={formData.countryCode} onValueChange={(value) => handleInputChange('countryCode', value)}>
                      <SelectTrigger className={errors.countryCode ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select code" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.code}>
                            +{country.code} ({country.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.countryCode && <p className="text-red-500 text-sm mt-1">{errors.countryCode}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className={`pl-10 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="userId">User ID *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="userId"
                        value={formData.userId}
                        onChange={(e) => handleInputChange('userId', e.target.value)}
                        className={`pl-10 ${errors.userId ? 'border-red-500' : ''}`}
                        placeholder="Enter user ID"
                      />
                    </div>
                    {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Enter password"
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Confirm password"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
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

export default SeekerRegistration;
