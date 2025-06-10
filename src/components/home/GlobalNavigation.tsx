
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Menu, X, User, Settings, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MasterDataContent } from "@/components/MasterDataContent";

export const GlobalNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('self-enrollment');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  console.log('GlobalNavigation rendered');
  console.log('isSignInDialogOpen:', isSignInDialogOpen);
  console.log('selectedRole:', selectedRole);
  console.log('activeSection:', activeSection);

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Challenges", href: "/challenges" },
    { label: "Solutions", href: "/solutions" },
    { label: "Events", href: "/events" },
    { label: "Community", href: "/community" },
    { label: "Resources", href: "/resources" },
  ];

  const userRoles = [
    "Solution Provider",
    "Solution Seeker", 
    "Solution Manager",
    "Solution Head",
    "Solution Assessor",
    "Client Administrator",
    "Platform Administrator"
  ];

  const handleRoleSelection = (role: string) => {
    console.log('Role selected:', role);
    setSelectedRole(role);
    setIsSignInDialogOpen(true);
    // For Platform Administrator, set default to master data structure
    if (role === "Platform Administrator") {
      console.log('Setting active section to master-data-structure for Platform Administrator');
      setActiveSection('master-data-structure');
    } else {
      setActiveSection('self-enrollment');
    }
  };

  const handleSignInComplete = () => {
    console.log('Sign in complete');
    setIsLoggedIn(true);
    setIsSignInDialogOpen(false);
    setSelectedRole(null);
  };

  return (
    <>
      {/* Navigation Bar with Bright Background for Visibility */}
      <nav className="sticky top-0 z-[60] bg-white border-b-4 border-blue-500 shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="font-bold text-2xl text-blue-600">
                CoInnovator
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden xl:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search challenges, solutions, industries..."
                  className="pl-12 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
              </div>
            </div>

            {/* Auth Section - BRIGHT VISIBLE BUTTONS */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white border shadow-xl z-[70]" align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
                        onClick={() => console.log('Sign In button clicked')}
                      >
                        Sign In
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white border shadow-xl z-[70]" align="end">
                      {userRoles.map((role) => (
                        <DropdownMenuItem 
                          key={role}
                          onClick={() => {
                            console.log('Dropdown item clicked:', role);
                            handleRoleSelection(role);
                          }}
                          className="hover:bg-blue-50 cursor-pointer py-2"
                        >
                          {role}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg">
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t bg-white py-6 space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-12 bg-gray-50 border-gray-300 rounded-xl"
                />
              </div>
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Sign In Dialog - ENSURE IT'S VISIBLE */}
      <Dialog open={isSignInDialogOpen} onOpenChange={(open) => {
        console.log('Dialog open state changed:', open);
        setIsSignInDialogOpen(open);
      }}>
        <DialogContent 
          className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden bg-white border-2 border-blue-500 shadow-2xl z-[80]"
          style={{ 
            position: 'fixed',
            top: '5vh',
            left: '2.5vw',
            width: '95vw',
            height: '90vh',
            maxHeight: '90vh',
            transform: 'none'
          }}
        >
          <DialogHeader className="p-6 border-b bg-blue-50 shrink-0 z-10">
            <DialogTitle className="text-2xl font-bold text-blue-800">
              {selectedRole === "Platform Administrator" ? "Master Data Configuration Portal" : "Master Data & Transactions Portal"}
              {selectedRole && (
                <span className="text-lg text-gray-600 ml-2">- {selectedRole}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-white relative min-h-0">
            <SidebarProvider>
              <div className="flex h-full w-full min-h-0">
                <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <main className="flex-1 relative overflow-hidden min-h-0 bg-gray-50">
                  <div className="h-full overflow-y-auto">
                    <MasterDataContent 
                      activeSection={activeSection} 
                      onSignInComplete={handleSignInComplete}
                    />
                  </div>
                </main>
              </div>
            </SidebarProvider>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
