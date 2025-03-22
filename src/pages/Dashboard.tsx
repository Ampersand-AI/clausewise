
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/document/DocumentCard";
import { Mic, Send, ListFilter, Gavel } from "lucide-react";
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
import { UploadArea } from "@/components/document/UploadArea";

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
  parties?: string[];
  keyFindings: {
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
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

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [documentText, setDocumentText] = useState("");
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Load documents from localStorage on initial render
  useEffect(() => {
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      try {
        setDocuments(JSON.parse(storedDocs));
      } catch (error) {
        console.error("Error parsing documents from localStorage:", error);
      }
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    try {
      const file = files[0];
      
      // Extract content using OCR API for images and PDFs
      let extractedText = "";
      const fileType = file.type.toLowerCase();
      
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      if (fileType.includes('image') || fileType.includes('pdf') || fileType.includes('word')) {
        // Use OCR Space API to extract text
        const formData = new FormData();
        formData.append('apikey', 'ed07758ff988957');
        formData.append('file', file);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        
        const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          body: formData,
        });
        
        const ocrData = await ocrResponse.json();
        
        if (ocrData && ocrData.ParsedResults && ocrData.ParsedResults.length > 0) {
          extractedText = ocrData.ParsedResults[0].ParsedText;
          console.log("OCR extracted text:", extractedText.substring(0, 200) + "...");
        } else {
          throw new Error("Failed to extract text from document");
        }
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

  const toggleSpeechRecognition = () => {
    if (!isListening) {
      if (!('webkitSpeechRecognition' in window)) {
        toast({
          title: "Speech Recognition Error",
          description: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
          variant: "destructive",
        });
        return;
      }
      
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Recognition Active",
          description: "Start speaking now. Click the mic button again to stop.",
        });
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setDocumentText(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      
      // Store recognition instance in window to be able to stop it later
      (window as any).recognition = recognition;
    } else {
      if ((window as any).recognition) {
        (window as any).recognition.stop();
      }
      setIsListening(false);
      toast({
        title: "Voice Recognition Stopped",
        description: "The text has been captured in the input field.",
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
    
    // Simulate analysis progress with a cool animation
    let progress = 0;
    const analysisInterval = setInterval(() => {
      progress += Math.random() * 3; // Random progress increments for more realistic effect
      progress = Math.min(progress, 99); // Cap at 99% until completion
      setAnalysisProgress(Math.floor(progress));
      
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocId && doc.status === "analyzing"
            ? { ...doc, progress: Math.floor(progress) }
            : doc
        )
      );
      
      if (progress >= 99) {
        clearInterval(analysisInterval);
      }
    }, 300);
    
    try {
      // Call the API to analyze the document
      const result = await analyzeDocument(textFile);
      
      // Set progress to 100% on completion
      setAnalysisProgress(100);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocId && doc.status === "analyzing"
            ? { ...doc, progress: 100 }
            : doc
        )
      );
      
      // Short delay to show 100% before updating to completed
      setTimeout(() => {
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
                  parties: result.parties,
                  keyFindings: result.keyFindings
                }
              : doc
          )
        );
        
        toast({
          title: "Analysis completed",
          description: `Document "${result.documentTitle || title}" has been analyzed successfully.`,
        });
        
        setIsAnalyzing(false);
        setDocumentText("");
      }, 500);
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
      
      clearInterval(analysisInterval);
      setIsAnalyzing(false);
      setDocumentText("");
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    try {
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      setDocuments(updatedDocuments);
      
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

  return (
    <AppLayout>
      <div className="flex flex-col items-center space-y-8 py-8 w-full">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary glow shadow-lg">
            <Gavel className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gradient bg-primary-gradient">
            ClauseCrush
          </h1>
          <p className="text-muted-foreground text-center max-w-lg">
            Analyze legal documents or clauses with AI. Paste your text or upload a document.
          </p>
        </div>

        {/* Chat-like interface */}
        <div className="w-full max-w-2xl neo-blur rounded-lg shadow-lg overflow-hidden">
          {isAnalyzing ? (
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-center text-foreground">Analyzing Document...</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-black/30">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary animate-pulse" 
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-center mt-2 text-muted-foreground">
                  {analysisProgress}% - Extracting information and analyzing content
                </div>
              </div>
              
              {/* Animated processing indicator */}
              <div className="flex justify-center mt-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
                  <div className="absolute inset-0 rounded-full border-b-4 border-primary animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Gavel className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h3 className="font-medium text-foreground">Analyze Legal Document or Clauses</h3>
                <div className="flex space-x-2">
                  <UploadArea 
                    onUpload={handleFileUpload}
                    isUploading={isAnalyzing}
                  />
                </div>
              </div>
              <div className="p-4">
                <Textarea 
                  placeholder="Paste your legal document text here for analysis..."
                  className="min-h-[200px] text-sm focus:ring-primary bg-black/20 border-white/10 resize-none"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                />
              </div>
              <div className="border-t border-white/10 p-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant={isListening ? "destructive" : "ghost"} 
                    size="sm" 
                    className={isListening ? "animate-pulse" : "text-muted-foreground"}
                    onClick={toggleSpeechRecognition}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={() => analyzeTextDocument(documentText)}
                  disabled={!documentText.trim() || documentText.trim().length < 50}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4 mr-1" /> Analyze
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Recent Documents */}
        {documents.length > 0 && (
          <div className="w-full max-w-2xl mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Documents</h2>
              <Button variant="outline" size="sm" className="gap-1 text-muted-foreground">
                <ListFilter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="group relative">
                  <DocumentCard {...doc} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent className="neo-blur border-white/10">
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
    </AppLayout>
  );
};

export default Dashboard;
