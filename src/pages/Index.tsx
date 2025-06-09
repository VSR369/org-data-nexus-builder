
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import CountryConfig from '@/components/master-data/CountryConfig';
import CurrencyConfig from '@/components/master-data/CurrencyConfig';
import IndustrySegmentConfig from '@/components/master-data/IndustrySegmentConfig';
import OrganizationTypeConfig from '@/components/master-data/OrganizationTypeConfig';
import EntityTypeConfig from '@/components/master-data/EntityTypeConfig';
import DepartmentConfig from '@/components/master-data/DepartmentConfig';
import MasterDataStructureConfig from '@/components/master-data/MasterDataStructureConfig';
import ChallengeStatusConfig from '@/components/master-data/ChallengeStatusConfig';
import SolutionStatusConfig from '@/components/master-data/SolutionStatusConfig';
import CompetencyCapabilityConfig from '@/components/master-data/CompetencyCapabilityConfig';
import CommunicationTypeConfig from '@/components/master-data/CommunicationTypeConfig';
import RewardTypeConfig from '@/components/master-data/RewardTypeConfig';
import PricingConfig from '@/components/master-data/PricingConfig';
import SolutionVotingAssessmentConfig from '@/components/voting-assessment/SolutionVotingAssessmentConfig';
import EventsCalendar from '@/components/EventsCalendar';
import SelfEnrollmentForm from '@/components/transactions/SelfEnrollmentForm';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const [activeSection, setActiveSection] = useState('countries');
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [location]);

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
      case 'master-data-structure':
        return <MasterDataStructureConfig />;
      case 'challenge-status':
        return <ChallengeStatusConfig />;
      case 'solution-status':
        return <SolutionStatusConfig />;
      case 'competency-capability':
        return <CompetencyCapabilityConfig />;
      case 'communication-types':
        return <CommunicationTypeConfig />;
      case 'reward-types':
        return <RewardTypeConfig />;
      case 'pricing-config':
        return <PricingConfig />;
      case 'voting-assessment':
        return <SolutionVotingAssessmentConfig />;
      case 'events-calendar':
        return <EventsCalendar />;
      case 'self-enrollment':
        return <SelfEnrollmentForm />;
      default:
        return <CountryConfig />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Master Data Configuration</h1>
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
