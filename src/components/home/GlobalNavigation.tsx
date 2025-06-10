
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
import { Search, Menu, X, User, Settings, LogOut, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MasterDataContent } from "@/components/MasterDataContent";

export const GlobalNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMasterDataDialogOpen, setIsMasterDataDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('master-data-structure');

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Challenges", href: "/challenges" },
    { label: "Solutions", href: "/solutions" },
    { label: "Events", href: "/events" },
    { label: "Community", href: "/community" },
    { label: "Resources", href: "/resources" },
  ];

  const handleMasterDataAccess = () => {
    setIsMasterDataDialogOpen(true);
  };

  const handleSignInComplete = () => {
    setIsLoggedIn(true);
    setIsMasterDataDialogOpen(false);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-[60] bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">
                CoInnovator
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden xl:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search challenges, solutions..."
                  className="pl-10 bg-gray-50 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
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
                  <Button variant="outline">
                    Sign In
                  </Button>
                  <Button>
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Master Data Access Button */}
              <Button 
                onClick={handleMasterDataAccess}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Master Data
              </Button>

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
            <div className="lg:hidden border-t bg-white py-4 space-y-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-gray-50"
                />
              </div>
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block py-2 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Master Data Dialog */}
      <Dialog open={isMasterDataDialogOpen} onOpenChange={setIsMasterDataDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-2xl font-bold">
              Master Data Configuration Portal
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <SidebarProvider>
              <div className="flex h-full w-full">
                <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <main className="flex-1 overflow-hidden">
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
