
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, Eye, EyeOff, X } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseMasterData } from '@/hooks/useSupabaseMasterData';
import { useSeekerValidation } from '@/hooks/useSeekerValidation';
import { generateOrganizationId } from '@/utils/seekerUserStorage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface FormData {
  // Organization Information
  organizationName: string;
  organizationId: string;
  organizationType: string;
  entityType: string;
  
  // Documents
  registrationDocuments: File[];
  companyProfile: File[];
  companyLogo: File[];
  
  // Contact & Location
  website: string;
  country: string;
  address: string;
  
  // Contact Person Details
  contactPersonName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  
  // Authentication
  password: string;
  confirmPassword: string;
}

const SignUpForm = () => {
  const { signUp } = useSupabaseAuth();
  const { validateForm } = useSeekerValidation();
  const navigate = useNavigate();
  const {
    countries,
    organizationTypes,
    entityTypes,
    isLoading: masterDataLoading,
    error: masterDataError
  } = useSupabaseMasterData();

  const [formData, setFormData] = useState<FormData>({
    organizationName: '',
    organizationId: generateOrganizationId(),
    organizationType: '',
    entityType: '',
    registrationDocuments: [],
    companyProfile: [],
    companyLogo: [],
    website: '',
    country: '',
    address: '',
    contactPersonName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate country code when country is selected
  useEffect(() => {
    if (formData.country && countries.length > 0) {
      const selectedCountry = countries.find(country => country.name === formData.country);
      if (selectedCountry && selectedCountry.code) {
        // Map country codes to phone codes
        const phoneCodeMap: { [key: string]: string } = {
          'IN': '+91',
          'US': '+1',
          'AE': '+971',
          'GB': '+44',
          'CA': '+1',
          'AU': '+61',
          'DE': '+49',
          'FR': '+33',
          'JP': '+81',
          'CN': '+86',
          'BR': '+55',
          'MX': '+52',
          'SG': '+65',
          'MY': '+60',
          'TH': '+66',
          'ID': '+62',
          'PH': '+63',
          'VN': '+84',
          'KR': '+82',
          'TW': '+886'
        };
        
        const phoneCode = phoneCodeMap[selectedCountry.code] || '+1';
        setFormData(prev => ({ ...prev, countryCode: phoneCode }));
        
        // Clear any existing error for countryCode
        if (errors.countryCode) {
          setErrors(prev => ({ ...prev, countryCode: '' }));
        }
      }
    }
  }, [formData.country, countries, errors.countryCode]);

  // Calculate progress - exclude file arrays and confirmation field
  const totalFields = Object.keys(formData).length - 4; // Exclude file arrays and confirmPassword
  const filledFields = Object.entries(formData).filter(([key, value]) => {
    if (key.includes('Documents') || key.includes('Logo') || key.includes('Profile') || key === 'confirmPassword') return true;
    return value && value !== '';
  }).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setFormData(prev => ({ 
      ...prev, 
      [field]: [...prev[field], ...newFiles]
    }));
  };

  const handleFileRemove = (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const requiresRegistrationDocuments = ['Non-Profit Organization', 'Society', 'Trust'].includes(formData.entityType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (masterDataLoading) {
      setErrors({ submit: 'Please wait for master data to load' });
      return;
    }

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔐 Starting registration process...');
      
      // Prepare additional data for profile creation
      const additionalData = {
        organizationName: formData.organizationName,
        organizationId: formData.organizationId,
        organizationType: formData.organizationType,
        entityType: formData.entityType,
        contactPersonName: formData.contactPersonName,
        country: formData.country,
        countryCode: formData.countryCode,
        address: formData.address,
        website: formData.website,
        phoneNumber: formData.phoneNumber
      };

      console.log('📝 Registration data prepared:', { 
        email: formData.email, 
        additionalData: { ...additionalData, password: '[REDACTED]' }
      });

      const { error } = await signUp(formData.email, formData.password, additionalData);

      if (error) {
        console.error('❌ Registration failed:', error);
        setErrors({ submit: error.message });
      } else {
        console.log('✅ Registration successful!');
        toast.success('Registration successful! Please check your email to confirm your account, then sign in.');
        
        // Redirect to sign-in page
        navigate('/auth');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setErrors({ submit: 'An unexpected error occurred during registration' });
    } finally {
      setIsLoading(false);
    }
  };

  if (masterDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration form...</p>
        </div>
      </div>
    );
  }

  if (masterDataError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading master data: {masterDataError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with Progress */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Solution Seeking Organization Registration</h1>
        <p className="text-gray-600 mb-4">Register your organization to access our platform</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Organization Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <h3 className="text-lg font-semibold text-blue-600">Organization Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className={errors.organizationName ? "text-red-500" : ""}>Organization Name *</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder="Enter organization name"
                className={errors.organizationName ? "border-red-500" : ""}
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
              <Label htmlFor="organizationType" className={errors.organizationType ? "text-red-500" : ""}>Organization Type *</Label>
              <Select value={formData.organizationType} onValueChange={(value) => handleInputChange('organizationType', value)}>
                <SelectTrigger className={errors.organizationType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  {organizationTypes.map((type) => (
                    <SelectItem key={type} value={type} className="hover:bg-gray-50">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organizationType && <p className="text-sm text-red-500">{errors.organizationType}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="entityType" className={errors.entityType ? "text-red-500" : ""}>Entity Type *</Label>
              <Select value={formData.entityType} onValueChange={(value) => handleInputChange('entityType', value)}>
                <SelectTrigger className={`md:w-1/2 ${errors.entityType ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  {entityTypes.map((type) => (
                    <SelectItem key={type} value={type} className="hover:bg-gray-50">
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
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <h3 className="text-lg font-semibold text-blue-600">Company Documents</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requiresRegistrationDocuments && (
              <div className="space-y-2 md:col-span-2">
                <Label>Registration Documents *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload('registrationDocuments', e.target.files)}
                    className="hidden"
                    id="registrationDocuments"
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
                  <Label htmlFor="registrationDocuments" className="cursor-pointer text-blue-600 hover:underline">
                    Choose Files
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">Required for Non-Profit Organization, Society, or Trust</p>
                </div>
                {formData.registrationDocuments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.registrationDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileRemove('registrationDocuments', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
                  multiple
                />
                <Label htmlFor="companyProfile" className="cursor-pointer text-blue-600 hover:underline">
                  Choose Files
                </Label>
              </div>
              {formData.companyProfile.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.companyProfile.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileRemove('companyProfile', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
                  multiple
                />
                <Label htmlFor="companyLogo" className="cursor-pointer text-blue-600 hover:underline">
                  Choose Files
                </Label>
              </div>
              {formData.companyLogo.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.companyLogo.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileRemove('companyLogo', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact & Location Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <h3 className="text-lg font-semibold text-blue-600">Contact & Location Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="country" className={errors.country ? "text-red-500" : ""}>Country *</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                 <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name} className="hover:bg-gray-50">
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
            </div>
          </div>
        </div>

        {/* Contact Person Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <h3 className="text-lg font-semibold text-blue-600">Contact Person Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonName" className={errors.contactPersonName ? "text-red-500" : ""}>Contact Person Name *</Label>
              <Input
                id="contactPersonName"
                value={formData.contactPersonName}
                onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                placeholder="Enter contact person name"
                className={errors.contactPersonName ? "border-red-500" : ""}
              />
              {errors.contactPersonName && <p className="text-sm text-red-500">{errors.contactPersonName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email ID *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryCode" className={errors.countryCode ? "text-red-500" : ""}>Country Code *</Label>
              <Input
                id="countryCode"
                value={formData.countryCode}
                readOnly
                className="bg-gray-100"
                placeholder="Auto-populated based on country selection"
              />
              {errors.countryCode && <p className="text-sm text-red-500">{errors.countryCode}</p>}
              <p className="text-xs text-gray-500">This field is auto-populated when you select a country</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className={errors.phoneNumber ? "text-red-500" : ""}>Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter phone number"
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-red-500" : ""}>Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button 
            type="submit" 
            className="px-8 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Registering Organization...' : 'Register Organization'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
