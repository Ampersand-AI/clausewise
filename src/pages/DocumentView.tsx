
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
  Globe
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
            <div className="absolute inset-0 border-4 border-indigo-600/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 border-r-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="h-8 w-8 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400">Retrieving document details...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (!document) {
    return (
      <AppLayout>
        <div className="container px-4 py-16 mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Document Not Found</h1>
          <p className="text-slate-400 mb-6">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2 glass-card glass-card-hover text-white">
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
              <Button variant="ghost" size="sm" className="gap-1 text-slate-300 hover:text-white hover:bg-white/5">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-6 border-l border-white/10"></div>
            <h1 className="text-2xl font-bold text-white">{document.title}</h1>
          </div>
          
          <Card className="p-10 text-center bg-transparent">
            <div className="max-w-md mx-auto">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* AI-inspired circular rings animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-[-4px] border-2 border-indigo-600/30 border-dashed rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
                <div className="absolute inset-[-8px] border-2 border-indigo-600/20 border-dashed rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 rounded-full p-3">
                    <FileText className="h-8 w-8 text-indigo-400 animate-pulse" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-medium mb-3 text-white">AI analyzing document...</h2>
              <p className="text-slate-400 mb-6">
                Our AI is processing and extracting insights from your document. This may take a few moments.
              </p>
              <div className="relative h-2 mb-2 overflow-hidden rounded-full bg-black/40">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
                  <div className="w-1/2 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
              <p className="text-sm text-slate-400">{document.progress}% complete</p>
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
              <Button variant="ghost" size="sm" className="gap-1 text-slate-300 hover:text-white hover:bg-white/5">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-6 border-l border-white/10"></div>
            <h1 className="text-2xl font-bold text-white">{document.title}</h1>
            
            <div className="ml-auto">
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 bg-transparent border-destructive text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card text-white border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                      This action cannot be undone. This will permanently delete the document.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-black/40 text-white hover:bg-white/10 border-white/10">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <Card className="p-10 text-center bg-transparent">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-medium mb-3 text-white">Analysis Error</h2>
              <p className="text-slate-400 mb-6">
                There was an error analyzing this document. Please try uploading it again.
              </p>
              <Link to="/dashboard">
                <Button className="bg-white/5 border border-white/10 text-white hover:bg-white/10">Return to Dashboard</Button>
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
            <Button variant="ghost" size="sm" className="gap-1 text-slate-300 hover:text-white hover:bg-white/5">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="h-6 border-l border-white/10"></div>
          <h1 className="text-2xl font-bold text-white">{completedDoc.title}</h1>
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-card text-white border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. This will permanently delete the document.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-black/40 text-white hover:bg-white/10 border-white/10">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Document info */}
          <div className="space-y-6">
            <Card className="overflow-hidden bg-transparent text-white">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Document Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Date & Time</div>
                    <div className="text-slate-200">
                      {formattedDate}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Risk Assessment</div>
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
                        className="h-2 bg-black/40"
                        indicatorClassName={
                          completedDoc.riskScore < 30 
                            ? "bg-green-500" 
                            : completedDoc.riskScore < 70 
                              ? "bg-yellow-500" 
                              : "bg-red-500"
                        }
                      />
                    </div>
                  </div>
                  
                  {completedDoc.parties && completedDoc.parties.length > 0 && (
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Parties</div>
                      <div className="space-y-1 text-slate-200">
                        {completedDoc.parties.map((party, index) => (
                          <div key={index} className="text-sm">{party}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {completedDoc.jurisdiction && (
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-slate-400">Jurisdiction:</div>
                      <Badge variant="outline" className="gap-1 bg-black/30 border-white/10 text-slate-200">
                        <Globe className="h-3 w-3" />
                        <span>{completedDoc.jurisdiction}</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-white/10 p-4">
                <Button 
                  className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" 
                  onClick={handleDownloadPDF}
                >
                  <Download className="h-4 w-4" />
                  Download Analysis
                </Button>
              </div>
            </Card>
            
            <Card className="bg-transparent text-white">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Key Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Document Type</div>
                      <div className="text-sm text-slate-400">
                        {completedDoc.title.includes("Service") 
                          ? "Service Agreement" 
                          : completedDoc.title.includes("Non-Disclosure") 
                            ? "Non-Disclosure Agreement" 
                            : completedDoc.title.includes("Letter") 
                              ? "Letter of Intent"
                              : completedDoc.title.includes("Partnership")
                                ? "Partnership Agreement"
                                : "Legal Document"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0">
                      <Info className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Clauses Identified</div>
                      <div className="text-sm text-slate-400">
                        {completedDoc.clauses} clauses found
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">High Risk Items</div>
                      <div className="text-sm text-slate-400">
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
            <Tabs defaultValue="analysis" className="text-white">
              <TabsList className="mb-6 bg-black/30 border border-white/10">
                <TabsTrigger value="analysis" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Analysis</TabsTrigger>
                <TabsTrigger value="summary" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-6">
                <div className="space-y-4">
                  {keyFindings.length > 0 ? (
                    keyFindings.map((clause, index) => (
                      <Card key={index} className="overflow-hidden bg-transparent text-white">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">{clause.title}</h3>
                            <RiskBadge level={clause.riskLevel} />
                          </div>
                          
                          <div className="text-sm text-slate-400 mb-4">
                            {clause.description}
                          </div>
                          
                          {/* Extracted Text Section */}
                          {clause.extractedText && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-slate-200">
                                <span>Extracted Text</span>
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80 glass-card text-slate-200 border-white/10">
                                    <p className="text-sm">
                                      This is the actual text extracted from your document that our AI identified as relevant to this issue.
                                    </p>
                                  </HoverCardContent>
                                </HoverCard>
                              </h4>
                              <div className="relative">
                                <div className="bg-black/20 p-3 rounded-md text-sm italic border-l-4 border-indigo-600/30 text-slate-300">
                                  "{clause.extractedText}"
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="absolute top-1 right-1 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/5"
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
                          
                          {/* Mitigation Options - Show only 2 */}
                          {clause.mitigationOptions && clause.mitigationOptions.length > 0 && clause.riskLevel !== 'low' && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-slate-200">
                                <span>Suggested Alternatives</span>
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80 glass-card text-slate-200 border-white/10">
                                    <p className="text-sm">
                                      These are AI-suggested alternatives for the problematic clause in your document.
                                    </p>
                                  </HoverCardContent>
                                </HoverCard>
                              </h4>
                              <div className="space-y-2">
                                {clause.mitigationOptions.slice(0, 2).map((option, optionIndex) => (
                                  <div key={optionIndex} className="relative">
                                    <div className="rounded-md border border-white/10 p-3 bg-black/20 text-sm">
                                      <div className="flex gap-2 items-start">
                                        <div className="mt-0.5">
                                          <div className="h-4 w-4 rounded-full bg-indigo-600/10 flex items-center justify-center flex-shrink-0">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                                          </div>
                                        </div>
                                        <div className="text-slate-300">{option}</div>
                                      </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="absolute top-1 right-1 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/5"
                                      onClick={() => copyToClipboard(option, index * 100 + optionIndex)}
                                    >
                                      {copiedIndex === (index * 100 + optionIndex) ? (
                                        <CheckCheck className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
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
                    <Card className="p-6 text-center bg-transparent">
                      <p className="text-slate-400">
                        No key findings available for this document.
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="summary">
                <Card className="p-6 bg-transparent">
                  <h3 className="text-lg font-semibold mb-4 text-white">Document Summary</h3>
                  
                  {completedDoc.summary ? (
                    <div className="mb-6 p-4 bg-black/30 rounded-lg border border-white/10">
                      <div className="flex gap-3">
                        <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300">
                          {completedDoc.summary}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 mb-4">
                      This document contains {completedDoc.clauses} key clauses identified by our analysis.
                    </p>
                  )}
                  
                  {completedDoc.jurisdiction && (
                    <div className="mb-4 p-3 bg-black/30 rounded-lg flex items-center gap-3">
                      <Globe className="h-5 w-5 text-indigo-400" />
                      <div>
                        <div className="text-sm font-medium text-white">Governing Law</div>
                        <div className="text-sm text-slate-400">{completedDoc.jurisdiction}</div>
                      </div>
                    </div>
                  )}
                  
                  {keyFindings.length > 0 && (
                    <>
                      <p className="text-slate-400 mb-2">Key clauses include:</p>
                      <ul className="space-y-2 mb-4">
                        {keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-black/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                            </div>
                            <span className="text-slate-300">{finding.title}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  <p className="text-slate-400">
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
      <Badge variant="outline" className="text-xs font-normal border-green-800 bg-green-900/20 text-green-400">
        Low Risk
      </Badge>
    );
  }
  
  if (level === "medium") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-yellow-800 bg-yellow-900/20 text-yellow-400">
        Medium Risk
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-xs font-normal border-red-800 bg-red-900/20 text-red-400">
      High Risk
    </Badge>
  );
}

export default DocumentView;
