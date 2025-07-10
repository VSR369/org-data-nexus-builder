
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    contactPersonName: '',
    organizationType: '',
    entityType: '',
    country: '',
    industrySegment: '',
    address: '',
    phoneNumber: '',
    website: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp } = useSupabaseAuth();

  const organizationTypes = [
    'Startup', 'SME', 'Large Enterprise', 'Government', 'NGO', 'Academic Institution'
  ];

  const entityTypes = [
    'Private Limited', 'Public Limited', 'Partnership', 'Sole Proprietorship', 'Government Entity', 'Non-Profit'
  ];

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Singapore'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Energy', 'Agriculture'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
    if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
    if (!formData.entityType) newErrors.entityType = 'Entity type is required';
    if (!formData.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        organization_name: formData.organizationName,
        contact_person_name: formData.contactPersonName,
        organization_type: formData.organizationType,
        entity_type: formData.entityType,
        country: formData.country,
        industry_segment: formData.industrySegment,
        address: formData.address,
        phone_number: formData.phoneNumber,
        website: formData.website
      });

      if (error) {
        setErrors({ submit: error.message });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email and Password Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className={`h-11 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                className={`h-11 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              className={`h-11 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Organization Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700">Organization Name *</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="Enter organization name"
              className={`h-11 ${errors.organizationName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.organizationName && <p className="text-sm text-red-500 mt-1">{errors.organizationName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPersonName" className="text-sm font-medium text-gray-700">Contact Person Name *</Label>
            <Input
              id="contactPersonName"
              value={formData.contactPersonName}
              onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
              placeholder="Enter contact person name"
              className={`h-11 ${errors.contactPersonName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.contactPersonName && <p className="text-sm text-red-500 mt-1">{errors.contactPersonName}</p>}
          </div>
        </div>

        {/* Organization and Entity Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="organizationType" className="text-sm font-medium text-gray-700">Organization Type *</Label>
            <Select value={formData.organizationType} onValueChange={(value) => handleInputChange('organizationType', value)}>
              <SelectTrigger className={`h-11 ${errors.organizationType ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                {organizationTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-gray-50 focus:bg-gray-50">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.organizationType && <p className="text-sm text-red-500 mt-1">{errors.organizationType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entityType" className="text-sm font-medium text-gray-700">Entity Type *</Label>
            <Select value={formData.entityType} onValueChange={(value) => handleInputChange('entityType', value)}>
              <SelectTrigger className={`h-11 ${errors.entityType ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                {entityTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-gray-50 focus:bg-gray-50">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.entityType && <p className="text-sm text-red-500 mt-1">{errors.entityType}</p>}
          </div>
        </div>

        {/* Country and Industry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
              <SelectTrigger className={`h-11 ${errors.country ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem key={country} value={country} className="hover:bg-gray-50 focus:bg-gray-50">
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industrySegment" className="text-sm font-medium text-gray-700">Industry Segment</Label>
            <Select value={formData.industrySegment} onValueChange={(value) => handleInputChange('industrySegment', value)}>
              <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry} className="hover:bg-gray-50 focus:bg-gray-50">
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Enter phone number"
              className="h-11 border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="Enter website URL"
              className="h-11 border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter organization address"
            rows={3}
            className="border-gray-300 focus:border-blue-500 resize-none"
          />
        </div>

        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-sm transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Organization Account'
          )}
        </Button>

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Button variant="link" className="p-0 h-auto text-blue-600 font-medium hover:underline">
              Sign in instead
            </Button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
