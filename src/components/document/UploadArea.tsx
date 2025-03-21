import { cn } from "@/lib/utils";
import { AlertCircle, FileText, MessageSquare, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onUpload: (files: File[]) => void;
  onAnalyzeText?: (text: string) => void;
  className?: string;
  accept?: string;
  maxSize?: number;
  isUploading?: boolean;
}

export function UploadArea({
  onUpload,
  onAnalyzeText,
  className,
  accept = ".pdf,.docx,.doc,.jpg,.jpeg,.png,.txt",
  maxSize = 10, // MB
  isUploading = false,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreementText, setAgreementText] = useState("");
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setError(null);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    if (isUploading) {
      toast({
        title: "Analysis in progress",
        description: "Please wait until the current analysis is complete",
        variant: "destructive",
      });
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (isUploading) {
      toast({
        title: "Analysis in progress",
        description: "Please wait until the current analysis is complete",
        variant: "destructive",
      });
      return;
    }
    
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    if (files.length === 0) {
      setError("No files selected");
      return;
    }
    
    // Validate file types
    const validFiles = files.filter(file => {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      return (
        fileType.includes("pdf") ||
        fileType.includes("word") ||
        fileType.includes("document") ||
        fileType.includes("image") ||
        fileType.includes("text") ||
        fileName.endsWith(".pdf") ||
        fileName.endsWith(".doc") ||
        fileName.endsWith(".docx") ||
        fileName.endsWith(".txt") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".png")
      );
    });
    
    // Validate file size
    const validSizeFiles = validFiles.filter(file => {
      const fileSize = file.size / (1024 * 1024); // Convert to MB
      return fileSize <= maxSize;
    });
    
    // Show error messages if needed
    if (validSizeFiles.length !== files.length) {
      setError(`Some files exceed the maximum size of ${maxSize}MB`);
      toast({
        title: "File size error",
        description: `Some files exceed the maximum size of ${maxSize}MB`,
        variant: "destructive",
      });
    }
    
    if (validFiles.length !== files.length) {
      setError("Please upload PDF, Word, image, or text files only");
      toast({
        title: "Unsupported file type",
        description: "Please upload PDF, Word, image, or text files only",
        variant: "destructive",
      });
    }
    
    if (validSizeFiles.length > 0) {
      onUpload(validSizeFiles);
      setError(null);
    } else {
      setError("No valid files to upload");
    }
  };

  const handleAnalyzeText = () => {
    if (isUploading) {
      toast({
        title: "Analysis in progress",
        description: "Please wait until the current analysis is complete",
        variant: "destructive",
      });
      return;
    }

    if (!agreementText.trim()) {
      setError("Please enter the agreement text");
      toast({
        title: "Empty text",
        description: "Please enter the agreement text for analysis",
        variant: "destructive",
      });
      return;
    }

    if (agreementText.trim().length < 50) {
      setError("Agreement text is too short for meaningful analysis");
      toast({
        title: "Text too short",
        description: "Please enter more detailed agreement text for accurate analysis",
        variant: "destructive",
      });
      return;
    }

    // Create a virtual file from the text
    const blob = new Blob([agreementText], { type: 'text/plain' });
    const file = new File([blob], "agreement.txt", { type: 'text/plain' });
    
    onUpload([file]);
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <UploadIcon className="h-4 w-4" /> 
          Upload Document
        </TabsTrigger>
        <TabsTrigger value="paste" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> 
          Paste Agreement
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="mt-0">
        <div
          className={cn(
            "relative p-8 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out",
            isDragging 
              ? "border-primary bg-primary/10 scale-[1.01]" 
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            isUploading && "opacity-50 cursor-not-allowed",
            "dark:bg-slate-900/30 dark:border-violet-700/50 dark:hover:border-violet-500",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className={cn(
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10",
              isUploading && "pointer-events-none"
            )}
            accept={accept}
            onChange={handleFileChange}
            multiple
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className={cn(
              "relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden",
              isDragging 
                ? "bg-primary/20" 
                : "bg-primary/10",
              "dark:bg-gradient-to-br dark:from-violet-600/30 dark:to-primary/30",
            )}>
              {/* Add shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
              <UploadIcon className="h-8 w-8 text-primary dark:text-violet-400 relative z-10" />
            </div>
            <h3 className="text-xl font-medium">Upload your document</h3>
            <p className="text-muted-foreground max-w-md">
              Drag and drop your legal documents here, or click to browse
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Supported formats: PDF, DOCX, TXT, JPG, PNG • Max size: {maxSize}MB
            </div>
            
            {error && (
              <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            {isUploading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-primary dark:text-violet-400">
                <FileText className="h-4 w-4 animate-pulse" />
                <span>Processing document...</span>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="paste" className="mt-0">
        <div className={cn(
          "p-6 border-2 border rounded-xl transition-all",
          isUploading ? "opacity-50 cursor-not-allowed" : "border-border",
          "dark:bg-slate-900/30 dark:border-violet-700/50",
          className
        )}>
          <div className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <h3 className="text-xl font-medium">Paste agreement text</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Copy and paste your contract or agreement for AI-powered analysis
              </p>
            </div>
            
            <Textarea 
              placeholder="Paste your agreement text here..."
              className="min-h-[250px] resize-y text-sm"
              value={agreementText}
              onChange={(e) => {
                setAgreementText(e.target.value);
                setError(null);
              }}
              disabled={isUploading}
            />
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            <Button
              onClick={handleAnalyzeText}
              className="mt-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white"
              disabled={isUploading || !agreementText.trim()}
            >
              {isUploading ? (
                <>
                  <FileText className="mr-2 h-4 w-4 animate-pulse" />
                  Processing...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Analyze Agreement
                </>
              )}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
