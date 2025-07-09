import React from 'react';
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
  // Calculate discounted price based on discount percentage
  const calculateDiscountedPrice = (originalPrice: number, discount: number) => {
    const discountedPrice = originalPrice - (originalPrice * discount / 100);
    return Math.round(discountedPrice * 10) / 10; // Round to 1 decimal place
  };

  // Check if engagement model is Platform as a Service (PaaS)
  const isPaaSModel = (engagementModel: string) => {
    return engagementModel.toLowerCase().includes('platform as a service') || 
           engagementModel.toLowerCase().includes('paas');
  };

  // Check if engagement model uses single platform fee (non-PaaS models)
  const isMarketplaceBasedModel = (engagementModel: string) => {
    const modelLower = engagementModel?.toLowerCase() || '';
    return modelLower.includes('marketplace') || modelLower.includes('aggregator');
  };

  // Format fee display based on engagement model
  const formatFeeDisplay = (fee: number, currency: string, engagementModel: string) => {
    if (isPaaSModel(engagementModel)) {
      return `${currency} ${fee.toLocaleString()}`;
    }
    return `${fee}%`;
  };

  if (configs.length === 0) {
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
  const hasMarketplaceConfigs = configs.some(config => isMarketplaceBasedModel(config.engagementModel));
  const hasPaaSConfigs = configs.some(config => isPaaSModel(config.engagementModel));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Configurations ({configs.length})</CardTitle>
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
                <TableHead>Platform Fee</TableHead>
                {hasPaaSConfigs && <TableHead>Half Yearly Fee</TableHead>}
                {hasPaaSConfigs && <TableHead>Annual Fee</TableHead>}
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => {
                const discount = config.discountPercentage || 0;
                const hasDiscount = config.membershipStatus === 'member' && discount > 0;
                const isPaaS = isPaaSModel(config.engagementModel);
                const isMarketplaceBased = isMarketplaceBasedModel(config.engagementModel);

                // Generate rows based on membership status and discount
                const rows = [];

                if (hasDiscount) {
                  // Member row (with discount)
                  rows.push(
                    <TableRow key={`${config.id}-member`}>
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
                        <Badge variant="default">Member</Badge>
                      </TableCell>
                      <TableCell>{discount}%</TableCell>
                      
                      {/* Platform Fee Column */}
                      <TableCell>
                        {config.quarterlyFee !== undefined ? 
                          formatFeeDisplay(calculateDiscountedPrice(config.quarterlyFee, discount), config.currency, config.engagementModel) : 
                          '-'}
                      </TableCell>
                      
                      {/* Conditional frequency columns for PaaS */}
                      {hasPaaSConfigs && (
                        <TableCell>
                          {isPaaS && config.halfYearlyFee !== undefined ? 
                            formatFeeDisplay(calculateDiscountedPrice(config.halfYearlyFee, discount), config.currency, config.engagementModel) : 
                            '-'}
                        </TableCell>
                      )}
                      {hasPaaSConfigs && (
                        <TableCell>
                          {isPaaS && config.annualFee !== undefined ? 
                            formatFeeDisplay(calculateDiscountedPrice(config.annualFee, discount), config.currency, config.engagementModel) : 
                            '-'}
                        </TableCell>
                      )}
                      
                      <TableCell>{config.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
                        </div>
                      </TableCell>
                    </TableRow>
                  );

                  // Non-member row (original price)
                  rows.push(
                    <TableRow key={`${config.id}-non-member`}>
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
                        <Badge variant="secondary">Not a Member</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      
                      {/* Platform Fee Column */}
                      <TableCell>
                        {config.quarterlyFee !== undefined ? 
                          formatFeeDisplay(config.quarterlyFee, config.currency, config.engagementModel) : 
                          '-'}
                      </TableCell>
                      
                      {/* Conditional frequency columns for PaaS */}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  // Single row for non-member or member without discount
                  rows.push(
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
                      <TableCell>-</TableCell>
                      
                      {/* Platform Fee Column */}
                      <TableCell>
                        {config.quarterlyFee !== undefined ? 
                          formatFeeDisplay(config.quarterlyFee, config.currency, config.engagementModel) : 
                          '-'}
                      </TableCell>
                      
                      {/* Conditional frequency columns for PaaS */}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                return rows;
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedConfigurationsList;
