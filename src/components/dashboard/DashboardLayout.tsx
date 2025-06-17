
import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeSection, 
  setActiveSection 
}) => {
  return (
    <>
      <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto p-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default DashboardLayout;
