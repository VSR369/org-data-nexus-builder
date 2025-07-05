
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MasterDataHealthProvider } from "@/components/providers/MasterDataHealthProvider";

// Import pages
import Index from './pages/Index';
import SignIn from './pages/SignIn';
import GeneralSignIn from './pages/GeneralSignIn';
import SignUp from './pages/SignUp';
import SeekerLogin from './pages/SeekerLogin';
import SeekerRegistration from './pages/SeekerRegistration';
import ContributorLogin from './pages/ContributorLogin';
import SeekingOrgAdministratorLogin from './pages/SeekingOrgAdministratorLogin';
import ContributorEnrollment from './pages/ContributorEnrollment';
import MasterDataPortal from './pages/MasterDataPortal';
import AdminRegistration from './pages/AdminRegistration';
import OrganizationDashboard from './pages/OrganizationDashboard';
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
                <Route path="/general-signin" element={<GeneralSignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/seeker-login" element={<SeekerLogin />} />
                <Route path="/solution-seeking-org/login" element={<SeekerLogin />} />
                <Route path="/seeker-registration" element={<SeekerRegistration />} />
                <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
                <Route path="/contributor-login" element={<ContributorLogin />} />
                <Route path="/seeking-org-administrator-login" element={<SeekingOrgAdministratorLogin />} />
                <Route path="/contributor-enrollment" element={<ContributorEnrollment />} />
                <Route path="/admin-registration" element={<AdminRegistration />} />
                <Route path="/master-data-portal" element={<MasterDataPortal />} />
                <Route path="/master-data" element={<MasterDataPortal />} />
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
