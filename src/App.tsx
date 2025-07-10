import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import OrganizationRegistration from "./pages/OrganizationRegistration";
import SeekerRegistration from "./pages/SeekerRegistration";
import GeneralSignIn from "./pages/GeneralSignIn";
import SeekerLogin from "./pages/SeekerLogin";
import SeekingOrgAdminLogin from "./pages/SeekingOrgAdminLogin";
import SeekingOrgAdminDashboard from "./pages/SeekingOrgAdminDashboard";
import MasterDataPortal from "./pages/MasterDataPortal";
import SolutionProviderEnrollment from "./pages/SolutionProviderEnrollment";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistration from "./pages/AdminRegistration";
import IndustrySegmentsAdmin from "./components/master-data/industry-segments/IndustrySegmentsAdmin";
import CountriesAdmin from "./components/master-data/countries/CountriesAdmin";
import { SimplifiedSignIn } from "./pages/SimplifiedSignIn";
import { SimplifiedSignUp } from "./pages/SimplifiedSignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/organization-registration" element={<OrganizationRegistration />} />
          <Route path="/seeker-registration" element={<SeekerRegistration />} />
          <Route path="/general-signin" element={<GeneralSignIn />} />
          <Route path="/seeker-login" element={<SeekerLogin />} />
          <Route path="/seeking-org-admin-login" element={<SeekingOrgAdminLogin />} />
          <Route path="/seeking-org-admin-dashboard" element={<SeekingOrgAdminDashboard />} />
          <Route path="/master-data" element={<MasterDataPortal />} />
          <Route path="/solution-provider-enrollment" element={<SolutionProviderEnrollment />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-registration" element={<AdminRegistration />} />
          <Route path="/industry-segments-admin" element={<IndustrySegmentsAdmin />} />
          <Route path="/countries-admin" element={<CountriesAdmin />} />
          <Route path="/signin" element={<SimplifiedSignIn />} />
          <Route path="/signup" element={<SimplifiedSignUp />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
