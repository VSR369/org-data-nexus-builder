import React from "react";
import ResponsiveDashboardWrapper from "./layout/ResponsiveDashboardWrapper";
import CountryConfigSupabase from "./master-data/CountryConfigSupabase";
import CurrencyConfigSupabase from "./master-data/CurrencyConfigSupabase";
import DomainGroupsConfigSupabase from "./masterData/DomainGroupsConfigSupabase";
import IndustrySegmentsConfigSupabase from "./master-data/IndustrySegmentsConfigSupabase";
import DepartmentConfigSupabase from "./master-data/DepartmentConfigSupabase";
import OrganizationTypeConfigSupabase from "./master-data/OrganizationTypeConfigSupabase";
import EntityTypeConfigSupabase from "./master-data/EntityTypeConfigSupabase";
import ChallengeStatusConfigSupabase from "./master-data/ChallengeStatusConfigSupabase";
import SolutionStatusConfigSupabase from "./master-data/SolutionStatusConfigSupabase";
import CapabilityLevelsConfig from "./master-data/CapabilityLevelsConfig";
import CommunicationTypeConfigSupabase from "./master-data/CommunicationTypeConfigSupabase";
import RewardTypeConfigSupabase from "./master-data/RewardTypeConfigSupabase";
import SeekerMembershipFeeConfig from "./master-data/SeekerMembershipFeeConfig";
import EngagementModelsConfig from "./master-data/EngagementModelsConfig";
import EventsCalendarConfig from "./master-data/EventsCalendarConfig";
import GlobalCacheManager from "./master-data/GlobalCacheManager";
import AdminCreationDiagnostic from "./master-data/AdminCreationDiagnostic";
import LocalStorageDebugPanel from "./debug/LocalStorageDebugPanel";
import MasterDataDiagnostics from "./master-data/MasterDataDiagnostics";
import SeekingOrgValidationDashboard from "./master-data/solution-seekers/SeekingOrgValidationDashboard";
import MigrationTester from "./MigrationTester";
import MasterDataTableTester from "./master-data/MasterDataTableTester";

interface MasterDataContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MasterDataContent: React.FC<MasterDataContentProps> = ({ activeSection }) => {
  console.log('MasterDataContent - activeSection:', activeSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'table-tester':
        return <MasterDataTableTester />;
      case 'migration-tester':
        return <MigrationTester />;
      case 'custom-data-manager':
        return <MasterDataDiagnostics />;
      case 'countries':
        return <CountryConfigSupabase />;
      case 'currencies':
        return <CurrencyConfigSupabase />;
      case 'domain-groups':
        return <DomainGroupsConfigSupabase />;
      case 'industry-segments':
        return <IndustrySegmentsConfigSupabase />;
      case 'organization-types':
        return <OrganizationTypeConfigSupabase />;
      case 'entity-types':
        return <EntityTypeConfigSupabase />;
      case 'departments':
        return <DepartmentConfigSupabase />;
      case 'challenge-statuses':
        return <ChallengeStatusConfigSupabase />;
      case 'solution-statuses':
        return <SolutionStatusConfigSupabase />;
      case 'capability-levels':
        return <CapabilityLevelsConfig />;
      case 'communication-types':
        return <CommunicationTypeConfigSupabase />;
      case 'reward-types':
        return <RewardTypeConfigSupabase />;
      case 'seeker-membership-fee':
        return <SeekerMembershipFeeConfig />;
      case 'engagement-models':
        return <EngagementModelsConfig />;
      case 'events-calendar':
        return <EventsCalendarConfig />;
      case 'global-cache-manager':
        return <GlobalCacheManager />;
      case 'localstorage-debug':
        return <LocalStorageDebugPanel />;
      case 'master-data-diagnostics':
        return <MasterDataDiagnostics />;
      case 'admin-creation':
        return <AdminCreationDiagnostic />;
      case 'solution-seekers-validation':
        return <SeekingOrgValidationDashboard />;
      default:
        return <MasterDataDiagnostics />;
    }
  };

  return (
    <ResponsiveDashboardWrapper
      layout="stack"
      padding="md"
      showBackground={true}
      className="min-h-screen"
    >
      {renderContent()}
    </ResponsiveDashboardWrapper>
  );
};

export default MasterDataContent;
