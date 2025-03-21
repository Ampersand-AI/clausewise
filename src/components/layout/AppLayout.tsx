
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";
import { ModeToggle } from "../mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {!isHome && <AppSidebar />}
      <div className={cn("flex-1 flex flex-col min-h-screen", className)}>
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-border">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {!isHome && (
              <div className="flex items-center md:hidden">
                <SidebarTrigger />
              </div>
            )}
            <div className={cn("flex items-center gap-2", isHome ? "mx-auto" : "")}>
              <div className="h-8 w-8 rounded-full bg-primary-gradient flex items-center justify-center text-white font-semibold">
                C
              </div>
              <span className="font-medium text-lg">ClauseCrush</span>
            </div>
            {!isHome && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search documents..."
                    className="pl-10 pr-4 py-2 h-9 w-64 lg:w-80 rounded-full text-sm border border-input bg-background"
                  />
                </div>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
                </Button>
                <ModeToggle />
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
