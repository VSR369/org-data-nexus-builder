
import React from "react";
import CountryConfig from "./master-data/CountryConfig";
import CurrencyConfig from "./master-data/CurrencyConfig";
import IndustrySegmentConfig from "./master-data/IndustrySegmentConfig";
import OrganizationTypeConfig from "./master-data/OrganizationTypeConfig";
import EntityTypeConfig from "./master-data/EntityTypeConfig";
import DepartmentConfig from "./master-data/DepartmentConfig";
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
import SolutionSeekersValidation from "./master-data/SolutionSeekersValidation";
import AdminCreationDiagnostic from "./master-data/AdminCreationDiagnostic";
import AdminRecoveryTool from "./master-data/AdminRecoveryTool";
import { CompleteDataResetButton } from "./admin/CompleteDataResetButton";
import LocalStorageDebugPanel from "./debug/LocalStorageDebugPanel";
import MasterDataDiagnostics from "./master-data/MasterDataDiagnostics";

interface MasterDataContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MasterDataContent: React.FC<MasterDataContentProps> = ({ activeSection }) => {
  console.log('MasterDataContent - activeSection:', activeSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'countries':
        return <CountryConfig />;
      case 'currencies':
        return <CurrencyConfig />;
      case 'industry-segments':
        return <IndustrySegmentConfig />;
      case 'organization-types':
        return <OrganizationTypeConfig />;
      case 'entity-types':
        return <EntityTypeConfig />;
      case 'departments':
        return <DepartmentConfig />;
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
      case 'solution-seekers-validation':
        return <SolutionSeekersValidation />;
      case 'global-cache-manager':
        return <GlobalCacheManager />;
      case 'complete-data-reset':
        return <CompleteDataResetButton />;
      case 'localstorage-debug':
        return <LocalStorageDebugPanel />;
      case 'master-data-diagnostics':
        return <MasterDataDiagnostics />;
      case 'admin-creation':
        return <AdminCreationDiagnostic />;
      case 'admin-recovery':
        return <AdminRecoveryTool />;
      default:
        return <DomainGroupsConfig />;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export default MasterDataContent;
