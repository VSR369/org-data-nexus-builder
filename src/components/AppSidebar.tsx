
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from './sidebar/SidebarHeader';
import { SidebarMenuGroup } from './sidebar/SidebarMenuGroup';
import {
  foundationMenuItems,
  organizationMenuItems,
  challengeMenuItems,
  systemMenuItems,
  administrationMenuItems
} from './sidebar/menuData';

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnRegistrationPage = location.pathname === '/register';
  const isOnMasterDataPortal = location.pathname === '/master-data';

  console.log('AppSidebar render:', { activeSection, isOnMasterDataPortal, pathname: location.pathname });

  const handleMasterDataClick = (sectionId: string) => {
    console.log('AppSidebar - handleMasterDataClick:', sectionId);
    
    if (isOnRegistrationPage) {
      navigate(`/?section=${sectionId}`);
    } else if (isOnMasterDataPortal) {
      setActiveSection(sectionId);
    } else {
      setActiveSection(sectionId);
    }
  };

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarMenuGroup
          title="Foundation Data"
          items={foundationMenuItems}
          activeSection={activeSection}
          isOnMasterDataPortal={isOnMasterDataPortal}
          onItemClick={handleMasterDataClick}
        />
        <SidebarMenuGroup
          title="Organization Setup"
          items={organizationMenuItems}
          activeSection={activeSection}
          isOnMasterDataPortal={isOnMasterDataPortal}
          onItemClick={handleMasterDataClick}
        />
        <SidebarMenuGroup
          title="Challenge & Solution Management"
          items={challengeMenuItems}
          activeSection={activeSection}
          isOnMasterDataPortal={isOnMasterDataPortal}
          onItemClick={handleMasterDataClick}
        />
        <SidebarMenuGroup
          title="System Configuration"
          items={systemMenuItems}
          activeSection={activeSection}
          isOnMasterDataPortal={isOnMasterDataPortal}
          onItemClick={handleMasterDataClick}
        />
        <SidebarMenuGroup
          title="Administration"
          items={administrationMenuItems}
          activeSection={activeSection}
          isOnMasterDataPortal={isOnMasterDataPortal}
          onItemClick={handleMasterDataClick}
        />
      </SidebarContent>
    </Sidebar>
  );
}
