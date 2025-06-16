
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormData, Country } from '@/types/seekerRegistration';

interface ContactInfoSectionProps {
  formData: FormData;
  countries: Country[];
  errors: { [key: string]: string };
  onInputChange: (field: keyof FormData, value: string) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  formData,
  countries,
  errors,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
        <h3 className="text-lg font-semibold text-blue-600">Contact & Location Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="website" className={errors.website ? "text-red-500" : ""}>Website URL</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder="https://www.example.com"
            className={errors.website ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className={errors.country ? "text-red-500" : ""}>Country *</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => onInputChange('country', value)}
          >
            <SelectTrigger className={errors.country ? "border-red-500 focus:ring-red-500" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className={errors.address ? "text-red-500" : ""}>Address *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            placeholder="Enter complete address"
            rows={3}
            className={errors.address ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
