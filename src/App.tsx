
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MasterDataHealthProvider } from "@/components/providers/MasterDataHealthProvider";

// Import pages
import Index from './pages/Index';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SeekerRegistration from './pages/SeekerRegistration';
import SeekerLogin from './pages/SeekerLogin';
import ContributorLogin from './pages/ContributorLogin';
import SeekingOrgAdminLogin from './pages/SeekingOrgAdminLogin';
import SeekingOrgAdministratorLogin from './pages/SeekingOrgAdministratorLogin';
import ContributorEnrollment from './pages/ContributorEnrollment';
import SeekerDashboard from './pages/SeekerDashboard';
import MasterDataPortal from './pages/MasterDataPortal';
import MembershipRegistration from './pages/MembershipRegistration';
import SeekingOrgAdminDashboard from './pages/SeekingOrgAdminDashboard';
import AdminRegistration from './pages/AdminRegistration';
import TestPage from './pages/TestPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MasterDataHealthProvider enableAutoFix={true} showToastNotifications={true}>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/general-signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/seeker-registration" element={<SeekerRegistration />} />
                <Route path="/seeker-login" element={<SeekerLogin />} />
                <Route path="/contributor-login" element={<ContributorLogin />} />
                
                {/* Unified Solution Seeking Organization Routes */}
                <Route path="/solution-seeking-org/login" element={<SeekingOrgAdminLogin />} />
                <Route path="/seeking-org-admin-login" element={<SeekingOrgAdminLogin />} />
                
                <Route path="/seeking-org-administrator-login" element={<SeekingOrgAdministratorLogin />} />
                <Route path="/contributor-enrollment" element={<ContributorEnrollment />} />
                <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
                <Route path="/seeking-org-admin-dashboard" element={<SeekingOrgAdminDashboard />} />
                <Route path="/admin-registration" element={<AdminRegistration />} />
                <Route path="/master-data-portal" element={<MasterDataPortal />} />
                <Route path="/master-data" element={<MasterDataPortal />} />
                <Route path="/membership-registration" element={<MembershipRegistration />} />
              </Routes>
            </Router>
          </div>
        </SidebarProvider>
        <Toaster />
      </MasterDataHealthProvider>
    </QueryClientProvider>
  );
}

export default App;
