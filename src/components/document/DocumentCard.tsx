import { File, FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

type DocumentStatus = "analyzing" | "completed" | "error";

type KeyFinding = {
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  extractedText?: string;
  mitigationOptions?: string[];
  redraftedClauses?: string[];
};

// Base properties shared by all document types
type BaseDocumentCardProps = {
  id: string;
  title: string;
  date: string;
  status: DocumentStatus;
  className?: string;
  onDelete?: (id: string) => void;
  keyFindings?: KeyFinding[];
};

// Type for analyzing documents
type AnalyzingDocumentProps = BaseDocumentCardProps & {
  status: "analyzing";
  progress: number;
};

// Type for completed documents
type CompletedDocumentProps = BaseDocumentCardProps & {
  status: "completed";
  riskScore: number;
  clauses?: number;
  summary?: string;
  parties?: string[];
};

// Type for error documents
type ErrorDocumentProps = BaseDocumentCardProps & {
  status: "error";
};

// Union type to represent all possible document types
type DocumentCardProps = AnalyzingDocumentProps | CompletedDocumentProps | ErrorDocumentProps;

export function DocumentCard(props: DocumentCardProps) {
  const { id, title, date, status, className, onDelete } = props;

  // Type guards to safely access properties
  const isAnalyzing = status === "analyzing";
  const isCompleted = status === "completed";
  
  // Safely access properties based on status
  const progress = isAnalyzing ? (props as AnalyzingDocumentProps).progress : undefined;
  const riskScore = isCompleted ? (props as CompletedDocumentProps).riskScore : undefined;
  const clauses = isCompleted ? (props as CompletedDocumentProps).clauses : undefined;
  const summary = isCompleted ? (props as CompletedDocumentProps).summary : undefined;
  const parties = isCompleted ? (props as CompletedDocumentProps).parties : undefined;
  const keyFindings = props.keyFindings;

  // Format date to show time as well
  const formattedDate = new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Function to get risk level text and color
  const getRiskLevel = (score?: number) => {
    if (score === undefined) return { text: "", color: "" };
    if (score < 30) return { text: "Low Risk", color: "success" };
    if (score < 70) return { text: "Medium Risk", color: "warning" };
    return { text: "High Risk", color: "destructive" };
  };

  const riskInfo = getRiskLevel(riskScore);

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300",
      "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
      "dark:bg-slate-900/30 dark:border-violet-700/50 dark:hover:border-violet-500",
      className
    )}>
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Analyzing document...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {isCompleted && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={riskInfo.color as any} className="font-medium">
                {riskInfo.text}
              </Badge>
              <Badge variant="outline" className="font-medium">
                {clauses} Clauses
              </Badge>
            </div>
            
            {summary && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {summary}
              </p>
            )}
            
            {keyFindings && keyFindings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>Key Findings</span>
                </div>
                <div className="space-y-1">
                  {keyFindings.slice(0, 2).map((finding, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        finding.riskLevel === "low" ? "bg-success" :
                        finding.riskLevel === "medium" ? "bg-warning" :
                        "bg-destructive"
                      )} />
                      <span className="text-muted-foreground line-clamp-1">
                        {finding.title}
                      </span>
                    </div>
                  ))}
                  {keyFindings.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{keyFindings.length - 2} more findings
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  if (status === "analyzing") {
    return (
      <Badge 
        variant="secondary" 
        className="text-sm px-2 py-0.5 shadow-sm bg-primary/10 text-primary font-medium"
      >
        Analyzing
      </Badge>
    );
  }
  
  if (status === "error") {
    return (
      <Badge 
        variant="destructive" 
        className="text-sm px-2 py-0.5 shadow-sm"
      >
        Error
      </Badge>
    );
  }
  
  return (
    <Badge 
      variant="success" 
      className="text-sm px-2 py-0.5 shadow-sm bg-green-500/10 text-green-600 font-medium"
    >
      Completed
    </Badge>
  );
}
