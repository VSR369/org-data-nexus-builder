
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
import { useRewardTypes, useCurrencies } from '@/hooks/useMasterDataCRUD';

const RewardTypeConfig = () => {
  const [rewardTypes, setRewardTypes] = useState<RewardType[]>([]);
  const [newRewardType, setNewRewardType] = useState({ 
    type: 'non-monetary' as 'monetary' | 'non-monetary',
    name: '', 
    description: '',
    currency: '',
    amount: ''
  });
  const [currencies, setCurrencies] = useState<any[]>([]);
  const { toast } = useToast();

  const [isInitialized, setIsInitialized] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadedRewardTypes = RewardTypeService.getRewardTypes();
    const loadedCurrencies = CurrencyService.getCurrencies();
    console.log('🔍 RewardTypeConfig - Loaded reward types from service:', loadedRewardTypes);
    setRewardTypes(loadedRewardTypes);
    setCurrencies(loadedCurrencies);
    setIsInitialized(true);
  }, []);

  // Save data whenever rewardTypes change
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    console.log('💾 RewardTypeConfig - Saving reward types to service:', rewardTypes.length);
    RewardTypeService.saveRewardTypes(rewardTypes);
  }, [rewardTypes, isInitialized]);

  const addRewardType = () => {
    if (newRewardType.type === 'monetary') {
      if (newRewardType.name && newRewardType.currency && newRewardType.amount) {
        const newType: RewardType = {
          id: Date.now().toString(),
          type: 'monetary',
          name: newRewardType.name,
          currency: newRewardType.currency,
          amount: parseFloat(newRewardType.amount),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setRewardTypes([...rewardTypes, newType]);
        setNewRewardType({ type: 'non-monetary', name: '', description: '', currency: '', amount: '' });
        toast({
          title: "Monetary Reward Type Added",
          description: `Successfully added ${newType.name}.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Please fill in name, currency, and amount fields.",
          variant: "destructive",
        });
      }
    } else {
      if (newRewardType.name && newRewardType.description) {
        const newType: RewardType = {
          id: Date.now().toString(),
          type: 'non-monetary',
          name: newRewardType.name,
          description: newRewardType.description,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setRewardTypes([...rewardTypes, newType]);
        setNewRewardType({ type: 'non-monetary', name: '', description: '', currency: '', amount: '' });
        toast({
          title: "Non-Monetary Reward Type Added",
          description: `Successfully added ${newType.name}.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Please fill in name and description fields.",
          variant: "destructive",
        });
      }
    }
  };

  const removeRewardType = (id: string) => {
    setRewardTypes(rewardTypes.filter(type => type.id !== id));
    toast({
      title: "Reward Type Removed",
      description: "Successfully removed reward type.",
    });
  };

  const updateRewardType = (id: string, updatedType: Partial<RewardType>) => {
    const updatedRewardTypes = rewardTypes.map(type =>
      type.id === id ? { ...type, ...updatedType, updatedAt: new Date().toISOString() } : type
    );
    setRewardTypes(updatedRewardTypes);
    toast({
      title: "Reward Type Updated",
      description: "Successfully updated reward type.",
    });
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
                        <SelectItem key={currency.id} value={currency.code}>
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
            
            <Button type="submit" className="w-fit">
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
            {rewardTypes.map(type => (
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
                        updateRewardType(type.id, { name: newName });
                      }
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeRewardType(type.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardTypeConfig;
