
import { cn } from "@/lib/utils";
import { Settings, User } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
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
    <div className="min-h-screen flex flex-col bg-[#121215] text-foreground relative overflow-hidden">
      {/* Background gradients and patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(50,50,70,0.2)_0%,transparent_40%),radial-gradient(circle_at_75%_85%,rgba(80,50,50,0.2)_0%,transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 pointer-events-none"></div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="glass" size="icon" className="text-primary hover:text-primary/90 rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="backdrop-blur-md bg-glass border-glass-border">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
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
            </div>
          </SheetContent>
        </Sheet>
        <Button variant="glass" size="icon" className="text-primary hover:text-primary/90 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </div>
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn("w-full max-w-6xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
