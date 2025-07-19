import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';

const TierConfigurationsConfigSupabase = () => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    pricing_tier_id: '',
    country_id: '',
    currency_id: '',
    monthly_challenge_limit: 0,
    solutions_per_challenge: 1,
    allows_overage: false,
    fixed_charge_per_challenge: 0,
    support_type_id: '',
    analytics_access_id: '',
    onboarding_type_id: '',
    workflow_template_id: ''
  });

  const { data: tierConfigs = [], isLoading, refetch } = useQuery({
    queryKey: ['tier-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_tier_configurations')
        .select(`
          *,
          pricing_tier:master_pricing_tiers(name),
          country:master_countries(name),
          currency:master_currencies(name, code),
          support_type:master_support_types(name),
          analytics_access:master_analytics_access_types(name),
          onboarding_type:master_onboarding_types(name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const handleSave = async (item: any) => {
    try {
      const { error } = await supabase
        .from('master_tier_configurations')
        .update(item)
        .eq('id', item.id);

      if (error) throw error;

      toast.success('Tier configuration updated successfully');
      setEditingItem(null);
      refetch();
    } catch (error) {
      console.error('Error updating tier configuration:', error);
      toast.error('Failed to update tier configuration');
    }
  };

  if (isLoading) {
    return <div>Loading tier configurations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tier Configurations</h2>
          <p className="text-muted-foreground">Manage pricing tier configurations and access levels</p>
        </div>
      </div>

      <div className="grid gap-4">
        {tierConfigs.map((config) => (
          <Card key={config.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">
                  {config.pricing_tier?.name} - {config.country?.name}
                </CardTitle>
                <CardDescription>
                  Challenge Limit: {config.monthly_challenge_limit} | Solutions: {config.solutions_per_challenge}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                {config.allows_overage && <Badge variant="secondary">Overage Allowed</Badge>}
                <Badge variant={config.is_active ? "default" : "secondary"}>
                  {config.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Fixed Charge:</span> ${config.fixed_charge_per_challenge}
                  </div>
                  <div>
                    <span className="font-medium">Currency:</span> {config.currency?.code}
                  </div>
                  <div>
                    <span className="font-medium">Support:</span> {config.support_type?.name}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingItem(config)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TierConfigurationsConfigSupabase;