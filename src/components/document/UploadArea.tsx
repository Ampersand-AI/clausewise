
import { cn } from "@/lib/utils";
import { AlertCircle, FileText, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadAreaProps {
  onUpload: (files: File[]) => void;
  className?: string;
  accept?: string;
  maxSize?: number;
  isUploading?: boolean;
}

export function UploadArea({
  onUpload,
  className,
  accept = ".pdf,.docx,.doc,.jpg,.jpeg,.png,.txt",
  maxSize = 10, // MB
  isUploading = false,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        title: "Upload in progress",
        description: "Please wait until the current upload is complete",
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
        title: "Upload in progress",
        description: "Please wait until the current upload is complete",
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
        fileName.endsWith(".txt")
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
      setError("Please upload PDF, Word, or text files only");
      toast({
        title: "Unsupported file type",
        description: "Please upload PDF, Word, or text files only",
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

  return (
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
          Drag and drop your PDF, Word, or text files here, or click to browse
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
  );
}
