
import { cn } from "@/lib/utils";
import { Home, Settings, User } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
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
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col bg-background text-foreground relative",
      )}
    >
      {/* Header */}
      <header className="border-b p-4 flex items-center justify-between bg-background">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate("/dashboard")}
        >
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs">L</span>
          </div>
          <h1 className="font-medium text-xl">Lawbit</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Configure your preferences.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">System Parameters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications" className="flex flex-col gap-1">
                        <span>Notifications</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          Receive system alerts
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
                          Automated data backup
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
                          Minimize UI elements
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
          
          <Button
            variant="ghost"
            size="icon"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 bg-background">
        <div className={cn("w-full max-w-6xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
