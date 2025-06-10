
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
import { Search, Menu, X, User, Settings, LogOut, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const GlobalNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Challenges", href: "/challenges" },
    { label: "Solutions", href: "/solutions" },
    { label: "Events", href: "/events" },
    { label: "Community", href: "/community" },
    { label: "Resources", href: "/resources" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-background via-background/95 to-background backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-primary/20 shadow-lg">
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
                <Button 
                  variant="ghost" 
                  onClick={() => setIsLoggedIn(true)}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Sign In
                </Button>
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
  );
};
