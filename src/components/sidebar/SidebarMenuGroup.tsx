
import React from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarMenuGroupProps {
  title: string;
  items: MenuItem[];
  activeSection: string;
  isOnMasterDataPortal: boolean;
  onItemClick: (sectionId: string) => void;
}

export const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({
  title,
  items,
  activeSection,
  isOnMasterDataPortal,
  onItemClick
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🖱️ SidebarMenuButton clicked:', item.id);
                  onItemClick(item.id);
                }}
                isActive={activeSection === item.id && isOnMasterDataPortal}
                className="w-full justify-start cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                style={{ pointerEvents: 'auto' }}
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
};
