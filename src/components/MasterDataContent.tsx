
import React from 'react';

// Import ONLY ConfigSupabase components - Original Architecture Restored
import OrganizationTypeConfigSupabase from './master-data/OrganizationTypeConfigSupabase';
import EntityTypeConfigSupabase from './master-data/EntityTypeConfigSupabase';
import IndustrySegmentsConfigSupabase from './master-data/IndustrySegmentsConfigSupabase';
import RewardTypeConfigSupabase from './master-data/RewardTypeConfigSupabase';
import CountryConfigSupabase from './master-data/CountryConfigSupabase';
import CurrencyConfigSupabase from './master-data/CurrencyConfigSupabase';
import DomainGroupsConfigSupabase from './master-data/DomainGroupsConfigSupabase';
import DepartmentsConfigSupabase from './master-data/DepartmentsConfigSupabase';
import CategoriesConfigSupabase from './master-data/CategoriesConfigSupabase';
import SubCategoriesConfigSupabase from './master-data/SubCategoriesConfigSupabase';
import SubDepartmentsConfigSupabase from './master-data/SubDepartmentsConfigSupabase';
import TeamUnitsConfigSupabase from './master-data/TeamUnitsConfigSupabase';
import BillingFrequenciesConfigSupabase from './master-data/BillingFrequenciesConfigSupabase';
import MembershipStatusesConfigSupabase from './master-data/MembershipStatusesConfigSupabase';
import UnitsOfMeasureConfigSupabase from './master-data/UnitsOfMeasureConfigSupabase';
import EngagementModelsConfigSupabase from './master-data/EngagementModelsConfigSupabase';
import CommunicationTypesConfigSupabase from './master-data/CommunicationTypesConfigSupabase';
import SolutionSeekersConfigSupabase from './master-data/SolutionSeekersConfigSupabase';

interface MasterDataContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MasterDataContent: React.FC<MasterDataContentProps> = ({ activeSection }) => {
  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'solution-seekers':
        return <SolutionSeekersConfigSupabase />;
      case 'domain-groups':
        return <DomainGroupsConfigSupabase />;
      case 'categories':
        return <CategoriesConfigSupabase />;
      case 'sub-categories':
        return <SubCategoriesConfigSupabase />;
      case 'countries':
        return <CountryConfigSupabase />;
      case 'currencies':
        return <CurrencyConfigSupabase />;
      case 'organization-types':
        return <OrganizationTypeConfigSupabase />;
      case 'entity-types':
        return <EntityTypeConfigSupabase />;
      case 'industry-segments':
        return <IndustrySegmentsConfigSupabase />;
      case 'departments':
        return <DepartmentsConfigSupabase />;
      case 'sub-departments':
        return <SubDepartmentsConfigSupabase />;
      case 'team-units':
        return <TeamUnitsConfigSupabase />;
      case 'billing-frequencies':
        return <BillingFrequenciesConfigSupabase />;
      case 'membership-statuses':
        return <MembershipStatusesConfigSupabase />;
      case 'units-of-measure':
        return <UnitsOfMeasureConfigSupabase />;
      case 'engagement-models':
        return <EngagementModelsConfigSupabase />;
      case 'communication-types':
        return <CommunicationTypesConfigSupabase />;
      case 'reward-types':
        return <RewardTypeConfigSupabase />;
      default:
        return <DomainGroupsConfigSupabase />;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {renderActiveComponent()}
    </div>
  );
};

export default MasterDataContent;
