
import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { appInitializationService } from './utils/storage/AppInitializationService'
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
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting app initialization...')
        const result = await appInitializationService.initialize()
        
        if (result.success) {
          console.log('✅ App initialization successful')
          setIsInitialized(true)
        } else {
          console.error('❌ App initialization failed:', result.error)
          setInitError(result.error || 'Unknown initialization error')
        }
      } catch (error) {
        console.error('❌ App initialization error:', error)
        setInitError(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    initializeApp()
  }, [])

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">App Initialization Failed</h1>
          <p className="text-red-800 mb-4">{initError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-blue-800">Initializing Application...</h1>
          <p className="text-blue-600 mt-2">Setting up database and storage...</p>
        </div>
      </div>
    )
  }

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
              <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
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
