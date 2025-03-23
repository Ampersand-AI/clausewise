import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Mic, Send, ListFilter, MicOff, RefreshCw, Download, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeDocument } from "@/utils/documentAnalysis";
import { Progress } from "@/components/ui/progress";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModeToggle from "@/components/contract/ModeToggle";
import ContractForm, { GeneratedContract } from "@/components/contract/ContractForm";
import DocumentTabs from "@/components/document/DocumentTabs";

// Define top most used agreement types
const popularAgreements = [
  { label: "Non-Disclosure Agreement (NDA)", value: "nda" },
  { label: "Service Agreement", value: "service" },
  { label: "Employment Contract", value: "employment" },
  { label: "Consulting Agreement", value: "consulting" },
  { label: "Term Sheet", value: "termsheet" },
  { label: "SAFE Note", value: "safenote" },
  { label: "Convertible Note", value: "convertiblenote" },
  { label: "Equity Agreement", value: "equity" },
];

// CSS for glow effect
const glowStyles = `
  .glow-purple {
    text-shadow: 0 0 15px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3);
  }
`;

// Define document types
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
  keyFindings: {
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    extractedText?: string;
    mitigationOptions?: string[];
    redraftedClauses?: string[]; // Added redrafted clauses
  }[];
};

type ErrorDocument = {
  id: string;
  title: string;
  date: string;
  status: "error";
};

type Document = AnalyzingDocument | CompletedDocument | ErrorDocument;

