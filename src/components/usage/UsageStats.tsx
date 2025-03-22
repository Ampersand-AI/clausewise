
import React from 'react';
import { BarChart3, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type UsageItem = {
  label: string;
  used: number;
  total: number;
  unit: string;
};

const UsageStats: React.FC = () => {
  // Mock usage data - in a real app, this would come from an API
  const usageStats: UsageItem[] = [
    { label: "AI Credits", used: 2500, total: 10000, unit: "credits" },
    { label: "Storage", used: 142, total: 500, unit: "MB" },
    { label: "Documents", used: 15, total: 50, unit: "files" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass" size="icon" className="text-lawbit-orange-500 hover:text-lawbit-orange-400 rounded-full glow-effect">
          <BarChart3 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 backdrop-blur-md bg-glass border-glass-border">
        <DropdownMenuLabel className="text-lawbit-orange-500">Your Usage</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <DropdownMenuGroup>
            {usageStats.map((item, index) => (
              <div key={index} className="usage-stat-card mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.used} / {item.total} {item.unit}</span>
                </div>
                <Progress 
                  value={(item.used / item.total) * 100} 
                  className="h-2 bg-lawbit-orange-200/20 dark:bg-lawbit-orange-900/20"
                />
              </div>
            ))}
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Usage limits reset on the 1st</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsageStats;
