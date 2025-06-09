
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Gift } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface RewardType {
  id: string;
  name: string;
  type: 'monetary' | 'non-monetary';
  currency?: string;
  description: string;
}

const RewardTypeConfig = () => {
  const [rewardTypes, setRewardTypes] = useState<RewardType[]>([
    { id: '1', name: 'Cash Bonus', type: 'monetary', currency: 'INR', description: 'Direct cash reward for achievements' },
    { id: '2', name: 'Achievement Certificate', type: 'non-monetary', description: 'Certificate recognizing innovation contributions' },
    { id: '3', name: 'Gift Voucher', type: 'non-monetary', description: 'Vouchers for shopping or dining' },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentReward, setCurrentReward] = useState<Partial<RewardType>>({});
  const { toast } = useToast();

  const currencies = ['INR', 'USD', 'EUR', 'GBP'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentReward.name || !currentReward.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentReward.id) {
      setRewardTypes(prev => prev.map(item => 
        item.id === currentReward.id ? { ...currentReward as RewardType } : item
      ));
      toast({
        title: "Success",
        description: "Reward type updated successfully.",
      });
    } else {
      const newReward = {
        ...currentReward,
        id: Date.now().toString(),
      } as RewardType;
      setRewardTypes(prev => [...prev, newReward]);
      toast({
        title: "Success",
        description: "Reward type created successfully.",
      });
    }

    setCurrentReward({});
    setIsEditing(false);
  };

  const handleEdit = (reward: RewardType) => {
    setCurrentReward(reward);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setRewardTypes(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Reward type deleted successfully.",
    });
  };

  const resetForm = () => {
    setCurrentReward({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            {isEditing ? 'Edit Reward Type' : 'Add New Reward Type'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Reward Name *</Label>
                <Input
                  id="name"
                  value={currentReward.name || ''}
                  onChange={(e) => setCurrentReward(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter reward name"
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select 
                  value={currentReward.type || ''} 
                  onValueChange={(value) => setCurrentReward(prev => ({ ...prev, type: value as 'monetary' | 'non-monetary', currency: value === 'non-monetary' ? undefined : prev.currency }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monetary">Monetary</SelectItem>
                    <SelectItem value="non-monetary">Non-Monetary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentReward.type === 'monetary' && (
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={currentReward.currency || ''} 
                  onValueChange={(value) => setCurrentReward(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentReward.description || ''}
                onChange={(e) => setCurrentReward(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {isEditing ? 'Update' : 'Add'} Reward Type
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Reward Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rewardTypes.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{reward.name}</h3>
                    <Badge variant={reward.type === 'monetary' ? 'default' : 'secondary'}>
                      {reward.type === 'monetary' ? `Monetary${reward.currency ? ` (${reward.currency})` : ''}` : 'Non-Monetary'}
                    </Badge>
                  </div>
                  {reward.description && (
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(reward)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(reward.id)}>
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
