
import { File, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Link } from "react-router-dom";

type DocumentStatus = "analyzing" | "completed" | "error";

// Define props with proper type discrimination
type DocumentCardProps = {
  id: string;
  title: string;
  date: string;
  status: DocumentStatus;
  className?: string;
} & (
  | { status: "analyzing"; progress: number }
  | { status: "completed"; riskScore: number; clauses: number }
  | { status: "error" }
);

export function DocumentCard({ 
  id,
  title,
  date,
  status,
  className,
  ...props 
}: DocumentCardProps) {
  return (
    <Link 
      to={`/document/${id}`}
      className={cn(
        "group relative block rounded-xl p-5 transition-all duration-300",
        "glass-card glass-card-hover",
        status === "analyzing" && "animate-pulse",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          {status === "analyzing" ? (
            <File className="h-6 w-6 text-primary" />
          ) : (
            <FileText className="h-6 w-6 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-muted-foreground">
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <StatusBadge status={status} />
          </div>
          
          {status === "analyzing" && (
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span className="font-medium">Analyzing document</span>
                <span>{props.progress}%</span>
              </div>
              <Progress value={props.progress} className="h-1.5" />
            </div>
          )}
          
          {status === "completed" && (
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  props.riskScore < 30 ? "bg-success" : 
                  props.riskScore < 70 ? "bg-warning" : 
                  "bg-destructive"
                )} />
                <span className="text-sm font-medium">
                  {props.riskScore < 30 ? "Low" : props.riskScore < 70 ? "Medium" : "High"} Risk
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {props.clauses} clauses identified
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  if (status === "analyzing") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400">
        Analyzing
      </Badge>
    );
  }
  
  if (status === "error") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
        Error
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-xs font-normal border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
      Completed
    </Badge>
  );
}
