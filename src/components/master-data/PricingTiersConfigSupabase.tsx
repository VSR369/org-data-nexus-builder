import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Save, X, Crown } from 'lucide-react';

const PricingTiersConfigSupabase = () => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    level_order: 1
  });

  const { data: pricingTiers = [], isLoading, refetch } = useQuery({
    queryKey: ['pricing-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_pricing_tiers')
        .select('*')
        .order('level_order');
      if (error) throw error;
      return data || [];
    }
  });

  const handleSave = async (item: any) => {
    try {
      const { error } = await supabase
        .from('master_pricing_tiers')
        .update(item)
        .eq('id', item.id);

      if (error) throw error;

      toast.success('Pricing tier updated successfully');
      setEditingItem(null);
      refetch();
    } catch (error) {
      console.error('Error updating pricing tier:', error);
      toast.error('Failed to update pricing tier');
    }
  };

  const getTierColor = (levelOrder: number) => {
    switch (levelOrder) {
      case 1: return 'text-blue-600';
      case 2: return 'text-purple-600';
      case 3: return 'text-yellow-600';
      case 4: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return <div>Loading pricing tiers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pricing Tiers</h2>
          <p className="text-muted-foreground">Manage subscription tiers and their hierarchy</p>
        </div>
      </div>

      <div className="grid gap-4">
        {pricingTiers.map((tier) => (
          <Card key={tier.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className={`text-lg flex items-center gap-2 ${getTierColor(tier.level_order)}`}>
                  <Crown className="h-5 w-5" />
                  {tier.name}
                </CardTitle>
                <CardDescription>
                  Level {tier.level_order} tier
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Badge variant={tier.is_active ? "default" : "secondary"}>
                  {tier.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tier.description && (
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">Position in hierarchy:</span> Level {tier.level_order}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(tier)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingTiersConfigSupabase;