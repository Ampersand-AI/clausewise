
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, ArrowLeft, Download } from "lucide-react";
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
  } = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!id) throw new Error("Document ID is required");
      const response = await api.get(`/documents/${id}`);
      console.log("info: GET request to /documents/" + id);
      console.log("info: Fetched document:", response.data);
      // Cast to Document type
      return response.data as Document;
    },
    retry: 1,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#222222] text-white">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={handleGoBack} 
          className="mb-6 -ml-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Document View</h1>
          <p className="text-gray-400 mt-1">
            View and manage document details
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4 bg-[#2A2A2A] rounded-xl p-6 border border-[#333333]">
            <Skeleton className="h-8 w-full max-w-sm bg-[#333333]" />
            <Skeleton className="h-12 w-full bg-[#333333]" />
            <Skeleton className="h-12 w-full bg-[#333333]" />
            <Skeleton className="h-10 w-32 bg-[#333333]" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-[#2A2A2A] rounded-xl border border-[#333333]">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white">Document Not Found</h3>
            <p className="text-gray-400 mt-1">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleGoBack} className="mt-4 bg-[#333333] hover:bg-[#444444]">
              Go Back
            </Button>
          </div>
        ) : document ? (
          <div className="grid gap-6">
            <div className="rounded-xl border border-[#333333] p-6 shadow-lg bg-[#2A2A2A]">
              <div className="mb-4">
                <label htmlFor="documentName" className="block text-sm font-medium text-gray-400 mb-1">
                  Document Name
                </label>
                <Input
                  type="text"
                  name="documentName"
                  id="documentName"
                  className="w-full bg-[#333333] border-[#444444] text-white"
                  value={document.name}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label htmlFor="documentId" className="block text-sm font-medium text-gray-400 mb-1">
                  Document ID
                </label>
                <Input
                  type="text"
                  name="documentId"
                  id="documentId"
                  className="w-full font-mono text-sm bg-[#333333] border-[#444444] text-white"
                  value={document.id}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="createdAt" className="block text-sm font-medium text-gray-400 mb-1">
                    Created At
                  </label>
                  <Input
                    type="text"
                    name="createdAt"
                    id="createdAt"
                    className="w-full bg-[#333333] border-[#444444] text-white"
                    value={new Date(document.createdAt).toLocaleString()}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="updatedAt" className="block text-sm font-medium text-gray-400 mb-1">
                    Last Updated
                  </label>
                  <Input
                    type="text"
                    name="updatedAt"
                    id="updatedAt"
                    className="w-full bg-[#333333] border-[#444444] text-white"
                    value={new Date(document.updatedAt).toLocaleString()}
                    readOnly
                  />
                </div>
              </div>

              {document.parties && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Parties Involved
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {document.parties.map((party: string, index: number) => (
                      <div key={index} className="px-3 py-1 bg-[#333333] rounded-full text-sm text-white">
                        {party}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="default" className="flex items-center bg-[#333333] hover:bg-[#444444]">
                  <FileText className="mr-2 h-4 w-4" />
                  View Document Content
                </Button>
                <Button variant="outline" className="flex items-center border-[#444444] text-white hover:bg-[#444444]">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#2A2A2A] rounded-xl border border-[#333333]">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white">Document Not Found</h3>
            <p className="text-gray-400 mt-1">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleGoBack} className="mt-4 bg-[#333333] hover:bg-[#444444]">
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentView;
