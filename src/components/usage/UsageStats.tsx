
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
        <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-400">
          <BarChart3 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-zinc-900/95 border border-zinc-700 backdrop-blur-md">
        <DropdownMenuLabel className="text-orange-500">Your Usage</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <div className="p-2">
          <DropdownMenuGroup>
            {usageStats.map((item, index) => (
              <div key={index} className="mb-3 last:mb-0 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-200">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.used} / {item.total} {item.unit}</span>
                </div>
                <div className="mt-2 h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                    style={{ width: `${Math.min(100, (item.used / item.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem className="gap-2 text-gray-400 hover:text-gray-200">
          <AlertCircle className="h-4 w-4" />
          <span>Usage limits reset on the 1st</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsageStats;
