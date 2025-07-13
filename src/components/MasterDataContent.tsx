import React from "react";
import ResponsiveDashboardWrapper from "./layout/ResponsiveDashboardWrapper";
import CountryConfig from "./master-data/CountryConfig";
import CurrencyConfig from "./master-data/CurrencyConfig";
import IndustrySegmentsConfig from "./master-data/IndustrySegmentsConfig";
import DepartmentsConfig from "./master-data/DepartmentsConfig";
import OrganizationTypeConfig from "./master-data/OrganizationTypeConfig";
import OrganizationTypeConfigSupabase from "./master-data/OrganizationTypeConfigSupabase";
import EntityTypeConfig from "./master-data/EntityTypeConfig";
import DomainGroupsConfig from "./master-data/DomainGroupsConfig";
import ChallengeStatusConfig from "./master-data/ChallengeStatusConfig";
import SolutionStatusConfig from "./master-data/SolutionStatusConfig";
import CompetencyCapabilityConfig from "./master-data/CompetencyCapabilityConfig";
import CommunicationTypeConfig from "./master-data/CommunicationTypeConfig";
import RewardTypeConfig from "./master-data/RewardTypeConfig";
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
        return <CountryConfig />;
      case 'currencies':
        return <CurrencyConfig />;
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
