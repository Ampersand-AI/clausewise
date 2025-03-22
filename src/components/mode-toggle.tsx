
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
        <Button variant="ghost" size="icon" className="text-lawbit-orange-500 hover:text-lawbit-orange-400 hover:bg-lawbit-orange-100/20 dark:text-lawbit-orange-400 dark:hover:text-lawbit-orange-300 dark:hover:bg-lawbit-orange-900/20 rounded-full">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-lawbit-orange-200/50 dark:bg-gray-800 dark:border-lawbit-orange-700/30">
        <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-lawbit-orange-50 dark:hover:bg-lawbit-orange-900/20">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-lawbit-orange-50 dark:hover:bg-lawbit-orange-900/20">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-lawbit-orange-50 dark:hover:bg-lawbit-orange-900/20">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ModeToggle;
