
import React from "react";
import { cn } from "@/lib/utils";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClick, className }) => {
  return (
    <button 
      className={cn("hamburger-menu", isOpen && "open", className)} 
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default HamburgerMenu;
