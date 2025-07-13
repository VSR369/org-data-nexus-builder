import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { PricingConfig } from '@/types/pricing';

interface SavedConfigurationsListProps {
  configs: PricingConfig[];
  onEdit: (config: PricingConfig) => void;
  onDelete: (configId: string) => void;
}

const SavedConfigurationsList: React.FC<SavedConfigurationsListProps> = ({
  configs,
  onEdit,
  onDelete
}) => {
  // Client-side deduplication as a safety measure
  const deduplicatedConfigs = useMemo(() => {
    const seen = new Set<string>();
    const unique: PricingConfig[] = [];
    
    for (const config of configs) {
      const key = `${config.country}-${config.organizationType}-${config.engagementModel}-${config.membershipStatus}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(config);
      } else {
        console.warn('🔍 Client-side deduplication: Filtering duplicate config:', key);
      }
    }
    
    return unique;
  }, [configs]);

  // Check if engagement model is Platform as a Service (PaaS)
  const isPaaSModel = (engagementModel: string) => {
    return engagementModel === 'Platform as a Service';
  };

  // Check if engagement model uses single platform fee (non-PaaS models)
  const isMarketplaceBasedModel = (engagementModel: string) => {
    return engagementModel === 'Market Place' || 
           engagementModel === 'Market Place & Aggregator' || 
           engagementModel === 'Aggregator';
  };

  // Format fee display based on engagement model
  const formatFeeDisplay = (fee: number, currency: string, engagementModel: string) => {
    if (isMarketplaceBasedModel(engagementModel)) {
      return `${fee}%`;
    }
    return `${currency} ${fee.toLocaleString()}`;
  };

  if (deduplicatedConfigs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No configurations saved yet. Create your first configuration above.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Determine if we have any marketplace-based configurations
  const hasMarketplaceConfigs = deduplicatedConfigs.some(config => isMarketplaceBasedModel(config.engagementModel));
  const hasPaaSConfigs = deduplicatedConfigs.some(config => isPaaSModel(config.engagementModel));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Configurations ({deduplicatedConfigs.length})</CardTitle>
        {deduplicatedConfigs.length < configs.length && (
          <p className="text-sm text-muted-foreground">
            Note: {configs.length - deduplicatedConfigs.length} duplicate configurations were filtered out
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Organization Type</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Engagement Model</TableHead>
                <TableHead>Membership Status</TableHead>
                <TableHead>Discount (%)</TableHead>
                {/* Conditional headers based on engagement model type */}
                {hasMarketplaceConfigs && <TableHead>Platform Fee</TableHead>}
                {hasPaaSConfigs && <TableHead>Quarterly Fee</TableHead>}
                {hasPaaSConfigs && <TableHead>Half Yearly Fee</TableHead>}
                {hasPaaSConfigs && <TableHead>Annual Fee</TableHead>}
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deduplicatedConfigs.map((config) => {
                const isPaaS = isPaaSModel(config.engagementModel);
                const isMarketplaceBased = isMarketplaceBasedModel(config.engagementModel);
                const discount = config.discountPercentage || 0;

                return (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.country}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{config.currency}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{config.organizationType}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{config.entityType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{config.engagementModel}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.membershipStatus === 'member' ? 'default' : 'secondary'}>
                        {config.membershipStatus === 'member' ? 'Member' : 'Not a Member'}
                      </Badge>
                    </TableCell>
                    <TableCell>{discount > 0 ? `${discount}%` : '-'}</TableCell>
                    
                    {/* Conditional pricing columns based on engagement model type */}
                    {hasMarketplaceConfigs && (
                      <TableCell>
                        {isMarketplaceBased && config.platformFeePercentage !== undefined ? 
                          formatFeeDisplay(config.platformFeePercentage, config.currency, config.engagementModel) : 
                          '-'}
                      </TableCell>
                    )}
                    {hasPaaSConfigs && (
                      <TableCell>
                        {isPaaS && config.quarterlyFee !== undefined ? 
                          formatFeeDisplay(config.quarterlyFee, config.currency, config.engagementModel) : 
                          '-'}
                      </TableCell>
                    )}
                    {hasPaaSConfigs && (
                      <TableCell>
                        {isPaaS && config.halfYearlyFee !== undefined ? 
                          formatFeeDisplay(config.halfYearlyFee, config.currency, config.engagementModel) : 
                          '-'}
                      </TableCell>
                    )}
                    {hasPaaSConfigs && (
                      <TableCell>
                        {isPaaS && config.annualFee !== undefined ? 
                          formatFeeDisplay(config.annualFee, config.currency, config.engagementModel) : 
                          '-'}
                      </TableCell>
                    )}
                    
                    <TableCell>{config.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {config.membershipStatus !== 'member' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(config)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(config.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedConfigurationsList;
