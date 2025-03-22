
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserButton } from "@/components/auth/UserButton";
import { Link } from "react-router-dom";
import UsageStats from "@/components/usage/UsageStats";
import ModeToggle from "@/components/mode-toggle";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-2xl font-bold">
              Lawbit
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <ModeToggle />
            <UsageStats />
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
            <UserButton />
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 relative z-10 mt-16">
        <div className={cn("w-full max-w-6xl mx-auto p-0.5 rounded-xl", className)}>
          <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
