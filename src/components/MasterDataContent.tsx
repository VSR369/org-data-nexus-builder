
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Tag,
  Tags,
  DollarSign,
  Shield,
  Database,
  Globe,
  Users,
  Gift,
  MessageSquare,
  Calendar,
  CheckCircle,
  Award,
  Brain,
  Vote,
  CreditCard,
  Trash2,
  Factory,
  FolderTree
} from 'lucide-react';
import EntityTypeConfig from './master-data/EntityTypeConfig';
import IndustrySegmentConfig from './master-data/IndustrySegmentConfig';
import DomainGroupsConfig from './master-data/DomainGroupsConfig';
import PricingConfig from './master-data/PricingConfig';
import DataHealthPanel from './master-data/debug/DataHealthPanel';
import CompetencyCapabilityConfig from './master-data/CompetencyCapabilityConfig';
import MasterDataRecoveryCenter from './master-data/recovery/MasterDataRecoveryCenter';
import CountryConfig from './master-data/CountryConfig';
import CurrencyConfig from './master-data/CurrencyConfig';
import OrganizationTypeConfig from './master-data/OrganizationTypeConfig';
import DepartmentConfig from './master-data/DepartmentConfig';
import ChallengeStatusConfig from './master-data/ChallengeStatusConfig';
import SolutionStatusConfig from './master-data/SolutionStatusConfig';
import CommunicationTypeConfig from './master-data/CommunicationTypeConfig';
import RewardTypeConfig from './master-data/RewardTypeConfig';
import SeekerMembershipFeeConfig from './master-data/SeekerMembershipFeeConfig';
import SolutionVotingAssessmentConfig from './voting-assessment/SolutionVotingAssessmentConfig';
import EventsCalendarConfig from './master-data/EventsCalendarConfig';
import GlobalCacheManager from './master-data/GlobalCacheManager';

interface MasterDataContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MasterDataContent = ({ activeSection, setActiveSection }: MasterDataContentProps) => {
  console.log('MasterDataContent - activeSection:', activeSection);

  const renderActiveComponent = () => {
    switch (activeSection) {
      // Foundation Data
      case 'countries':
        return <CountryConfig />;
      case 'currencies':
        return <CurrencyConfig />;
      case 'industry-segments':
        return <IndustrySegmentConfig />;
      
      // Organization Setup
      case 'organization-types':
        return <OrganizationTypeConfig />;
      case 'entity-types':
        return <EntityTypeConfig />;
      case 'departments':
        return <DepartmentConfig />;
      
      // Challenge & Solution Management
      case 'domain-groups':
        return <DomainGroupsConfig />;
      case 'challenge-statuses':
        return <ChallengeStatusConfig />;
      case 'solution-statuses':
        return <SolutionStatusConfig />;
      case 'competency-capabilities':
        return <CompetencyCapabilityConfig />;
      
      // System Configuration
      case 'communication-types':
        return <CommunicationTypeConfig />;
      case 'reward-types':
        return <RewardTypeConfig />;
      case 'seeker-membership-fee':
        return <SeekerMembershipFeeConfig />;
      case 'pricing':
        return <PricingConfig />;
      case 'solution-voting-assessment':
        return <SolutionVotingAssessmentConfig />;
      case 'events-calendar':
        return <EventsCalendarConfig />;
      
      // Administration
      case 'global-cache-manager':
        return <GlobalCacheManager />;
      
      // Special sections
      case 'debug':
        return <DataHealthPanel />;
      case 'recovery':
        return <MasterDataRecoveryCenter />;
      
      default:
        return (
          <div className="text-center p-8">
            <p className="text-lg text-muted-foreground">
              Select a configuration option from the sidebar to get started.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Current section: {activeSection}
            </p>
          </div>
        );
    }
  };

  const getSectionTitle = () => {
    const sectionTitles: Record<string, string> = {
      'countries': 'Countries Configuration',
      'currencies': 'Currencies Configuration',
      'industry-segments': 'Industry Segments Configuration',
      'organization-types': 'Organization Types Configuration',
      'entity-types': 'Entity Types Configuration',
      'departments': 'Departments Configuration',
      'domain-groups': 'Domain Groups Configuration',
      'challenge-statuses': 'Challenge Status Configuration',
      'solution-statuses': 'Solution Status Configuration',
      'competency-capabilities': 'Competency Capabilities Configuration',
      'communication-types': 'Communication Types Configuration',
      'reward-types': 'Reward Types Configuration',
      'seeker-membership-fee': 'Seeker Membership Fee Configuration',
      'pricing': 'Pricing Configuration',
      'solution-voting-assessment': 'Solution Voting & Assessment Configuration',
      'events-calendar': 'Events Calendar Configuration',
      'global-cache-manager': 'Global Cache Manager',
      'debug': 'Data Health Panel',
      'recovery': 'Master Data Recovery Center'
    };
    
    return sectionTitles[activeSection] || 'Master Data Configuration';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getSectionTitle()}</h1>
          <p className="text-lg text-muted-foreground">
            Configure and manage master data for the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveSection('recovery')}
            variant={activeSection === 'recovery' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Recovery Center
          </Button>
          <Button
            onClick={() => setActiveSection('debug')}
            variant={activeSection === 'debug' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Data Health
          </Button>
        </div>
      </div>

      {renderActiveComponent()}
    </div>
  );
};

export default MasterDataContent;
