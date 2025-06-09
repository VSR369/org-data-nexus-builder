
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '../components/AppSidebar';
import EventsCalendar from '../components/EventsCalendar';
import SolutionVotingAssessmentConfig from '../components/voting-assessment/SolutionVotingAssessmentConfig';
import MasterDataStructureConfig from '../components/master-data/MasterDataStructureConfig';
import ChallengeStatusConfig from '../components/master-data/ChallengeStatusConfig';
import IndustrySegmentConfig from '../components/master-data/IndustrySegmentConfig';
import OrganizationTypeConfig from '../components/master-data/OrganizationTypeConfig';
import EntityTypeConfig from '../components/master-data/EntityTypeConfig';
import DepartmentConfig from '../components/master-data/DepartmentConfig';
import RewardTypeConfig from '../components/master-data/RewardTypeConfig';
import CurrencyConfig from '../components/master-data/CurrencyConfig';
import CountryConfig from '../components/master-data/CountryConfig';
import CommunicationTypeConfig from '../components/master-data/CommunicationTypeConfig';

const Index = () => {
  const [activeSection, setActiveSection] = useState('events-calendar');

  const renderContent = () => {
    switch (activeSection) {
      case 'events-calendar':
        return <EventsCalendar />;
      case 'voting-assessment':
        return <SolutionVotingAssessmentConfig />;
      case 'master-data-structure':
        return <MasterDataStructureConfig />;
      case 'challenge-status':
        return <ChallengeStatusConfig />;
      case 'industry-segments':
        return <IndustrySegmentConfig />;
      case 'organization-types':
        return <OrganizationTypeConfig />;
      case 'entity-types':
        return <EntityTypeConfig />;
      case 'departments':
        return <DepartmentConfig />;
      case 'reward-types':
        return <RewardTypeConfig />;
      case 'currencies':
        return <CurrencyConfig />;
      case 'countries':
        return <CountryConfig />;
      case 'communication-types':
        return <CommunicationTypeConfig />;
      default:
        return <EventsCalendar />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger />
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Master Data Setup</h1>
                <p className="text-xl text-muted-foreground">Configure organization master data and taxonomies</p>
              </div>
            </div>

            <div className="w-full">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
