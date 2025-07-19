import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DomainGroupsManager from './master-data/DomainGroupsManager';
import CategoriesManager from './master-data/CategoriesManager';
import SubCategoriesManager from './master-data/SubCategoriesManager';
import CountriesManager from './master-data/CountriesManager';
import CurrenciesManager from './master-data/CurrenciesManager';
import OrganizationTypesManager from './master-data/OrganizationTypesManager';
import EntityTypesManager from './master-data/EntityTypesManager';
import IndustrySegmentsManager from './master-data/IndustrySegmentsManager';
import DepartmentsManager from './master-data/DepartmentsManager';
import SubDepartmentsManager from './master-data/SubDepartmentsManager';
import TeamUnitsManager from './master-data/TeamUnitsManager';
import BillingFrequenciesManager from './master-data/BillingFrequenciesManager';
import MembershipStatusesManager from './master-data/MembershipStatusesManager';
import UnitsOfMeasureManager from './master-data/UnitsOfMeasureManager';
import EngagementModelsManager from './master-data/EngagementModelsManager';
import EngagementModelSubtypesManager from './master-data/EngagementModelSubtypesManager';
import FeeComponentsManager from './master-data/FeeComponentsManager';
import PricingParametersManager from './master-data/PricingParametersManager';
import PlatformFeeFormulasManager from './master-data/PlatformFeeFormulasManager';
import PricingTiersManager from './master-data/PricingTiersManager';
import TierConfigurationsManager from './master-data/TierConfigurationsManager';
import TierEngagementModelAccessManager from './master-data/TierEngagementModelAccessManager';
import SeekerMembershipFeesManager from './master-data/SeekerMembershipFeesManager';
import ChallengeComplexityManager from './master-data/ChallengeComplexityManager';
import ChallengeOverageFeesManager from './master-data/ChallengeOverageFeesManager';
import AdvancePaymentTypesManager from './master-data/AdvancePaymentTypesManager';
import AnalyticsAccessTypesManager from './master-data/AnalyticsAccessTypesManager';
import SupportTypesManager from './master-data/SupportTypesManager';
import OnboardingTypesManager from './master-data/OnboardingTypesManager';
import WorkflowTemplatesManager from './master-data/WorkflowTemplatesManager';
import SystemFeatureAccessManager from './master-data/SystemFeatureAccessManager';
import SystemConfigurationsManager from './master-data/SystemConfigurationsManager';
import CapabilityLevelsManager from './master-data/CapabilityLevelsManager';
import CompetencyCapabilitiesManager from './master-data/CompetencyCapabilitiesManager';
import CommunicationTypesManager from './master-data/CommunicationTypesManager';
import RewardTypesManager from './master-data/RewardTypesManager';
import OrganizationCategoriesManager from './master-data/OrganizationCategoriesManager';
import PricingConfigurationsManager from './master-data/PricingConfigurationsManager';

