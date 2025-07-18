
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
                className="w-full justify-start cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors py-2 px-3 text-sm md:text-base"
                style={{ pointerEvents: 'auto' }}
              >
                <item.icon className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                <span className="font-medium truncate text-xs md:text-sm">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
