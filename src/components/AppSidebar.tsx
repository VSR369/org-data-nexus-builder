
import React from 'react';
import { Briefcase, Building2, Users, Gift, DollarSign, Globe, MessageSquare, Calendar, Target } from 'lucide-react';
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

const menuItems = [
  {
    id: 'events-calendar',
    title: 'Events Calendar',
    icon: Calendar,
  },
  {
    id: 'voting-assessment',
    title: 'Voting & Assessment Config',
    icon: Target,
  },
  {
    id: 'industry-segments',
    title: 'Industry Segments',
    icon: Briefcase,
  },
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
  {
    id: 'reward-types',
    title: 'Reward Types',
    icon: Gift,
  },
  {
    id: 'currencies',
    title: 'Currencies',
    icon: DollarSign,
  },
  {
    id: 'countries',
    title: 'Countries',
    icon: Globe,
  },
  {
    id: 'communication-types',
    title: 'Communication & Content Types',
    icon: MessageSquare,
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
          <SidebarGroupLabel>Organization Setup</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
