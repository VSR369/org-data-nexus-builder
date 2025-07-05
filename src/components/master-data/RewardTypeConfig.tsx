
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RewardTypeService, RewardType } from '@/utils/masterData/rewardTypeService';

const RewardTypeConfig = () => {
  const [rewardTypes, setRewardTypes] = useState<RewardType[]>([]);
  const [newRewardType, setNewRewardType] = useState({ name: '', description: '' });
  const { toast } = useToast();

  const [isInitialized, setIsInitialized] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadedRewardTypes = RewardTypeService.getRewardTypes();
    console.log('🔍 RewardTypeConfig - Loaded reward types from service:', loadedRewardTypes);
    setRewardTypes(loadedRewardTypes);
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
    if (newRewardType.name && newRewardType.description) {
      const newType: RewardType = {
        id: Date.now().toString(),
        name: newRewardType.name,
        description: newRewardType.description,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setRewardTypes([...rewardTypes, newType]);
      setNewRewardType({ name: '', description: '' });
      toast({
        title: "Non-Monetary Reward Type Added",
        description: `Successfully added ${newType.name}.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
    }
  };

  const removeRewardType = (id: string) => {
    setRewardTypes(rewardTypes.filter(type => type.id !== id));
    toast({
      title: "Non-Monetary Reward Type Removed",
      description: "Successfully removed reward type.",
    });
  };

  const updateRewardType = (id: string, updatedType: Partial<RewardType>) => {
    const updatedRewardTypes = rewardTypes.map(type =>
      type.id === id ? { ...type, ...updatedType, updatedAt: new Date().toISOString() } : type
    );
    setRewardTypes(updatedRewardTypes);
    toast({
      title: "Non-Monetary Reward Type Updated",
      description: "Successfully updated reward type.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRewardType();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Non-Monetary Reward Type</CardTitle>
          <CardDescription>Add a new non-monetary reward type to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newRewardType.name}
                onChange={(e) => setNewRewardType({ ...newRewardType, name: e.target.value })}
                placeholder="Non-Monetary Reward Type Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Non-Monetary Reward Type Description"
                value={newRewardType.description}
                onChange={(e) => setNewRewardType({ ...newRewardType, description: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Add Non-Monetary Reward Type
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Non-Monetary Reward Types</CardTitle>
          <CardDescription>Manage existing non-monetary reward types.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {rewardTypes.map(type => (
              <div key={type.id} className="flex items-center justify-between border rounded-md p-4">
                <div>
                  <h3 className="text-lg font-semibold">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
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
