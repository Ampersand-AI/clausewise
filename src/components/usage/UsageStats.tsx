
import React from 'react';
import { BarChart3, AlertTriangle, Clock, Calendar, CreditCard } from "lucide-react";
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

  // Function to get icon based on status
  const getIcon = (status?: string) => {
    switch(status) {
      case "outstanding":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "overdue":
        return <Clock className="h-5 w-5 text-red-500" />;
      case "scheduled":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "paid":
        return <CreditCard className="h-5 w-5 text-gray-500" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  // Function to get badge variant based on status
  const getBadgeVariant = (status?: string) => {
    switch(status) {
      case "outstanding":
        return "alert";
      case "overdue":
        return "overdue";
      case "scheduled":
        return "scheduled";
      case "paid":
        return "paid";
      default:
        return "dark";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="text-gray-400 hover:text-gray-200 border-gray-800/50 bg-black/80 rounded-full">
          <BarChart3 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black/90 border-gray-800/50 shadow-lg">
        <DropdownMenuLabel className="text-gray-100 text-lg">All Invoices</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800/50" />
        <div className="p-4">
          <DropdownMenuGroup>
            {usageStats.map((item, index) => (
              <div key={index} className="usage-stat-card mb-4 last:mb-0 p-3 bg-gray-900/70 rounded-lg border border-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIcon(item.status)}
                    <span className="text-sm font-medium text-gray-300">{item.label}</span>
                  </div>
                  <Badge variant={getBadgeVariant(item.status)} className="text-xs">
                    ${item.used}
                  </Badge>
                </div>
                {item.status !== "outstanding" && (
                  <div className="mt-2">
                    <Progress 
                      value={(item.used / item.total) * 100} 
                      className="h-1.5 bg-gray-800/70"
                      indicatorClassName={
                        item.status === "overdue" ? "bg-red-500" : 
                        item.status === "scheduled" ? "bg-blue-500" : 
                        item.status === "paid" ? "bg-gray-500" : 
                        "bg-orange-500"
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator className="bg-gray-800/50" />
        <DropdownMenuItem className="gap-2 text-gray-400 hover:text-gray-200 focus:bg-gray-800/70">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span>Outstanding balance: $2,500</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsageStats;
