
import { File, FileText } from "lucide-react";
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
          "border border-bento-gray-200 bg-white shadow-sm hover:shadow-md dark:bg-bento-gray-800 dark:border-bento-gray-700",
          "transform transition-transform hover:scale-102 hover:-translate-y-1",
          status === "analyzing" && "animate-pulse",
          "card-shine", // Add shine effect
          className
        )}
      >
        {isCompleted && riskScore !== undefined && (
          <div className="absolute -top-3 right-4 z-10">
            <Badge 
              variant={riskInfo.color as "success" | "warning" | "destructive"} 
              className="px-3 py-1 text-xs font-medium"
            >
              {riskInfo.text}
            </Badge>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-bento-yellow-50 dark:bg-bento-yellow-100/10 flex items-center justify-center flex-shrink-0 border border-bento-yellow-100 dark:border-bento-yellow-500/20 transition-colors group-hover:bg-bento-orange-50 dark:group-hover:bg-bento-orange-100/10">
            {status === "analyzing" ? (
              <File className="h-6 w-6 text-bento-yellow-500 group-hover:text-bento-orange-500 transition-colors" />
            ) : (
              <FileText className="h-6 w-6 text-bento-orange-500 group-hover:text-bento-brown-600 transition-colors" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-bento-orange-500 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-bento-gray-500 dark:text-bento-gray-400">
                {formattedDate}
              </span>
              <StatusBadge status={status} />
            </div>
            
            {isAnalyzing && progress !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium text-bento-gray-700 dark:text-bento-gray-300">Analyzing document</span>
                  <span className="text-bento-gray-600 dark:text-bento-gray-400">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
            
            {isCompleted && riskScore !== undefined && (
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-4">
                  {clauses !== undefined && (
                    <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400">
                      {clauses} clauses identified
                    </div>
                  )}
                </div>
                
                {parties && parties.length > 0 && (
                  <p className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mt-1">
                    <span className="font-medium">Parties:</span> {parties.join(", ")}
                  </p>
                )}
                
                {summary && (
                  <p className="text-sm text-bento-gray-600 dark:text-bento-gray-400 line-clamp-2 mt-1">
                    {summary}
                  </p>
                )}
                
                {keyFindings && keyFindings.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-bento-gray-600 dark:text-bento-gray-400">Key findings:</p>
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
                        <Badge variant="outline" className="text-xs">
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
          className="absolute bottom-3 left-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-bento-gray-800 text-destructive border-destructive hover:bg-destructive hover:text-white dark:border-destructive"
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
      <Badge variant="outline" className="text-xs font-normal border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
        Analyzing
      </Badge>
    );
  }
  
  if (status === "error") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
        Error
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-xs font-normal border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
      Completed
    </Badge>
  );
}
