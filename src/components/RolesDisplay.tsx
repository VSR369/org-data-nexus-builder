import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Role {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function RolesDisplay() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Platform Roles ({roles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <div key={role.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{role.name}</h3>
                <Badge variant={role.is_active ? "default" : "secondary"}>
                  {role.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {role.description && (
                <p className="text-muted-foreground text-sm mb-3">
                  {role.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Created: {new Date(role.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
        {roles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No roles found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}