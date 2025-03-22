import { cn } from "@/lib/utils";
import { AlertCircle, FileText, UploadIcon } from "lucide-react";
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

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground"
      onClick={() => document.getElementById('file-upload')?.click()}
      disabled={isUploading}
    >
      <UploadIcon className="h-5 w-5" />
      <input 
        id="file-upload" 
        type="file" 
        className="hidden" 
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </Button>
  );
}
