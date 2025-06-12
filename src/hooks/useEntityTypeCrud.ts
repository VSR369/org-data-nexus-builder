
import { useState, useEffect } from 'react';
import { EntityTypeManager, EntityType, MembershipPlan } from '@/utils/entityTypeManager';
import { useToast } from '@/hooks/use-toast';

export const useEntityTypeCrud = () => {
  const { toast } = useToast();
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  const loadData = () => {
    try {
      setLoading(true);
      const types = EntityTypeManager.getAllEntityTypes();
      const plans = EntityTypeManager.getAllMembershipPlans();
      setEntityTypes(types);
      setMembershipPlans(plans);
      console.log('📋 Data loaded:', { entityTypes: types.length, membershipPlans: plans.length });
    } catch (error) {
      console.error('❌ Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data from storage",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Entity Type CRUD operations
  const createEntityType = (name: string) => {
    try {
      const newType = EntityTypeManager.saveEntityType({ name });
      setEntityTypes(prev => [...prev, newType]);
      toast({
        title: "Success",
        description: `Entity type "${name}" created successfully`
      });
      return newType;
    } catch (error) {
      console.error('❌ Error creating entity type:', error);
      toast({
        title: "Error",
        description: "Failed to create entity type",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateEntityType = (id: string, name: string) => {
    try {
      const updated = EntityTypeManager.updateEntityType(id, { name });
      if (updated) {
        setEntityTypes(prev => prev.map(et => et.id === id ? updated : et));
        toast({
          title: "Success",
          description: "Entity type updated successfully"
        });
        return updated;
      } else {
        throw new Error('Entity type not found');
      }
    } catch (error) {
      console.error('❌ Error updating entity type:', error);
      toast({
        title: "Error",
        description: "Failed to update entity type",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteEntityType = (id: string) => {
    try {
      const success = EntityTypeManager.deleteEntityType(id);
      if (success) {
        setEntityTypes(prev => prev.filter(et => et.id !== id));
        setMembershipPlans(prev => prev.filter(mp => mp.entityTypeId !== id));
        toast({
          title: "Success",
          description: "Entity type and associated plans deleted successfully"
        });
        return true;
      } else {
        throw new Error('Entity type not found');
      }
    } catch (error) {
      console.error('❌ Error deleting entity type:', error);
      toast({
        title: "Error",
        description: "Failed to delete entity type",
        variant: "destructive"
      });
      return false;
    }
  };

  // Membership Plan CRUD operations
  const createMembershipPlan = (planData: Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPlan = EntityTypeManager.saveMembershipPlan(planData);
      setMembershipPlans(prev => [...prev, newPlan]);
      toast({
        title: "Success",
        description: `Membership plan "${planData.name}" created successfully`
      });
      return newPlan;
    } catch (error) {
      console.error('❌ Error creating membership plan:', error);
      toast({
        title: "Error",
        description: "Failed to create membership plan",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateMembershipPlan = (id: string, updates: Partial<Omit<MembershipPlan, 'id' | 'createdAt'>>) => {
    try {
      const updated = EntityTypeManager.updateMembershipPlan(id, updates);
      if (updated) {
        setMembershipPlans(prev => prev.map(mp => mp.id === id ? updated : mp));
        toast({
          title: "Success",
          description: "Membership plan updated successfully"
        });
        return updated;
      } else {
        throw new Error('Membership plan not found');
      }
    } catch (error) {
      console.error('❌ Error updating membership plan:', error);
      toast({
        title: "Error",
        description: "Failed to update membership plan",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteMembershipPlan = (id: string) => {
    try {
      const success = EntityTypeManager.deleteMembershipPlan(id);
      if (success) {
        setMembershipPlans(prev => prev.filter(mp => mp.id !== id));
        toast({
          title: "Success",
          description: "Membership plan deleted successfully"
        });
        return true;
      } else {
        throw new Error('Membership plan not found');
      }
    } catch (error) {
      console.error('❌ Error deleting membership plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete membership plan",
        variant: "destructive"
      });
      return false;
    }
  };

  // Utility functions
  const seedDemoData = () => {
    EntityTypeManager.seedDemoData();
    loadData();
    toast({
      title: "Demo Data Loaded",
      description: "Sample entity types and membership plans have been created"
    });
  };

  const getMembershipPlansByEntityType = (entityTypeId: string) => {
    return membershipPlans.filter(plan => plan.entityTypeId === entityTypeId);
  };

  const getEntityTypeById = (id: string) => {
    return entityTypes.find(et => et.id === id) || null;
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  return {
    // Data
    entityTypes,
    membershipPlans,
    loading,
    
    // Actions
    loadData,
    seedDemoData,
    
    // Entity Type CRUD
    createEntityType,
    updateEntityType,
    deleteEntityType,
    
    // Membership Plan CRUD
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,
    
    // Utilities
    getMembershipPlansByEntityType,
    getEntityTypeById
  };
};
