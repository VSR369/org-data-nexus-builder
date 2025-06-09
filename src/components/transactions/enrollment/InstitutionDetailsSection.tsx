
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from './types';

interface InstitutionDetailsSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
}

const InstitutionDetailsSection: React.FC<InstitutionDetailsSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <h4 className="font-medium">Institution Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization Name *</Label>
          <Input 
            id="org-name" 
            placeholder="Enter organization name"
            value={formData.orgName}
            onChange={(e) => updateFormData('orgName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-type">Organization Type *</Label>
          <Select value={formData.orgType} onValueChange={(value) => updateFormData('orgType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corporation">Corporation</SelectItem>
              <SelectItem value="llp">Limited Liability Partnership</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
              <SelectItem value="ngo">NGO</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-country">Country *</Label>
          <Select value={formData.orgCountry} onValueChange={(value) => updateFormData('orgCountry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in">India</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Official Website URL</Label>
          <Input 
            id="website" 
            type="url" 
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => updateFormData('website', e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="reg-address">Registered Address *</Label>
          <Textarea 
            id="reg-address" 
            placeholder="Enter complete registered address"
            value={formData.regAddress}
            onChange={(e) => updateFormData('regAddress', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetailsSection;
