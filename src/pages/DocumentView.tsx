
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle2, Copy, AlertTriangle, ArrowLeft, Download, FileText, Info, Sparkles, HelpCircle, CheckCheck } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Define document data types
type AnalyzingDocument = {
  id: string;
  title: string;
  date: string;
  status: "analyzing";
  progress: number;
};

type CompletedDocument = {
  id: string;
  title: string;
  date: string;
  status: "completed";
  riskScore: number;
  clauses: number;
  keyFindings: {
    title: string;
    description: string;
    riskLevel: string;
    extractedText?: string;
    mitigationOptions?: string[];
  }[];
};

type ErrorDocument = {
  id: string;
  title: string;
  date: string;
  status: "error";
};

type Document = AnalyzingDocument | CompletedDocument | ErrorDocument;

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch document from localStorage
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const storedDocuments = localStorage.getItem('documents');
        let documents: Document[] = [];
        
        if (storedDocuments) {
          documents = JSON.parse(storedDocuments);
        }
        
        const foundDocument = documents.find(doc => doc.id === id);
        
        if (foundDocument) {
          setDocument(foundDocument);
        } else {
          toast({
            title: "Document not found",
            description: "The requested document could not be found",
            variant: "destructive"
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        toast({
          title: "Error",
          description: "There was an error loading the document",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id, navigate, toast]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="container px-4 py-16 mx-auto text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-r-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground">Retrieving document details...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (!document) {
    return (
      <AppLayout>
        <div className="container px-4 py-16 mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }
  
  // Handle analyzing document
  if (document.status === "analyzing") {
    return (
      <AppLayout>
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-6 border-l border-border"></div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
          </div>
          
          <Card className="p-10 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* AI-inspired circular rings animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-[-4px] border-2 border-primary/30 border-dashed rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
                <div className="absolute inset-[-8px] border-2 border-primary/20 border-dashed rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background rounded-full p-3">
                    <FileText className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-medium mb-3">AI analyzing document...</h2>
              <p className="text-muted-foreground mb-6">
                Our AI is processing and extracting insights from your document. This may take a few moments.
              </p>
              <div className="relative h-2 mb-2 overflow-hidden rounded-full bg-primary/10">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-gradient-to-r from-primary to-violet-600"></div>
                  <div className="w-1/2 bg-gradient-to-r from-violet-600 to-primary"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground">{document.progress}% complete</p>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  // Handle error document
  if (document.status === "error") {
    return (
      <AppLayout>
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-6 border-l border-border"></div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
          </div>
          
          <Card className="p-10 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-medium mb-3">Analysis Error</h2>
              <p className="text-muted-foreground mb-6">
                There was an error analyzing this document. Please try uploading it again.
              </p>
              <Link to="/dashboard">
                <Button>Return to Dashboard</Button>
              </Link>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  // Handle completed document (type is now narrowed to CompletedDocument)
  const completedDoc = document as CompletedDocument;
  const keyFindings = completedDoc.keyFindings || [];
  
  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="h-6 border-l border-border"></div>
          <h1 className="text-2xl font-bold">{completedDoc.title}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Document info */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Document Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Date</div>
                    <div>
                      {new Date(completedDoc.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Risk Assessment</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {completedDoc.riskScore < 30 
                            ? "Low Risk" 
                            : completedDoc.riskScore < 70 
                              ? "Medium Risk" 
                              : "High Risk"}
                        </span>
                        <span className="text-sm">{completedDoc.riskScore}/100</span>
                      </div>
                      <Progress 
                        value={completedDoc.riskScore} 
                        className="h-2"
                        indicatorClassName={
                          completedDoc.riskScore < 30 
                            ? "bg-success" 
                            : completedDoc.riskScore < 70 
                              ? "bg-warning" 
                              : "bg-destructive"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border p-4">
                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Download Analysis
                </Button>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Key Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Document Type</div>
                      <div className="text-sm text-muted-foreground">
                        {completedDoc.title.includes("Service") 
                          ? "Service Agreement" 
                          : completedDoc.title.includes("Non-Disclosure") 
                            ? "Non-Disclosure Agreement" 
                            : completedDoc.title.includes("Letter") 
                              ? "Letter of Intent"
                              : "Legal Document"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Clauses Identified</div>
                      <div className="text-sm text-muted-foreground">
                        {completedDoc.clauses} clauses found
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">High Risk Items</div>
                      <div className="text-sm text-muted-foreground">
                        {keyFindings.filter(c => c.riskLevel === "high").length} issues found
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main content - Clauses */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="analysis">
              <TabsList className="mb-6">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-6">
                <div className="space-y-4">
                  {keyFindings.length > 0 ? (
                    keyFindings.map((clause, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">{clause.title}</h3>
                            <RiskBadge level={clause.riskLevel} />
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-4">
                            {clause.description}
                          </div>
                          
                          {/* Extracted Text Section */}
                          {clause.extractedText && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <span>Extracted Text</span>
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <p className="text-sm">
                                      This is the actual text extracted from your document that our AI identified as relevant to this issue.
                                    </p>
                                  </HoverCardContent>
                                </HoverCard>
                              </h4>
                              <div className="relative">
                                <div className="bg-muted p-3 rounded-md text-sm italic border-l-4 border-primary/30">
                                  "{clause.extractedText}"
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="absolute top-1 right-1 h-8 w-8 p-0"
                                  onClick={() => copyToClipboard(clause.extractedText || "", index)}
                                >
                                  {copiedIndex === index ? (
                                    <CheckCheck className="h-4 w-4 text-success" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Mitigation Options */}
                          {clause.mitigationOptions && clause.mitigationOptions.length > 0 && clause.riskLevel !== 'low' && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <span>Suggested Alternatives</span>
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <p className="text-sm">
                                      These are AI-suggested ways to mitigate or rephrase the problematic clause in your document.
                                    </p>
                                  </HoverCardContent>
                                </HoverCard>
                              </h4>
                              <div className="space-y-2">
                                {clause.mitigationOptions.map((option, optionIndex) => (
                                  <div key={optionIndex} className="relative">
                                    <div className="rounded-md border border-border p-3 bg-background text-sm">
                                      <div className="flex gap-2 items-start">
                                        <div className="mt-0.5">
                                          <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                          </div>
                                        </div>
                                        <div>{option}</div>
                                      </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="absolute top-1 right-1 h-8 w-8 p-0"
                                      onClick={() => copyToClipboard(option, index * 100 + optionIndex)}
                                    >
                                      {copiedIndex === (index * 100 + optionIndex) ? (
                                        <CheckCheck className="h-4 w-4 text-success" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <Separator className="my-4" />
                          
                          <div className="bg-muted p-3 rounded-md flex gap-3">
                            <Sparkles className="h-5 w-5 text-secondary flex-shrink-0" />
                            <div className="text-sm">
                              <span className="font-medium">Recommendation: </span>
                              {clause.riskLevel === "high" 
                                ? "Review this clause carefully and consider renegotiation."
                                : clause.riskLevel === "medium"
                                  ? "Consider clarifying or amending these terms."
                                  : "Standard terms, no changes needed."}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground">
                        No key findings available for this document.
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="summary">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Document Summary</h3>
                  
                  <p className="text-muted-foreground mb-4">
                    This document contains {completedDoc.clauses} key clauses identified by our analysis.
                  </p>
                  
                  {keyFindings.length > 0 && (
                    <>
                      <p className="text-muted-foreground mb-2">Key clauses include:</p>
                      <ul className="space-y-2 mb-4">
                        {keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span>{finding.title}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  <p className="text-muted-foreground">
                    Overall risk assessment indicates this is a 
                    {completedDoc.riskScore < 30 
                      ? " low-risk" 
                      : completedDoc.riskScore < 70 
                        ? " medium-risk" 
                        : " high-risk"} document
                    {keyFindings.filter(c => c.riskLevel === "high").length > 0
                      ? ` with specific concerns in ${keyFindings
                          .filter(c => c.riskLevel === "high")
                          .map(c => c.title.toLowerCase())
                          .join(", ")}.`
                      : " with no critical issues identified."}
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Recommendations</h3>
                  
                  <div className="space-y-4">
                    {keyFindings.filter(clause => clause.riskLevel !== "low").length > 0 ? (
                      keyFindings
                        .filter(clause => clause.riskLevel !== "low")
                        .map((clause, index) => (
                          <div key={index} className="p-4 rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{clause.title}</h4>
                              <RiskBadge level={clause.riskLevel} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {clause.description}
                            </p>
                            
                            {/* Extracted Text for Recommendation */}
                            {clause.extractedText && (
                              <div className="mb-3 bg-muted/50 p-3 rounded-md text-sm italic">
                                <div className="flex gap-2">
                                  <div className="text-muted-foreground font-medium">Current:</div>
                                  <div>"{clause.extractedText}"</div>
                                </div>
                              </div>
                            )}
                            
                            {/* Suggested Alternatives in Recommendations */}
                            {clause.mitigationOptions && clause.mitigationOptions.length > 0 && (
                              <div className="space-y-2 mb-3">
                                <div className="text-sm font-medium">Suggested Alternatives:</div>
                                {clause.mitigationOptions.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2 items-start bg-background p-2 rounded-md border border-border text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                    <div>{option}</div>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="ml-auto h-6 w-6 p-0"
                                      onClick={() => copyToClipboard(option, index * 1000 + optionIndex)}
                                    >
                                      {copiedIndex === (index * 1000 + optionIndex) ? (
                                        <CheckCheck className="h-3 w-3 text-success" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="bg-muted p-3 rounded-md flex gap-3">
                              <Sparkles className="h-5 w-5 text-secondary flex-shrink-0" />
                              <div className="text-sm">
                                {clause.riskLevel === "high"
                                  ? "Consider renegotiating these terms or seeking legal advice."
                                  : "Review and potentially clarify these terms before proceeding."}
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No significant issues found in this document.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

function RiskBadge({ level }: { level: string }) {
  if (level === "low") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
        Low Risk
      </Badge>
    );
  }
  
  if (level === "medium") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
        Medium Risk
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-xs font-normal border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
      High Risk
    </Badge>
  );
}

export default DocumentView;
