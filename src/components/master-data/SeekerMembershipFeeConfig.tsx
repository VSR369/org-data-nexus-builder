
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMembershipFeeDataSupabase } from './seeker-membership/useMembershipFeeDataSupabase';
import { MembershipFeeEntry } from './seeker-membership/types';
import DataHealthStatus from './seeker-membership/DataHealthStatus';
import MembershipFeeForm from './seeker-membership/MembershipFeeForm';
import MembershipConfigsList from './seeker-membership/MembershipConfigsList';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { organizationTypesDataManager } from '@/utils/sharedDataManagers';

const SeekerMembershipFeeConfig = () => {
  const [editingEntry, setEditingEntry] = useState<MembershipFeeEntry | null>(null);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const { toast } = useToast();
  
  const {
    membershipFees,
    currencies,
    countries,
    entityTypes,
    userCurrencies,
    isLoading,
    isInitialized,
    setMembershipFeesSafely,
    saveMembershipFee,
    deleteMembershipFee,
    reloadMasterData,
    dataHealth
  } = useMembershipFeeDataSupabase();

  // Load organization types from master data
  useEffect(() => {
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    console.log('🔄 Loading organization types:', loadedOrgTypes);
    setOrganizationTypes(loadedOrgTypes);
  }, []);

  // Load data on component mount only if not already initialized
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      console.log('🚀 Component mounted - triggering data reload...');
      reloadMasterData();
    }
  }, [isInitialized, isLoading]);

  const handleSubmit = async (entry: MembershipFeeEntry) => {
    const success = await saveMembershipFee(entry);
    
    if (success) {
      setEditingEntry(null);
      toast({
        title: editingEntry ? "Fee Updated" : "Fee Added",
        description: `Membership fee has been ${editingEntry ? 'updated' : 'added'} successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save membership fee",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (entry: MembershipFeeEntry) => {
    setEditingEntry(entry);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteMembershipFee(id);
    
    if (success) {
      toast({
        title: "Fee Deleted", 
        description: "Membership fee has been deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete membership fee",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading membership fee configuration...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataHealthStatus dataHealth={dataHealth} />
      
      <MembershipFeeForm
        currencies={currencies}
        countries={countries}
        entityTypes={entityTypes}
        organizationTypes={organizationTypes}
        membershipFees={membershipFees}
        onSubmit={handleSubmit}
        editingEntry={editingEntry}
        onCancelEdit={handleCancelEdit}
      />

      <MembershipConfigsList
        membershipFees={membershipFees}
        currencies={currencies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SeekerMembershipFeeConfig;
