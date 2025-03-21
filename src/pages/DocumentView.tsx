
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowLeft, Download, FileText, Info, Sparkles } from "lucide-react";
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
  parties?: string[];
  keyFindings?: {
    title: string;
    description: string;
    riskLevel: string;
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
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Simulate fetching document from a server
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // In a real app, this would be an API call
        // Here we'll simulate looking for the document in localStorage
        const storedDocuments = localStorage.getItem('documents');
        let documents: Document[] = [];
        
        if (storedDocuments) {
          documents = JSON.parse(storedDocuments);
        }
        
        const foundDocument = documents.find(doc => doc.id === id);
        
        if (foundDocument) {
          // If document is found, add some mock parties and findings for display
          if (foundDocument.status === 'completed') {
            const completeDoc = foundDocument as CompletedDocument;
            if (!completeDoc.parties) {
              completeDoc.parties = ['Your Company', 'Partner Organization'];
            }
            if (!completeDoc.keyFindings) {
              completeDoc.keyFindings = [
                {
                  title: 'Termination Clause',
                  description: 'Standard termination terms with 30 days notice period.',
                  riskLevel: 'low'
                },
                {
                  title: 'Payment Terms',
                  description: 'Net 45 payment terms may create cash flow challenges.',
                  riskLevel: 'medium'
                },
                {
                  title: 'Intellectual Property',
                  description: 'IP ownership terms favor the other party.',
                  riskLevel: 'high'
                }
              ];
            }
            setDocument(completeDoc);
          } else {
            setDocument(foundDocument);
          }
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
  
  if (loading) {
    return (
      <AppLayout>
        <div className="container px-4 py-16 mx-auto text-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-r-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading document...</p>
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
              <div className="h-16 w-16 rounded-full border-4 border-primary border-r-transparent animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-medium mb-3">Analyzing document...</h2>
              <p className="text-muted-foreground mb-6">
                Please wait while our AI analyzes your document. This may take a few moments.
              </p>
              <Progress value={document.progress} className="h-2 mb-2" />
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
  const parties = completedDoc.parties || [];
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
                    <div className="text-sm text-muted-foreground mb-1">Parties</div>
                    <div className="space-y-1">
                      {parties.map((party, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <div>{party}</div>
                        </div>
                      ))}
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
                  
                  {parties.length > 0 ? (
                    <>
                      <p className="text-muted-foreground mb-4">
                        This document establishes terms between {parties.join(" and ")}. 
                        The document contains {completedDoc.clauses} key clauses identified by our analysis.
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
                              .map(c => ` ${c.title.toLowerCase()}`)}.`
                          : " with no critical issues identified."}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      No summary information is available for this document.
                    </p>
                  )}
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
