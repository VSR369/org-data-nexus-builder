
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import Index from './pages/Index';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SeekerLogin from './pages/SeekerLogin';
import SeekerRegistration from './pages/SeekerRegistration';
import SeekerDashboard from './pages/SeekerDashboard';
import SeekerMembership from './pages/SeekerMembership';
import MembershipRegistration from './pages/MembershipRegistration';
import OrganizationRegistration from './pages/OrganizationRegistration';
import ContributorEnrollment from './pages/ContributorEnrollment';
import MasterDataPortal from './pages/MasterDataPortal';
import Solutions from './pages/Solutions';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import Resources from './pages/Resources';
import Events from './pages/Events';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/seeker-login" element={<SeekerLogin />} />
          <Route path="/register" element={<SeekerRegistration />} />
          <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          <Route path="/seeker-membership" element={<SeekerMembership />} />
          <Route path="/membership" element={<MembershipRegistration />} />
          <Route path="/organization-registration" element={<OrganizationRegistration />} />
          <Route path="/contributor-enrollment" element={<ContributorEnrollment />} />
          <Route path="/master-data" element={<MasterDataPortal />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/community" element={<Community />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/events" element={<Events />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
