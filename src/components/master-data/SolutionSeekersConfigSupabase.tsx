
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const SolutionSeekersConfigSupabase: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Solution Seekers Configuration
          </CardTitle>
          <p className="text-muted-foreground">
            View and manage registered solution seeking organizations
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
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

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : filteredOrganizations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No organizations found matching your search criteria.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredOrganizations.map((org) => (
                <div key={org.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{org.organization_name}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                          {org.organization_id}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p><strong>Contact:</strong> {org.contact_person_name}</p>
                          <p><strong>Email:</strong> {org.email}</p>
                          <p><strong>Phone:</strong> {org.phone_number || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Country:</strong> {org.country_code || 'N/A'}</p>
                          <p><strong>Website:</strong> {org.website || 'N/A'}</p>
                          <p><strong>Created:</strong> {new Date(org.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {org.address && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Address:</strong> {org.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionSeekersConfigSupabase;
