
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Database } from "lucide-react";
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
    </div>
  );
};
