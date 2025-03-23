
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { Home, Settings, User } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [crtEffect, setCrtEffect] = useState(true);
  const navigate = useNavigate();

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col bg-terminal-background text-terminal-foreground font-mono relative overflow-hidden",
        crtEffect && "crt crt-scanlines"
      )}
    >
      {crtEffect && <div className="scanline"></div>}
      
      {/* Terminal-style Header */}
      <header className="border-b border-terminal-cyan/30 p-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate("/dashboard")}
        >
          <div className="h-6 w-6 rounded-full border border-terminal-cyan flex items-center justify-center">
            <span className="text-terminal-cyan text-xs">G</span>
          </div>
          <h1 className="text-terminal-cyan font-terminal text-xl tracking-wider">GEMINI AI</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-terminal-cyan hover:bg-terminal-darkGray hover:text-terminal-lightCyan"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-terminal-cyan hover:bg-terminal-darkGray hover:text-terminal-lightCyan"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-terminal-darkGray border-terminal-cyan/30 text-terminal-foreground font-mono">
              <SheetHeader>
                <SheetTitle className="text-terminal-cyan font-terminal text-xl">AI Settings</SheetTitle>
                <SheetDescription className="text-terminal-foreground">
                  Configure your AI assistant preferences.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm text-terminal-cyan">System Parameters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="crt-effect" className="flex flex-col gap-1">
                        <span>CRT Effect</span>
                        <span className="text-xs font-normal text-terminal-foreground opacity-70">
                          Enable retro monitor effect
                        </span>
                      </Label>
                      <Switch 
                        id="crt-effect" 
                        checked={crtEffect} 
                        onCheckedChange={setCrtEffect}
                        className="data-[state=checked]:bg-terminal-cyan"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications" className="flex flex-col gap-1">
                        <span>Notifications</span>
                        <span className="text-xs font-normal text-terminal-foreground opacity-70">
                          Receive system alerts
                        </span>
                      </Label>
                      <Switch 
                        id="notifications" 
                        checked={notifications} 
                        onCheckedChange={setNotifications}
                        className="data-[state=checked]:bg-terminal-cyan"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autosave" className="flex flex-col gap-1">
                        <span>Auto Save</span>
                        <span className="text-xs font-normal text-terminal-foreground opacity-70">
                          Automated data backup
                        </span>
                      </Label>
                      <Switch 
                        id="autosave" 
                        checked={autoSave} 
                        onCheckedChange={setAutoSave}
                        className="data-[state=checked]:bg-terminal-cyan"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compact-view" className="flex flex-col gap-1">
                        <span>Compact View</span>
                        <span className="text-xs font-normal text-terminal-foreground opacity-70">
                          Minimize UI elements
                        </span>
                      </Label>
                      <Switch 
                        id="compact-view" 
                        checked={compactView} 
                        onCheckedChange={setCompactView}
                        className="data-[state=checked]:bg-terminal-cyan"
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
            className="text-terminal-cyan hover:bg-terminal-darkGray hover:text-terminal-lightCyan"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn("w-full max-w-6xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
