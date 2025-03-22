
import { cn } from "@/lib/utils";
import { Settings, User, Gavel } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();

  // Get system theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bento-orange-50/80 to-bento-yellow-50/80 text-bento-gray-800 dark:bg-gradient-to-br dark:from-bento-brown-700 dark:to-bento-brown-800 dark:text-bento-gray-200 relative overflow-hidden header-gradient-fade">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-30 dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] pointer-events-none"></div>
      
      {/* Header/Navigation */}
      <header className="relative z-20 py-4 px-6 md:px-8 mb-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-bento-brown-800 dark:text-white">
            <Gavel className="h-6 w-6 text-bento-orange-500" />
            <span>LawBit</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" active={location.pathname === "/dashboard"}>
              Dashboard
            </NavLink>
          </nav>
          
          <div className="flex items-center gap-2 z-10">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-bento-orange-600 hover:text-bento-orange-700 hover:bg-bento-orange-100 dark:text-bento-orange-400 dark:hover:text-bento-orange-300 dark:hover:bg-bento-brown-700 rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white/90 backdrop-blur-sm border-bento-orange-200 text-bento-gray-900 dark:bg-bento-brown-800/90 dark:border-bento-brown-700 dark:text-bento-gray-100">
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                  <SheetDescription className="text-bento-gray-600 dark:text-bento-gray-400">
                    Configure your application preferences.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="theme" className="flex flex-col gap-1">
                          <span>Dark Mode</span>
                          <span className="text-xs font-normal text-bento-gray-500 dark:text-bento-gray-400">
                            Switch between light and dark theme
                          </span>
                        </Label>
                        <Switch 
                          id="theme" 
                          checked={theme === 'dark'} 
                          onCheckedChange={toggleTheme} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications" className="flex flex-col gap-1">
                          <span>Notifications</span>
                          <span className="text-xs font-normal text-bento-gray-500 dark:text-bento-gray-400">
                            Receive notifications about your documents
                          </span>
                        </Label>
                        <Switch 
                          id="notifications" 
                          checked={notifications} 
                          onCheckedChange={setNotifications} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autosave" className="flex flex-col gap-1">
                          <span>Auto Save</span>
                          <span className="text-xs font-normal text-bento-gray-500 dark:text-bento-gray-400">
                            Automatically save changes
                          </span>
                        </Label>
                        <Switch 
                          id="autosave" 
                          checked={autoSave} 
                          onCheckedChange={setAutoSave} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="compact-view" className="flex flex-col gap-1">
                          <span>Compact View</span>
                          <span className="text-xs font-normal text-bento-gray-500 dark:text-bento-gray-400">
                            Display content in a more compact format
                          </span>
                        </Label>
                        <Switch 
                          id="compact-view" 
                          checked={compactView} 
                          onCheckedChange={setCompactView} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" className="text-bento-orange-600 hover:text-bento-orange-700 hover:bg-bento-orange-100 dark:text-bento-orange-400 dark:hover:text-bento-orange-300 dark:hover:bg-bento-brown-700 rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn("w-full max-w-6xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-bento-orange-100 text-bento-orange-700 dark:bg-bento-brown-700 dark:text-bento-orange-300"
        : "text-bento-gray-600 hover:text-bento-gray-900 hover:bg-bento-gray-100/60 dark:text-bento-gray-300 dark:hover:text-white dark:hover:bg-bento-brown-700/60"
    }`}
  >
    {children}
  </Link>
);
