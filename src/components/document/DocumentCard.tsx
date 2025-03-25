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
    <div className="group relative">
      <Link 
        to={`/document/${id}`}
        className={cn(
          "enhanced-card group relative block",
          "p-5 h-full transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-1",
          status === "analyzing" && "animate-pulse",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
            "bg-gradient-to-br from-primary/10 to-primary/5",
            "border border-primary/10"
          )}>
            {status === "analyzing" ? (
              <File className="h-5 w-5 text-primary" />
            ) : (
              <FileText className="h-5 w-5 text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between w-full gap-3">
              <h3 className="font-semibold text-base truncate pr-2 mb-1">
                {title}
              </h3>
              
              {isCompleted && riskScore !== undefined && (
                <Badge 
                  variant={riskInfo.color as "success" | "warning" | "destructive"} 
                  className={cn(
                    "px-2 py-0.5 text-xs font-medium shrink-0",
                    "shadow-sm"
                  )}
                >
                  {riskInfo.text}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {formattedDate}
            </p>
            
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={status} />
              
              {isCompleted && clauses !== undefined && (
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1.5 text-warning" />
                  <span className="text-sm font-medium">{clauses} clauses</span>
                </div>
              )}
            </div>
            
            {isAnalyzing && progress !== undefined && (
              <div className="mt-3 w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Processing</span>
                  <span className="text-sm text-primary font-medium">{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2 enhanced-progress" 
                  showGradient={true} 
                />
              </div>
            )}
            
            {isCompleted && riskScore !== undefined && (
              <div className="mt-3 w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Risk score</span>
                  <span 
                    className={cn(
                      "text-sm font-medium",
                      riskScore < 30 ? "text-green-600" : 
                      riskScore < 70 ? "text-yellow-600" : 
                      "text-red-600"
                    )}
                  >
                    {riskScore}%
                  </span>
                </div>
                <Progress 
                  value={riskScore} 
                  className="h-2 enhanced-progress" 
                  showGradient={true}
                />
              </div>
            )}
            
            {keyFindings && keyFindings.length > 0 && (
              <div className="mt-4">
                <div className="flex gap-2 flex-wrap">
                  {keyFindings.slice(0, 2).map((finding, idx) => (
                    <Badge 
                      key={idx} 
                      variant={finding.riskLevel === 'low' ? 'success' : finding.riskLevel === 'medium' ? 'warning' : 'destructive'}
                      className="text-xs px-2 py-1 shadow-sm hover-scale"
                    >
                      {finding.title}
                    </Badge>
                  ))}
                  {keyFindings.length > 2 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-1 text-muted-foreground hover-scale"
                    >
                      +{keyFindings.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {onDelete && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute -top-2 -right-2 h-8 w-8",
            "opacity-0 group-hover:opacity-100 transition-all duration-200",
            "border-destructive text-destructive",
            "hover:bg-destructive hover:text-destructive-foreground",
            "shadow-sm z-10"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
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
