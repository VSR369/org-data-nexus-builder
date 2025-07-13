import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit2, Copy, Trash2, DollarSign, Percent, Calendar, Globe, Building2, Users } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../../utils/formatting';

interface PricingConfigurationGridProps {
  configurations: any[];
  loading: boolean;
  onEdit: (config: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (config: any) => void;
}

export const PricingConfigurationGrid: React.FC<PricingConfigurationGridProps> = ({
  configurations,
  loading,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading configurations...</p>
      </div>
    );
  }

  if (configurations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No pricing configurations found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first pricing configuration to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (config: any) => {
    if (!config.is_active) return 'destructive';
    const now = new Date();
    const effectiveFrom = config.effective_from ? new Date(config.effective_from) : null;
    const effectiveTo = config.effective_to ? new Date(config.effective_to) : null;

    if (effectiveFrom && effectiveFrom > now) return 'secondary';
    if (effectiveTo && effectiveTo < now) return 'destructive';
    if (effectiveTo && effectiveTo <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) return 'warning';
    return 'default';
  };

  const getStatusText = (config: any) => {
    if (!config.is_active) return 'Inactive';
    const now = new Date();
    const effectiveFrom = config.effective_from ? new Date(config.effective_from) : null;
    const effectiveTo = config.effective_to ? new Date(config.effective_to) : null;

    if (effectiveFrom && effectiveFrom > now) return 'Scheduled';
    if (effectiveTo && effectiveTo < now) return 'Expired';
    if (effectiveTo && effectiveTo <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) return 'Expiring Soon';
    return 'Active';
  };

  const groupedConfigurations = configurations.reduce((groups, config) => {
    const key = config.engagement_model || 'Unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(config);
    return groups;
  }, {} as Record<string, any[]>);

  return (
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
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{config.country_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span>{config.organization_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{config.entity_type}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(config) as any}>
                      {getStatusText(config)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pricing Information */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Base Value</span>
                      <div className="flex items-center gap-1">
                        {config.is_percentage ? (
                          <>
                            <Percent className="h-3 w-3" />
                            <span className="font-medium">{formatPercentage(config.base_value)}</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-3 w-3" />
                            <span className="font-medium">
                              {formatCurrency(config.base_value, config.currency_code)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {config.membership_discount_percentage > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Member Discount</span>
                        <span className="font-medium text-green-600">
                          -{formatPercentage(config.membership_discount_percentage)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Final Value</span>
                      <div className="flex items-center gap-1">
                        {config.is_percentage ? (
                          <>
                            <Percent className="h-3 w-3" />
                            <span className="font-semibold">{formatPercentage(config.calculated_value)}</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-3 w-3" />
                            <span className="font-semibold">
                              {formatCurrency(config.calculated_value, config.currency_code)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Membership & Billing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Membership</span>
                      <Badge variant={config.membership_status === 'Member' ? 'default' : 'secondary'} className="text-xs">
                        {config.membership_status}
                      </Badge>
                    </div>

                    {config.billing_frequency && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Billing</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="text-sm">{config.billing_frequency}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Validity Period */}
                  {(config.effective_from || config.effective_to) && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Validity Period</span>
                        <div className="text-xs text-muted-foreground">
                          {config.effective_from && (
                            <div>From: {new Date(config.effective_from).toLocaleDateString()}</div>
                          )}
                          {config.effective_to && (
                            <div>To: {new Date(config.effective_to).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
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
  );
};