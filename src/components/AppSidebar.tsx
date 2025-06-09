
import React from 'react';
import { Briefcase, Building2, Users, Gift, DollarSign, Globe, MessageSquare, Calendar, Target, Database, CheckCircle, Award, CreditCard, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    id: 'master-data-structure',
    title: 'Domain Groups',
    icon: Database,
  },
  {
    id: 'challenge-status',
    title: 'Challenge Status',
    icon: CheckCircle,
  },
  {
    id: 'solution-status',
    title: 'Solution Statuses',
    icon: Award,
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
    id: 'pricing-config',
    title: 'Pricing Configuration',
    icon: CreditCard,
  },
  {
    id: 'voting-assessment',
    title: 'Voting & Assessment Config',
    icon: Target,
  },
  {
    id: 'events-calendar',
    title: 'Events Calendar',
    icon: Calendar,
  },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
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
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="w-full justify-start">
                  <Link to="/register" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium">Organization Registration</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
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
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
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
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
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
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
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
