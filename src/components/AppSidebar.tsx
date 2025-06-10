
import React from 'react';
import { Briefcase, Building2, Users, Gift, DollarSign, Globe, MessageSquare, Calendar, Target, Database, CheckCircle, Award, CreditCard, UserCheck, Brain, Vote, Settings, BarChart3 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const transactionMenuItems = [
  {
    id: 'self-enrollment',
    title: 'Solution Provider Enrollment',
    icon: UserCheck,
  },
];

const foundationMenuItems = [
  {
    id: 'countries',
    title: 'Countries',
    icon: Globe,
  },
  {
    id: 'currencies',
    title: 'Currencies',
    icon: DollarSign,
  },
  {
    id: 'industry-segments',
    title: 'Industry Segments',
    icon: Briefcase,
  },
];

const organizationMenuItems = [
  {
    id: 'organization-types',
    title: 'Organization Types',
    icon: Building2,
  },
  {
    id: 'entity-types',
    title: 'Entity Types',
    icon: Building2,
  },
  {
    id: 'departments',
    title: 'Departments',
    icon: Users,
  },
];

const challengeMenuItems = [
  {
    id: 'domain-groups',
    title: 'Domain Groups',
    icon: Database,
  },
  {
    id: 'challenge-statuses',
    title: 'Challenge Status',
    icon: CheckCircle,
  },
  {
    id: 'solution-statuses',
    title: 'Solution Statuses',
    icon: Award,
  },
  {
    id: 'competency-capabilities',
    title: 'Competency & Capabilities',
    icon: Brain,
  },
];

const systemMenuItems = [
  {
    id: 'communication-types',
    title: 'Communication & Content Types',
    icon: MessageSquare,
  },
  {
    id: 'reward-types',
    title: 'Reward Types',
    icon: Gift,
  },
  {
    id: 'pricing',
    title: 'Pricing Configuration',
    icon: CreditCard,
  },
  {
    id: 'solution-voting-assessment',
    title: 'Solution Voting & Assessment',
    icon: Vote,
  },
  {
    id: 'events-calendar',
    title: 'Events Calendar',
    icon: Calendar,
  },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnRegistrationPage = location.pathname === '/register';

  const handleMasterDataClick = (sectionId: string) => {
    if (isOnRegistrationPage) {
      // Navigate to home page with the section using React Router
      navigate(`/?section=${sectionId}`);
    } else {
      // Just set the active section on the current page
      setActiveSection(sectionId);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          <div>
            <h2 className="font-semibold">Master Data</h2>
            <p className="text-sm text-muted-foreground">Configuration Hub</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Transactions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {transactionMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleMasterDataClick(item.id)}
                    isActive={activeSection === item.id && !isOnRegistrationPage}
                    className="w-full justify-start cursor-pointer"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Foundation Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {foundationMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleMasterDataClick(item.id)}
                    isActive={activeSection === item.id && !isOnRegistrationPage}
                    className="w-full justify-start cursor-pointer"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Organization Setup</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {organizationMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleMasterDataClick(item.id)}
                    isActive={activeSection === item.id && !isOnRegistrationPage}
                    className="w-full justify-start cursor-pointer"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Challenge & Solution Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {challengeMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleMasterDataClick(item.id)}
                    isActive={activeSection === item.id && !isOnRegistrationPage}
                    className="w-full justify-start cursor-pointer"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleMasterDataClick(item.id)}
                    isActive={activeSection === item.id && !isOnRegistrationPage}
                    className="w-full justify-start cursor-pointer"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
