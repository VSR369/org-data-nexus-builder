
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Database, Users, Globe, Building2, Briefcase, DollarSign, MessageSquare, Gift, CreditCard, Target, Calendar, Award, Brain, UserCheck } from "lucide-react";
import MasterDataStructureConfig from "@/components/master-data/MasterDataStructureConfig";
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

interface MasterDataContentProps {
  activeSection: string;
  onSignInComplete: () => void;
}

export const MasterDataContent = ({ activeSection, onSignInComplete }: MasterDataContentProps) => {
  const handleQuickAccess = () => {
    onSignInComplete();
  };

  const getSectionContent = () => {
    switch (activeSection) {
      case 'self-enrollment':
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Solution Provider Enrollment
                </CardTitle>
                <CardDescription>
                  Register as a solution provider to participate in challenges and submit innovative solutions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Benefits of Enrollment:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Access to exclusive challenges
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Submit solutions and compete
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Network with industry experts
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Earn rewards and recognition
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Quick Actions:</h4>
                    <div className="space-y-2">
                      <Button onClick={handleQuickAccess} className="w-full">
                        Start Enrollment Process
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Requirements
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'master-data-structure':
        return (
          <div className="p-6">
            <MasterDataStructureConfig />
          </div>
        );

      case 'countries':
        return (
          <div className="p-6">
            <CountryConfig />
          </div>
        );

      case 'currencies':
        return (
          <div className="p-6">
            <CurrencyConfig />
          </div>
        );

      case 'industry-segments':
        return (
          <div className="p-6">
            <IndustrySegmentConfig />
          </div>
        );

      case 'entity-types':
        return (
          <div className="p-6">
            <EntityTypeConfig />
          </div>
        );

      case 'organization-types':
        return (
          <div className="p-6">
            <OrganizationTypeConfig />
          </div>
        );

      case 'competency-capability':
        return (
          <div className="p-6">
            <CompetencyCapabilityConfig />
          </div>
        );

      case 'reward-types':
        return (
          <div className="p-6">
            <RewardTypeConfig />
          </div>
        );

      case 'challenge-statuses':
        return (
          <div className="p-6">
            <ChallengeStatusConfig />
          </div>
        );

      case 'solution-statuses':
        return (
          <div className="p-6">
            <SolutionStatusConfig />
          </div>
        );

      case 'communication-types':
        return (
          <div className="p-6">
            <CommunicationTypeConfig />
          </div>
        );

      default:
        return (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Welcome to CoInnovator Portal
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access master data configurations and manage your solution provider enrollment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage solution provider enrollments and transaction processes.
                  </p>
                  <Button onClick={handleQuickAccess} size="sm" className="w-full">
                    Quick Access
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5 text-primary" />
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
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-background to-muted/20">
      {getSectionContent()}
    </div>
  );
};
