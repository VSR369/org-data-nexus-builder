
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

interface AdminSidebarMenuGroupProps {
  title: string;
  items: MenuItem[];
  activeSection: string;
  onItemClick: (sectionId: string) => void;
}

export const AdminSidebarMenuGroup: React.FC<AdminSidebarMenuGroupProps> = ({
  title,
  items,
  activeSection,
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
                onClick={() => onItemClick(item.id)}
                isActive={activeSection === item.id}
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
};
