
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMembershipFeeData } from './seeker-membership/useMembershipFeeData';
import { MembershipFeeEntry } from './seeker-membership/types';
import DataHealthStatus from './seeker-membership/DataHealthStatus';
import MembershipFeeForm from './seeker-membership/MembershipFeeForm';
import MembershipConfigsList from './seeker-membership/MembershipConfigsList';

const SeekerMembershipFeeConfig = () => {
  const [editingEntry, setEditingEntry] = useState<MembershipFeeEntry | null>(null);
  const { toast } = useToast();
  
  const {
    membershipFees,
    setMembershipFees,
    currencies,
    countries,
    entityTypes,
    dataHealth,
    reloadMasterData,
    userCurrencies
  } = useMembershipFeeData();

  // Load data on component mount
  useEffect(() => {
    reloadMasterData();
  }, []);

  const handleSubmit = (entry: MembershipFeeEntry) => {
    if (editingEntry) {
      setMembershipFees(prev => 
        prev.map(item => item.id === entry.id ? entry : item)
      );
    } else {
      setMembershipFees(prev => [...prev, entry]);
    }
    setEditingEntry(null);
  };

  const handleEdit = (entry: MembershipFeeEntry) => {
    setEditingEntry(entry);
  };

  const handleDelete = (id: string) => {
    setMembershipFees(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Seeker membership fee deleted successfully.",
    });
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  return (
    <div className="space-y-6">
      <DataHealthStatus dataHealth={dataHealth} />
      
      <MembershipFeeForm
        currencies={currencies}
        countries={countries}
        entityTypes={entityTypes}
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
