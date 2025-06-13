
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Globe } from 'lucide-react';
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
            onChange={(e) => onInputChange('website', e.target.value)}
            className={errors.website ? 'border-red-500' : ''}
            placeholder="https://www.example.com"
          />
          {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <Select value={formData.country} onValueChange={(value) => onInputChange('country', value)}>
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
            onChange={(e) => onInputChange('address', e.target.value)}
            className={errors.address ? 'border-red-500' : ''}
            placeholder="Enter complete address"
            rows={3}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
