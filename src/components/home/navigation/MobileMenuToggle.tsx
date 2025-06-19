
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

export const MobileMenuToggle = ({ isMenuOpen, setIsMenuOpen }: MobileMenuToggleProps) => {
  return (
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
  );
};
