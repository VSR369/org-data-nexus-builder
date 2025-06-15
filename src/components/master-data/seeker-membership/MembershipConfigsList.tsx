
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

  const calculateMemberPrice = (amount: number, discountPercentage?: number) => {
    if (!discountPercentage) return amount;
    return amount * (1 - discountPercentage / 100);
  };

  const formatMemberNonMemberPricing = (amount: number, currency: string, membershipStatus: string, discountPercentage?: number) => {
    const basePrice = formatCurrency(amount, currency);
    
    if (membershipStatus === 'Active' && discountPercentage) {
      const memberPrice = calculateMemberPrice(amount, discountPercentage);
      const memberPriceFormatted = formatCurrency(memberPrice, currency);
      return (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-medium text-green-600">Member: {memberPriceFormatted}</span>
            <span className="text-xs text-green-500 ml-1">({discountPercentage}% off)</span>
          </div>
          <div className="text-sm text-gray-600">Non-Member: {basePrice}</div>
        </div>
      );
    }
    
    return <div className="text-sm">{basePrice}</div>;
  };

  const getMembershipStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'Not Active':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Not Active</Badge>;
      case 'Not a Member':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Not a Member</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell>
                        <div className="space-y-1">
                          {getMembershipStatusBadge(fee.membershipStatus)}
                          {fee.membershipStatus === 'Active' && fee.memberDiscountPercentage && (
                            <div className="text-xs text-green-600">
                              {fee.memberDiscountPercentage}% member discount
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatMemberNonMemberPricing(
                          fee.quarterlyAmount, 
                          fee.quarterlyCurrency, 
                          fee.membershipStatus, 
                          fee.memberDiscountPercentage
                        )}
                      </TableCell>
                      <TableCell>
                        {formatMemberNonMemberPricing(
                          fee.halfYearlyAmount, 
                          fee.halfYearlyCurrency, 
                          fee.membershipStatus, 
                          fee.memberDiscountPercentage
                        )}
                      </TableCell>
                      <TableCell>
                        {formatMemberNonMemberPricing(
                          fee.annualAmount, 
                          fee.annualCurrency, 
                          fee.membershipStatus, 
                          fee.memberDiscountPercentage
                        )}
                      </TableCell>
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipConfigsList;
