
import { cn } from "@/lib/utils";
import { Home, Settings, User, Database } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "../ui/progress";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const navigate = useNavigate();

  // Quota data (would come from a real API in production)
  const quota = {
    contractsUsed: 1,
    contractsLimit: 2,
    analysesUsed: 3,
    analysesLimit: 5,
  };

  const getQuotaColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col relative",
      )}
    >
      {/* Icons-only header */}
      <header className="p-4 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => {
                    // Show upgrade modal in a real implementation
                    alert("Upgrade to Premium for more tokens!");
                  }}
                >
                  <Database className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="w-60 p-0">
                <div className="p-3">
                  <h3 className="font-medium mb-2">Your Usage Quota</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Contract Creation: {quota.contractsUsed}/{quota.contractsLimit}</span>
                        <span>{Math.round((quota.contractsUsed / quota.contractsLimit) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(quota.contractsUsed / quota.contractsLimit) * 100} 
                        className="h-1.5" 
                        indicatorClassName={getQuotaColor(quota.contractsUsed, quota.contractsLimit)}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Document Analysis: {quota.analysesUsed}/{quota.analysesLimit}</span>
                        <span>{Math.round((quota.analysesUsed / quota.analysesLimit) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(quota.analysesUsed / quota.analysesLimit) * 100} 
                        className="h-1.5" 
                        indicatorClassName={getQuotaColor(quota.analysesUsed, quota.analysesLimit)}
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Upgrade to Premium for 10,000 tokens (2 contracts + 5 analyses per day)
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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
      
      <main className="flex-1 flex items-center justify-center py-8 px-4 mt-8">
        <div className={cn("w-full max-w-3xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
