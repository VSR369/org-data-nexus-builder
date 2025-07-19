import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Save, X, Calculator } from 'lucide-react';

const PlatformFeeFormulasConfigSupabase = () => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    formula_name: '',
    description: '',
    formula_expression: '',
    engagement_model_id: '',
    formula_type: 'structured',
    platform_usage_fee_percentage: 0,
    base_management_fee: 0,
    base_consulting_fee: 0,
    advance_payment_percentage: 25,
    membership_discount_percentage: 0,
    country_id: '',
    currency_id: ''
  });

  const { data: formulas = [], isLoading, refetch } = useQuery({
    queryKey: ['platform-fee-formulas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_platform_fee_formulas')
        .select(`
          *,
          engagement_model:master_engagement_models(name),
          country:master_countries(name),
          currency:master_currencies(name, code)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const { data: engagementModels = [] } = useQuery({
    queryKey: ['engagement-models-for-formulas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_engagement_models')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries-for-formulas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_countries')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: currencies = [] } = useQuery({
    queryKey: ['currencies-for-formulas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_currencies')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const handleSave = async (item: any) => {
    try {
      const { error } = await supabase
        .from('master_platform_fee_formulas')
        .update(item)
        .eq('id', item.id);

      if (error) throw error;

      toast.success('Platform fee formula updated successfully');
      setEditingItem(null);
      refetch();
    } catch (error) {
      console.error('Error updating formula:', error);
      toast.error('Failed to update formula');
    }
  };

  const handleCreate = async () => {
    try {
      const { error } = await supabase
        .from('master_platform_fee_formulas')
        .insert([newItem]);

      if (error) throw error;

      toast.success('Platform fee formula created successfully');
      setIsCreateDialogOpen(false);
      setNewItem({
        formula_name: '',
        description: '',
        formula_expression: '',
        engagement_model_id: '',
        formula_type: 'structured',
        platform_usage_fee_percentage: 0,
        base_management_fee: 0,
        base_consulting_fee: 0,
        advance_payment_percentage: 25,
        membership_discount_percentage: 0,
        country_id: '',
        currency_id: ''
      });
      refetch();
    } catch (error) {
      console.error('Error creating formula:', error);
      toast.error('Failed to create formula');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('master_platform_fee_formulas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Platform fee formula deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting formula:', error);
      toast.error('Failed to delete formula');
    }
  };

  if (isLoading) {
    return <div>Loading platform fee formulas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Fee Formulas</h2>
          <p className="text-muted-foreground">Manage fee calculation formulas for different engagement models</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Formula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Platform Fee Formula</DialogTitle>
              <DialogDescription>
                Define a new fee calculation formula with specific parameters
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formula_name">Formula Name</Label>
                <Input
                  value={newItem.formula_name}
                  onChange={(e) => setNewItem({...newItem, formula_name: e.target.value})}
                  placeholder="Enter formula name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="engagement_model">Engagement Model</Label>
                <Select value={newItem.engagement_model_id} onValueChange={(value) => setNewItem({...newItem, engagement_model_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engagement model" />
                  </SelectTrigger>
                  <SelectContent>
                    {engagementModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Enter formula description"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="formula_expression">Formula Expression</Label>
                <Textarea
                  value={newItem.formula_expression}
                  onChange={(e) => setNewItem({...newItem, formula_expression: e.target.value})}
                  placeholder="Enter mathematical formula expression"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform_fee">Platform Usage Fee (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.platform_usage_fee_percentage}
                  onChange={(e) => setNewItem({...newItem, platform_usage_fee_percentage: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_management">Base Management Fee</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.base_management_fee}
                  onChange={(e) => setNewItem({...newItem, base_management_fee: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_consulting">Base Consulting Fee</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.base_consulting_fee}
                  onChange={(e) => setNewItem({...newItem, base_consulting_fee: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advance_payment">Advance Payment (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.advance_payment_percentage}
                  onChange={(e) => setNewItem({...newItem, advance_payment_percentage: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Formula</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {formulas.map((formula) => (
          <Card key={formula.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {formula.formula_name}
                </CardTitle>
                <CardDescription>
                  {formula.engagement_model?.name} | {formula.country?.name || 'Global'}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Badge variant={formula.formula_type === 'structured' ? 'default' : 'secondary'}>
                  {formula.formula_type}
                </Badge>
                <Badge variant={formula.is_active ? "default" : "secondary"}>
                  {formula.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {editingItem?.id === formula.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="formula_name">Formula Name</Label>
                      <Input
                        value={editingItem.formula_name}
                        onChange={(e) => setEditingItem({...editingItem, formula_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform_fee">Platform Fee (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem.platform_usage_fee_percentage}
                        onChange={(e) => setEditingItem({...editingItem, platform_usage_fee_percentage: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="management_fee">Management Fee</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem.base_management_fee}
                        onChange={(e) => setEditingItem({...editingItem, base_management_fee: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consulting_fee">Consulting Fee</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem.base_consulting_fee}
                        onChange={(e) => setEditingItem({...editingItem, base_consulting_fee: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formula_expression">Formula Expression</Label>
                    <Textarea
                      value={editingItem.formula_expression}
                      onChange={(e) => setEditingItem({...editingItem, formula_expression: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleSave(editingItem)}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Platform Fee:</span> {formula.platform_usage_fee_percentage}%
                    </div>
                    <div>
                      <span className="font-medium">Management:</span> ${formula.base_management_fee}
                    </div>
                    <div>
                      <span className="font-medium">Consulting:</span> ${formula.base_consulting_fee}
                    </div>
                    <div>
                      <span className="font-medium">Advance:</span> {formula.advance_payment_percentage}%
                    </div>
                  </div>
                  {formula.description && (
                    <p className="text-sm text-muted-foreground">{formula.description}</p>
                  )}
                  {formula.formula_expression && (
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-sm">{formula.formula_expression}</code>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(formula)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(formula.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlatformFeeFormulasConfigSupabase;