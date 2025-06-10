
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Database, Users, Globe, Building2, Briefcase, DollarSign, MessageSquare, Gift, CreditCard, Target, Calendar, Award, Brain, UserCheck } from "lucide-react";
import DomainGroupsConfig from "@/components/master-data/DomainGroupsConfig";
import CountryConfig from "@/components/master-data/CountryConfig";
import CurrencyConfig from "@/components/master-data/CurrencyConfig";
import IndustrySegmentConfig from "@/components/master-data/IndustrySegmentConfig";
import EntityTypeConfig from "@/components/master-data/EntityTypeConfig";
import OrganizationTypeConfig from "@/components/master-data/OrganizationTypeConfig";
import CompetencyCapabilityConfig from "@/components/master-data/CompetencyCapabilityConfig";
import RewardTypeConfig from "@/components/master-data/RewardTypeConfig";
import ChallengeStatusConfig from "@/components/master-data/ChallengeStatusConfig";
import SolutionStatusConfig from "@/components/master-data/SolutionStatusConfig";
import CommunicationTypeConfig from "@/components/master-data/CommunicationTypeConfig";
import DepartmentConfig from "@/components/master-data/DepartmentConfig";
import PricingConfig from "@/components/master-data/PricingConfig";
import EventsCalendarConfig from "@/components/master-data/EventsCalendarConfig";
import SolutionVotingAssessmentConfig from "@/components/voting-assessment/SolutionVotingAssessmentConfig";
import { SelfEnrollmentForm } from "@/components/transactions/SelfEnrollmentForm";

interface MasterDataContentProps {
  activeSection: string;
  onSignInComplete: () => void;
}

export const MasterDataContent = ({ activeSection, onSignInComplete }: MasterDataContentProps) => {
  const handleQuickAccess = () => {
    onSignInComplete();
  };

  console.log('MasterDataContent activeSection:', activeSection);

  const getSectionContent = () => {
    switch (activeSection) {
      case 'master-data-structure':
        return (
          <div className="container mx-auto p-6">
            <DomainGroupsConfig />
          </div>
        );

      case 'countries':
        return (
          <div className="container mx-auto p-6">
            <CountryConfig />
          </div>
        );

      case 'currencies':
        return (
          <div className="container mx-auto p-6">
            <CurrencyConfig />
          </div>
        );

      case 'industry-segments':
        return (
          <div className="container mx-auto p-6">
            <IndustrySegmentConfig />
          </div>
        );

      case 'entity-types':
        return (
          <div className="container mx-auto p-6">
            <EntityTypeConfig />
          </div>
        );

      case 'organization-types':
        return (
          <div className="container mx-auto p-6">
            <OrganizationTypeConfig />
          </div>
        );

      case 'departments':
        return (
          <div className="container mx-auto p-6">
            <DepartmentConfig />
          </div>
        );

      case 'competency-capability':
        return (
          <div className="container mx-auto p-6">
            <CompetencyCapabilityConfig />
          </div>
        );

      case 'reward-types':
        return (
          <div className="container mx-auto p-6">
            <RewardTypeConfig />
          </div>
        );

      case 'challenge-statuses':
        return (
          <div className="container mx-auto p-6">
            <ChallengeStatusConfig />
          </div>
        );

      case 'solution-statuses':
        return (
          <div className="container mx-auto p-6">
            <SolutionStatusConfig />
          </div>
        );

      case 'communication-types':
        return (
          <div className="container mx-auto p-6">
            <CommunicationTypeConfig />
          </div>
        );

      case 'pricing-config':
        return (
          <div className="container mx-auto p-6">
            <PricingConfig />
          </div>
        );

      case 'voting-assessment':
        return (
          <div className="container mx-auto p-6">
            <SolutionVotingAssessmentConfig />
          </div>
        );

      case 'events-calendar':
        return (
          <div className="container mx-auto p-6">
            <EventsCalendarConfig />
          </div>
        );

      case 'self-enrollment':
        return (
          <div className="container mx-auto p-6">
            <div className="space-y-6">
              <div className="text-left">
                <h2 className="text-3xl font-bold text-foreground mb-2">Solution Provider Enrollment</h2>
                <p className="text-lg text-muted-foreground">
                  Register as a solution provider to participate in challenges and submit innovative solutions.
                </p>
              </div>
              <SelfEnrollmentForm />
            </div>
          </div>
        );

      default:
        return (
          <div className="container mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Master Data Portal
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive configuration management system for all master data entities and business processes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Solution Provider Enrollment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage solution provider registrations and competency assessments.
                  </p>
                  <Button onClick={handleQuickAccess} size="sm" className="w-full">
                    Access Enrollment
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5 text-primary" />
                    Domain Groups Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure hierarchical domain groups, categories, and sub-categories.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Structure
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-primary" />
                    Foundation Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure countries, currencies, and industry segments.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    Organization Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set up organization types, entity types, and departments.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Configure
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5 text-primary" />
                    Competency Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define competencies, capabilities, and assessment criteria.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Setup Competencies
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure rewards, pricing, voting, and communication types.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    System Setup
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">Quick Configuration Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">15+</div>
                    <div className="text-sm text-gray-600">Industry Segments</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">200+</div>
                    <div className="text-sm text-gray-600">Domain Groups</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">500+</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">1000+</div>
                    <div className="text-sm text-gray-600">Sub-Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {getSectionContent()}
    </div>
  );
};
