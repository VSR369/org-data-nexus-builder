
import React from 'react';
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { AdminSidebarHeader } from './AdminSidebarHeader';
import { AdminSidebarMenuGroup } from './AdminSidebarMenuGroup';
import {
  dashboardMenuItems,
  organizationMenuItems,
  solutionMenuItems,
  reportsMenuItems
} from './adminMenuData';

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  console.log('AdminSidebar render:', { activeSection });

  const handleMenuClick = (sectionId: string) => {
    console.log('AdminSidebar - handleMenuClick:', sectionId);
    setActiveSection(sectionId);
  };

  return (
    <Sidebar collapsible="offcanvas">
      <AdminSidebarHeader />
      <SidebarContent className="gap-0">
        <AdminSidebarMenuGroup
          title="Dashboard"
          items={dashboardMenuItems}
          activeSection={activeSection}
          onItemClick={handleMenuClick}
        />
        <AdminSidebarMenuGroup
          title="Organization Management"
          items={organizationMenuItems}
          activeSection={activeSection}
          onItemClick={handleMenuClick}
        />
        <AdminSidebarMenuGroup
          title="Solution Management"
          items={solutionMenuItems}
          activeSection={activeSection}
          onItemClick={handleMenuClick}
        />
        <AdminSidebarMenuGroup
          title="Reports & Analytics"
          items={reportsMenuItems}
          activeSection={activeSection}
          onItemClick={handleMenuClick}
        />
      </SidebarContent>
    </Sidebar>
  );
}
