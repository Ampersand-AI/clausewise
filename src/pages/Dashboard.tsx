
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/document/DocumentCard";
import { Upload, Image, FileText, Mic, Send, Plus, FileUp, Trash2, ListFilter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeDocument, DocumentAnalysisResult } from "@/utils/documentAnalysis";
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
      <div className="flex flex-col items-center space-y-8 py-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            ClauseCrush
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-lg">
            Analyze legal documents with AI. Paste your text or upload a document.
          </p>
        </div>

        {/* Chat-like interface */}
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800">
          {isAnalyzing ? (
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-center">Analyzing Document...</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-[shimmer_2s_infinite]" 
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-center mt-2 text-slate-600 dark:text-slate-400">
                  {analysisProgress}% - Extracting information and analyzing content
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4">
                <h3 className="font-medium">Analyze Document</h3>
                <div className="flex space-x-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                      <Upload className="h-5 w-5" />
                    </div>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.txt,image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
              <div className="p-4">
                <Textarea 
                  placeholder="Paste your legal document text here for analysis..."
                  className="min-h-[200px] text-sm focus:ring-indigo-500 resize-none"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                />
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={() => analyzeTextDocument(documentText)}
                  disabled={!documentText.trim() || documentText.trim().length < 50}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Recent Documents</h2>
              <Button variant="outline" size="sm" className="gap-1 text-slate-600 dark:text-slate-400">
                <ListFilter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="group relative">
                  <DocumentCard {...doc} />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-destructive border-destructive hover:bg-destructive hover:text-white"
                    onClick={() => setDocumentToDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
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
