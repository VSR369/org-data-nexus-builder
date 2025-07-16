import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';

export const ChallengeOverageFeesManager: React.FC = () => {
  const { items: challengeOverageFees, loading } = useMasterDataCRUD('master_challenge_overage_fees');

  const columns = [
    { accessorKey: 'country_id', header: 'Country' },
    { accessorKey: 'currency_id', header: 'Currency' },
    { accessorKey: 'pricing_tier_id', header: 'Pricing Tier' },
    { accessorKey: 'fee_per_additional_challenge', header: 'Fee per Additional Challenge' },
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }: any) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge> }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Challenge Overage Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={challengeOverageFees} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};