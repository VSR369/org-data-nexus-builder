
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Settings, LogOut, Database } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  navigationItems: NavigationItem[];
}

export const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isLoggedIn, 
  setIsLoggedIn, 
  navigationItems 
}: MobileMenuProps) => {
  if (!isMenuOpen) return null;

  return (
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
  );
};
