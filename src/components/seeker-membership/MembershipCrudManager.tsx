
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Database, RefreshCw } from 'lucide-react';
import { useEntityTypeCrud } from '@/hooks/useEntityTypeCrud';
import { EntityType, MembershipPlan } from '@/utils/entityTypeManager';

const MembershipCrudManager = () => {
  const {
    entityTypes,
    membershipPlans,
    loading,
    loadData,
    seedDemoData,
    createEntityType,
    updateEntityType,
    deleteEntityType,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,
    getEntityTypeById
  } = useEntityTypeCrud();

  // Entity Type form state
  const [entityTypeForm, setEntityTypeForm] = useState({ name: '' });
  const [editingEntityType, setEditingEntityType] = useState<EntityType | null>(null);
  const [entityTypeDialogOpen, setEntityTypeDialogOpen] = useState(false);

  // Membership Plan form state
  const [planForm, setPlanForm] = useState({
    name: '',
    fee: 0,
    currency: 'USD',
    entityTypeId: '',
    duration: 'quarterly' as 'quarterly' | 'halfYearly' | 'annual'
  });
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);

  // Entity Type handlers
  const handleCreateEntityType = () => {
    if (entityTypeForm.name.trim()) {
      createEntityType(entityTypeForm.name.trim());
      setEntityTypeForm({ name: '' });
      setEntityTypeDialogOpen(false);
    }
  };

  const handleEditEntityType = (entityType: EntityType) => {
    setEditingEntityType(entityType);
    setEntityTypeForm({ name: entityType.name });
    setEntityTypeDialogOpen(true);
  };

  const handleUpdateEntityType = () => {
    if (editingEntityType && entityTypeForm.name.trim()) {
      updateEntityType(editingEntityType.id, entityTypeForm.name.trim());
      setEditingEntityType(null);
      setEntityTypeForm({ name: '' });
      setEntityTypeDialogOpen(false);
    }
  };

  const handleDeleteEntityType = (entityType: EntityType) => {
    if (confirm(`Are you sure you want to delete "${entityType.name}"? This will also delete all associated membership plans.`)) {
      deleteEntityType(entityType.id);
    }
  };

  // Membership Plan handlers
  const handleCreatePlan = () => {
    if (planForm.name.trim() && planForm.entityTypeId && planForm.fee > 0) {
      createMembershipPlan({
        name: planForm.name.trim(),
        fee: planForm.fee,
        currency: planForm.currency,
        entityTypeId: planForm.entityTypeId,
        duration: planForm.duration
      });
      setPlanForm({ name: '', fee: 0, currency: 'USD', entityTypeId: '', duration: 'quarterly' });
      setPlanDialogOpen(false);
    }
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      fee: plan.fee,
      currency: plan.currency,
      entityTypeId: plan.entityTypeId,
      duration: plan.duration
    });
    setPlanDialogOpen(true);
  };

  const handleUpdatePlan = () => {
    if (editingPlan && planForm.name.trim() && planForm.entityTypeId && planForm.fee > 0) {
      updateMembershipPlan(editingPlan.id, {
        name: planForm.name.trim(),
        fee: planForm.fee,
        currency: planForm.currency,
        entityTypeId: planForm.entityTypeId,
        duration: planForm.duration
      });
      setEditingPlan(null);
      setPlanForm({ name: '', fee: 0, currency: 'USD', entityTypeId: '', duration: 'quarterly' });
      setPlanDialogOpen(false);
    }
  };

  const handleDeletePlan = (plan: MembershipPlan) => {
    if (confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      deleteMembershipPlan(plan.id);
    }
  };

  const resetForms = () => {
    setEditingEntityType(null);
    setEditingPlan(null);
    setEntityTypeForm({ name: '' });
    setPlanForm({ name: '', fee: 0, currency: 'USD', entityTypeId: '', duration: 'quarterly' });
    setEntityTypeDialogOpen(false);
    setPlanDialogOpen(false);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Membership Management</h2>
          <p className="text-muted-foreground">Manage entity types and membership plans</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={seedDemoData} variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            Load Demo Data
          </Button>
        </div>
      </div>

      {/* Entity Types Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Entity Types ({entityTypes.length})</CardTitle>
              <CardDescription>Manage organization entity types</CardDescription>
            </div>
            <Dialog open={entityTypeDialogOpen} onOpenChange={(open) => {
              setEntityTypeDialogOpen(open);
              if (!open) resetForms();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entity Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingEntityType ? 'Edit Entity Type' : 'Create Entity Type'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingEntityType ? 'Update the entity type details' : 'Add a new entity type for organizations'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="entityTypeName">Entity Type Name</Label>
                    <Input
                      id="entityTypeName"
                      value={entityTypeForm.name}
                      onChange={(e) => setEntityTypeForm({ name: e.target.value })}
                      placeholder="e.g., Commercial, Non-Profit"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={editingEntityType ? handleUpdateEntityType : handleCreateEntityType}
                      disabled={!entityTypeForm.name.trim()}
                    >
                      {editingEntityType ? 'Update' : 'Create'}
                    </Button>
                    <Button variant="outline" onClick={() => setEntityTypeDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {entityTypes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No entity types created yet</p>
          ) : (
            <div className="grid gap-3">
              {entityTypes.map((entityType) => (
                <div key={entityType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{entityType.name}</span>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(entityType.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEntityType(entityType)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEntityType(entityType)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Membership Plans Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Membership Plans ({membershipPlans.length})</CardTitle>
              <CardDescription>Manage membership plans and pricing</CardDescription>
            </div>
            <Dialog open={planDialogOpen} onOpenChange={(open) => {
              setPlanDialogOpen(open);
              if (!open) resetForms();
            }}>
              <DialogTrigger asChild>
                <Button disabled={entityTypes.length === 0}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Membership Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? 'Edit Membership Plan' : 'Create Membership Plan'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPlan ? 'Update the membership plan details' : 'Add a new membership plan'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      value={planForm.name}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Commercial Quarterly"
                    />
                  </div>
                  <div>
                    <Label htmlFor="entityType">Entity Type</Label>
                    <Select 
                      value={planForm.entityTypeId} 
                      onValueChange={(value) => setPlanForm(prev => ({ ...prev, entityTypeId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {entityTypes.map((et) => (
                          <SelectItem key={et.id} value={et.id}>{et.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fee">Fee Amount</Label>
                      <Input
                        id="fee"
                        type="number"
                        value={planForm.fee}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, fee: Number(e.target.value) }))}
                        placeholder="199"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={planForm.currency} 
                        onValueChange={(value) => setPlanForm(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Select 
                      value={planForm.duration} 
                      onValueChange={(value: 'quarterly' | 'halfYearly' | 'annual') => 
                        setPlanForm(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="halfYearly">Half-Yearly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}
                      disabled={!planForm.name.trim() || !planForm.entityTypeId || planForm.fee <= 0}
                    >
                      {editingPlan ? 'Update' : 'Create'}
                    </Button>
                    <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {membershipPlans.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {entityTypes.length === 0 
                ? "Create entity types first, then add membership plans" 
                : "No membership plans created yet"}
            </p>
          ) : (
            <div className="grid gap-3">
              {membershipPlans.map((plan) => {
                const entityType = getEntityTypeById(plan.entityTypeId);
                return (
                  <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">{plan.name}</span>
                        <Badge variant="outline">{entityType?.name || 'Unknown Type'}</Badge>
                        <Badge variant="secondary">{plan.duration}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-semibold text-lg text-foreground">
                          {plan.currency} {plan.fee.toLocaleString()}
                        </span>
                        <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePlan(plan)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipCrudManager;
