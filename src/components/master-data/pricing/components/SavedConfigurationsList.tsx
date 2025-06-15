
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { PricingConfig } from '../types';

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
                <TableHead>Quarterly Fee</TableHead>
                <TableHead>Half Yearly Fee</TableHead>
                <TableHead>Annual Fee</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => {
                const discount = config.discountPercentage || 0;
                const hasDiscount = config.membershipStatus === 'active' && discount > 0;

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
                      <Badge variant={config.membershipStatus === 'active' ? 'default' : 'secondary'}>
                        {config.membershipStatus === 'active' ? 'Active' : 
                         config.membershipStatus === 'inactive' ? 'Inactive' : 'Not a Member'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {discount > 0 ? `${discount}%` : '-'}
                    </TableCell>
                    <TableCell>
                      {config.quarterlyFee !== undefined ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{config.quarterlyFee}%</div>
                          {hasDiscount && (
                            <div className="text-xs text-green-600">
                              After discount: {calculateDiscountedPrice(config.quarterlyFee, discount)}%
                            </div>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {config.halfYearlyFee !== undefined ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{config.halfYearlyFee}%</div>
                          {hasDiscount && (
                            <div className="text-xs text-green-600">
                              After discount: {calculateDiscountedPrice(config.halfYearlyFee, discount)}%
                            </div>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {config.annualFee !== undefined ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{config.annualFee}%</div>
                          {hasDiscount && (
                            <div className="text-xs text-green-600">
                              After discount: {calculateDiscountedPrice(config.annualFee, discount)}%
                            </div>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
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
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedConfigurationsList;
