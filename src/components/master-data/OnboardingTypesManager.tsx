
import React from 'react';
import { UserCheck } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const OnboardingTypesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'service_type',
      header: 'Service Type',
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">
          {row.getValue('service_type')}
        </div>
      ),
    },
    {
      accessorKey: 'resources_included',
      header: 'Resources',
      cell: ({ row }: any) => {
        const resources = row.getValue('resources_included') || [];
        return (
          <div className="text-sm">
            {Array.isArray(resources) ? resources.length : 0} resources
          </div>
        );
      },
    },
  ];

  return (
    <StandardDataManager
      tableName="master_onboarding_types"
      title="Onboarding Types Manager"
      description="Manage onboarding service types and configurations"
      icon={UserCheck}
      additionalColumns={additionalColumns}
    />
  );
};

export default OnboardingTypesManager;
