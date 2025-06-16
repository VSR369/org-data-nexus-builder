
import React from 'react';
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
  return (
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
            onChange={(e) => onInputChange('contactPersonName', e.target.value)}
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
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="countryCode">Country Code *</Label>
          <Select
            value={formData.countryCode}
            onValueChange={(value) => onInputChange('countryCode', value)}
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
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="userId">User ID *</Label>
          <Input
            id="userId"
            value={formData.userId}
            onChange={(e) => onInputChange('userId', e.target.value)}
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
            onChange={(e) => onInputChange('password', e.target.value)}
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
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm password"
            className="md:w-1/2"
          />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactPersonSection;
