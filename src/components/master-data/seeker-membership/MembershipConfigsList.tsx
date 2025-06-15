
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { MembershipFeeEntry, Currency } from './types';

interface MembershipConfigsListProps {
  membershipFees: MembershipFeeEntry[];
  currencies: Currency[];
  onEdit: (entry: MembershipFeeEntry) => void;
  onDelete: (id: string) => void;
}

const MembershipConfigsList: React.FC<MembershipConfigsListProps> = ({
  membershipFees,
  currencies,
  onEdit,
  onDelete
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    const currencyData = currencies.find(c => c.code === currency);
    const symbol = currencyData?.symbol || currency;
    return `${symbol} ${amount.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User-Created Membership Fee Configurations ({membershipFees.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {membershipFees.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No user-created membership fee configurations found. Add one above to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Quarterly</TableHead>
                  <TableHead>Half Yearly</TableHead>
                  <TableHead>Annual</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membershipFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>
                      <Badge variant="outline">{fee.country}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{fee.entityType}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(fee.quarterlyAmount, fee.quarterlyCurrency)}</TableCell>
                    <TableCell>{formatCurrency(fee.halfYearlyAmount, fee.halfYearlyCurrency)}</TableCell>
                    <TableCell>{formatCurrency(fee.annualAmount, fee.annualCurrency)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{fee.createdAt}</div>
                        {fee.isUserCreated && (
                          <Badge variant="outline" className="text-xs mt-1">User Created</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(fee)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDelete(fee.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipConfigsList;
