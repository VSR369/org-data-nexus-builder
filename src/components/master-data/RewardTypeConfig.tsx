import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, DollarSign, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRewardTypes } from '@/hooks/useMasterDataCRUD';

const RewardTypeConfig = () => {
  const { toast } = useToast();
  const { items: rewardTypes, loading, addItem, updateItem, deleteItem } = useRewardTypes();
  const [newRewardType, setNewRewardType] = useState({ 
    type: 'non-monetary' as 'monetary' | 'non-monetary',
    name: '', 
    description: ''
  });

  const handleAddRewardType = async () => {
    if (!newRewardType.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a reward type name.",
        variant: "destructive",
      });
      return;
    }

    const success = await addItem({
      name: newRewardType.name.trim(),
      description: `${newRewardType.type}${newRewardType.description ? ': ' + newRewardType.description : ''}`,
      is_user_created: true
    });

    if (success) {
      setNewRewardType({ 
        type: 'non-monetary',
        name: '', 
        description: ''
      });
      toast({
        title: "Success",
        description: "Reward type added successfully.",
      });
    } else {
      toast({
        title: "Error", 
        description: "Failed to add reward type.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRewardType = async (rewardTypeId: string) => {
    const success = await deleteItem(rewardTypeId);
    
    if (success) {
      toast({
        title: "Success",
        description: "Reward type deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete reward type.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddRewardType();
  };

  const handleTypeChange = (value: 'monetary' | 'non-monetary') => {
    setNewRewardType({ 
      type: value, 
      name: '', 
      description: ''
    });
  };

  const getRewardTypeFromDescription = (description: string | undefined) => {
    if (!description) return 'non-monetary';
    return description.startsWith('monetary') ? 'monetary' : 'non-monetary';
  };

  const getCleanDescription = (description: string | undefined) => {
    if (!description) return '';
    if (description.startsWith('monetary:')) return description.replace('monetary:', '').trim();
    if (description.startsWith('non-monetary:')) return description.replace('non-monetary:', '').trim();
    return description;
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

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder={`${newRewardType.type === 'monetary' ? 'Monetary' : 'Non-Monetary'} Reward Type Description`}
                value={newRewardType.description}
                onChange={(e) => setNewRewardType({ ...newRewardType, description: e.target.value })}
              />
            </div>
            
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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Loading reward types...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {rewardTypes.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reward types configured yet.</p>
                  <p className="text-sm">Add your first reward type above to get started.</p>
                </div>
              ) : (
                rewardTypes.map(type => {
                  const rewardType = getRewardTypeFromDescription(type.description);
                  const cleanDescription = getCleanDescription(type.description);
                  
                  return (
                    <div key={type.id} className="flex items-center justify-between border rounded-md p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                          {rewardType === 'monetary' ? (
                            <DollarSign className="w-5 h-5" />
                          ) : (
                            <Award className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{type.name}</h3>
                            <Badge variant={rewardType === 'monetary' ? 'default' : 'secondary'}>
                              {rewardType === 'monetary' ? 'Monetary' : 'Non-Monetary'}
                            </Badge>
                          </div>
                          {cleanDescription && (
                            <p className="text-sm text-muted-foreground">{cleanDescription}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteRewardType(type.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardTypeConfig;