
import { File, FileText, AlertTriangle, Clock, Calendar, CreditCard } from "lucide-react";
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
          "group relative block rounded-lg p-5 transition-all duration-300",
          "border border-gray-800/50 bg-black/80 shadow-md hover:shadow-lg",
          "transform transition-transform hover:-translate-y-1",
          status === "analyzing" && "animate-pulse",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-gray-800/70 flex items-center justify-center flex-shrink-0 border border-gray-700/50">
            {status === "analyzing" ? (
              <File className="h-6 w-6 text-gray-400" />
            ) : (
              <FileText className="h-6 w-6 text-gray-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-lg truncate text-gray-100">
                {title}
              </h3>
              
              {/* Risk badge */}
              {isCompleted && riskScore !== undefined && (
                <Badge 
                  variant={riskInfo.color as "success" | "warning" | "destructive"} 
                  className="ml-2 px-2 py-0.5 text-xs font-medium"
                >
                  {riskInfo.text}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-400">
                {formattedDate}
              </span>
              <StatusBadge status={status} />
            </div>
            
            {isAnalyzing && progress !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium text-gray-300">Analyzing document</span>
                  <span className="text-gray-400">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" indicatorClassName="bg-blue-500" />
              </div>
            )}
            
            {isCompleted && riskScore !== undefined && (
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-4">
                  {clauses !== undefined && (
                    <div className="text-sm text-gray-400">
                      {clauses} clauses identified
                    </div>
                  )}
                </div>
                
                {parties && parties.length > 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="font-medium">Parties:</span> {parties.join(", ")}
                  </p>
                )}
                
                {summary && (
                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                    {summary}
                  </p>
                )}
                
                {keyFindings && keyFindings.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-400">Key findings:</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
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
                        <Badge variant="dark" className="text-xs">
                          +{keyFindings.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {onDelete && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-3 left-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/70 text-gray-300 border-gray-700/50 hover:bg-red-900/80 hover:text-white"
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
      <Badge variant="dark" className="text-xs font-normal text-blue-300">
        <Clock className="h-3 w-3 mr-1" />
        Analyzing
      </Badge>
    );
  }
  
  if (status === "error") {
    return (
      <Badge variant="dark" className="text-xs font-normal text-red-300">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Error
      </Badge>
    );
  }
  
  return (
    <Badge variant="dark" className="text-xs font-normal text-green-300">
      <CreditCard className="h-3 w-3 mr-1" />
      Completed
    </Badge>
  );
}
