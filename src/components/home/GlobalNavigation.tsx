
import { useState } from "react";
import { NavigationLogo } from "./navigation/NavigationLogo";
import { DesktopNavigation } from "./navigation/DesktopNavigation";
import { SearchBar } from "./navigation/SearchBar";
import { AuthSection } from "./navigation/AuthSection";
import { MobileMenu } from "./navigation/MobileMenu";
import { MobileMenuToggle } from "./navigation/MobileMenuToggle";

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
          <NavigationLogo />

          {/* Desktop Navigation - Show at medium screens and up */}
          <DesktopNavigation items={navigationItems} />

          {/* Search Bar */}
          <SearchBar />

          {/* Auth Section */}
          <AuthSection 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn} 
          />

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          navigationItems={navigationItems}
        />
      </div>
    </nav>
  );
};
