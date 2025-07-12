
import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData, Country } from '@/types/seekerRegistration';

interface ContactPersonSectionProps {
  formData: FormData;
  countries: Country[];
  errors: { [key: string]: string };
  onInputChange: (field: keyof FormData, value: string) => void;
}

const ContactPersonSection: React.FC<ContactPersonSectionProps> = ({
  formData,
  countries,
  errors,
  onInputChange
}) => {
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
        onInputChange('countryCode', phoneCode);
      }
    }
  }, [formData.country, countries, onInputChange]);

  const countryCodeOptions = [
    { code: '+1', country: 'US/CA' },
    { code: '+91', country: 'India' },
    { code: '+971', country: 'UAE' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
    { code: '+55', country: 'Brazil' },
    { code: '+52', country: 'Mexico' },
    { code: '+65', country: 'Singapore' },
    { code: '+60', country: 'Malaysia' },
    { code: '+66', country: 'Thailand' },
    { code: '+62', country: 'Indonesia' },
    { code: '+63', country: 'Philippines' },
    { code: '+84', country: 'Vietnam' },
    { code: '+82', country: 'South Korea' },
    { code: '+886', country: 'Taiwan' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
        <h3 className="text-lg font-semibold text-blue-600">Contact Person Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactPersonName" className={errors.contactPersonName ? "text-red-500" : ""}>Contact Person Name *</Label>
          <Input
            id="contactPersonName"
            value={formData.contactPersonName}
            onChange={(e) => onInputChange('contactPersonName', e.target.value)}
            placeholder="Enter contact person name"
            className={errors.contactPersonName ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.contactPersonName && <p className="text-sm text-red-500">{errors.contactPersonName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email ID *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="Enter email address"
            className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="countryCode" className={errors.countryCode ? "text-red-500" : ""}>Country Code *</Label>
          <Select
            value={formData.countryCode}
            onValueChange={(value) => onInputChange('countryCode', value)}
          >
            <SelectTrigger className={errors.countryCode ? "border-red-500 focus:ring-red-500" : ""}>
              <SelectValue placeholder="Select country code" />
            </SelectTrigger>
            <SelectContent>
              {countryCodeOptions.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.code} ({option.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.countryCode && <p className="text-sm text-red-500">{errors.countryCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className={errors.phoneNumber ? "text-red-500" : ""}>Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            placeholder="Enter phone number (e.g., 123-456-7890)"
            className={errors.phoneNumber ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            placeholder="Enter password"
            className={errors.password ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-red-500" : ""}>Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm password"
            className={errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactPersonSection;
