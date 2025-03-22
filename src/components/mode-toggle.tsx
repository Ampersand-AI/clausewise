
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass" size="icon" className="text-lawbit-orange-500 hover:text-lawbit-orange-400 rounded-full glow-effect">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="backdrop-blur-md bg-glass border-glass-border shadow-lg">
        <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-glass-light hover:text-lawbit-orange-400">
          <Sun className="h-4 w-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-glass-light hover:text-lawbit-orange-400">
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-glass-light hover:text-lawbit-orange-400">
          <span className="h-4 w-4 mr-2 flex items-center justify-center">
            <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ModeToggle;
