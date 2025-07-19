import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, UserCheck } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';

export const OnboardingTypesManager: React.FC = () => {
  const { toast } = useToast();
  const { items: onboardingTypes, loading, deleteItem, refreshItems } = useMasterDataCRUD('master_onboarding_types');

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast({ title: "Success", description: "Onboarding type deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete onboarding type", variant: "destructive" });
    }
  };

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'service_type', header: 'Service Type' },
    { accessorKey: 'description', header: 'Description', cell: ({ row }: any) => row.getValue('description') || 'No description' },
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }: any) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge> },
    { id: 'actions', header: 'Actions', cell: ({ row }: any) => <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button> }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Onboarding Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={onboardingTypes} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};