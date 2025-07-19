import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import MasterDataContent from './components/MasterDataContent';
import OrganizationDashboard from './pages/OrganizationDashboard';

const queryClient = new QueryClient();

function App() {
  const [activeSection, setActiveSection] = useState('countries');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<OrganizationDashboard />} />
            <Route path="/master-data/:section" element={<MasterDataContent activeSection={activeSection} setActiveSection={setActiveSection} />} />
            <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
          </Routes>
          <Toaster />
          <SonnerToaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;