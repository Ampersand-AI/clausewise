
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface DocumentViewProps {}

interface Document {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  parties?: string[];
  [key: string]: any; // For additional document properties
}

const DocumentView: React.FC<DocumentViewProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: document,
    isLoading,
    isError,
  } = useQuery<Document>({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!id) throw new Error("Document ID is required");
      const response = await api.get(`/documents/${id}`);
      console.log("info: GET request to /documents/" + id);
      console.log("info: Fetched document:", response.data);
      // Ensure we're returning a properly typed Document object
      return response.data as Document;
    },
    retry: 1,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <Button 
        variant="ghost" 
        onClick={handleGoBack} 
        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Documents
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Document View</h1>
        <p className="text-muted-foreground mt-1">
          View and manage document details
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Document Not Found</h3>
          <p className="text-muted-foreground mt-1">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleGoBack} className="mt-4">
            Go Back
          </Button>
        </div>
      ) : document ? (
        <div className="grid gap-6">
          <div className="rounded-lg border border-border p-6 shadow-sm">
            <div className="mb-4">
              <label htmlFor="documentName" className="block text-sm font-medium text-muted-foreground mb-1">
                Document Name
              </label>
              <Input
                type="text"
                name="documentName"
                id="documentName"
                className="w-full"
                value={document.name}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label htmlFor="documentId" className="block text-sm font-medium text-muted-foreground mb-1">
                Document ID
              </label>
              <Input
                type="text"
                name="documentId"
                id="documentId"
                className="w-full font-mono text-sm bg-muted"
                value={document.id}
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="createdAt" className="block text-sm font-medium text-muted-foreground mb-1">
                  Created At
                </label>
                <Input
                  type="text"
                  name="createdAt"
                  id="createdAt"
                  className="w-full bg-muted"
                  value={new Date(document.createdAt).toLocaleString()}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="updatedAt" className="block text-sm font-medium text-muted-foreground mb-1">
                  Last Updated
                </label>
                <Input
                  type="text"
                  name="updatedAt"
                  id="updatedAt"
                  className="w-full bg-muted"
                  value={new Date(document.updatedAt).toLocaleString()}
                  readOnly
                />
              </div>
            </div>

            {document.parties && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Parties Involved
                </label>
                <div className="flex flex-wrap gap-2">
                  {document.parties.map((party: string, index: number) => (
                    <div key={index} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                      {party}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button variant="default" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                View Document Content
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Document Not Found</h3>
          <p className="text-muted-foreground mt-1">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleGoBack} className="mt-4">
            Go Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentView;
