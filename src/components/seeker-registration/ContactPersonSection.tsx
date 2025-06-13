
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Mail, Phone, User, Lock } from 'lucide-react';
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
            onChange={(e) => onInputChange('contactPersonName', e.target.value)}
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
              onChange={(e) => onInputChange('email', e.target.value)}
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email address"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="countryCode">Country Code *</Label>
          <Select value={formData.countryCode} onValueChange={(value) => onInputChange('countryCode', value)}>
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
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
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
              onChange={(e) => onInputChange('userId', e.target.value)}
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
              onChange={(e) => onInputChange('password', e.target.value)}
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
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm password"
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactPersonSection;
