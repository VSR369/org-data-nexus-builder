
import React from 'react';
import { Briefcase, Building2, Users, Settings, Database } from 'lucide-react';
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
    id: 'industry-segments',
    title: 'Industry Segments',
    icon: Briefcase,
    description: 'Business sector classifications'
  },
  {
    id: 'organization-types',
    title: 'Organization Types',
    icon: Building2,
    description: 'Company size and structure types'
  },
  {
    id: 'entity-types',
    title: 'Entity Types',
    icon: Building2,
    description: 'Legal entity classifications'
  },
  {
    id: 'departments',
    title: 'Departments',
    icon: Users,
    description: 'Department categories and subcategories'
  },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6" />
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
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
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
