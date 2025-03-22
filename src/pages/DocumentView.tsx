
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react"; // Changed from Document to FileText which exists in lucide-react
import { cn } from "@/lib/utils";

interface DocumentViewProps {
}

const DocumentView: React.FC<DocumentViewProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [documentName, setDocumentName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch document name or details based on the ID
    if (id) {
      // Simulate fetching document name
      setTimeout(() => {
        setDocumentName(`Document ID: ${id}`);
      }, 500);
    }
  }, [id]);

  return (
    <div className="container mx-auto mt-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Document View</h1>
        {documentName && <p className="text-gray-600">Viewing: {documentName}</p>}
      </div>

      <div className="grid gap-4">
        <div>
          <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">
            Document Name
          </label>
          <div className="mt-1">
            <Input
              type="text"
              name="documentName"
              id="documentName"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={documentName || ""}
              disabled
            />
          </div>
        </div>

        <div>
          <Button variant="outline" className="mt-4">
            <FileText className="mr-2 h-4 w-4" />
            View Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
