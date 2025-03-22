
import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Mic, Send, ListFilter, MicOff, Sparkles, CreditCard, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeDocument } from "@/utils/documentAnalysis";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModeToggle from "@/components/contract/ModeToggle";
import ContractForm, { GeneratedContract } from "@/components/contract/ContractForm";
import DocumentTabs from "@/components/document/DocumentTabs";
import { Link } from "react-router-dom";

// Define max limits for free users
const FREE_USER_LIMITS = {
  CONTRACT_GENERATION: 2,
  DOCUMENT_ANALYSIS: 5
};

// Define max limits for premium users
const PREMIUM_USER_LIMITS = {
  CONTRACT_GENERATION: 5,
  DOCUMENT_ANALYSIS: 10,
  TOKENS: 10000
};

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
    error: boolean;
  };
  risk: {
    low: boolean;
    medium: boolean;
    high: boolean;
  };
};

const Dashboard = () => {
  const { user } = useAuth();
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"contracts" | "analysis">("contracts");
  // For demo purposes, we'll simulate a user subscription status
  const [isPremium, setIsPremium] = useState(false);
  const [usageStats, setUsageStats] = useState({
    contractsGenerated: 0,
    documentsAnalyzed: 0,
    tokensUsed: 0
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

    // Load usage stats from localStorage
    const storedUsageStats = localStorage.getItem('usageStats');
    if (storedUsageStats) {
      try {
        setUsageStats(JSON.parse(storedUsageStats));
      } catch (error) {
        console.error("Error parsing usage stats from localStorage:", error);
      }
    }

    // Load premium status from localStorage
    const storedPremiumStatus = localStorage.getItem('isPremium');
    if (storedPremiumStatus) {
      try {
        setIsPremium(JSON.parse(storedPremiumStatus));
      } catch (error) {
        console.error("Error parsing premium status from localStorage:", error);
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

  // Save usage stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('usageStats', JSON.stringify(usageStats));
  }, [usageStats]);

  // Save premium status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isPremium', JSON.stringify(isPremium));
  }, [isPremium]);

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

  const checkUsageLimits = (type: "contracts" | "analysis"): boolean => {
    if (type === "contracts") {
      const currentContractCount = usageStats.contractsGenerated;
      const maxContracts = isPremium ? PREMIUM_USER_LIMITS.CONTRACT_GENERATION : FREE_USER_LIMITS.CONTRACT_GENERATION;
      
      if (currentContractCount >= maxContracts) {
        setUpgradeReason("contracts");
        setShowUpgradeModal(true);
        return false;
      }
    } else if (type === "analysis") {
      const currentAnalysisCount = usageStats.documentsAnalyzed;
      const maxAnalysis = isPremium ? PREMIUM_USER_LIMITS.DOCUMENT_ANALYSIS : FREE_USER_LIMITS.DOCUMENT_ANALYSIS;
      
      if (currentAnalysisCount >= maxAnalysis) {
        setUpgradeReason("analysis");
        setShowUpgradeModal(true);
        return false;
      }
    }
    
    return true;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkUsageLimits("analysis")) return;
    
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
    if (!checkUsageLimits("analysis")) return;
    
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
      
      // Update usage stats
      setUsageStats(prev => ({
        ...prev,
        documentsAnalyzed: prev.documentsAnalyzed + 1,
        tokensUsed: prev.tokensUsed + Math.floor(Math.random() * 500) + 500 // Simulate token usage
      }));
      
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
  
  const handleGenerateContract = (contract: GeneratedContract) => {
    if (!checkUsageLimits("contracts")) return;
    
    setContracts(prev => [contract, ...prev]);
    
    // Update usage stats
    setUsageStats(prev => ({
      ...prev,
      contractsGenerated: prev.contractsGenerated + 1,
      tokensUsed: prev.tokensUsed + Math.floor(Math.random() * 1000) + 1000 // Simulate token usage
    }));
  };

  const handleUpgrade = () => {
    // In a real application, this would redirect to a payment page
    // For demo purposes, we'll just set the user as premium
    setIsPremium(true);
    setShowUpgradeModal(false);
    
    toast({
      title: "Upgraded to Premium!",
      description: "You now have access to all premium features.",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center space-y-8 py-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-lawbit-orange-400 to-lawbit-brown-600 shadow-md overflow-hidden glow-effect">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center">
            <span className="text-gradient">Law</span><span className="text-lawbit-orange-500">bit</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-lg">
            Create and analyze legal documents with AI. Draft contracts or upload existing documents.
          </p>
        </div>

        {/* Usage Stats */}
        <div className="w-full max-w-2xl glass-card rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Your Usage</h3>
            <div className="flex items-center">
              {isPremium ? (
                <span className="premium-badge">Premium</span>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-lawbit-orange-500 border-lawbit-orange-500 hover:bg-lawbit-orange-500/10"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  Upgrade
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-lawbit-orange-50/10 dark:bg-lawbit-orange-900/10 rounded-lg border border-lawbit-orange-100/30 dark:border-lawbit-orange-700/30">
              <p className="text-sm text-muted-foreground">Contracts Generated</p>
              <div className="flex justify-between items-end mt-1">
                <p className="text-2xl font-bold">{usageStats.contractsGenerated}</p>
                <p className="text-xs text-muted-foreground">
                  of {isPremium ? PREMIUM_USER_LIMITS.CONTRACT_GENERATION : FREE_USER_LIMITS.CONTRACT_GENERATION}
                </p>
              </div>
              <Progress 
                value={(usageStats.contractsGenerated / (isPremium ? PREMIUM_USER_LIMITS.CONTRACT_GENERATION : FREE_USER_LIMITS.CONTRACT_GENERATION)) * 100} 
                className="h-1 mt-2 bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30"
              />
            </div>
            
            <div className="p-3 bg-lawbit-orange-50/10 dark:bg-lawbit-orange-900/10 rounded-lg border border-lawbit-orange-100/30 dark:border-lawbit-orange-700/30">
              <p className="text-sm text-muted-foreground">Documents Analyzed</p>
              <div className="flex justify-between items-end mt-1">
                <p className="text-2xl font-bold">{usageStats.documentsAnalyzed}</p>
                <p className="text-xs text-muted-foreground">
                  of {isPremium ? PREMIUM_USER_LIMITS.DOCUMENT_ANALYSIS : FREE_USER_LIMITS.DOCUMENT_ANALYSIS}
                </p>
              </div>
              <Progress 
                value={(usageStats.documentsAnalyzed / (isPremium ? PREMIUM_USER_LIMITS.DOCUMENT_ANALYSIS : FREE_USER_LIMITS.DOCUMENT_ANALYSIS)) * 100} 
                className="h-1 mt-2 bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30"
              />
            </div>
            
            {isPremium && (
              <div className="p-3 bg-lawbit-orange-50/10 dark:bg-lawbit-orange-900/10 rounded-lg border border-lawbit-orange-100/30 dark:border-lawbit-orange-700/30">
                <p className="text-sm text-muted-foreground">Tokens Used</p>
                <div className="flex justify-between items-end mt-1">
                  <p className="text-2xl font-bold">{usageStats.tokensUsed}</p>
                  <p className="text-xs text-muted-foreground">
                    of {PREMIUM_USER_LIMITS.TOKENS}
                  </p>
                </div>
                <Progress 
                  value={(usageStats.tokensUsed / PREMIUM_USER_LIMITS.TOKENS) * 100} 
                  className="h-1 mt-2 bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30"
                />
              </div>
            )}
          </div>
        </div>

        {/* Mode toggle between create and analyze */}
        <ModeToggle mode={mode} onModeChange={setMode} />

        {/* Chat-like interface with animated gradient border */}
        <div className="w-full max-w-2xl relative rounded-xl overflow-hidden group">
          {/* Animated gradient border */}
          <div className="absolute -z-10 inset-0 rounded-xl bg-orange-brown-gradient bg-[length:200%_100%] animate-shimmer p-[1.5px]">
            <div className="absolute inset-0 rounded-lg bg-background"></div>
          </div>
          
          <div className="w-full max-w-2xl overflow-hidden border border-lawbit-orange-200 dark:border-lawbit-orange-700/30 bg-white/90 backdrop-blur-sm shadow-sm dark:bg-gray-800/90 rounded-xl z-10">
            {isAnalyzing ? (
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-center">Analyzing Document...</h3>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-lawbit-orange-100/50 dark:bg-lawbit-orange-900/30">
                    <div 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-brown-gradient bg-[length:200%_100%] animate-shimmer" 
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
                    <h3 className="font-medium mb-4 text-center">Create Legal Contract</h3>
                    <ContractForm 
                      onGenerate={handleGenerateContract} 
                      popularAgreements={[]}
                    />
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-center">Analyze Legal Document or Clauses</h3>
                    <div className="flex flex-col space-y-4">
                      <Textarea 
                        placeholder="Paste your legal document text here for analysis..."
                        className="min-h-[200px] text-sm focus:ring-lawbit-orange-500 resize-none bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-900/50 dark:text-gray-100 dark:border-gray-700 rounded-lg"
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                      />
                    
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="p-2 rounded-md hover:bg-lawbit-orange-100/50 dark:hover:bg-lawbit-orange-900/30 text-lawbit-orange-500 flex items-center gap-2">
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
                            className={isRecording ? "text-white" : "text-lawbit-orange-500 hover:bg-lawbit-orange-50 dark:hover:bg-lawbit-orange-900/30"}
                            onClick={toggleRecording}
                          >
                            {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                            {isRecording ? "Stop" : "Record"}
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={() => analyzeTextDocument(documentText)}
                          disabled={!documentText.trim() || documentText.trim().length < 50}
                          className="bg-orange-brown-gradient hover:bg-orange-brown-gradient-hover text-white transition-all duration-300"
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
        {(documents.length > 0 || contracts.length > 0) && (
          <div className="w-full max-w-2xl mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Documents</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 text-muted-foreground border-lawbit-orange-200 bg-white hover:bg-lawbit-orange-50 dark:bg-gray-800 dark:border-lawbit-orange-700/30 dark:hover:bg-lawbit-orange-900/20">
                    <ListFilter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-sm border-lawbit-orange-200 dark:bg-gray-800/90 dark:border-lawbit-orange-700/30">
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
                  
                  <div className="p-2 border-t border-lawbit-orange-200/50 dark:border-lawbit-orange-700/20">
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
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-sm border-lawbit-orange-200 text-gray-900 dark:bg-gray-800/90 dark:border-lawbit-orange-700/30 dark:text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-gray-900 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upgrade Modal */}
      <AlertDialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-md border-lawbit-orange-200 dark:bg-gray-800/90 dark:border-lawbit-orange-700/30 max-w-md">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="h-24 w-24 rounded-full bg-orange-brown-gradient flex items-center justify-center shadow-lg glow-effect">
              <Lock className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <AlertDialogHeader className="pt-14">
            <AlertDialogTitle className="text-center">Upgrade to Premium</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {upgradeReason === "contracts" 
                ? "You've reached your free contract generation limit. Upgrade to premium to create more contracts."
                : "You've reached your free document analysis limit. Upgrade to premium to analyze more documents."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 text-lawbit-orange-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p className="text-sm">{isPremium ? "10" : "5"} document analyses per month</p>
              </div>
              <div className="flex items-center">
                <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 text-lawbit-orange-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p className="text-sm">{isPremium ? "5" : "2"} contract generations per month</p>
              </div>
              <div className="flex items-center">
                <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 text-lawbit-orange-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p className="text-sm">Priority support</p>
              </div>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-gray-900 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpgrade}
              className="orange-brown-button glow-button text-white"
            >
              Upgrade Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Dashboard;
