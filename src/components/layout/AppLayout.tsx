
import { cn } from "@/lib/utils";
import { Settings, User, Bell, LogOut, Shield, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserButton } from "@/components/auth/UserButton";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen flex flex-col bg-[#121210] text-foreground relative overflow-hidden">
      {/* Background gradients and patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(249,115,22,0.15)_0%,transparent_40%),radial-gradient(circle_at_75%_85%,rgba(181,119,61,0.15)_0%,transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 pointer-events-none"></div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="glass" size="icon" className="text-lawbit-orange-500 hover:text-lawbit-orange-400 rounded-full glow-effect">
              <Settings className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="backdrop-blur-md bg-glass border-glass-border">
            <SheetHeader>
              <SheetTitle className="text-lawbit-orange-500">Settings</SheetTitle>
              <SheetDescription className="text-muted-foreground">
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
                      <span className="text-xs font-normal text-muted-foreground">
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
                      <span className="text-xs font-normal text-muted-foreground">
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
                      <span className="text-xs font-normal text-muted-foreground">
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
                      <span className="text-xs font-normal text-muted-foreground">
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
                <h3 className="text-sm font-medium">Account</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-left">
                    <CreditCard className="h-4 w-4" />
                    <span>Subscription & Billing</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-left">
                    <Shield className="h-4 w-4" />
                    <span>Privacy & Security</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-left">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </Button>
                  {user && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-2 text-left text-destructive hover:text-destructive/90 hover:bg-destructive/10"
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
        <div className={cn("w-full max-w-6xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
