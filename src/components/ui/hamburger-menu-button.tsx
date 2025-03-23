
import React from "react";
import HamburgerMenu from "./hamburger-menu";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface HamburgerMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  show?: boolean;
}

const HamburgerMenuButton: React.FC<HamburgerMenuButtonProps> = ({ 
  isOpen, 
  onClick, 
  className,
  show = true
}) => {
  if (!show) return null;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "fixed z-30 left-4 top-4 text-bento-orange-600 hover:text-bento-orange-700 hover:bg-bento-orange-100 dark:text-bento-orange-400 dark:hover:text-bento-orange-300 dark:hover:bg-bento-brown-700 rounded-full",
        className
      )}
    >
      <HamburgerMenu isOpen={isOpen} onClick={() => {}} className="scale-75" />
    </Button>
  );
};

export default HamburgerMenuButton;
