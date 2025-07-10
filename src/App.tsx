
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useSupabaseAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ContributorAuth from "./pages/ContributorAuth";
import SeekingOrgAdministratorLogin from "./pages/SeekingOrgAdministratorLogin";
import MasterDataPortal from "./pages/MasterDataPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="w-full overflow-x-hidden">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/contributor-auth" element={<ContributorAuth />} />
              <Route path="/seeking-org-admin-login" element={<SeekingOrgAdministratorLogin />} />
              <Route path="/master-data-portal" element={<MasterDataPortal />} />
              <Route path="/master-data" element={<MasterDataPortal />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
