
import { Link } from "react-router-dom";

interface NavigationItem {
  label: string;
  href: string;
}

interface DesktopNavigationProps {
  items: NavigationItem[];
}

export const DesktopNavigation = ({ items }: DesktopNavigationProps) => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};
