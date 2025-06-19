
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
import { Search, Menu, X, User, Settings, LogOut, Sparkles, Database } from "lucide-react";
import { Link } from "react-router-dom";

export const GlobalNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Challenges", href: "/challenges" },
    { label: "Solutions", href: "/solutions" },
    { label: "Events", href: "/events" },
    { label: "Community", href: "/community" },
    { label: "Resources", href: "/resources" },
  ];

  return (
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

          {/* Desktop Navigation - Show at medium screens and up */}
          <div className="hidden md:flex items-center space-x-1">
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
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
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
                <DropdownMenuContent className="w-56 bg-white" align="end">
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
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/signin">
                  <Button variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Master Data Portal Link - Only for master data management */}
            <Link to="/master-data" className="hidden sm:block">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Master Data Portal
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
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
          <div className="md:hidden border-t bg-white py-4 space-y-2">
            {/* Search Bar for Mobile */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-50"
              />
            </div>
            
            {/* Navigation items - always visible */}
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block py-2 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Sign-in options - only when not logged in */}
            {!isLoggedIn && (
              <div className="px-4 py-2 border-t pt-4 mt-4">
                <div className="space-y-2">
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full"
                  >
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full"
                  >
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Master Data Portal link in mobile - Only for master data management */}
            <Link
              to="/master-data"
              className="block py-2 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded font-medium border-t pt-4 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <Database className="inline h-4 w-4 mr-2" />
              Master Data Portal
            </Link>
            
            {/* User Profile section when logged in */}
            {isLoggedIn && (
              <div className="px-4 py-2 border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Account:</p>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <User className="inline mr-2 h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Settings className="inline mr-2 h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <LogOut className="inline mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
