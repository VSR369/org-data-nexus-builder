
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
                <TableHead>Organization Type</TableHead>
                <TableHead>Engagement Model</TableHead>
                <TableHead>Fee (%)</TableHead>
                <TableHead>Membership Status</TableHead>
                <TableHead>Discount (%)</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.organizationType}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{config.engagementModel}</Badge>
                  </TableCell>
                  <TableCell>{config.engagementModelFee}%</TableCell>
                  <TableCell>
                    <Badge variant={config.membershipStatus === 'active' ? 'default' : 'secondary'}>
                      {config.membershipStatus === 'active' ? 'Active' : 
                       config.membershipStatus === 'inactive' ? 'Inactive' : 'Not a Member'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {config.discountPercentage !== undefined ? `${config.discountPercentage}%` : '-'}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedConfigurationsList;
