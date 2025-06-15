
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CountryPricing } from '../types';
import { formatCurrency } from '../utils/currencyUtils';

interface PaasPricingTableProps {
  pricingEntries: Array<CountryPricing & { organizationType: string }>;
}

const PaasPricingTable: React.FC<PaasPricingTableProps> = ({ pricingEntries }) => {
  if (pricingEntries.length === 0) return null;

  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Current Pricing Entries ({pricingEntries.length})</h4>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization Type</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Membership Status</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Quarterly</TableHead>
              <TableHead>Half-Yearly</TableHead>
              <TableHead>Annual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingEntries.map((pricing) => (
              <TableRow key={`${pricing.organizationType}-${pricing.id}`}>
                <TableCell className="font-medium">{pricing.organizationType}</TableCell>
                <TableCell>{pricing.country}</TableCell>
                <TableCell>
                  <Badge variant="outline">{pricing.currency}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={pricing.membershipStatus === 'active' ? 'default' : 'secondary'}>
                    {pricing.membershipStatus === 'active' ? 'Active' : 
                     pricing.membershipStatus === 'inactive' ? 'Inactive' : 'Not a Member'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {pricing.membershipStatus === 'active' && pricing.discountPercentage ? 
                    `${pricing.discountPercentage}%` : '-'}
                </TableCell>
                <TableCell>{formatCurrency(pricing.quarterlyPrice, pricing.currency)}</TableCell>
                <TableCell>{formatCurrency(pricing.halfYearlyPrice, pricing.currency)}</TableCell>
                <TableCell>{formatCurrency(pricing.annualPrice, pricing.currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaasPricingTable;
