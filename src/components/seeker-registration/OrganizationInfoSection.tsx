
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from 'lucide-react';
import { FormData, IndustrySegment } from '@/types/seekerRegistration';

interface OrganizationInfoSectionProps {
  formData: FormData;
  industrySegments: IndustrySegment[];
  organizationTypes: string[];
  entityTypes: string[];
  errors: { [key: string]: string };
  onInputChange: (field: keyof FormData, value: string) => void;
}

const OrganizationInfoSection: React.FC<OrganizationInfoSectionProps> = ({
  formData,
  industrySegments,
  organizationTypes,
  entityTypes,
  errors,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Building className="h-5 w-5" />
        Organization Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="industrySegment">Industry Segment *</Label>
          <Select value={formData.industrySegment} onValueChange={(value) => onInputChange('industrySegment', value)}>
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
            onChange={(e) => onInputChange('organizationName', e.target.value)}
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
          <Label htmlFor="organizationType">Organization Type *</Label>
          <Select value={formData.organizationType} onValueChange={(value) => onInputChange('organizationType', value)}>
            <SelectTrigger className={errors.organizationType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              {organizationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organizationType && <p className="text-red-500 text-sm mt-1">{errors.organizationType}</p>}
        </div>

        <div>
          <Label htmlFor="entityType">Entity Type *</Label>
          <Select value={formData.entityType} onValueChange={(value) => onInputChange('entityType', value)}>
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
  );
};

export default OrganizationInfoSection;
