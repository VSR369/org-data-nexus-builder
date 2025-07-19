import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import MasterDataContent from './components/MasterDataContent';

const queryClient = new QueryClient();

function App() {
  const [activeSection, setActiveSection] = useState('countries');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/*" element={<MasterDataContent activeSection={activeSection} setActiveSection={setActiveSection} />} />
          </Routes>
          <Toaster />
          <SonnerToaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;