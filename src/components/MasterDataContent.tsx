import React from "react";
import ResponsiveDashboardWrapper from "./layout/ResponsiveDashboardWrapper";
import CountryConfigSupabase from "./master-data/CountryConfigSupabase";
import CurrencyConfigSupabase from "./master-data/CurrencyConfigSupabase";
import DomainGroupsConfigSupabase from "./masterData/DomainGroupsConfigSupabase";
import IndustrySegmentsConfigSupabase from "./master-data/IndustrySegmentsConfigSupabase";
import DepartmentConfigSupabase from "./master-data/DepartmentConfigSupabase";
import OrganizationTypeConfigSupabase from "./master-data/OrganizationTypeConfigSupabase";
import EntityTypeConfigSupabase from "./master-data/EntityTypeConfigSupabase";
import { OrganizationCategoryConfigSupabase } from "./OrganizationCategoryConfigSupabase";

import CapabilityLevelsConfig from "./master-data/CapabilityLevelsConfig";
import CommunicationTypeConfigSupabase from "./master-data/CommunicationTypeConfigSupabase";
import RewardTypeConfigSupabase from "./master-data/RewardTypeConfigSupabase";
import SeekerMembershipFeeConfig from "./master-data/SeekerMembershipFeeConfig";
import EngagementModelsConfig from "./master-data/EngagementModelsConfig";
import EngagementPricingManager from "./master-data/engagement-pricing/EngagementPricingManager";
import EventsCalendarConfig from "./master-data/EventsCalendarConfig";
import BillingFrequenciesConfig from "./master-data/BillingFrequenciesConfig";
import MembershipStatusesConfig from "./master-data/MembershipStatusesConfig";
import UnitsOfMeasureConfig from "./master-data/UnitsOfMeasureConfig";
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
      case 'organization-categories':
        return <OrganizationCategoryConfigSupabase />;
      case 'entity-types':
        return <EntityTypeConfigSupabase />;
      case 'departments':
        return <DepartmentConfigSupabase />;
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
      case 'billing-frequencies':
        return <BillingFrequenciesConfig />;
      case 'membership-statuses':
        return <MembershipStatusesConfig />;
      case 'units-of-measure':
        return <UnitsOfMeasureConfig />;
      case 'pricing':
        return <EngagementPricingManager />;
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
      case 'pricing-tiers':
        const PricingTiersManager = React.lazy(() => 
          import('./master-data/pricing-tiers/PricingTiersManager').then(m => ({ default: m.PricingTiersManager }))
        );
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <PricingTiersManager />
          </React.Suspense>
        );
      case 'system-configurations':
        const SystemConfigurationsManager = React.lazy(() => 
          import('./master-data/system-configurations/SystemConfigurationsManager').then(m => ({ default: m.SystemConfigurationsManager }))
        );
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <SystemConfigurationsManager />
          </React.Suspense>
        );
      case 'pricing-parameters':
        const PricingParametersManager = React.lazy(() => 
          import('./master-data/pricing-parameters/PricingParametersManager').then(m => ({ default: m.PricingParametersManager }))
        );
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <PricingParametersManager />
          </React.Suspense>
        );
      case 'engagement-model-subtypes':
        const EngagementModelSubtypesManager = React.lazy(() => 
          import('./master-data/engagement-model-subtypes/EngagementModelSubtypesManager').then(m => ({ default: m.EngagementModelSubtypesManager }))
        );
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <EngagementModelSubtypesManager />
          </React.Suspense>
        );
      case 'fee-components':
        const FeeComponentsManager = React.lazy(() => 
          import('./master-data/fee-components/FeeComponentsManager').then(m => ({ default: m.FeeComponentsManager }))
        );
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <FeeComponentsManager />
          </React.Suspense>
        );
      case 'platform-fee-formulas':
        const PlatformFeeFormulasManager = React.lazy(() => 
          import('./master-data/platform-fee-formulas/PlatformFeeFormulasManager').then(m => ({ default: m.PlatformFeeFormulasManager }))
        );
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <PlatformFeeFormulasManager />
          </React.Suspense>
        );
      case 'advance-payment-types':
        const AdvancePaymentTypesManager = React.lazy(() => 
          import('./master-data/advance-payment-types/AdvancePaymentTypesManager').then(m => ({ default: m.AdvancePaymentTypesManager }))
        );
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <AdvancePaymentTypesManager />
          </React.Suspense>
        );
      case 'tier-engagement-restrictions':
        const TierEngagementModelRestrictionsManager = React.lazy(() => 
          import('./master-data/tier-engagement-restrictions/TierEngagementModelRestrictionsManager').then(m => ({ default: m.TierEngagementModelRestrictionsManager }))
        );
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <TierEngagementModelRestrictionsManager />
          </React.Suspense>
        );
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
