
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import Index from './pages/Index'
import Login from './pages/Login'
import SeekerLogin from './pages/SeekerLogin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MasterData from './pages/MasterData'
import Membership from './pages/Membership'
import CompetencyAssessment from './pages/CompetencyAssessment'
import SolutionProviderEnrollment from './pages/SolutionProviderEnrollment'
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
              <Route path="/login" element={<Login />} />
              <Route path="/seeker-login" element={<SeekerLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/master-data" element={<MasterData />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/competency-assessment" element={<CompetencyAssessment />} />
              <Route path="/solution-provider-enrollment" element={<SolutionProviderEnrollment />} />
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
