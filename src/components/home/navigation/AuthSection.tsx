
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export const AuthSection = () => {
  const { isAuthenticated, user, profile, signOut, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="hidden sm:flex items-center space-x-3">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {profile?.contact_person_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white" align="end">
            <div className="px-2 py-1.5 text-sm">
              <div className="font-medium">{profile?.contact_person_name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
              {profile?.custom_user_id && (
                <div className="text-xs text-gray-500">ID: {profile.custom_user_id}</div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="hidden sm:flex items-center space-x-3">
          <Link to="/auth">
            <Button variant="outline">
              Sign In
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button>
              Sign Up
            </Button>
          </Link>
        </div>
      )}

      {/* Master Data Portal Link - Separate from authentication */}
      <Link to="/master-data-portal" className="hidden sm:block">
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
