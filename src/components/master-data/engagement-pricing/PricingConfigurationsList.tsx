import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Edit2, Copy, Trash2, Search, X } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../../utils/formatting';

interface PricingConfigurationsListProps {
  configurations: any[];
  loading: boolean;
  onEdit: (config: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (config: any) => void;
  masterData: any;
}

export const PricingConfigurationsList: React.FC<PricingConfigurationsListProps> = ({
  configurations,
  loading,
  onEdit,
  onDelete,
  onDuplicate,
  masterData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    engagementModels: [] as string[],
    countries: [] as string[],
    organizationTypes: [] as string[],
    membershipStatus: 'All'
  });

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearFilters = () => {
    setFilters({
      engagementModels: [],
      countries: [],
      organizationTypes: [],
      membershipStatus: 'All'
    });
  };

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    if (category === 'membershipStatus') {
      setFilters(prev => ({ ...prev, [category]: value }));
    } else {
      setFilters(prev => ({
        ...prev,
        [category]: prev[category].includes(value) 
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      }));
    }
  };

  const filteredConfigurations = configurations.filter(config => {
    const matchesSearch = searchTerm === '' || 
      Object.values(config).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesEngagementModel = filters.engagementModels.length === 0 || 
      filters.engagementModels.includes(config.engagement_model);

    const matchesCountry = filters.countries.length === 0 || 
      filters.countries.includes(config.country_name);

    const matchesOrganizationType = filters.organizationTypes.length === 0 || 
      filters.organizationTypes.includes(config.organization_type);

    const matchesMembershipStatus = filters.membershipStatus === 'All' || 
      config.membership_status === filters.membershipStatus;

    return matchesSearch && matchesEngagementModel && matchesCountry && 
           matchesOrganizationType && matchesMembershipStatus;
  });

  const groupedConfigurations = filteredConfigurations.reduce((groups, config) => {
    const key = config.engagement_model || 'Unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(config);
    return groups;
  }, {} as Record<string, any[]>);

  const uniqueEngagementModels = [...new Set(configurations.map(c => c.engagement_model))].filter(Boolean);
  const uniqueCountries = [...new Set(configurations.map(c => c.country_name))].filter(Boolean);
  const uniqueOrganizationTypes = [...new Set(configurations.map(c => c.organization_type))].filter(Boolean);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search configurations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {(searchTerm || filters.engagementModels.length > 0 || filters.countries.length > 0 || 
          filters.organizationTypes.length > 0 || filters.membershipStatus !== 'All') && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="absolute right-12 top-1/2 transform -translate-y-1/2"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Engagement Models */}
        <div>
          <h4 className="font-medium mb-2">Engagement Models</h4>
          <div className="space-y-1">
            {uniqueEngagementModels.map(model => (
              <Badge
                key={model}
                variant={filters.engagementModels.includes(model) ? "default" : "outline"}
                className="cursor-pointer mr-1 mb-1"
                onClick={() => toggleFilter('engagementModels', model)}
              >
                {model}
              </Badge>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <h4 className="font-medium mb-2">Countries</h4>
          <div className="space-y-1">
            {uniqueCountries.map(country => (
              <Badge
                key={country}
                variant={filters.countries.includes(country) ? "default" : "outline"}
                className="cursor-pointer mr-1 mb-1"
                onClick={() => toggleFilter('countries', country)}
              >
                {country}
              </Badge>
            ))}
          </div>
        </div>

        {/* Organization Types */}
        <div>
          <h4 className="font-medium mb-2">Organization Types</h4>
          <div className="space-y-1">
            {uniqueOrganizationTypes.map(type => (
              <Badge
                key={type}
                variant={filters.organizationTypes.includes(type) ? "default" : "outline"}
                className="cursor-pointer mr-1 mb-1"
                onClick={() => toggleFilter('organizationTypes', type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Membership Status */}
        <div>
          <h4 className="font-medium mb-2">Membership Status</h4>
          <Select value={filters.membershipStatus} onValueChange={(value) => toggleFilter('membershipStatus', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
              <SelectItem value="Not a Member">Not a Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Configuration Cards */}
      <div className="space-y-6">
        {Object.entries(groupedConfigurations).map(([engagementModel, configs]) => (
          <div key={engagementModel}>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">{engagementModel}</h3>
              <Badge variant="outline">{(configs as any[]).length} configurations</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(configs as any[]).map((config) => (
                <Card key={config.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇮🇳</span>
                          <span className="font-medium">{config.country_name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {config.organization_type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {config.entity_type}
                        </div>
                      </div>
                      <Badge variant={config.is_active ? "default" : "secondary"}>
                        {config.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Pricing Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Base Value</span>
                        <span className="font-medium">
                          {config.currency_symbol} {formatCurrency(config.base_value, config.currency_code)}
                        </span>
                      </div>

                      {config.membership_discount_percentage > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Member Discount</span>
                          <span className="font-medium text-green-600">
                            -{formatPercentage(config.membership_discount_percentage)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Final Value</span>
                        <span className="font-semibold">
                          {config.currency_symbol} {formatCurrency(config.calculated_value, config.currency_code)}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Status and Billing */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Membership</span>
                        <Badge variant={config.membership_status === 'Member' ? "default" : "outline"}>
                          {config.membership_status}
                        </Badge>
                      </div>

                      {config.billing_frequency && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Billing</span>
                          <span className="text-sm">{config.billing_frequency}</span>
                        </div>
                      )}
                    </div>

                    {/* Validity Period */}
                    {(config.effective_from || config.effective_to) && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-1">Validity Period</div>
                        <div className="text-xs text-muted-foreground">
                          {config.effective_from && (
                            <div>From: {new Date(config.effective_from).toLocaleDateString()}</div>
                          )}
                          {config.effective_to && (
                            <div>To: {new Date(config.effective_to).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(config)}
                        className="flex-1"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDuplicate(config)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(config.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredConfigurations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No configurations found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filters.engagementModels.length > 0 || filters.countries.length > 0 || 
               filters.organizationTypes.length > 0 || filters.membershipStatus !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'Create your first pricing configuration to get started.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};