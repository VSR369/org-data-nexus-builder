
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const SolutionSeekersManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['solution-seekers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredOrganizations = organizations.filter(org => 
    org.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.contact_person_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.organization_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      accessorKey: 'organization_id',
      header: 'Organization ID',
      cell: ({ row }: any) => (
        <div className="font-mono text-sm">
          {row.getValue('organization_id')}
        </div>
      ),
    },
    {
      accessorKey: 'organization_name',
      header: 'Organization Name',
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.getValue('organization_name')}
        </div>
      ),
    },
    {
      accessorKey: 'contact_person_name',
      header: 'Contact Person',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('contact_person_name')}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: any) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('email')}
        </div>
      ),
    },
    {
      accessorKey: 'phone_number',
      header: 'Phone',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('phone_number') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'country_code',
      header: 'Country',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('country_code') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }: any) => (
        <div className="text-muted-foreground text-sm">
          {new Date(row.getValue('created_at')).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Solution Seekers Manager
          </CardTitle>
          <p className="text-muted-foreground">
            Manage registered solution seeking organizations
          </p>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">Total Organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredOrganizations.length}</div>
            <p className="text-xs text-muted-foreground">Filtered Results</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {organizations.filter(org => org.created_at && 
                new Date(org.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">New This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={filteredOrganizations}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionSeekersManager;
