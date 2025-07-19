
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

// Import all pages
import Dashboard from './pages/Dashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import MasterDataPortal from './pages/MasterDataPortal';
import NewSeekerPortal from './pages/NewSeekerPortal';
import ContributionPortal from './pages/ContributionPortal';
import AdminPortal from './pages/AdminPortal';
import MasterDataContent from './components/MasterDataContent';

const queryClient = new QueryClient();

function App() {
  const [activeSection, setActiveSection] = useState('countries');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Main Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Portal Routes */}
            <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
            <Route path="/master-data-portal" element={<MasterDataPortal />} />
            <Route path="/new-seeker" element={<NewSeekerPortal />} />
            <Route path="/contribution-portal" element={<ContributionPortal />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            
            {/* Master Data Section Routes */}
            <Route path="/master-data/:section" element={<MasterDataContent activeSection={activeSection} setActiveSection={setActiveSection} />} />
            
            {/* Legacy compatibility routes */}
            <Route path="/master-data" element={<MasterDataPortal />} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster />
          <SonnerToaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
