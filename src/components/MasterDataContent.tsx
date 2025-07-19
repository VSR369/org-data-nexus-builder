
import React from 'react';

// Import your sophisticated ConfigSupabase components
import OrganizationTypeConfigSupabase from './master-data/OrganizationTypeConfigSupabase';
import EntityTypeConfigSupabase from './master-data/EntityTypeConfigSupabase';
import IndustrySegmentsConfigSupabase from './master-data/IndustrySegmentsConfigSupabase';
import RewardTypeConfigSupabase from './master-data/RewardTypeConfigSupabase';
import CountryConfigSupabase from './master-data/CountryConfigSupabase';
import CurrencyConfigSupabase from './master-data/CurrencyConfigSupabase';

// Import specialized subdirectory components
import { FeeComponentsManager } from './master-data/fee-components/FeeComponentsManager';
import { ChallengeComplexityManager } from './master-data/challenge-complexity/ChallengeComplexityManager';
import { ChallengeOverageFeesManager } from './master-data/challenge-overage-fees/ChallengeOverageFeesManager';
import { AdvancePaymentTypesManager } from './master-data/advance-payment-types/AdvancePaymentTypesManager';
import { AnalyticsAccessTypesManager } from './master-data/analytics-access-types/AnalyticsAccessTypesManager';
import { OnboardingTypesManager } from './master-data/onboarding-types/OnboardingTypesManager';
import { SystemFeatureAccessManager } from './master-data/system-feature-access/SystemFeatureAccessManager';

// Import other advanced components (the ones that actually exist and work)
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
import EngagementModelSubtypesConfigSupabase from './master-data/EngagementModelSubtypesConfigSupabase';
import PricingParametersConfigSupabase from './master-data/PricingParametersConfigSupabase';
import PlatformFeeFormulasConfigSupabase from './master-data/PlatformFeeFormulasConfigSupabase';
import PricingTiersConfigSupabase from './master-data/PricingTiersConfigSupabase';
import TierConfigurationsConfigSupabase from './master-data/TierConfigurationsConfigSupabase';
import TierEngagementModelAccessConfigSupabase from './master-data/TierEngagementModelAccessConfigSupabase';
import SeekerMembershipFeesConfigSupabase from './master-data/SeekerMembershipFeesConfigSupabase';
import SupportTypesConfigSupabase from './master-data/SupportTypesConfigSupabase';
import WorkflowTemplatesConfigSupabase from './master-data/WorkflowTemplatesConfigSupabase';
import SystemConfigurationsConfigSupabase from './master-data/SystemConfigurationsConfigSupabase';
import CapabilityLevelsConfigSupabase from './master-data/CapabilityLevelsConfigSupabase';
import CompetencyCapabilityConfigSupabase from './master-data/CompetencyCapabilityConfigSupabase';
import CommunicationTypesConfigSupabase from './master-data/CommunicationTypesConfigSupabase';
import OrganizationCategoriesConfigSupabase from './master-data/OrganizationCategoriesConfigSupabase';
import PricingConfigurationsConfigSupabase from './master-data/PricingConfigurationsConfigSupabase';
import SolutionSeekersConfigSupabase from './master-data/SolutionSeekersConfigSupabase';

interface MasterDataContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MasterDataContent: React.FC<MasterDataContentProps> = ({ activeSection }) => {
  // Remove the junk tab header and restore your original clean interface
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
      case 'engagement-model-subtypes':
        return <EngagementModelSubtypesConfigSupabase />;
      case 'fee-components':
        return <FeeComponentsManager />;
      case 'pricing-parameters':
        return <PricingParametersConfigSupabase />;
      case 'platform-fee-formulas':
        return <PlatformFeeFormulasConfigSupabase />;
      case 'pricing-tiers':
        return <PricingTiersConfigSupabase />;
      case 'tier-configurations':
        return <TierConfigurationsConfigSupabase />;
      case 'tier-engagement-model-access':
        return <TierEngagementModelAccessConfigSupabase />;
      case 'seeker-membership-fees':
        return <SeekerMembershipFeesConfigSupabase />;
      case 'challenge-complexity':
        return <ChallengeComplexityManager />;
      case 'challenge-overage-fees':
        return <ChallengeOverageFeesManager />;
      case 'advance-payment-types':
        return <AdvancePaymentTypesManager />;
      case 'analytics-access-types':
        return <AnalyticsAccessTypesManager />;
      case 'support-types':
        return <SupportTypesConfigSupabase />;
      case 'onboarding-types':
        return <OnboardingTypesManager />;
      case 'workflow-templates':
        return <WorkflowTemplatesConfigSupabase />;
      case 'system-feature-access':
        return <SystemFeatureAccessManager />;
      case 'system-configurations':
        return <SystemConfigurationsConfigSupabase />;
      case 'capability-levels':
        return <CapabilityLevelsConfigSupabase />;
      case 'competency-capabilities':
        return <CompetencyCapabilityConfigSupabase />;
      case 'communication-types':
        return <CommunicationTypesConfigSupabase />;
      case 'reward-types':
        return <RewardTypeConfigSupabase />;
      case 'organization-categories':
        return <OrganizationCategoriesConfigSupabase />;
      case 'pricing-configurations':
        return <PricingConfigurationsConfigSupabase />;
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
