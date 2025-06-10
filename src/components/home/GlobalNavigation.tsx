
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
    setSelectedRole(role);
    setIsSignInDialogOpen(true);
  };

  const handleSignInComplete = () => {
    setIsLoggedIn(true);
    setIsSignInDialogOpen(false);
    setSelectedRole(null);
  };

  return (
    <>
      <nav className="sticky top-0 z-[60] bg-gradient-to-r from-background via-background/95 to-background backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-primary/20 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                CoInnovator
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300 story-link group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden xl:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search challenges, solutions, industries..."
                  className="pl-12 bg-gradient-to-r from-background to-muted/30 border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-md border border-primary/20 shadow-xl" align="end">
                    <DropdownMenuItem className="hover:bg-primary/10">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-primary/10">
                      <Settings className="mr-2 h-4 w-4 text-primary" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)} className="hover:bg-red-50 hover:text-red-600">
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
                        variant="ghost" 
                        className="hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
                      >
                        Sign In
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-md border border-primary/20 shadow-xl" align="end">
                      {userRoles.map((role) => (
                        <DropdownMenuItem 
                          key={role}
                          onClick={() => handleRoleSelection(role)}
                          className="hover:bg-primary/10 cursor-pointer"
                        >
                          {role}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-primary/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-primary" />
                ) : (
                  <Menu className="h-5 w-5 text-primary" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-primary/20 py-6 space-y-4 bg-gradient-to-b from-background to-muted/20">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-12 bg-muted/30 border-primary/20 rounded-xl"
                />
              </div>
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block py-3 px-4 text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-lg mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Sign In Dialog */}
      <Dialog open={isSignInDialogOpen} onOpenChange={setIsSignInDialogOpen}>
        <DialogContent className="max-w-7xl w-full h-[85vh] p-0 top-[52%] z-40">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Master Data & Transactions Portal
              {selectedRole && (
                <span className="text-lg text-muted-foreground ml-2">- {selectedRole}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <SidebarProvider>
              <div className="flex h-full w-full">
                <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <main className="flex-1 overflow-auto">
                  <MasterDataContent 
                    activeSection={activeSection} 
                    onSignInComplete={handleSignInComplete}
                  />
                </main>
              </div>
            </SidebarProvider>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
