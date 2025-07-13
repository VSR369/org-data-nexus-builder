import React from "react";
import ResponsiveDashboardWrapper from "./layout/ResponsiveDashboardWrapper";
import CountryConfigSupabase from "./master-data/CountryConfigSupabase";
import CurrencyConfigSupabase from "./master-data/CurrencyConfigSupabase";
import IndustrySegmentsConfigSupabase from "./master-data/IndustrySegmentsConfigSupabase";
import DepartmentsConfigSupabase from "./master-data/DepartmentsConfigSupabase";
import OrganizationTypeConfigSupabase from "./master-data/OrganizationTypeConfigSupabase";
import EntityTypeConfigSupabase from "./master-data/EntityTypeConfigSupabase";
import DomainGroupsConfig from "./master-data/DomainGroupsConfig";
import ChallengeStatusConfigSupabase from "./master-data/ChallengeStatusConfigSupabase";
import SolutionStatusConfigSupabase from "./master-data/SolutionStatusConfigSupabase";
import CompetencyCapabilityConfig from "./master-data/CompetencyCapabilityConfig";
import CommunicationTypeConfigSupabase from "./master-data/CommunicationTypeConfigSupabase";
import RewardTypeConfigSupabase from "./master-data/RewardTypeConfigSupabase";
import SeekerMembershipFeeConfig from "./master-data/SeekerMembershipFeeConfig";
import EngagementModelsConfig from "./master-data/EngagementModelsConfig";
import PricingConfig from "./master-data/PricingConfig";
import EventsCalendarConfig from "./master-data/EventsCalendarConfig";
import GlobalCacheManager from "./master-data/GlobalCacheManager";
import AdminCreationDiagnostic from "./master-data/AdminCreationDiagnostic";
import LocalStorageDebugPanel from "./debug/LocalStorageDebugPanel";
import MasterDataDiagnostics from "./master-data/MasterDataDiagnostics";
import CustomDataManager from "./master-data/CustomDataManager";
import DataProtectionPanel from "./master-data/DataProtectionPanel";
import SeekingOrgValidationDashboard from "./master-data/solution-seekers/SeekingOrgValidationDashboard";
import MigrationTester from "./MigrationTester";

interface MasterDataContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MasterDataContent: React.FC<MasterDataContentProps> = ({ activeSection }) => {
  console.log('MasterDataContent - activeSection:', activeSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'migration-tester':
        return <MigrationTester />;
      case 'custom-data-manager':
        return <CustomDataManager />;
      case 'countries':
        return <CountryConfigSupabase />;
      case 'currencies':
        return <CurrencyConfigSupabase />;
      case 'industry-segments':
        return <IndustrySegmentsConfig />;
      case 'organization-types':
        return <OrganizationTypeConfigSupabase />;
      case 'entity-types':
        return <EntityTypeConfig />;
      case 'departments':
        return <DepartmentsConfig />;
      case 'domain-groups':
        return <DomainGroupsConfig />;
      case 'challenge-statuses':
        return <ChallengeStatusConfig />;
      case 'solution-statuses':
        return <SolutionStatusConfig />;
      case 'competency-capabilities':
        return <CompetencyCapabilityConfig />;
      case 'communication-types':
        return <CommunicationTypeConfig />;
      case 'reward-types':
        return <RewardTypeConfig />;
      case 'seeker-membership-fee':
        return <SeekerMembershipFeeConfig />;
      case 'engagement-models':
        return <EngagementModelsConfig />;
      case 'pricing':
        return <PricingConfig />;
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
      case 'data-protection':
        return <DataProtectionPanel />;
      case 'solution-seekers-validation':
        return <SeekingOrgValidationDashboard />;
      default:
        return <CustomDataManager />;
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
