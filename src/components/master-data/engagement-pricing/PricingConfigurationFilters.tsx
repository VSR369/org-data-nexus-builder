import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';

interface PricingFilters {
  search: string;
  country: string[];
  engagementModel: string[];
  organizationType: string[];
  membershipStatus: string;
  status: string;
}

interface PricingConfigurationFiltersProps {
  filters: PricingFilters;
  onFiltersChange: (filters: PricingFilters) => void;
  masterData: any;
  loading: boolean;
}

export const PricingConfigurationFilters: React.FC<PricingConfigurationFiltersProps> = ({
  filters,
  onFiltersChange,
  masterData,
  loading
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleCountryToggle = (countryId: string) => {
    const newCountries = filters.country.includes(countryId)
      ? filters.country.filter(id => id !== countryId)
      : [...filters.country, countryId];
    onFiltersChange({ ...filters, country: newCountries });
  };

  const handleEngagementModelToggle = (modelId: string) => {
    const newModels = filters.engagementModel.includes(modelId)
      ? filters.engagementModel.filter(id => id !== modelId)
      : [...filters.engagementModel, modelId];
    onFiltersChange({ ...filters, engagementModel: newModels });
  };

  const handleOrgTypeToggle = (orgTypeId: string) => {
    const newOrgTypes = filters.organizationType.includes(orgTypeId)
      ? filters.organizationType.filter(id => id !== orgTypeId)
      : [...filters.organizationType, orgTypeId];
    onFiltersChange({ ...filters, organizationType: newOrgTypes });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      country: [],
      engagementModel: [],
      organizationType: [],
      membershipStatus: 'all',
      status: 'all'
    });
  };

  const activeFilterCount = [
    filters.search,
    ...filters.country,
    ...filters.engagementModel,
    ...filters.organizationType,
    filters.membershipStatus !== 'all' ? filters.membershipStatus : '',
    filters.status !== 'all' ? filters.status : ''
  ].filter(Boolean).length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search and Clear */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search configurations..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                disabled={activeFilterCount === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Clear {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Engagement Models */}
            <div>
              <label className="text-sm font-medium mb-2 block">Engagement Models</label>
              <div className="flex flex-wrap gap-1">
                {masterData.engagementModels?.map((model: any) => (
                  <Badge
                    key={model.id}
                    variant={filters.engagementModel.includes(model.id) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => handleEngagementModelToggle(model.id)}
                  >
                    {model.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div>
              <label className="text-sm font-medium mb-2 block">Countries</label>
              <div className="flex flex-wrap gap-1">
                {masterData.countries?.map((country: any) => (
                  <Badge
                    key={country.id}
                    variant={filters.country.includes(country.id) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => handleCountryToggle(country.id)}
                  >
                    {country.code || country.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Organization Types */}
            <div>
              <label className="text-sm font-medium mb-2 block">Organization Types</label>
              <div className="flex flex-wrap gap-1">
                {masterData.organizationTypes?.map((orgType: any) => (
                  <Badge
                    key={orgType.id}
                    variant={filters.organizationType.includes(orgType.id) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => handleOrgTypeToggle(orgType.id)}
                  >
                    {orgType.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Membership Status</label>
                <Select value={filters.membershipStatus} onValueChange={(value) => 
                  onFiltersChange({ ...filters, membershipStatus: value })
                }>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Non-Member">Non-Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={filters.status} onValueChange={(value) => 
                  onFiltersChange({ ...filters, status: value })
                }>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};