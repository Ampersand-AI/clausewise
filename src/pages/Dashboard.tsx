import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/document/DocumentCard";
import { UploadArea } from "@/components/document/UploadArea";
import { useState, useEffect } from "react";
import { Clipboard, ListFilter, Plus, Upload, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { analyzeDocument, DocumentAnalysisResult } from "@/utils/documentAnalysis";

// Define the document type more explicitly
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
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload process
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
        }
        return newProgress;
      });
    }, 200);
    
    try {
      // Add new document after upload completes
      const newDocId = `doc-${Date.now()}`;
      const newDoc: AnalyzingDocument = {
        id: newDocId,
        title: files[0].name.split('.')[0],
        date: new Date().toISOString(),
        status: "analyzing",
        progress: 0,
      };
      
      // Add the new document to the list
      setDocuments(prev => [newDoc, ...prev]);
      
      // Wait for upload to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(uploadInterval);
      setIsUploadOpen(false);
      
      toast({
        title: "Document uploaded",
        description: "Your document is now being analyzed.",
      });
      
      // Simulate analysis progress
      let analysisProgress = 0;
      const analysisInterval = setInterval(() => {
        analysisProgress += 5;
        
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDocId && doc.status === "analyzing"
              ? { ...doc, progress: analysisProgress }
              : doc
          )
        );
        
        if (analysisProgress >= 100) {
          clearInterval(analysisInterval);
          
          // Call the API to analyze the document
          analyzeDocument(files[0]).then((result: DocumentAnalysisResult) => {
            // Update the document with the analysis results
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === newDocId
                  ? {
                      id: doc.id,
                      title: result.documentTitle || doc.title,
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
            
            // Save the updated documents to localStorage
            localStorage.setItem('documents', JSON.stringify(
              documents.map(doc => 
                doc.id === newDocId
                  ? {
                      id: doc.id,
                      title: result.documentTitle || doc.title,
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
            ));
            
            toast({
              title: "Analysis completed",
              description: `Document "${result.documentTitle || files[0].name.split('.')[0]}" has been analyzed successfully.`,
            });
          }).catch(error => {
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
              description: error.message || "There was an error analyzing your document. Please try again.",
              variant: "destructive",
            });
          }).finally(() => {
            setIsUploading(false);
          });
        }
      }, 300);
    } catch (error) {
      console.error("Upload error:", error);
      clearInterval(uploadInterval);
      setIsUploading(false);
      
      toast({
        title: "Upload error",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
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
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-primary to-violet-500 dark:from-primary dark:to-indigo-300 text-transparent bg-clip-text">ClauseCrush</h1>
            <p className="text-muted-foreground mt-1">
              Manage and analyze your legal documents
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1">
              <ListFilter className="h-4 w-4" />
              Filter
            </Button>
            <Button 
              size="sm" 
              className="gap-1 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Button 
              size="sm" 
              className="gap-1 bg-gradient-to-r from-violet-600 to-primary hover:from-violet-700 hover:to-primary/90 text-white"
              onClick={() => setIsUploadOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        
        {documents.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl p-8 bg-muted/10">
            <Clipboard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload your first document or paste agreement text to get started with AI-powered legal document analysis.
            </p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="gap-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white"
            >
              <Upload className="h-4 w-4" />
              Analyze Document
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Analyze Document</DialogTitle>
            <DialogDescription className="text-center">
              Upload a document or paste agreement text for AI-powered analysis
            </DialogDescription>
          </DialogHeader>
          
          {isUploading && uploadProgress < 100 ? (
            <div className="py-6">
              <div className="mb-4 text-center">
                <p className="font-medium mb-2">Processing document...</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Please wait while your document is being analyzed.
                </p>
                <Progress 
                  value={uploadProgress} 
                  className="h-2" 
                  indicatorClassName="bg-gradient-to-r from-primary to-violet-600" 
                />
                <p className="text-sm mt-2">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <UploadArea onUpload={handleUpload} isUploading={isUploading} />
            </div>
          )}
        </DialogContent>
      </Dialog>
      
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
