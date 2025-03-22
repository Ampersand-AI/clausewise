
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, File as FileIcon } from "lucide-react";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadArea } from "@/components/document/UploadArea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  agreementText?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [agreementText, setAgreementText] = useState("");

  const {
    data: documentsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await api.get("/documents");
      return response.data;
    },
  });

  // Make sure documents is always an array
  const documents = Array.isArray(documentsData) ? documentsData : documentsData ? [documentsData] : [];

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Files uploaded",
        description: "Your files have been uploaded successfully.",
      });
      refetch();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error?.response?.data?.message || "Failed to upload the files.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateDocument = async () => {
    setIsCreating(true);
    try {
      const response = await api.post("/documents", {
        name: documentName,
        agreementText: agreementText,
      });

      toast({
        title: "Document created",
        description: "Your document has been created successfully.",
      });
      refetch();
    } catch (error: any) {
      console.error("Creation error:", error);
      toast({
        title: "Creation failed",
        description:
          error?.response?.data?.message || "Failed to create the document.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Manage and analyze your documents here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <UploadArea onUpload={handleFileUpload} isUploading={isUploading} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Create Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Document</DialogTitle>
                <DialogDescription>
                  Create a new document to start analyzing.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agreementText" className="text-right">
                    Agreement Text
                  </Label>
                  <Textarea
                    id="agreementText"
                    value={agreementText}
                    onChange={(e) => setAgreementText(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleCreateDocument} disabled={isCreating}>
                Create
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-4">
        <Table>
          <TableCaption>
            A list of your documents. Click on a document to view it.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            {documents?.map((document: Document) => (
              <TableRow
                key={document.id}
                onClick={() => navigate(`/document/${document.id}`)}
                className="cursor-pointer hover:bg-secondary"
              >
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>
                  {new Date(document.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(document.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">Active</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
