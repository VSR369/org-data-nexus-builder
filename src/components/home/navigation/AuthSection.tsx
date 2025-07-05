
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Database, Building2, Target, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthSectionProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

export const AuthSection = ({ isLoggedIn, setIsLoggedIn }: AuthSectionProps) => {
  return (
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sign In
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white" align="end">
              <DropdownMenuItem asChild>
                <Link to="/general-signin" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  General Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/seeker-login" className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  Solution Seeking Organization
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/seeking-org-administrator-login" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Seeking Org Administrator
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/seeker-login" className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  Solution Seeker
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/signup">
            <Button>
              Sign Up
            </Button>
          </Link>
        </div>
      )}

      {/* Master Data Portal Link - Separate from authentication */}
      <Link to="/master-data" className="hidden sm:block">
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Master Data Portal
        </Button>
      </Link>
    </div>
  );
};
