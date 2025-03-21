
import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadAreaProps {
  onUpload: (files: File[]) => void;
  className?: string;
  accept?: string;
  maxSize?: number;
}

export function UploadArea({
  onUpload,
  className,
  accept = ".pdf,.docx,.doc,.jpg,.jpeg,.png",
  maxSize = 10, // MB
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    // Validate file types
    const validFiles = files.filter(file => {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      return (
        fileType.includes("pdf") ||
        fileType.includes("word") ||
        fileType.includes("image") ||
        fileName.endsWith(".pdf") ||
        fileName.endsWith(".doc") ||
        fileName.endsWith(".docx")
      );
    });
    
    // Validate file size
    const validSizeFiles = validFiles.filter(file => {
      const fileSize = file.size / (1024 * 1024); // Convert to MB
      return fileSize <= maxSize;
    });
    
    // Show error messages if needed
    if (validSizeFiles.length !== files.length) {
      toast({
        title: "File size error",
        description: `Some files exceed the maximum size of ${maxSize}MB`,
        variant: "destructive",
      });
    }
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Unsupported file type",
        description: "Please upload PDF, Word, or image files only",
        variant: "destructive",
      });
    }
    
    if (validSizeFiles.length > 0) {
      onUpload(validSizeFiles);
    }
  };

  return (
    <div
      className={cn(
        "relative p-8 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.01]" 
          : "border-border hover:border-primary/50 hover:bg-muted/30",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        accept={accept}
        onChange={handleFileChange}
        multiple
      />
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-float">
          <UploadIcon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium">Upload your document</h3>
        <p className="text-muted-foreground max-w-md">
          Drag and drop your PDF, Word, or image files here, or click to browse
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          Supported formats: PDF, DOCX, JPG, PNG • Max size: {maxSize}MB
        </div>
      </div>
    </div>
  );
}
