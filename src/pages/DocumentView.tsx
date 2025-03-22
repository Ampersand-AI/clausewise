
import { useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle2, 
  Copy, 
  AlertTriangle, 
  ArrowLeft, 
  Download, 
  FileText, 
  Info, 
  Sparkles, 
  HelpCircle, 
  CheckCheck, 
  Trash2,
  Globe,
  Flag
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
  summary?: string;
  jurisdiction?: string;
  parties?: string[];
  intent?: string;
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);
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
  
  const handleDeleteDocument = () => {
    try {
      const storedDocuments = localStorage.getItem('documents');
      let documents: Document[] = [];
      
      if (storedDocuments) {
        documents = JSON.parse(storedDocuments);
      }
      
      const updatedDocuments = documents.filter(doc => doc.id !== id);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the document",
        variant: "destructive"
      });
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!document || document.status !== "completed" || !documentRef.current) {
      toast({
        title: "Error",
        description: "Unable to generate PDF at this time",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your document...",
      });
      
      const element = documentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#121212",
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${document.title.replace(/\s+/g, '_')}_analysis.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your document analysis has been downloaded as a PDF",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "There was an error generating the PDF",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="container px-4 py-16 mx-auto text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-bento-orange-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-bento-orange-500 border-r-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="h-8 w-8 text-bento-orange-500 animate-pulse" />
            </div>
          </div>
          <p className="text-bento-gray-500 dark:text-bento-gray-400">Retrieving document details...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (!document) {
    return (
      <AppLayout>
        <div className="container px-4 py-16 mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <p className="text-bento-gray-500 dark:text-bento-gray-400 mb-6">
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
            <div className="h-6 border-l border-bento-gray-200 dark:border-bento-gray-700"></div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
          </div>
          
          <Card className="p-10 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* AI-inspired circular rings animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-bento-orange-500 to-bento-yellow-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-[-4px] border-2 border-bento-orange-500/30 border-dashed rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
                <div className="absolute inset-[-8px] border-2 border-bento-orange-500/20 border-dashed rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-bento-gray-100 dark:bg-bento-gray-800 rounded-full p-3">
                    <FileText className="h-8 w-8 text-bento-orange-500 animate-pulse" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-medium mb-3">AI analyzing document...</h2>
              <p className="text-bento-gray-500 dark:text-bento-gray-400 mb-6">
                Our AI is processing and extracting insights from your document. This may take a few moments.
              </p>
              <div className="relative h-2 mb-2 overflow-hidden rounded-full bg-bento-gray-200 dark:bg-bento-gray-700">
                <div className="absolute inset-0 flex">
                  <Progress value={document.progress} indicatorClassName="bg-gradient-to-r from-bento-orange-500 via-bento-yellow-500 to-bento-orange-500 animate-shimmer" />
                </div>
              </div>
              <p className="text-sm text-bento-gray-500 dark:text-bento-gray-400">{document.progress}% complete</p>
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
            <div className="h-6 border-l border-bento-gray-200 dark:border-bento-gray-700"></div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            
            <div className="ml-auto">
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 border-destructive text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the document.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <Card className="p-10 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-medium mb-3">Analysis Error</h2>
              <p className="text-bento-gray-500 dark:text-bento-gray-400 mb-6">
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

  // Format date to include time
  const formattedDate = new Date(completedDoc.date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  
  return (
    <AppLayout>
      <div ref={documentRef} className="container px-4 py-8 mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="h-6 border-l border-bento-gray-200 dark:border-bento-gray-700"></div>
          <h1 className="text-2xl font-bold">{completedDoc.title}</h1>
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the document.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Tabs */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="mb-6 border border-bento-gray-200 dark:border-bento-gray-700 bg-white dark:bg-bento-gray-800">
                <TabsTrigger value="analysis" className="data-[state=active]:bg-bento-orange-500 data-[state=active]:text-white">Analysis</TabsTrigger>
                <TabsTrigger value="summary" className="data-[state=active]:bg-bento-orange-500 data-[state=active]:text-white">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-6">
                {/* Document information card - Placed first as requested */}
                <Card className="overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Document Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Date & Time</div>
                        <div>
                          {formattedDate}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Risk Assessment</div>
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
                                ? "bg-green-500" 
                                : completedDoc.riskScore < 70 
                                  ? "bg-bento-yellow-500" 
                                  : "bg-red-500"
                            }
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Key Statistics</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-bento-orange-500" /> 
                            <span className="text-sm">{completedDoc.clauses} clauses identified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{keyFindings.filter(c => c.riskLevel === "high").length} high risk items</span>
                          </div>
                        </div>
                      </div>
                      
                      {completedDoc.parties && completedDoc.parties.length > 0 && (
                        <div className="md:col-span-2">
                          <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Parties</div>
                          <div className="flex flex-wrap gap-2">
                            {completedDoc.parties.map((party, index) => (
                              <Badge key={index} variant="outline" className="bg-bento-gray-100 dark:bg-bento-gray-700 border-bento-gray-200 dark:border-bento-gray-600">
                                {party}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {completedDoc.jurisdiction && (
                        <div>
                          <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Jurisdiction</div>
                          <Badge variant="outline" className="flex items-center gap-2 bg-bento-gray-100 dark:bg-bento-gray-700 border-bento-gray-200 dark:border-bento-gray-600">
                            <Flag className="h-3.5 w-3.5 text-bento-orange-500" />
                            <span>{completedDoc.jurisdiction}</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-bento-gray-200 dark:border-bento-gray-700 p-4 bg-bento-gray-50 dark:bg-bento-gray-800/50">
                    <Button 
                      className="w-full gap-2 bg-gradient-to-r from-bento-orange-500 via-bento-yellow-500 to-bento-orange-600 hover:from-bento-orange-600 hover:via-bento-yellow-600 hover:to-bento-brown-600 text-white border-none" 
                      onClick={handleDownloadPDF}
                    >
                      <Download className="h-4 w-4" />
                      Download Analysis
                    </Button>
                  </div>
                </Card>
                
                {/* Key findings */}
                <div className="space-y-4">
                  {keyFindings.length > 0 ? (
                    keyFindings.map((clause, index) => (
                      <Card key={index} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow duration-300" 
                        style={{
                          borderLeftColor: clause.riskLevel === "low" 
                            ? "rgb(34, 197, 94)" // Green for low risk
                            : clause.riskLevel === "medium" 
                              ? "rgb(234, 179, 8)" // Yellow for medium risk
                              : "rgb(239, 68, 68)" // Red for high risk
                        }}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">{clause.title}</h3>
                            <RiskBadge level={clause.riskLevel} />
                          </div>
                          
                          <div className="text-sm text-bento-gray-600 dark:text-bento-gray-400 mb-4">
                            {clause.description}
                          </div>
                          
                          {/* Extracted Text Section */}
                          {clause.extractedText && (
                            <div className="mb-6">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <span>Extracted Text</span>
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-bento-gray-400 cursor-help" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <p className="text-sm">
                                      This is the actual text extracted from your document that our AI identified as relevant to this issue.
                                    </p>
                                  </HoverCardContent>
                                </HoverCard>
                              </h4>
                              <div className="relative rounded-lg overflow-hidden">
                                <div className="bg-bento-gray-100 dark:bg-bento-gray-800 p-4 text-sm italic border-l-4 border-bento-orange-500/50">
                                  "{clause.extractedText}"
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="absolute top-1 right-1 h-8 w-8 p-0"
                                  onClick={() => copyToClipboard(clause.extractedText || "", index)}
                                >
                                  {copiedIndex === index ? (
                                    <CheckCheck className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Mitigation Options - Show all 3 as requested */}
                          {clause.mitigationOptions && clause.mitigationOptions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <span>Suggested Alternatives</span>
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-bento-gray-400 cursor-help" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <p className="text-sm">
                                      These are AI-suggested alternatives for the problematic clause in your document.
                                    </p>
                                  </HoverCardContent>
                                </HoverCard>
                              </h4>
                              <div className="space-y-3">
                                {clause.mitigationOptions.map((option, optionIndex) => (
                                  <div key={optionIndex} className="relative">
                                    <div className="rounded-lg border border-bento-gray-200 dark:border-bento-gray-700 p-4 bg-white dark:bg-bento-gray-800 text-sm hover:border-bento-orange-300 dark:hover:border-bento-orange-500/50 transition-colors">
                                      <div className="flex gap-3 items-start">
                                        <div className="mt-0.5">
                                          <div className="h-5 w-5 rounded-full bg-bento-orange-100 dark:bg-bento-orange-900/20 flex items-center justify-center flex-shrink-0 border border-bento-orange-200 dark:border-bento-orange-800/30">
                                            <span className="text-xs font-medium text-bento-orange-600 dark:text-bento-orange-400">{optionIndex + 1}</span>
                                          </div>
                                        </div>
                                        <div>{option}</div>
                                      </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="absolute top-2 right-2 h-8 p-2 flex items-center gap-1 text-xs bg-white dark:bg-bento-gray-800 border-bento-gray-200 dark:border-bento-gray-700"
                                      onClick={() => copyToClipboard(option, index * 100 + optionIndex)}
                                    >
                                      {copiedIndex === (index * 100 + optionIndex) ? (
                                        <span className="flex items-center gap-1">
                                          <CheckCheck className="h-3 w-3 text-green-500" />
                                          Copied
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1">
                                          <Copy className="h-3 w-3" />
                                          Copy
                                        </span>
                                      )}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-bento-gray-500 dark:text-bento-gray-400">
                        No key findings available for this document.
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="summary">
                {/* Document information card - Placed first as requested */}
                <Card className="overflow-hidden mb-6">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Document Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Date & Time</div>
                        <div>
                          {formattedDate}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Risk Assessment</div>
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
                                ? "bg-green-500" 
                                : completedDoc.riskScore < 70 
                                  ? "bg-bento-yellow-500" 
                                  : "bg-red-500"
                            }
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Key Statistics</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-bento-orange-500" /> 
                            <span className="text-sm">{completedDoc.clauses} clauses identified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{keyFindings.filter(c => c.riskLevel === "high").length} high risk items</span>
                          </div>
                        </div>
                      </div>
                      
                      {completedDoc.parties && completedDoc.parties.length > 0 && (
                        <div className="md:col-span-2">
                          <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Parties</div>
                          <div className="flex flex-wrap gap-2">
                            {completedDoc.parties.map((party, index) => (
                              <Badge key={index} variant="outline" className="bg-bento-gray-100 dark:bg-bento-gray-700 border-bento-gray-200 dark:border-bento-gray-600">
                                {party}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {completedDoc.jurisdiction && (
                        <div>
                          <div className="text-sm text-bento-gray-500 dark:text-bento-gray-400 mb-1">Jurisdiction</div>
                          <Badge variant="outline" className="flex items-center gap-2 bg-bento-gray-100 dark:bg-bento-gray-700 border-bento-gray-200 dark:border-bento-gray-600">
                            <Flag className="h-3.5 w-3.5 text-bento-orange-500" />
                            <span>{completedDoc.jurisdiction}</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-bento-gray-200 dark:border-bento-gray-700 p-4 bg-bento-gray-50 dark:bg-bento-gray-800/50">
                    <Button 
                      className="w-full gap-2 bg-gradient-to-r from-bento-orange-500 via-bento-yellow-500 to-bento-orange-600 hover:from-bento-orange-600 hover:via-bento-yellow-600 hover:to-bento-brown-600 text-white border-none" 
                      onClick={handleDownloadPDF}
                    >
                      <Download className="h-4 w-4" />
                      Download Analysis
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Document Summary</h3>
                  
                  {completedDoc.summary ? (
                    <div className="mb-6 p-4 bg-bento-gray-100 dark:bg-bento-gray-800 rounded-lg border border-bento-gray-200 dark:border-bento-gray-700">
                      <div className="flex gap-3">
                        <Info className="h-5 w-5 text-bento-orange-500 flex-shrink-0 mt-0.5" />
                        <p className="text-bento-gray-700 dark:text-bento-gray-300">
                          {completedDoc.summary}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-bento-gray-600 dark:text-bento-gray-400 mb-4">
                      This document contains {completedDoc.clauses} key clauses identified by our analysis.
                    </p>
                  )}
                  
                  {completedDoc.jurisdiction && (
                    <div className="mb-4 p-3 bg-bento-gray-100 dark:bg-bento-gray-800 rounded-lg flex items-center gap-3 border border-bento-gray-200 dark:border-bento-gray-700">
                      <Flag className="h-5 w-5 text-bento-orange-500" />
                      <div>
                        <div className="text-sm font-medium">Governing Law</div>
                        <div className="text-sm text-bento-gray-600 dark:text-bento-gray-400">{completedDoc.jurisdiction}</div>
                      </div>
                    </div>
                  )}
                  
                  {keyFindings.length > 0 && (
                    <>
                      <h4 className="font-medium mb-3">Key clauses include:</h4>
                      <div className="space-y-2 mb-6">
                        {keyFindings.map((finding, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 rounded-md hover:bg-bento-gray-100 dark:hover:bg-bento-gray-800 transition-colors">
                            <div className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{
                                backgroundColor: finding.riskLevel === "low" 
                                  ? "rgba(34, 197, 94, 0.1)" // Green for low risk
                                  : finding.riskLevel === "medium" 
                                    ? "rgba(234, 179, 8, 0.1)" // Yellow for medium risk
                                    : "rgba(239, 68, 68, 0.1)" // Red for high risk
                              }}
                            >
                              <div className="h-1.5 w-1.5 rounded-full"
                                style={{
                                  backgroundColor: finding.riskLevel === "low" 
                                    ? "rgb(34, 197, 94)" // Green for low risk
                                    : finding.riskLevel === "medium" 
                                      ? "rgb(234, 179, 8)" // Yellow for medium risk
                                      : "rgb(239, 68, 68)" // Red for high risk
                                }}
                              ></div>
                            </div>
                            <div className="flex-1">
                              <span className="text-bento-gray-700 dark:text-bento-gray-300">{finding.title}</span>
                              <span className="ml-2 text-xs">
                                <RiskBadge level={finding.riskLevel} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <div className="p-4 rounded-lg bg-bento-gray-100 dark:bg-bento-gray-800 border border-bento-gray-200 dark:border-bento-gray-700">
                    <p className="text-bento-gray-700 dark:text-bento-gray-300">
                      Overall risk assessment indicates this is a 
                      <span className={completedDoc.riskScore < 30 
                        ? "text-green-600 dark:text-green-400 font-medium" 
                        : completedDoc.riskScore < 70 
                          ? "text-bento-yellow-600 dark:text-bento-yellow-400 font-medium" 
                          : "text-red-600 dark:text-red-400 font-medium"}>
                        {completedDoc.riskScore < 30 
                          ? " low-risk" 
                          : completedDoc.riskScore < 70 
                            ? " medium-risk" 
                            : " high-risk"}
                      </span> document
                      {keyFindings.filter(c => c.riskLevel === "high").length > 0
                        ? ` with specific concerns in ${keyFindings
                            .filter(c => c.riskLevel === "high")
                            .map(c => c.title.toLowerCase())
                            .join(", ")}.`
                        : " with no critical issues identified."}
                    </p>
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
      <Badge variant="outline" className="text-xs font-normal border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
        Low Risk
      </Badge>
    );
  }
  
  if (level === "medium") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-bento-yellow-200 bg-bento-yellow-50 text-bento-yellow-600 dark:border-bento-yellow-800 dark:bg-bento-yellow-900/20 dark:text-bento-yellow-400">
        Medium Risk
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-xs font-normal border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      High Risk
    </Badge>
  );
}

export default DocumentView;
