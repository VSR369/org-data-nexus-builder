
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search challenges, solutions..."
          className="pl-10 bg-gray-50 border-gray-300 focus:border-blue-500"
        />
      </div>
    </div>
  );
};
