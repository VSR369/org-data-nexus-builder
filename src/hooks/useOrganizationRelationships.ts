import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RelationshipMapping {
  id?: string;
  organization_type_id?: string;
  organization_category_id?: string;
  department_id?: string;
  is_active?: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

interface OrganizationRelationshipsHook {
  loadRelationships: () => Promise<void>;
  addRelationship: (relationship: any) => Promise<boolean>;
  updateRelationship: (id: string, updates: any) => Promise<boolean>;
  deleteRelationship: (id: string) => Promise<boolean>;
  relationships: RelationshipMapping[];
  loading: boolean;
}

type RelationshipTableName = 'master_org_type_category_mapping' | 'master_org_type_department_mapping' | 'master_org_category_department_mapping';

export function useOrganizationRelationships(tableName: RelationshipTableName): OrganizationRelationshipsHook {
  const [relationships, setRelationships] = useState<RelationshipMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadRelationships = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      setRelationships(data || []);
    } catch (error) {
      console.error(`Error loading ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${tableName}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRelationship = async (relationship: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .insert([relationship])
        .select()
        .single();
      
      if (error) throw error;
      setRelationships(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Relationship added successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error adding to ${tableName}:`, error);
      toast({
        title: "Error",
        description: "Failed to add relationship",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateRelationship = async (id: string, updates: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setRelationships(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Success",
        description: "Relationship updated successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      toast({
        title: "Error",
        description: "Failed to update relationship",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRelationship = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setRelationships(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Relationship deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      toast({
        title: "Error",
        description: "Failed to delete relationship",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelationships();
  }, [tableName]);

  return {
    relationships,
    loading,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    loadRelationships,
  };
}