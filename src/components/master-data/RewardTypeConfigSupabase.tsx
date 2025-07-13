import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, DollarSign, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RewardType {
  id?: string;
  name: string;
  description?: string;
  type?: string;
  currency?: string;
  amount?: number;
  created_at?: string;
  updated_at?: string;
}

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol?: string;
}

const RewardTypeConfigSupabase = () => {
  const [rewardTypes, setRewardTypes] = useState<RewardType[]>([]);
  const [newRewardType, setNewRewardType] = useState({ 
    type: 'non-monetary' as 'monetary' | 'non-monetary',
    name: '', 
    description: '',
    currency: '',
    amount: ''
  });
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadRewardTypes();
    loadCurrencies();
  }, []);

  const loadRewardTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('master_reward_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setRewardTypes(data || []);
    } catch (error) {
      console.error('Error loading reward types:', error);
      toast({
        title: "Error",
        description: "Failed to load reward types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCurrencies = async () => {
    try {
      const { data, error } = await supabase
        .from('master_currencies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCurrencies(data || []);
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  };

  const addRewardType = async () => {
    if (newRewardType.type === 'monetary') {
      if (newRewardType.name && newRewardType.currency && newRewardType.amount) {
        try {
          const { error } = await supabase
            .from('master_reward_types')
            .insert({
              type: 'monetary',
              name: newRewardType.name,
              currency: newRewardType.currency,
              amount: parseFloat(newRewardType.amount)
            });

          if (error) throw error;
          
          setNewRewardType({ type: 'non-monetary', name: '', description: '', currency: '', amount: '' });
          loadRewardTypes();
          toast({
            title: "Monetary Reward Type Added",
            description: `Successfully added ${newRewardType.name}.`,
          });
        } catch (error) {
          console.error('Error adding reward type:', error);
          toast({
            title: "Error",
            description: "Failed to add reward type",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please fill in name, currency, and amount fields.",
          variant: "destructive",
        });
      }
    } else {
      if (newRewardType.name && newRewardType.description) {
        try {
          const { error } = await supabase
            .from('master_reward_types')
            .insert({
              type: 'non-monetary',
              name: newRewardType.name,
              description: newRewardType.description
            });

          if (error) throw error;
          
          setNewRewardType({ type: 'non-monetary', name: '', description: '', currency: '', amount: '' });
          loadRewardTypes();
          toast({
            title: "Non-Monetary Reward Type Added",
            description: `Successfully added ${newRewardType.name}.`,
          });
        } catch (error) {
          console.error('Error adding reward type:', error);
          toast({
            title: "Error",
            description: "Failed to add reward type",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please fill in name and description fields.",
          variant: "destructive",
        });
      }
    }
  };

  const removeRewardType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('master_reward_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      loadRewardTypes();
      toast({
        title: "Reward Type Removed",
        description: "Successfully removed reward type.",
      });
    } catch (error) {
      console.error('Error removing reward type:', error);
      toast({
        title: "Error",
        description: "Failed to remove reward type",
        variant: "destructive",
      });
    }
  };

  const updateRewardType = async (id: string, updatedType: Partial<RewardType>) => {
    try {
      const { error } = await supabase
        .from('master_reward_types')
        .update(updatedType)
        .eq('id', id);

      if (error) throw error;
      
      loadRewardTypes();
      toast({
        title: "Reward Type Updated",
        description: "Successfully updated reward type.",
      });
    } catch (error) {
      console.error('Error updating reward type:', error);
      toast({
        title: "Error",
        description: "Failed to update reward type",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRewardType();
  };

  const handleTypeChange = (value: 'monetary' | 'non-monetary') => {
    setNewRewardType({ 
      type: value, 
      name: '', 
      description: '', 
      currency: '', 
      amount: '' 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Reward Type</CardTitle>
          <CardDescription>Add a new monetary or non-monetary reward type to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Reward Type</Label>
              <Select value={newRewardType.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reward type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monetary">Monetary</SelectItem>
                  <SelectItem value="non-monetary">Non-Monetary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newRewardType.name}
                onChange={(e) => setNewRewardType({ ...newRewardType, name: e.target.value })}
                placeholder="Reward Type Name"
              />
            </div>

            {newRewardType.type === 'monetary' ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={newRewardType.currency} onValueChange={(value) => setNewRewardType({ ...newRewardType, currency: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.code || currency.name}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newRewardType.amount}
                    onChange={(e) => setNewRewardType({ ...newRewardType, amount: e.target.value })}
                    placeholder="Reward amount"
                    min="0"
                    step="0.01"
                  />
                </div>
              </>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Non-Monetary Reward Type Description"
                  value={newRewardType.description}
                  onChange={(e) => setNewRewardType({ ...newRewardType, description: e.target.value })}
                />
              </div>
            )}
            
            <Button type="submit" className="w-fit" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add {newRewardType.type === 'monetary' ? 'Monetary' : 'Non-Monetary'} Reward Type
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reward Types</CardTitle>
          <CardDescription>Manage existing reward types.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : rewardTypes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No reward types configured. Add some reward types to get started.
              </p>
            ) : (
              rewardTypes.map(type => (
                <div key={type.id} className="flex items-center justify-between border rounded-md p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      {type.type === 'monetary' ? (
                        <DollarSign className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{type.name}</h3>
                        <Badge variant={type.type === 'monetary' ? 'default' : 'secondary'}>
                          {type.type === 'monetary' ? 'Monetary' : 'Non-Monetary'}
                        </Badge>
                      </div>
                      {type.type === 'monetary' ? (
                        <p className="text-sm text-muted-foreground">
                          {type.currency} {type.amount?.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newName = prompt("Enter new name", type.name);
                        if (newName) {
                          updateRewardType(type.id!, { name: newName });
                        }
                      }}
                      disabled={loading}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeRewardType(type.id!)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardTypeConfigSupabase;