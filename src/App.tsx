
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import Index from './pages/Index'
import SeekerLogin from './pages/SeekerLogin'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import SeekerDashboard from './pages/SeekerDashboard'
import MasterDataPortal from './pages/MasterDataPortal'
import SeekerMembership from './pages/SeekerMembership'
import OrganizationRegistration from './pages/OrganizationRegistration'
import SeekerRegistration from './pages/SeekerRegistration'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/seeker-login" element={<SeekerLogin />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<SeekerDashboard />} />
              <Route path="/master-data" element={<MasterDataPortal />} />
              <Route path="/membership" element={<SeekerMembership />} />
              <Route path="/organization-registration" element={<OrganizationRegistration />} />
              <Route path="/seeker-registration" element={<SeekerRegistration />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
