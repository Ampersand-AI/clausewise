
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { Settings, User } from "lucide-react";
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

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bento-gray-100 to-bento-gray-50 text-bento-gray-800 dark:bg-gradient-to-br dark:from-bento-gray-900 dark:to-bento-gray-800 dark:text-bento-gray-200 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-30 dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] pointer-events-none"></div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-bento-gray-600 hover:text-bento-gray-900 hover:bg-bento-gray-200 dark:text-bento-gray-400 dark:hover:text-bento-gray-100 dark:hover:bg-bento-gray-800 rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white border-bento-gray-200 text-bento-gray-900 dark:bg-bento-gray-800 dark:border-bento-gray-700 dark:text-bento-gray-100">
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
