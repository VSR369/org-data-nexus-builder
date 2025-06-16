
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import SeekerRegistration from "./pages/SeekerRegistration";
import SeekerLogin from "./pages/SeekerLogin";
import SeekerDashboard from "./pages/SeekerDashboard";
import { appInitializationService } from "./utils/storage/AppInitializationService";
import { migrationService } from "./utils/storage/MigrationService";

const queryClient = new QueryClient();

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting app initialization...');
        
        // Initialize IndexedDB
        const initResult = await appInitializationService.initialize();
        
        if (!initResult.success) {
          throw new Error(initResult.error || 'App initialization failed');
        }

        // Run migration if not completed
        if (!migrationService.isMigrationComplete()) {
          console.log('🔄 Running localStorage to IndexedDB migration...');
          await migrationService.migrateAllLocalStorageData();
        }

        setIsInitialized(true);
        console.log('✅ App initialization complete');
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
        setIsInitialized(true); // Still allow app to load with limited functionality
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing Application</h2>
          <p className="text-gray-600">Setting up data persistence and migration...</p>
        </div>
      </div>
    );
  }

  if (initError) {
    console.warn('⚠️ App running with initialization error:', initError);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/seeker-registration" element={<SeekerRegistration />} />
            <Route path="/seeker-login" element={<SeekerLogin />} />
            <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
