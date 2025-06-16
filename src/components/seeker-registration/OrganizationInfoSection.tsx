
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
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
        <h3 className="text-lg font-semibold text-blue-600">Organization Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="industrySegment">Industry Segment *</Label>
          <Select
            value={formData.industrySegment}
            onValueChange={(value) => onInputChange('industrySegment', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry segment" />
            </SelectTrigger>
            <SelectContent>
              {industrySegments.map((segment) => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.industrySegment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industrySegment && <p className="text-sm text-red-500">{errors.industrySegment}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization Name *</Label>
          <Input
            id="organizationName"
            value={formData.organizationName}
            onChange={(e) => onInputChange('organizationName', e.target.value)}
            placeholder="Enter organization name"
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
          <Label htmlFor="organizationType">Organization Type *</Label>
          <Select
            value={formData.organizationType}
            onValueChange={(value) => onInputChange('organizationType', value)}
          >
            <SelectTrigger>
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
          {errors.organizationType && <p className="text-sm text-red-500">{errors.organizationType}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="entityType">Entity Type *</Label>
          <Select
            value={formData.entityType}
            onValueChange={(value) => onInputChange('entityType', value)}
          >
            <SelectTrigger className="md:w-1/2">
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
          {errors.entityType && <p className="text-sm text-red-500">{errors.entityType}</p>}
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfoSection;
