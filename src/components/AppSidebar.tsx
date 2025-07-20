
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
  validationMenuItems,
  administrationMenuItems,
  customDataMenuItems,
  pricingConfigurationMenuItems
} from './sidebar/menuData';

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnRegistrationPage = location.pathname === '/register' || location.pathname === '/organization-registration';
  const isOnMasterDataPortal = location.pathname === '/master-data-portal';

  console.log('AppSidebar render:', { activeSection, isOnMasterDataPortal, pathname: location.pathname });

  const handleMasterDataClick = (sectionId: string) => {
    console.log('🖱️ AppSidebar - handleMasterDataClick called:', sectionId);
    console.log('🖱️ Current state - isOnRegistrationPage:', isOnRegistrationPage);
    console.log('🖱️ Current state - isOnMasterDataPortal:', isOnMasterDataPortal);
    
    if (isOnRegistrationPage) {
      console.log('🔄 Navigating to master data portal with section:', sectionId);
      navigate(`/master-data-portal`);
      setTimeout(() => setActiveSection(sectionId), 100);
    } else if (isOnMasterDataPortal) {
      console.log('🔄 Setting active section to:', sectionId);
      setActiveSection(sectionId);
    } else {
      console.log('🔄 Navigating to master data portal with section:', sectionId);
      navigate(`/master-data-portal`);
      setTimeout(() => setActiveSection(sectionId), 100);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border">
      <AppSidebarHeader />
      <SidebarContent className="gap-0 px-2 md:px-3">
        <SidebarMenuGroup
          title="🎯 Custom Data Management"
          items={customDataMenuItems}
          activeSection={activeSection}
          isOnMasterDataPortal={isOnMasterDataPortal}
          onItemClick={handleMasterDataClick}
        />
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
          title="💰 Pricing & Configuration"
          items={pricingConfigurationMenuItems}
          activeSection={activeSection}
          isOnMasterDataPortal={isOnMasterDataPortal}
          onItemClick={handleMasterDataClick}
        />
        <SidebarMenuGroup
          title="Validations"
          items={validationMenuItems}
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
