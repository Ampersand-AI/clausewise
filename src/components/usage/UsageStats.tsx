
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
  // Updated usage data with tokens, created contracts, and analyzed contracts
  const usageStats: UsageItem[] = [
    { label: "AI Tokens", used: 2500, total: 10000, unit: "tokens" },
    { label: "Created Contracts", used: 8, total: 15, unit: "documents" },
    { label: "Analyzed Contracts", used: 12, total: 25, unit: "documents" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass" size="icon" className="text-lawbit-orange-500 hover:text-lawbit-orange-400 rounded-full glow-effect">
          <BarChart3 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 backdrop-blur-md bg-glass border-glass-border shadow-lg">
        <DropdownMenuLabel className="text-lawbit-orange-500 text-lg">Usage Stats</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-lawbit-orange-500/20" />
        <div className="p-4">
          <DropdownMenuGroup>
            {usageStats.map((item, index) => (
              <div key={index} className="usage-stat-card mb-4 last:mb-0 p-3 backdrop-blur-md bg-glass-light rounded-lg border border-lawbit-orange-300/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-lawbit-orange-400">{item.label}</span>
                  <span className="text-xs text-foreground/80">{item.used} / {item.total} {item.unit}</span>
                </div>
                <Progress 
                  value={(item.used / item.total) * 100} 
                  className="h-2 bg-lawbit-orange-200/20 dark:bg-lawbit-orange-900/20"
                  indicatorClassName="bg-orange-brown-gradient"
                />
                <div className="mt-1 text-xs text-right text-muted-foreground">
                  {Math.round((item.used / item.total) * 100)}% used
                </div>
              </div>
            ))}
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator className="bg-lawbit-orange-500/20" />
        <DropdownMenuItem className="gap-2 text-muted-foreground hover:text-foreground">
          <AlertCircle className="h-4 w-4 text-lawbit-orange-500" />
          <span>Usage limits reset on the 1st</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsageStats;
