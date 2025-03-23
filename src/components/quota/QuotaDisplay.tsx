
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage < 50) return "text-green-600";
    if (percentage < 80) return "text-yellow-600";
    return "text-red-600";
  };

  if (compact) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Contracts: {data.contractsUsed}/{data.contractsLimit}</span>
            <span className={getTextColor(data.contractsUsed, data.contractsLimit)}>
              {Math.round((data.contractsUsed / data.contractsLimit) * 100)}%
            </span>
          </div>
          <Progress 
            value={(data.contractsUsed / data.contractsLimit) * 100} 
            className="h-1.5" 
            indicatorClassName={getQuotaColor(data.contractsUsed, data.contractsLimit)}
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Analyses: {data.analysesUsed}/{data.analysesLimit}</span>
            <span className={getTextColor(data.analysesUsed, data.analysesLimit)}>
              {Math.round((data.analysesUsed / data.analysesLimit) * 100)}%
            </span>
          </div>
          <Progress 
            value={(data.analysesUsed / data.analysesLimit) * 100} 
            className="h-1.5" 
            indicatorClassName={getQuotaColor(data.analysesUsed, data.analysesLimit)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <div className="flex justify-between mb-1">
          <span className="font-medium">Contract Creation</span>
          <span className={cn("font-medium", getTextColor(data.contractsUsed, data.contractsLimit))}>
            {data.contractsUsed}/{data.contractsLimit}
          </span>
        </div>
        <Progress 
          value={(data.contractsUsed / data.contractsLimit) * 100} 
          className="h-2" 
          indicatorClassName={cn("gradient-animation", data.contractsUsed === data.contractsLimit && "!bg-red-500")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {data.contractsUsed >= data.contractsLimit 
            ? "Limit reached. Upgrade to create more contracts."
            : `${data.contractsLimit - data.contractsUsed} contracts remaining today.`
          }
        </p>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="font-medium">Document Analysis</span>
          <span className={cn("font-medium", getTextColor(data.analysesUsed, data.analysesLimit))}>
            {data.analysesUsed}/{data.analysesLimit}
          </span>
        </div>
        <Progress 
          value={(data.analysesUsed / data.analysesLimit) * 100} 
          className="h-2" 
          indicatorClassName={cn("gradient-animation", data.analysesUsed === data.analysesLimit && "!bg-red-500")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {data.analysesUsed >= data.analysesLimit 
            ? "Limit reached. Upgrade to analyze more documents."
            : `${data.analysesLimit - data.analysesUsed} analyses remaining today.`
          }
        </p>
      </div>
    </div>
  );
}
