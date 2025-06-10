
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, Users, Building, Globe, CreditCard, Briefcase, 
         Target, Award, Calendar, MessageSquare, Star, FileText, 
         Settings, BarChart3, Vote } from 'lucide-react';

// Master Data Components
import OrganizationTypeConfig from './master-data/OrganizationTypeConfig';
import EntityTypeConfig from './master-data/EntityTypeConfig';
import CountryConfig from './master-data/CountryConfig';
import CurrencyConfig from './master-data/CurrencyConfig';
import DepartmentConfig from './master-data/DepartmentConfig';
import CompetencyCapabilityConfig from './master-data/CompetencyCapabilityConfig';
import ChallengeStatusConfig from './master-data/ChallengeStatusConfig';
import SolutionStatusConfig from './master-data/SolutionStatusConfig';
import RewardTypeConfig from './master-data/RewardTypeConfig';
import PricingConfig from './master-data/PricingConfig';
import CommunicationTypeConfig from './master-data/CommunicationTypeConfig';
import EventsCalendarConfig from './master-data/EventsCalendarConfig';
import SelfEnrollmentForm from './transactions/SelfEnrollmentForm';
import SolutionVotingAssessmentConfig from './voting-assessment/SolutionVotingAssessmentConfig';
import GlobalCacheManagerComponent from './master-data/GlobalCacheManager';
import DomainGroupsConfig from './master-data/DomainGroupsConfig';

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
      case 'organization-types':
        return <OrganizationTypeConfig />;
      case 'entity-types':
        return <EntityTypeConfig />;
      case 'countries':
        return <CountryConfig />;
      case 'currencies':
        return <CurrencyConfig />;
      case 'domain-groups':
        return <DomainGroupsConfig />;
      case 'departments':
        return <DepartmentConfig />;
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
      case 'global-cache-manager':
        return <GlobalCacheManagerComponent />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Select a Configuration</h2>
              <p className="text-muted-foreground">Choose a configuration option from the sidebar to get started.</p>
            </div>
            <GlobalCacheManagerComponent />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      {renderContent()}
    </div>
  );
};
