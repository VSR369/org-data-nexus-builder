
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { appInitializationService, InitializationResult } from "./utils/storage/AppInitializationService";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SeekerLogin from "./pages/SeekerLogin";
import SeekerDashboard from "./pages/SeekerDashboard";
import SeekerMembership from "./pages/SeekerMembership";
import SeekerRegistration from "./pages/SeekerRegistration";
import OrganizationRegistration from "./pages/OrganizationRegistration";
import MasterDataPortal from "./pages/MasterDataPortal";
import ContributorEnrollment from "./pages/ContributorEnrollment";
import MembershipRegistration from "./pages/MembershipRegistration";
import Challenges from "./pages/Challenges";
import Solutions from "./pages/Solutions";
import Events from "./pages/Events";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing Application</h2>
      <p className="text-gray-600">Setting up data storage...</p>
    </div>
  </div>
);

const ErrorScreen = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Initialization Failed</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const App = () => {
  const [initState, setInitState] = useState<{
    status: 'loading' | 'success' | 'error';
    result?: InitializationResult;
  }>({ status: 'loading' });

  const initializeApp = async () => {
    setInitState({ status: 'loading' });
    
    try {
      const result = await appInitializationService.initialize();
      
      if (!result.success) {
        setInitState({ status: 'error', result });
        return;
      }

      // Check if we need to migrate from localStorage
      if (!result.hasExistingData && localStorage.length > 0) {
        console.log('🔄 Attempting localStorage migration...');
        try {
          await appInitializationService.migrateFromLocalStorage();
          console.log('✅ localStorage migration completed');
        } catch (migrationError) {
          console.warn('⚠️ localStorage migration failed, continuing without migration:', migrationError);
        }
      }

      setInitState({ status: 'success', result });
    } catch (error) {
      console.error('❌ App initialization error:', error);
      setInitState({ 
        status: 'error', 
        result: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          hasExistingData: false 
        }
      });
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // Show loading screen while initializing
  if (initState.status === 'loading') {
    return <LoadingScreen />;
  }

  // Show error screen if initialization failed
  if (initState.status === 'error') {
    return (
      <ErrorScreen 
        error={initState.result?.error || 'Unknown error'} 
        onRetry={initializeApp}
      />
    );
  }

  // App successfully initialized
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/seeker-login" element={<SeekerLogin />} />
            <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
            <Route path="/seeker-membership" element={<SeekerMembership />} />
            <Route path="/membership-registration" element={<MembershipRegistration />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/seeker-registration" element={<SeekerRegistration />} />
            <Route path="/contributor-enrollment" element={<ContributorEnrollment />} />
            <Route path="/register" element={<OrganizationRegistration />} />
            <Route path="/master-data" element={<MasterDataPortal />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/events" element={<Events />} />
            <Route path="/community" element={<Community />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