interface MasterDataContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MasterDataContent: React.FC<MasterDataContentProps> = ({ activeSection, setActiveSection }) => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 h-auto p-1">
          <TabsTrigger value="domain-groups" className="text-xs p-2">Domain Groups</TabsTrigger>
          <TabsTrigger value="categories" className="text-xs p-2">Categories</TabsTrigger>
          <TabsTrigger value="sub-categories" className="text-xs p-2">Sub-Categories</TabsTrigger>
          <TabsTrigger value="countries" className="text-xs p-2">Countries</TabsTrigger>
          <TabsTrigger value="currencies" className="text-xs p-2">Currencies</TabsTrigger>
          <TabsTrigger value="organization-types" className="text-xs p-2">Org Types</TabsTrigger>
          <TabsTrigger value="entity-types" className="text-xs p-2">Entity Types</TabsTrigger>
          <TabsTrigger value="industry-segments" className="text-xs p-2">Industries</TabsTrigger>
          <TabsTrigger value="departments" className="text-xs p-2">Departments</TabsTrigger>
          <TabsTrigger value="sub-departments" className="text-xs p-2">Sub-Depts</TabsTrigger>
          <TabsTrigger value="team-units" className="text-xs p-2">Team Units</TabsTrigger>
          <TabsTrigger value="billing-frequencies" className="text-xs p-2">Billing Freq</TabsTrigger>
          <TabsTrigger value="membership-statuses" className="text-xs p-2">Membership</TabsTrigger>
          <TabsTrigger value="units-of-measure" className="text-xs p-2">Units</TabsTrigger>
          <TabsTrigger value="engagement-models" className="text-xs p-2">Engagement</TabsTrigger>
          <TabsTrigger value="engagement-model-subtypes" className="text-xs p-2">Subtypes</TabsTrigger>
          <TabsTrigger value="fee-components" className="text-xs p-2">Fee Components</TabsTrigger>
          <TabsTrigger value="pricing-parameters" className="text-xs p-2">Pricing Params</TabsTrigger>
          <TabsTrigger value="platform-fee-formulas" className="text-xs p-2">Fee Formulas</TabsTrigger>
          <TabsTrigger value="pricing-tiers" className="text-xs p-2">Pricing Tiers</TabsTrigger>
          <TabsTrigger value="tier-configurations" className="text-xs p-2">Tier Configs</TabsTrigger>
          <TabsTrigger value="tier-engagement-model-access" className="text-xs p-2">Tier Access</TabsTrigger>
          <TabsTrigger value="seeker-membership-fees" className="text-xs p-2">Seeker Fees</TabsTrigger>
          <TabsTrigger value="challenge-complexity" className="text-xs p-2">Complexity</TabsTrigger>
          <TabsTrigger value="challenge-overage-fees" className="text-xs p-2">Overage Fees</TabsTrigger>
          <TabsTrigger value="advance-payment-types" className="text-xs p-2">Advance Pay</TabsTrigger>
          <TabsTrigger value="analytics-access-types" className="text-xs p-2">Analytics</TabsTrigger>
          <TabsTrigger value="support-types" className="text-xs p-2">Support</TabsTrigger>
          <TabsTrigger value="onboarding-types" className="text-xs p-2">Onboarding</TabsTrigger>
          <TabsTrigger value="workflow-templates" className="text-xs p-2">Workflows</TabsTrigger>
          <TabsTrigger value="system-feature-access" className="text-xs p-2">Features</TabsTrigger>
          <TabsTrigger value="system-configurations" className="text-xs p-2">System Config</TabsTrigger>
          <TabsTrigger value="capability-levels" className="text-xs p-2">Capabilities</TabsTrigger>
          <TabsTrigger value="competency-capabilities" className="text-xs p-2">Competencies</TabsTrigger>
          <TabsTrigger value="communication-types" className="text-xs p-2">Communication</TabsTrigger>
          <TabsTrigger value="reward-types" className="text-xs p-2">Rewards</TabsTrigger>
          <TabsTrigger value="organization-categories" className="text-xs p-2">Org Categories</TabsTrigger>
          <TabsTrigger value="pricing-configurations" className="text-xs p-2">Price Configs</TabsTrigger>
        </TabsList>

        <TabsContent value="domain-groups">
          <DomainGroupsManager />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesManager />
        </TabsContent>
        <TabsContent value="sub-categories">
          <SubCategoriesManager />
        </TabsContent>
        <TabsContent value="countries">
          <CountriesManager />
        </TabsContent>
        <TabsContent value="currencies">
          <CurrenciesManager />
        </TabsContent>
        <TabsContent value="organization-types">
          <OrganizationTypesManager />
        </TabsContent>
        <TabsContent value="entity-types">
          <EntityTypesManager />
        </TabsContent>
        <TabsContent value="industry-segments">
          <IndustrySegmentsManager />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentsManager />
        </TabsContent>
        <TabsContent value="sub-departments">
          <SubDepartmentsManager />
        </TabsContent>
        <TabsContent value="team-units">
          <TeamUnitsManager />
        </TabsContent>
        <TabsContent value="billing-frequencies">
          <BillingFrequenciesManager />
        </TabsContent>
        <TabsContent value="membership-statuses">
          <MembershipStatusesManager />
        </TabsContent>
        <TabsContent value="units-of-measure">
          <UnitsOfMeasureManager />
        </TabsContent>
        <TabsContent value="engagement-models">
          <EngagementModelsManager />
        </TabsContent>
        <TabsContent value="engagement-model-subtypes">
          <EngagementModelSubtypesManager />
        </TabsContent>
        <TabsContent value="fee-components">
          <FeeComponentsManager />
        </TabsContent>
        <TabsContent value="pricing-parameters">
          <PricingParametersManager />
        </TabsContent>
        <TabsContent value="platform-fee-formulas">
          <PlatformFeeFormulasManager />
        </TabsContent>
        <TabsContent value="pricing-tiers">
          <PricingTiersManager />
        </TabsContent>
        <TabsContent value="tier-configurations">
          <TierConfigurationsManager />
        </TabsContent>
        <TabsContent value="tier-engagement-model-access">
          <TierEngagementModelAccessManager />
        </TabsContent>
        <TabsContent value="seeker-membership-fees">
          <SeekerMembershipFeesManager />
        </TabsContent>
        <TabsContent value="challenge-complexity">
          <ChallengeComplexityManager />
        </TabsContent>
        <TabsContent value="challenge-overage-fees">
          <ChallengeOverageFeesManager />
        </TabsContent>
        <TabsContent value="advance-payment-types">
          <AdvancePaymentTypesManager />
        </TabsContent>
        <TabsContent value="analytics-access-types">
          <AnalyticsAccessTypesManager />
        </TabsContent>
        <TabsContent value="support-types">
          <SupportTypesManager />
        </TabsContent>
        <TabsContent value="onboarding-types">
          <OnboardingTypesManager />
        </TabsContent>
        <TabsContent value="workflow-templates">
          <WorkflowTemplatesManager />
        </TabsContent>
        <TabsContent value="system-feature-access">
          <SystemFeatureAccessManager />
        </TabsContent>
        <TabsContent value="system-configurations">
          <SystemConfigurationsManager />
        </TabsContent>
        <TabsContent value="capability-levels">
          <CapabilityLevelsManager />
        </TabsContent>
        <TabsContent value="competency-capabilities">
          <CompetencyCapabilitiesManager />
        </TabsContent>
        <TabsContent value="communication-types">
          <CommunicationTypesManager />
        </TabsContent>
        <TabsContent value="reward-types">
          <RewardTypesManager />
        </TabsContent>
        <TabsContent value="organization-categories">
          <OrganizationCategoriesManager />
        </TabsContent>
        <TabsContent value="pricing-configurations">
          <PricingConfigurationsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterDataContent;
