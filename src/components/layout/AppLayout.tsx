
import { cn } from "@/lib/utils";
import { Settings, User, Bell, LogOut, Shield, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserButton } from "@/components/auth/UserButton";
import { Link } from "react-router-dom";
import UsageStats from "@/components/usage/UsageStats";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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
    <div className="min-h-screen flex flex-col bg-[#121212] text-zinc-200 relative overflow-hidden">
      {/* Background gradients and patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,108,54,0.07)_0%,transparent_40%),radial-gradient(circle_at_75%_85%,rgba(255,108,54,0.05)_0%,transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 pointer-events-none"></div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <UsageStats />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-400">
              <Settings className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="backdrop-blur-md bg-zinc-900/95 border-zinc-700">
            <SheetHeader>
              <SheetTitle className="text-orange-500">Settings</SheetTitle>
              <SheetDescription className="text-zinc-400">
                Configure your application preferences.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-300">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme" className="flex flex-col gap-1 text-zinc-300">
                      <span>Dark Mode</span>
                      <span className="text-xs font-normal text-zinc-400">
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
                    <Label htmlFor="notifications" className="flex flex-col gap-1 text-zinc-300">
                      <span>Notifications</span>
                      <span className="text-xs font-normal text-zinc-400">
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
                    <Label htmlFor="autosave" className="flex flex-col gap-1 text-zinc-300">
                      <span>Auto Save</span>
                      <span className="text-xs font-normal text-zinc-400">
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
                    <Label htmlFor="compact-view" className="flex flex-col gap-1 text-zinc-300">
                      <span>Compact View</span>
                      <span className="text-xs font-normal text-zinc-400">
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
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-300">Account</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-left text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
                    <CreditCard className="h-4 w-4 text-orange-500" />
                    <span>Subscription & Billing</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-left text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
                    <Shield className="h-4 w-4 text-orange-500" />
                    <span>Privacy & Security</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-left text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
                    <HelpCircle className="h-4 w-4 text-orange-500" />
                    <span>Help & Support</span>
                  </Button>
                  {user && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-2 text-left text-red-400 hover:text-red-300 hover:bg-zinc-800"
                      onClick={() => signOut()}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <UserButton />
      </div>
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn("w-full max-w-6xl mx-auto glow-effect animate-glow p-0.5 rounded-xl", className)}>
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-700 p-6 rounded-lg w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
