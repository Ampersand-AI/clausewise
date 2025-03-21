
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/document/DocumentCard";
import { UploadArea } from "@/components/document/UploadArea";
import { useState } from "react";
import { Clipboard, ListFilter, Plus, Upload } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { analyzeDocument } from "@/utils/documentAnalysis";

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
  const { toast } = useToast();

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
          analyzeDocument(files[0]).then(result => {
            // Update the document with the analysis results
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === newDocId
                  ? {
                      id: doc.id,
                      title: doc.title,
                      date: doc.date,
                      status: "completed" as const,
                      riskScore: result.riskScore,
                      clauses: result.clauses,
                    }
                  : doc
              )
            );
            
            toast({
              title: "Analysis completed",
              description: `Document "${files[0].name.split('.')[0]}" has been analyzed successfully.`,
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
              description: "There was an error analyzing your document. Please try again.",
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

  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-primary to-violet-500 dark:from-primary dark:to-indigo-300 text-transparent bg-clip-text">Dashboard</h1>
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
            <DocumentCard key={doc.id} {...doc} />
          ))}
        </div>
        
        {documents.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl p-8 bg-muted/10">
            <Clipboard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload your first document to get started with AI-powered legal document analysis.
            </p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="gap-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Upload Document</DialogTitle>
            <DialogDescription className="text-center">
              Upload your legal document for AI-powered analysis
            </DialogDescription>
          </DialogHeader>
          
          {isUploading && uploadProgress < 100 ? (
            <div className="py-6">
              <div className="mb-4 text-center">
                <p className="font-medium mb-2">Uploading document...</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Please wait while your document is being uploaded.
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
    </AppLayout>
  );
};

export default Dashboard;
