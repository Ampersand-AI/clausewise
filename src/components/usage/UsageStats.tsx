
import React from 'react';
import { BarChart3, AlertTriangle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

type UsageItem = {
  label: string;
  used: number;
  total: number;
  unit: string;
  status?: "outstanding" | "overdue" | "scheduled" | "paid";
};

const UsageStats: React.FC = () => {
  // Updated usage data to match invoice-style from the image
  const usageStats: UsageItem[] = [
    { label: "Outstanding invoices", used: 2500, total: 10000, unit: "tokens", status: "outstanding" },
    { label: "Overdue", used: 750, total: 1000, unit: "documents", status: "overdue" },
    { label: "Scheduled", used: 12, total: 25, unit: "documents", status: "scheduled" },
    { label: "Paid", used: 20, total: 25, unit: "documents", status: "paid" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <BarChart3 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>All Invoices</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-4">
          <DropdownMenuGroup>
            {usageStats.map((item, index) => (
              <div key={index} className="mb-4 last:mb-0 p-3 bg-muted rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ${item.used}
                  </Badge>
                </div>
                {item.status !== "outstanding" && (
                  <div className="mt-2">
                    <Progress 
                      value={(item.used / item.total) * 100} 
                      className="h-1.5"
                    />
                  </div>
                )}
              </div>
            ))}
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Outstanding balance: $2,500</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsageStats;
