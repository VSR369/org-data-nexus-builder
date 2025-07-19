
import React from 'react';
import { CreditCard } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const SeekerMembershipFeesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('country')}
        </div>
      ),
    },
    {
      accessorKey: 'organization_type',
      header: 'Organization Type',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('organization_type')}
        </div>
      ),
    },
    {
      accessorKey: 'entity_type',
      header: 'Entity Type',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('entity_type')}
        </div>
      ),
    },
    {
      accessorKey: 'monthly_amount',
      header: 'Monthly Amount',
      cell: ({ row }: any) => (
        <div className="text-sm font-mono">
          {row.getValue('monthly_currency')} {row.getValue('monthly_amount')}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_seeker_membership_fees"
      title="Seeker Membership Fees Manager"
      description="Manage membership fees for solution seeking organizations"
      icon={CreditCard}
      additionalColumns={additionalColumns}
    />
  );
};

export default SeekerMembershipFeesManager;
