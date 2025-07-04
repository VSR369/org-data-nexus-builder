import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Building, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { FormData, IndustrySegment, Country } from '@/types/seekerRegistration';
import { useRobustMasterData } from '@/hooks/useRobustMasterData';

interface RobustOrganizationFormProps {
  formData: FormData;
  errors: { [key: string]: string };
  onInputChange: (field: keyof FormData, value: string) => void;
}

const RobustOrganizationForm: React.FC<RobustOrganizationFormProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  const {
    countries,
    organizationTypes,
    industrySegments,
    entityTypes,
    isLoading,
    hasErrors,
    errors: masterDataErrors,
    refreshMasterData
  } = useRobustMasterData();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
          <h3 className="text-lg font-semibold text-blue-600">Organization Information</h3>
        </div>
        
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading master data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
        <h3 className="text-lg font-semibold text-blue-600">Organization Information</h3>
        <Building className="h-5 w-5 text-blue-600" />
      </div>

      {/* Master Data Status Alert */}
      {hasErrors && (
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Master Data Issues:</strong>
                <ul className="list-disc pl-4 mt-1">
                  {masterDataErrors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
                <p className="text-sm mt-1">Fallback data is being used to ensure form functionality.</p>
              </div>
              <Button variant="outline" size="sm" onClick={refreshMasterData}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Status */}
      {!hasErrors && !isLoading && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Master data loaded successfully. All dropdowns are populated with current data.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Segment */}
        <div className="space-y-2">
          <Label htmlFor="industrySegment" className={errors.industrySegment ? "text-red-500" : ""}>
            Industry Segment *
          </Label>
          <Select
            value={formData.industrySegment}
            onValueChange={(value) => onInputChange('industrySegment', value)}
          >
            <SelectTrigger className={errors.industrySegment ? "border-red-500 focus:ring-red-500" : ""}>
              <SelectValue placeholder="Select industry segment" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-md max-h-60 overflow-y-auto z-50">
              {industrySegments.length > 0 ? (
                industrySegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{segment.industrySegment}</span>
                      {segment.description && (
                        <span className="text-xs text-muted-foreground">{segment.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No industry segments available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.industrySegment && <p className="text-sm text-red-500">{errors.industrySegment}</p>}
          <p className="text-xs text-muted-foreground">
            {industrySegments.length} industry segments available
          </p>
        </div>

        {/* Organization Name */}
        <div className="space-y-2">
          <Label htmlFor="organizationName" className={errors.organizationName ? "text-red-500" : ""}>
            Organization Name *
          </Label>
          <Input
            id="organizationName"
            value={formData.organizationName}
            onChange={(e) => onInputChange('organizationName', e.target.value)}
            placeholder="Enter organization name"
            className={errors.organizationName ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName}</p>}
        </div>

        {/* Organization ID (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="organizationId">Organization ID</Label>
          <Input
            id="organizationId"
            value={formData.organizationId}
            readOnly
            className="bg-muted"
            placeholder="Auto-generated after registration"
          />
          <p className="text-xs text-muted-foreground">
            This will be auto-generated after successful registration
          </p>
        </div>

        {/* Organization Type */}
        <div className="space-y-2">
          <Label htmlFor="organizationType" className={errors.organizationType ? "text-red-500" : ""}>
            Organization Type *
          </Label>
          <Select
            value={formData.organizationType}
            onValueChange={(value) => onInputChange('organizationType', value)}
          >
            <SelectTrigger className={errors.organizationType ? "border-red-500 focus:ring-red-500" : ""}>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-md z-50">
              {organizationTypes.length > 0 ? (
                organizationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No organization types available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.organizationType && <p className="text-sm text-red-500">{errors.organizationType}</p>}
          <p className="text-xs text-muted-foreground">
            {organizationTypes.length} organization types available
          </p>
        </div>

        {/* Entity Type */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="entityType" className={errors.entityType ? "text-red-500" : ""}>
            Entity Type *
          </Label>
          <Select
            value={formData.entityType}
            onValueChange={(value) => onInputChange('entityType', value)}
          >
            <SelectTrigger className={`md:w-1/2 ${errors.entityType ? "border-red-500 focus:ring-red-500" : ""}`}>
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-md z-50">
              {entityTypes.length > 0 ? (
                entityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No entity types available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.entityType && <p className="text-sm text-red-500">{errors.entityType}</p>}
          <p className="text-xs text-muted-foreground">
            {entityTypes.length} entity types available
          </p>
        </div>
      </div>

      {/* Data Status Footer */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Master Data Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Countries: {countries.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Org Types: {organizationTypes.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Industries: {industrySegments.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Entities: {entityTypes.length}</span>
          </div>
        </div>
        {hasErrors && (
          <div className="mt-2 text-xs text-amber-600">
            Some data loaded from fallback sources due to localStorage issues.
          </div>
        )}
      </div>
    </div>
  );
};

export default RobustOrganizationForm;