type FilterOptions = {
  status: {
    analyzing: boolean;
    completed: boolean;
    error: boolean,
  };
  risk: {
    low: boolean;
    medium: boolean;
    high: boolean;
  };
};

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [contracts, setContracts] = useState<GeneratedContract[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [documentText, setDocumentText] = useState("");
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<"create" | "analyze">("create");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: {
      analyzing: true,
      completed: true,
      error: true,
    },
    risk: {
      low: true,
      medium: true,
      high: true,
    },
  });
  const { toast } = useToast();
  
  // Voice recognition setup
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          setDocumentText(transcript);
        };
        
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
          toast({
            title: "Voice recognition error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          });
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "You can now edit the transcribed text or analyze it.",
      });
    } else {
      setDocumentText("");
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak clearly into your microphone. The text will appear as you speak.",
      });
    }
  };

  // Load documents and contracts from localStorage on initial render
  useEffect(() => {
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      try {
        setDocuments(JSON.parse(storedDocs));
      } catch (error) {
        console.error("Error parsing documents from localStorage:", error);
      }
    }
    
    const storedContracts = localStorage.getItem('contracts');
    if (storedContracts) {
      try {
        setContracts(JSON.parse(storedContracts));
      } catch (error) {
        console.error("Error parsing contracts from localStorage:", error);
      }
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);
  
  // Save contracts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('contracts', JSON.stringify(contracts));
  }, [contracts]);

  // Apply filters to documents
  useEffect(() => {
    let filtered = [...documents];
    
    // Filter by status
    filtered = filtered.filter(doc => 
      (doc.status === "analyzing" && filterOptions.status.analyzing) ||
      (doc.status === "completed" && filterOptions.status.completed) ||
      (doc.status === "error" && filterOptions.status.error)
    );
    
    // Filter by risk (for completed documents only)
    if (!filterOptions.risk.low || !filterOptions.risk.medium || !filterOptions.risk.high) {
      filtered = filtered.filter(doc => {
        if (doc.status !== "completed") return true;
        
        const riskScore = doc.riskScore;
        
        return (riskScore < 30 && filterOptions.risk.low) ||
               (riskScore >= 30 && riskScore < 70 && filterOptions.risk.medium) ||
               (riskScore >= 70 && filterOptions.risk.high);
      });
    }
    
    setFilteredDocuments(filtered);
  }, [documents, filterOptions]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const file = files[0];
      
      // Extract content using OCR API for images and PDFs
      let extractedText = "";
      const fileType = file.type.toLowerCase();
      
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      if (fileType.includes('image') || fileType.includes('pdf') || fileType.includes('word')) {
        // Mock OCR extraction for demo purposes
        // In a real app, this would call an actual OCR API
        await new Promise(resolve => setTimeout(resolve, 2000));
        extractedText = "This is a sample extracted text from a document. It represents what would be extracted from the uploaded file using OCR. The actual implementation would integrate with a real OCR service.";
        console.log("OCR extracted text:", extractedText);
      } else if (fileType.includes('text')) {
        // For text files, read directly
        extractedText = await file.text();
      }
      
      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error("Not enough text content to analyze");
      }
      
      analyzeTextDocument(extractedText, file.name.split('.')[0]);
      
    } catch (error) {
      console.error("Upload error:", error);
      setIsAnalyzing(false);
      
      toast({
        title: "Upload error",
        description: error instanceof Error ? error.message : "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const analyzeTextDocument = async (text: string, title: string = "Document") => {
    if (!text || text.trim().length < 50) {
      toast({
        title: "Content error",
        description: "Please provide more text content to analyze. At least a few paragraphs are needed.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Add new document
    const newDocId = `doc-${Date.now()}`;
    const newDoc: AnalyzingDocument = {
      id: newDocId,
      title: title || "Pasted Document",
      date: new Date().toISOString(),
      status: "analyzing",
      progress: 0,
    };
    
    // Add the new document to the list
    setDocuments(prev => [newDoc, ...prev]);
    
    // Create a virtual file from the text
    const textBlob = new Blob([text], { type: 'text/plain' });
    const textFile = new File([textBlob], "extracted_content.txt", { type: 'text/plain' });
    
    // Simulate analysis progress
    let progress = 0;
    const analysisInterval = setInterval(() => {
      progress += 2;
      setAnalysisProgress(progress);
      
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocId && doc.status === "analyzing"
            ? { ...doc, progress }
            : doc
        )
      );
      
      if (progress >= 100) {
        clearInterval(analysisInterval);
      }
    }, 200);
    
    try {
      // Call the API to analyze the document
      const result = await analyzeDocument(textFile);
      
      // Add redrafted clauses to each key finding
      const enhancedKeyFindings = result.keyFindings.map(finding => ({
        ...finding,
        redraftedClauses: [
          "We suggest replacing the clause with: \"The parties hereby agree that any disputes arising out of this agreement shall be resolved through arbitration in accordance with the rules of the Dubai International Arbitration Centre.\"",
          "Alternative redraft: \"The parties agree to resolve all disputes through mediation first, before proceeding to arbitration or litigation.\"",
          "Simplified version: \"Disputes will be resolved through arbitration in Dubai, UAE.\"",
        ],
      }));
      
      // Update the document with the analysis results
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocId
            ? {
                id: doc.id,
                title: result.documentTitle || title,
                date: doc.date,
                status: "completed" as const,
                riskScore: result.riskScore,
                clauses: result.clauses,
                summary: result.summary,
                jurisdiction: result.jurisdiction,
                keyFindings: enhancedKeyFindings
              }
            : doc
        )
      );
      
      toast({
        title: "Analysis completed",
        description: `Document "${result.documentTitle || title}" has been analyzed successfully.`,
      });
    } catch (error) {
      console.error("Error analyzing document:", error);
      
      // Update document to error state
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocId
            ? {
                id: doc.id,
                title: doc.title,
                date: doc.date,
                status: "error" as const,
              }
            : doc
        )
      );
      
      toast({
        title: "Analysis error",
        description: error instanceof Error ? error.message : "There was an error analyzing your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(analysisInterval);
      setIsAnalyzing(false);
      setDocumentText("");
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    try {
      // Check if document exists in documents array
      const docExists = documents.some(doc => doc.id === documentId);
      
      if (docExists) {
        const updatedDocuments = documents.filter(doc => doc.id !== documentId);
        setDocuments(updatedDocuments);
      } else {
        // Check if it's a contract
        const updatedContracts = contracts.filter(contract => contract.id !== documentId);
        setContracts(updatedContracts);
      }
      
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted",
      });
      
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the document",
        variant: "destructive"
      });
    }
  };

  const handleFilterChange = (type: 'status' | 'risk', key: string, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: checked
      }
    }));
  };
  
  // Contract generation handler
  const handleGenerateContract = (contract: GeneratedContract) => {
    setContracts(prev => [contract, ...prev]);
  };

  return (
    <AppLayout>
      {/* Add the glow styles */}
      <style>{glowStyles}</style>
      
      <div className="flex flex-col items-center space-y-8 py-12 max-w-5xl mx-auto px-4">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-primary/10 shadow-sm overflow-hidden">
            <div className="w-full h-full bg-primary/10 transform rotate-12 scale-150"></div>
          </div>
          <h1 className="text-3xl font-bold text-center">
            LabBit
          </h1>
          <p className="text-muted-foreground text-center max-w-lg">
            Draft contracts or upload existing documents
          </p>
        </div>

        {/* Mode toggle between create and analyze */}
        <ModeToggle mode={mode} onModeChange={setMode} />

        {/* Chat-like interface */}
        <div className="w-full max-w-2xl relative rounded-xl overflow-hidden group">
          <div className="absolute -z-10 inset-0 rounded-xl bg-primary/10 p-[1.5px]">
            <div className="absolute inset-0 rounded-lg bg-background"></div>
          </div>
          
          <div className="w-full max-w-2xl overflow-hidden border border-border bg-card shadow-sm rounded-xl z-10">
            {isAnalyzing ? (
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-center">Analyzing Document...</h3>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-secondary">
                    <div 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary" 
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-center mt-2 text-muted-foreground">
                    {analysisProgress}% - Extracting information and analyzing content
                  </div>
                </div>
              </div>
            ) : (
              <>
                {mode === "create" ? (
                  <div className="p-4">
                    <ContractForm 
                      onGenerate={handleGenerateContract} 
                      popularAgreements={popularAgreements}
                    />
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-center">Analyze Legal Document or Clauses</h3>
                    <div className="flex flex-col space-y-4">
                      <Textarea 
                        placeholder="Paste your legal document text here for analysis..."
                        className="min-h-[200px] text-sm resize-none rounded-lg"
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                      />
                    
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="p-2 rounded-md hover:bg-secondary text-primary flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              <span className="text-sm">Upload</span>
                            </div>
                            <input 
                              id="file-upload" 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.doc,.docx,.txt,image/*"
                              onChange={handleFileUpload}
                            />
                          </label>
                          
                          <Button 
                            variant={isRecording ? "destructive" : "ghost"} 
                            size="sm" 
                            className={isRecording ? "text-white" : "text-primary hover:bg-secondary"}
                            onClick={toggleRecording}
                          >
                            {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                            {isRecording ? "Stop" : "Record"}
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={() => analyzeTextDocument(documentText)}
                          disabled={!documentText.trim() || documentText.trim().length < 50}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Send className="h-4 w-4 mr-1" /> Analyze
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recent Documents with Tabs */}
        <div className="w-full max-w-2xl mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Documents</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ListFilter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.status.analyzing}
                      onCheckedChange={(checked) => handleFilterChange('status', 'analyzing', checked)}
                    >
                      Analyzing
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.status.completed}
                      onCheckedChange={(checked) => handleFilterChange('status', 'completed', checked)}
                    >
                      Completed
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.status.error}
                      onCheckedChange={(checked) => handleFilterChange('status', 'error', checked)}
                    >
                      Error
                    </DropdownMenuCheckboxItem>
                  </div>
                  
                  <div className="p-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Risk Level</p>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.risk.low}
                      onCheckedChange={(checked) => handleFilterChange('risk', 'low', checked)}
                    >
                      Low Risk
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.risk.medium}
                      onCheckedChange={(checked) => handleFilterChange('risk', 'medium', checked)}
                    >
                      Medium Risk
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.risk.high}
                      onCheckedChange={(checked) => handleFilterChange('risk', 'high', checked)}
                    >
                      High Risk
                    </DropdownMenuCheckboxItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <DocumentTabs 
              documents={filteredDocuments} 
              contracts={contracts}
              onDelete={handleDeleteDocument}
            />
          </div>
      </div>

      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Dashboard;
