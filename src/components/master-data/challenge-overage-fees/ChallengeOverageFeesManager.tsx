import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Edit, Trash2 } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { ChallengeOverageFeeDialog } from './ChallengeOverageFeeDialog';

export const ChallengeOverageFeesManager: React.FC = () => {
  const { items: challengeOverageFees, loading, refreshItems } = useMasterDataCRUD('master_challenge_overage_fees');
  const [editingItem, setEditingItem] = useState<any>(null);

  const columns = [
    { accessorKey: 'country_name', header: 'Country' },
    { accessorKey: 'currency_name', header: 'Currency' },
    { accessorKey: 'pricing_tier_name', header: 'Pricing Tier' },
    { 
      accessorKey: 'fee_per_additional_challenge', 
      header: 'Fee per Additional Challenge',
      cell: ({ row }: any) => {
        const amount = row.getValue('fee_per_additional_challenge');
        const currency = row.original.currency_symbol || '$';
        return `${currency}${amount}`;
      }
    },
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }: any) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge> },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <ChallengeOverageFeeDialog
            mode="edit"
            item={row.original}
            onSuccess={refreshItems}
          >
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </ChallengeOverageFeeDialog>
          <ChallengeOverageFeeDialog
            mode="delete"
            item={row.original}
            onSuccess={refreshItems}
          >
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </ChallengeOverageFeeDialog>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Challenge Overage Fees
            </div>
            <ChallengeOverageFeeDialog
              mode="add"
              onSuccess={refreshItems}
            >
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Fee Structure
              </Button>
            </ChallengeOverageFeeDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage additional fees charged when users exceed their tier's challenge limit.
          </p>
          <div className="text-sm text-muted-foreground">
            Total fee structures: {challengeOverageFees.length}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent>
          <DataTable columns={columns} data={challengeOverageFees} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};