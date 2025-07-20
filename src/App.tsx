
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import '@/utils/localStorage/LocalStorageCleaner';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useSupabaseAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ContributorAuth from "./pages/ContributorAuth";
import SuperAdminAuth from "./pages/SuperAdminAuth";
import MasterDataPortal from "./pages/MasterDataPortal";
import OrganizationRegistration from "./pages/OrganizationRegistration";
import OrganizationSignIn from "./pages/OrganizationSignIn";
import OrganizationDashboard from "./pages/OrganizationDashboard";

const queryClient = new QueryClient();

function App() {
  console.log('🚀 App component is rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/contributor-auth" element={<ContributorAuth />} />
              <Route path="/super-admin-auth" element={<SuperAdminAuth />} />
              <Route path="/master-data" element={<Navigate to="/master-data-portal" replace />} />
              <Route path="/master-data-portal" element={<MasterDataPortal />} />
              <Route path="/organization-registration" element={<OrganizationRegistration />} />
              <Route path="/organization-signin" element={<OrganizationSignIn />} />
              <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
