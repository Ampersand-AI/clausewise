
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
  Gavel
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  
  const generatePDF = async () => {
    if (!document || document.status !== "completed") {
      toast({
        title: "Error",
        description: "Cannot generate PDF for this document",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your document...",
      });
      
      const completedDoc = document as CompletedDocument;
      
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Add header
      pdf.setFontSize(24);
      pdf.setTextColor(88, 80, 236);
      pdf.text("Document Analysis Report", pageWidth / 2, 20, { align: "center" });
      
      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(50, 50, 50);
      pdf.text(completedDoc.title, pageWidth / 2, 30, { align: "center" });
      
      // Add date
      const formattedDate = new Date(completedDoc.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      
      const formattedTime = new Date(completedDoc.date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${formattedDate} at ${formattedTime}`, pageWidth / 2, 40, { align: "center" });
      
      // Add risk assessment
      pdf.setFontSize(14);
      pdf.setTextColor(50, 50, 50);
      pdf.text("Risk Assessment", 20, 55);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const riskLevel = completedDoc.riskScore < 30 ? "Low Risk" : completedDoc.riskScore < 70 ? "Medium Risk" : "High Risk";
      pdf.text(`${riskLevel} (${completedDoc.riskScore}/100)`, 20, 62);
      
      // Add jurisdiction if available
      let currentY = 72;
      if (completedDoc.jurisdiction) {
        pdf.setFontSize(14);
        pdf.setTextColor(50, 50, 50);
        pdf.text("Jurisdiction", 20, currentY);
        
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text(completedDoc.jurisdiction, 20, currentY + 7);
        currentY += 17;
      }
      
      // Add document summary if available
      if (completedDoc.summary) {
        pdf.setFontSize(14);
        pdf.setTextColor(50, 50, 50);
        pdf.text("Document Summary", 20, currentY);
        
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        const summaryLines = pdf.splitTextToSize(completedDoc.summary, pageWidth - 40);
        pdf.text(summaryLines, 20, currentY + 7);
        currentY += 7 + (summaryLines.length * 7) + 10;
      }
      
      // Add key findings
      pdf.setFontSize(16);
      pdf.setTextColor(88, 80, 236);
      pdf.text("Key Findings", pageWidth / 2, currentY, { align: "center" });
      currentY += 10;
      
      // Loop through key findings
      let findingNumber = 1;
      for (const finding of completedDoc.keyFindings) {
        if (currentY > 270) {
          // Add a new page if we're near the bottom
          pdf.addPage();
          currentY = 20;
        }
        
        // Finding title
        pdf.setFontSize(14);
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${findingNumber}. ${finding.title}`, 20, currentY);
        currentY += 7;
        
        // Risk level
        let riskColor;
        if (finding.riskLevel === "low") {
          riskColor = [46, 160, 67]; // Green
        } else if (finding.riskLevel === "medium") {
          riskColor = [227, 171, 15]; // Amber
        } else {
          riskColor = [210, 45, 45]; // Red
        }
        
        pdf.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
        pdf.setFontSize(12);
        pdf.text(`Risk Level: ${finding.riskLevel.toUpperCase()}`, 20, currentY);
        currentY += 7;
        
        // Description
        pdf.setTextColor(100, 100, 100);
        const descriptionLines = pdf.splitTextToSize(finding.description, pageWidth - 40);
        pdf.text(descriptionLines, 20, currentY);
        currentY += (descriptionLines.length * 7) + 5;
        
        // Extracted text if available
        if (finding.extractedText) {
          pdf.setTextColor(80, 80, 80);
          pdf.text("Extracted Text:", 20, currentY);
          currentY += 5;
          
          pdf.setTextColor(130, 130, 130);
          const extractedLines = pdf.splitTextToSize(`"${finding.extractedText}"`, pageWidth - 50);
          pdf.text(extractedLines, 25, currentY);
          currentY += (extractedLines.length * 6) + 5;
        }
        
        // Mitigation options if available
        if (finding.mitigationOptions && finding.mitigationOptions.length > 0 && finding.riskLevel !== 'low') {
          pdf.setTextColor(80, 80, 80);
          pdf.text("Suggested Alternatives:", 20, currentY);
          currentY += 5;
          
          pdf.setTextColor(130, 130, 130);
          for (let i = 0; i < Math.min(2, finding.mitigationOptions.length); i++) {
            const optionLines = pdf.splitTextToSize(`• ${finding.mitigationOptions[i]}`, pageWidth - 50);
            pdf.text(optionLines, 25, currentY);
            currentY += (optionLines.length * 6) + 5;
          }
        }
        
        // Add a separator
        pdf.setDrawColor(220, 220, 220);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        currentY += 10;
        
        findingNumber++;
      }
      
      // Save the PDF
      pdf.save(`${completedDoc.title.replace(/\s+/g, '_')}_analysis.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Your analysis report has been downloaded",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
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
          
          <Card className="p-10 text-center neo-blur border-white/10">
            <div className="max-w-md mx-auto">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* AI-inspired circular animation */}
                <div className="absolute inset-0 bg-primary/30 rounded-full animate-pulse"></div>
                <div className="absolute inset-[-4px] border-2 border-primary/40 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-[-8px] border-2 border-primary/20 rounded-full animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-[-12px] border border-primary/10 rounded-full animate-spin" style={{ animationDuration: '7s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background rounded-full p-3">
                    <Gavel className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-medium mb-3">AI analyzing document...</h2>
              <p className="text-muted-foreground mb-6">
                Our AI is processing and extracting insights from your document. This may take a few moments.
              </p>
              <div className="relative h-2 mb-2 overflow-hidden rounded-full bg-black/30">
                <div className="absolute inset-0 w-full bg-gradient-to-r from-violet-500 via-primary to-violet-500 animate-shimmer" style={{ 
                  width: `${document.progress}%`, 
                  backgroundSize: '200% 100%' 
                }}></div>
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
            
            <div className="ml-auto">
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="neo-blur border-white/10">
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
          
          <Card className="p-10 text-center neo-blur border-white/10">
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
  
  // Format date and time
  const formattedDate = new Date(completedDoc.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  const formattedTime = new Date(completedDoc.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  
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
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="neo-blur border-white/10">
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
          {/* Left sidebar - Document info */}
          <div className="space-y-6">
            <Card className="overflow-hidden neo-blur border-white/10">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Document Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                    <div>
                      {formattedDate}<br />
                      {formattedTime}
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
                      <div className="relative h-2">
                        <div className="absolute inset-0 rounded-full bg-black/30"></div>
                        <div 
                          className={cn(
                            "absolute inset-0 rounded-full",
                            completedDoc.riskScore < 30 
                              ? "bg-success" 
                              : completedDoc.riskScore < 70 
                                ? "bg-warning" 
                                : "bg-destructive"
                          )}
                          style={{width: `${completedDoc.riskScore}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {completedDoc.parties && completedDoc.parties.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Parties</div>
                      <div className="space-y-1">
                        {completedDoc.parties.map((party, index) => (
                          <div key={index} className="text-sm">{party}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {completedDoc.jurisdiction && (
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Jurisdiction:</div>
                      <Badge variant="outline" className="gap-1 border-white/10 bg-white/5">
                        <Globe className="h-3 w-3" />
                        <span>{completedDoc.jurisdiction}</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-white/10 p-4">
                <Button className="w-full gap-2" variant="outline" onClick={generatePDF}>
                  <Download className="h-4 w-4" />
                  Download Analysis
                </Button>
              </div>
            </Card>
            
            <Card className="neo-blur border-white/10">
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
                              : completedDoc.title.includes("Partnership")
                                ? "Partnership Agreement"
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
              <TabsList className="mb-6 neo-blur border-white/10">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-6">
                <div className="space-y-4">
                  {keyFindings.length > 0 ? (
                    keyFindings.map((clause, index) => (
                      <Card key={index} className="overflow-hidden neo-blur border-white/10">
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
                                  <HoverCardContent className="w-80 neo-blur border-white/10">
                                    <p className="text-sm">
                                      This is the actual text extracted from your document that our AI identified as relevant to this issue.
                                    </p>
                                  </HoverCardContent>
                                </HoverCard>
                              </h4>
                              <div className="relative">
                                <div className="bg-black/20 p-3 rounded-md text-sm italic border-l-4 border-primary/30">
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
                          
                          {/* Mitigation Options - limit to 2 options */}
                          {clause.mitigationOptions && clause.mitigationOptions.length > 0 && clause.riskLevel !== 'low' && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <span>Suggested Alternatives</span>
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80 neo-blur border-white/10">
                                    <p className="text-sm">
                                      These are AI-suggested ways to mitigate or rephrase the problematic clause in your document.
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
                          
                          <Separator className="my-4 bg-white/10" />
                          
                          <div className="bg-black/20 p-3 rounded-md flex gap-3">
                            <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
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
                    <Card className="p-6 text-center neo-blur border-white/10">
                      <p className="text-muted-foreground">
                        No key findings available for this document.
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="summary">
                <Card className="p-6 neo-blur border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Document Summary</h3>
                  
                  {completedDoc.summary ? (
                    <div className="mb-6 p-4 bg-black/20 rounded-lg border border-white/10">
                      <div className="flex gap-3">
                        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">
                          {completedDoc.summary}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-4">
                      This document contains {completedDoc.clauses} key clauses identified by our analysis.
                    </p>
                  )}
                  
                  {completedDoc.jurisdiction && (
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Governing Law</div>
                        <div className="text-sm text-muted-foreground">{completedDoc.jurisdiction}</div>
                      </div>
                    </div>
                  )}
                  
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
      <Badge variant="outline" className="text-xs font-normal border-green-800 bg-green-950/30 text-green-400">
        Low Risk
      </Badge>
    );
  }
  
  if (level === "medium") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-yellow-800 bg-yellow-950/30 text-yellow-400">
        Medium Risk
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-xs font-normal border-red-800 bg-red-950/30 text-red-400">
      High Risk
    </Badge>
  );
}

export default DocumentView;
