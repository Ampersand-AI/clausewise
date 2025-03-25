import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertCircle, FileText, Brain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type QuotaData = {
  contractsUsed: number;
  contractsLimit: number;
  analysesUsed: number;
  analysesLimit: number;
};

interface QuotaDisplayProps {
  data: QuotaData;
  compact?: boolean;
  className?: string;
}

export function QuotaDisplay({ data, compact = false, className }: QuotaDisplayProps) {
  const getQuotaColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage < 50) return "text-green-600 dark:text-green-400";
    if (percentage < 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  if (compact) {
    return (
      <TooltipProvider>
        <div className={cn("flex items-center gap-3", className)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className={cn(
                  "text-sm font-medium",
                  getQuotaColor(data.contractsUsed, data.contractsLimit)
                )}>
                  {data.contractsUsed}/{data.contractsLimit}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Contract Creation Quota</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span className={cn(
                  "text-sm font-medium",
                  getQuotaColor(data.analysesUsed, data.analysesLimit)
                )}>
                  {data.analysesUsed}/{data.analysesLimit}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Analysis Quota</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn(
      "space-y-6 p-6 rounded-lg",
      "bg-card border shadow-sm",
      "hover:shadow-md transition-all duration-200",
      className
    )}>
      <div>
        <div className="flex justify-between mb-3">
          <span className="font-semibold text-lg">Contract Creation</span>
          <span className={cn(
            "font-semibold text-lg",
            getQuotaColor(data.contractsUsed, data.contractsLimit)
          )}>
            {data.contractsUsed}/{data.contractsLimit}
          </span>
        </div>
        <Progress 
          value={(data.contractsUsed / data.contractsLimit) * 100} 
          className="h-2.5 enhanced-progress" 
          showGradient={true}
        />
        <div className={cn(
          "flex items-center gap-2 mt-2",
          "text-sm text-muted-foreground",
          "animate-fade-in"
        )}>
          {data.contractsUsed >= data.contractsLimit && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <p>
            {data.contractsUsed >= data.contractsLimit 
              ? "Limit reached. Upgrade to create more contracts."
              : `${data.contractsLimit - data.contractsUsed} contracts remaining today.`
            }
          </p>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-3">
          <span className="font-semibold text-lg">Document Analysis</span>
          <span className={cn(
            "font-semibold text-lg",
            getQuotaColor(data.analysesUsed, data.analysesLimit)
          )}>
            {data.analysesUsed}/{data.analysesLimit}
          </span>
        </div>
        <Progress 
          value={(data.analysesUsed / data.analysesLimit) * 100} 
          className="h-2.5 enhanced-progress" 
          showGradient={true}
        />
        <div className={cn(
          "flex items-center gap-2 mt-2",
          "text-sm text-muted-foreground",
          "animate-fade-in"
        )}>
          {data.analysesUsed >= data.analysesLimit && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <p>
            {data.analysesUsed >= data.analysesLimit 
              ? "Limit reached. Upgrade to analyze more documents."
              : `${data.analysesLimit - data.analysesUsed} analyses remaining today.`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
