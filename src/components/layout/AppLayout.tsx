
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bento-gray-100 to-bento-gray-50 text-bento-gray-800 dark:bg-gradient-to-br dark:from-bento-gray-900 dark:to-bento-gray-800 dark:text-bento-gray-200 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-30 dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] pointer-events-none"></div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <Button variant="ghost" size="icon" className="text-bento-gray-600 hover:text-bento-gray-900 hover:bg-bento-gray-200 dark:text-bento-gray-400 dark:hover:text-bento-gray-100 dark:hover:bg-bento-gray-800 rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
        <ModeToggle />
        <Button variant="ghost" size="icon" className="text-bento-gray-600 hover:text-bento-gray-900 hover:bg-bento-gray-200 dark:text-bento-gray-400 dark:hover:text-bento-gray-100 dark:hover:bg-bento-gray-800 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </div>
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn("w-full max-w-3xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
