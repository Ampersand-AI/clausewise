
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { Settings, User } from "lucide-react";
import { Button } from "../ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-indigo-600 dark:text-indigo-400">
          <Settings className="h-5 w-5" />
        </Button>
        <ModeToggle />
        <Button variant="ghost" size="icon" className="text-indigo-600 dark:text-indigo-400">
          <User className="h-5 w-5" />
        </Button>
      </div>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className={cn("w-full max-w-3xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
