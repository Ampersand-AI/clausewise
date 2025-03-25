import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Mic, Send, MicOff, Home, Settings, User, Quote, Brain, Check, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeDocument } from "@/utils/documentAnalysis";
import { Progress } from "@/components/ui/progress";
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
import ContractForm, { GeneratedContract } from "@/components/contract/ContractForm";
import DocumentTabs from "@/components/document/DocumentTabs";
import { QuotaDisplay, QuotaData } from "@/components/quota/QuotaDisplay";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardAnalytics } from '@/components/dashboard/DashboardAnalytics';
import { documentService } from '@/services/documentService';
import { aiService } from '@/services/aiService';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import pdfParse from 'pdf-parse';

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
  const navigate = useNavigate();
  
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
      const fileType = file.type.toLowerCase();
      
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      let extractedText = "";
      
      if (fileType.includes('text')) {
        extractedText = await file.text();
      } else if (fileType === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = await pdfParse(arrayBuffer);
        extractedText = pdfData.text;
      } else {
        throw new Error("Unsupported file type. Please upload a text or PDF file.");
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
    
    setDocuments(prev => [newDoc, ...prev]);
    
    try {
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
    
      // Call AI service for analysis
      const result = await aiService.analyzeText(text);
      
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
                keyFindings: result.keyFindings
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

  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'risk' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Update document filtering
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const filters = {
          searchTerm,
          dateRange,
          sortBy,
          sortOrder,
        };
        const results = await documentService.searchDocuments(filters);
        setFilteredDocuments(results);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Failed to fetch documents",
          variant: "destructive",
        });
      }
    };

    fetchDocuments();
  }, [searchTerm, dateRange, sortBy, sortOrder]);

  // Update the mode switching handlers
  const handleCreateMode = () => {
    setMode("create");
    setDocumentText("");
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleAnalyzeMode = () => {
    setMode("analyze");
    setDocumentText("");
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* New Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Main Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary/30 animate-spin-slow" />
                  <div className="absolute inset-2 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Brain className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    LawBit
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI-powered Legal Document Analysis
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant={mode === "create" ? "default" : "outline"}
                  onClick={handleCreateMode}
                  className="transition-all duration-300 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
                <Button
                  variant={mode === "analyze" ? "default" : "outline"}
                  onClick={handleAnalyzeMode}
                  className="transition-all duration-300 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Document
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Documents</p>
                      <h3 className="text-2xl font-bold mt-1">{documents.length}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-300 hover:shadow-lg hover:border-green-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {documents.filter(doc => doc.status === "completed").length}
                      </h3>
                    </div>
                    <div className="p-2 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-300 hover:shadow-lg hover:border-yellow-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Processing</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {documents.filter(doc => doc.status === "analyzing").length}
                      </h3>
                    </div>
                    <div className="p-2 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                      <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-300 hover:shadow-lg hover:border-red-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Error Rate</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {documents.length > 0
                          ? `${Math.round((documents.filter(doc => doc.status === "error").length / documents.length) * 100)}%`
                          : "0%"}
                      </h3>
                    </div>
                    <div className="p-2 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-300 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <h3 className="text-sm font-medium mb-4">Documents by Status</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Completed", value: documents.filter(doc => doc.status === "completed").length },
                            { name: "Processing", value: documents.filter(doc => doc.status === "analyzing").length },
                            { name: "Error", value: documents.filter(doc => doc.status === "error").length }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#22c55e" />
                          <Cell fill="#eab308" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-300 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <h3 className="text-sm font-medium mb-4">Documents by Risk Level</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Low", value: documents.filter(doc => doc.status === "completed" && doc.riskScore < 30).length },
                          { name: "Medium", value: documents.filter(doc => doc.status === "completed" && doc.riskScore >= 30 && doc.riskScore < 70).length },
                          { name: "High", value: documents.filter(doc => doc.status === "completed" && doc.riskScore >= 70).length }
                        ]}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <DashboardAnalytics />

        {/* Search and Filter Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-4">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-[300px]"
            />
            <Select value={sortBy} onValueChange={(value: 'date' | 'risk' | 'title') => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="risk">Risk</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl mx-auto relative rounded-xl overflow-hidden group"
        >
          <div className="absolute -z-10 inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 p-[1.5px]">
            <div className="absolute inset-0 rounded-lg bg-background/80 backdrop-blur-sm"></div>
          </div>
          
          <div className="w-full overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg rounded-xl z-10">
            {isAnalyzing ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-100" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-200" />
                </div>
                <h3 className="text-lg font-medium text-center">Analyzing Document...</h3>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-secondary">
                    <Progress 
                      value={analysisProgress} 
                      className="h-2 bg-gradient-to-r from-primary to-accent"
                      showGradient={true}
                    />
                  </div>
                  <div className="text-sm text-center mt-2 text-muted-foreground">
                    {analysisProgress}% - Extracting information and analyzing content
                  </div>
                </div>
              </div>
            ) : (
              <>
                {mode === "create" ? (
                  <div className="p-6">
                    <ContractForm 
                      onGenerate={handleGenerateContract} 
                      popularAgreements={popularAgreements}
                    />
                  </div>
                ) : (
                  <div className="p-6">
                    <h3 className="font-medium mb-4 text-center text-lg">Analyze Legal Document or Clauses</h3>
                    <div className="flex flex-col space-y-4">
                      <div className="relative">
                      <Textarea 
                        placeholder="Paste your legal document text here for analysis..."
                          className="min-h-[200px] text-sm resize-none rounded-lg border-primary/20 focus:border-primary/40 transition-colors bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/70"
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                      />
                        <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-b from-transparent via-background/5 to-background/10" />
                      </div>
                    
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="p-2 rounded-md hover:bg-secondary/50 text-primary flex items-center gap-2 transition-colors">
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
                            className={isRecording ? "text-white" : "text-primary hover:bg-secondary/50"}
                            onClick={toggleRecording}
                          >
                            {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                            {isRecording ? "Stop" : "Record"}
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={() => analyzeTextDocument(documentText)}
                          disabled={!documentText.trim() || documentText.trim().length < 50}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground transition-all duration-300"
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
        </motion.div>

        {/* Document Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-5xl mx-auto"
        >
          <DocumentTabs 
            documents={filteredDocuments} 
            contracts={contracts}
            onDelete={handleDeleteDocument}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </motion.div>
      </div>

      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-sm border-border/50">
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
