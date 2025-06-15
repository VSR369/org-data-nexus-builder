
import React from 'react';
import { Building2, Users, Gift, DollarSign, Globe, MessageSquare, Calendar, Target, Database, CheckCircle, Award, CreditCard, Brain, Vote, Settings, BarChart3, Trash2, Factory, FolderTree } from 'lucide-react';
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
    icon: Factory,
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
    icon: FolderTree,
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
    title: 'Capability Ratings',
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
    id: 'seeker-membership-fee',
    title: 'Seeker Membership Fee',
    icon: Users,
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

const administrationMenuItems = [
  {
    id: 'global-cache-manager',
    title: 'Global Cache Manager',
    icon: Trash2,
  },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnRegistrationPage = location.pathname === '/register';
  const isOnMasterDataPortal = location.pathname === '/master-data';

  console.log('AppSidebar render:', { activeSection, isOnMasterDataPortal, pathname: location.pathname });

  const handleMasterDataClick = (sectionId: string) => {
    console.log('AppSidebar - handleMasterDataClick:', sectionId);
    
    if (isOnRegistrationPage) {
      // Navigate to home page with the section using React Router
      navigate(`/?section=${sectionId}`);
    } else if (isOnMasterDataPortal) {
      // On master data portal, just set the active section
      setActiveSection(sectionId);
    } else {
      // Just set the active section on the current page
      setActiveSection(sectionId);
    }
  };

  const renderMenuGroup = (title: string, items: any[]) => (
    <SidebarGroup key={title}>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton 
                onClick={() => handleMasterDataClick(item.id)}
                isActive={activeSection === item.id && isOnMasterDataPortal}
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
  );

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
        {renderMenuGroup("Foundation Data", foundationMenuItems)}
        {renderMenuGroup("Organization Setup", organizationMenuItems)}
        {renderMenuGroup("Challenge & Solution Management", challengeMenuItems)}
        {renderMenuGroup("System Configuration", systemMenuItems)}
        {renderMenuGroup("Administration", administrationMenuItems)}
      </SidebarContent>
    </Sidebar>
  );
}
