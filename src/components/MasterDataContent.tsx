
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, Users, Building, Globe, CreditCard, Briefcase, 
         Target, Award, Calendar, MessageSquare, Star, FileText, 
         Settings, BarChart3, Vote } from 'lucide-react';

// Master Data Components
import IndustrySegmentConfig from './master-data/IndustrySegmentConfig';
import OrganizationTypeConfig from './master-data/OrganizationTypeConfig';
import EntityTypeConfig from './master-data/EntityTypeConfig';
import CountryConfig from './master-data/CountryConfig';
import CurrencyConfig from './master-data/CurrencyConfig';
import DepartmentConfig from './master-data/DepartmentConfig';
import DomainGroupsConfig from './master-data/DomainGroupsConfig';
import CompetencyCapabilityConfig from './master-data/CompetencyCapabilityConfig';
import ChallengeStatusConfig from './master-data/ChallengeStatusConfig';
import SolutionStatusConfig from './master-data/SolutionStatusConfig';
import RewardTypeConfig from './master-data/RewardTypeConfig';
import PricingConfig from './master-data/PricingConfig';
import CommunicationTypeConfig from './master-data/CommunicationTypeConfig';
import EventsCalendarConfig from './master-data/EventsCalendarConfig';
import SelfEnrollmentForm from './transactions/SelfEnrollmentForm';
import SolutionVotingAssessmentConfig from './voting-assessment/SolutionVotingAssessmentConfig';

interface MasterDataContentProps {
  activeSection: string;
  onSignInComplete?: () => void;
}

export const MasterDataContent: React.FC<MasterDataContentProps> = ({ 
  activeSection, 
  onSignInComplete 
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'industry-segments':
        return <IndustrySegmentConfig />;
      case 'organization-types':
        return <OrganizationTypeConfig />;
      case 'entity-types':
        return <EntityTypeConfig />;
      case 'countries':
        return <CountryConfig />;
      case 'currencies':
        return <CurrencyConfig />;
      case 'departments':
        return <DepartmentConfig />;
      case 'domain-groups':
        return <DomainGroupsConfig />;
      case 'competency-capabilities':
        return <CompetencyCapabilityConfig />;
      case 'challenge-statuses':
        return <ChallengeStatusConfig />;
      case 'solution-statuses':
        return <SolutionStatusConfig />;
      case 'reward-types':
        return <RewardTypeConfig />;
      case 'pricing':
        return <PricingConfig />;
      case 'communication-types':
        return <CommunicationTypeConfig />;
      case 'events-calendar':
        return <EventsCalendarConfig />;
      case 'self-enrollment':
        return <SelfEnrollmentForm />;
      case 'solution-voting-assessment':
        return <SolutionVotingAssessmentConfig />;
      default:
        return <div>Select a configuration option from the sidebar.</div>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {renderContent()}
    </div>
  );
};
