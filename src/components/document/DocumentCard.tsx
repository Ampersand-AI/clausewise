
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
          "group relative block rounded-xl transition-all duration-300",
          "border border-border bg-white shadow-sm text-bento-text",
          "hover:border-primary/50 p-4 h-full",
          status === "analyzing" && "animate-pulse",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0 border border-border">
            {status === "analyzing" ? (
              <File className="h-4 w-4 text-primary" />
            ) : (
              <FileText className="h-4 w-4 text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between w-full">
              <h3 className="font-semibold text-sm truncate pr-2 mb-0.5 flex-1">
                {title}
              </h3>
              
              {isCompleted && riskScore !== undefined && (
                <Badge 
                  variant={riskInfo.color as "success" | "warning" | "destructive"} 
                  className="px-1.5 py-0.5 text-xs font-medium shrink-0"
                >
                  {riskInfo.text}
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">
              {formattedDate}
            </p>
            
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={status} />
              
              {isCompleted && clauses !== undefined && (
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1 text-warning" />
                  <span className="text-xs font-medium">{clauses} clauses</span>
                </div>
              )}
            </div>
            
            {isAnalyzing && progress !== undefined && (
              <div className="mt-2 w-full">
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium">Processing</span>
                  <span className="text-primary font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" showGradient={true} />
              </div>
            )}
            
            {isCompleted && riskScore !== undefined && (
              <div className="mt-2 w-full">
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium">Risk score</span>
                  <span 
                    className={cn(
                      "font-medium",
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
                  className="h-1.5" 
                  showGradient={true}
                />
              </div>
            )}
            
            {keyFindings && keyFindings.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 flex-wrap">
                  {keyFindings.slice(0, 2).map((finding, idx) => (
                    <Badge 
                      key={idx} 
                      variant={finding.riskLevel === 'low' ? 'success' : finding.riskLevel === 'medium' ? 'warning' : 'destructive'}
                      className="text-xs"
                    >
                      {finding.title}
                    </Badge>
                  ))}
                  {keyFindings.length > 2 && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
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
          className="absolute bottom-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity border-destructive text-destructive hover:bg-destructive/20 hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  if (status === "analyzing") {
    return (
      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
        Analyzing
      </Badge>
    );
  }
  
  if (status === "error") {
    return (
      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
        Error
      </Badge>
    );
  }
  
  return (
    <Badge variant="success" className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-600 font-medium">
      Completed
    </Badge>
  );
}
