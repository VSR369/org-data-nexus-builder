
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const NavigationLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <span className="font-bold text-xl text-gray-900">
        CoInnovator
      </span>
    </Link>
  );
};
