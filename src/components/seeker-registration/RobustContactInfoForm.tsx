import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Phone } from 'lucide-react';
import { FormData, Country } from '@/types/seekerRegistration';
import { useRobustMasterData } from '@/hooks/useRobustMasterData';

interface RobustContactInfoFormProps {
  formData: FormData;
  errors: { [key: string]: string };
  onInputChange: (field: keyof FormData, value: string) => void;
}

const RobustContactInfoForm: React.FC<RobustContactInfoFormProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  const { countries, isLoading } = useRobustMasterData();

  // Get country code for phone number placeholder
  const getCountryCode = (countryName: string): string => {
    const countryCodeMap: { [key: string]: string } = {
      'India': '+91',
      'United States': '+1',
      'United Kingdom': '+44',
      'Canada': '+1',
      'Australia': '+61',
      'Germany': '+49',
      'France': '+33',
      'Japan': '+81',
      'Singapore': '+65',
      'Kenya': '+254'
    };
    return countryCodeMap[countryName] || '+XX';
  };

  const selectedCountry = countries.find(c => c.name === formData.country);
  const countryCode = selectedCountry ? getCountryCode(selectedCountry.name) : '+XX';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
        <h3 className="text-lg font-semibold text-green-600">Contact Information</h3>
        <MapPin className="h-5 w-5 text-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country" className={errors.country ? "text-red-500" : ""}>
            Country *
          </Label>
          <Select
            value={formData.country}
            onValueChange={(value) => onInputChange('country', value)}
            disabled={isLoading}
          >
            <SelectTrigger className={errors.country ? "border-red-500 focus:ring-red-500" : ""}>
              <SelectValue placeholder={isLoading ? "Loading countries..." : "Select country"} />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-md max-h-60 overflow-y-auto z-50">
              {countries.length > 0 ? (
                countries.map((country) => (
                  <SelectItem key={country.id} value={country.name}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{country.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {country.code}
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No countries available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
          <p className="text-xs text-muted-foreground">
            {countries.length} countries available
          </p>
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <Label htmlFor="website">Official Website URL</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              placeholder="https://example.com"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Optional: Your organization's official website
          </p>
        </div>

        {/* Phone Number with Country Code */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className={errors.phoneNumber ? "text-red-500" : ""}>
            Phone Number *
          </Label>
          <div className="flex gap-2">
            <div className="relative w-20">
              <Input
                value={formData.countryCode || countryCode}
                onChange={(e) => onInputChange('countryCode', e.target.value)}
                placeholder="+XX"
                className="text-center"
              />
            </div>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => onInputChange('phoneNumber', e.target.value)}
                placeholder="Enter phone number"
                className={`pl-10 ${errors.phoneNumber ? "border-red-500 focus:ring-red-500" : ""}`}
              />
            </div>
          </div>
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
          <p className="text-xs text-muted-foreground">
            Include country code (auto-filled based on selected country)
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="contact@organization.com"
            className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className={errors.address ? "text-red-500" : ""}>
            Registered Address *
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            placeholder="Enter complete registered address including city, state, and postal code"
            rows={3}
            className={errors.address ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          <p className="text-xs text-muted-foreground">
            Include full address with city, state/province, and postal code
          </p>
        </div>
      </div>

      {/* Selected Country Info */}
      {selectedCountry && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Selected Country: {selectedCountry.name} ({selectedCountry.code})
            </span>
            <Badge variant="outline" className="text-xs">
              Phone: {countryCode}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default RobustContactInfoForm;