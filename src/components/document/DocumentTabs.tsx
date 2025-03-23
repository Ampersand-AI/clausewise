
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentCard } from "@/components/document/DocumentCard";
import { FileText, Search } from "lucide-react";
import { GeneratedContract } from "@/components/contract/ContractForm";

type Document = {
  id: string;
  title: string;
  date: string;
  status: "analyzing" | "completed" | "error";
  progress?: number;
  riskScore?: number;
  clauses?: number;
  summary?: string;
  jurisdiction?: string;
  keyFindings?: {
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    extractedText?: string;
    mitigationOptions?: string[];
    redraftedClauses?: string[];
  }[];
};

type DocumentTabsProps = {
  documents: Document[];
  contracts: GeneratedContract[];
  onDelete: (id: string) => void;
};

const DocumentTabs: React.FC<DocumentTabsProps> = ({ documents, contracts, onDelete }) => {
  const [activeTab, setActiveTab] = useState("analyses");

  return (
    <Tabs defaultValue="analyses" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4 rounded-sm border border-terminal-cyan/30 bg-terminal-background font-mono">
        <TabsTrigger 
          value="analyses" 
          className="rounded-sm data-[state=active]:bg-terminal-cyan/20 data-[state=active]:text-terminal-cyan"
        >
          <div className="flex items-center gap-1.5">
            <Search className="h-4 w-4" />
            <span>Recent Analyses</span>
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="drafts" 
          className="rounded-sm data-[state=active]:bg-terminal-cyan/20 data-[state=active]:text-terminal-cyan"
        >
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>Recent Drafts</span>
          </div>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="analyses" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.length === 0 ? (
            <div className="col-span-full text-center py-8 text-terminal-foreground border border-terminal-cyan/20 bg-terminal-darkGray rounded-sm p-6">
              <Search className="h-10 w-10 mx-auto mb-2 opacity-30 text-terminal-cyan" />
              <p className="text-terminal-cyan">No document analyses yet</p>
              <p className="text-sm opacity-70 mt-1">ID: j3kwugu2k</p>
            </div>
          ) : (
            documents.map((doc) => {
              // Ensure we pass the correct props based on document status
              if (doc.status === "analyzing" && doc.progress !== undefined) {
                return (
                  <DocumentCard 
                    key={doc.id} 
                    {...doc} 
                    status="analyzing"
                    progress={doc.progress}
                    onDelete={onDelete}
                  />
                );
              } else if (doc.status === "completed" && doc.riskScore !== undefined) {
                return (
                  <DocumentCard 
                    key={doc.id} 
                    {...doc} 
                    status="completed"
                    riskScore={doc.riskScore}
                    onDelete={onDelete}
                  />
                );
              } else {
                return (
                  <DocumentCard 
                    key={doc.id} 
                    id={doc.id}
                    title={doc.title}
                    date={doc.date}
                    status="error"
                    onDelete={onDelete}
                  />
                );
              }
            })
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="drafts" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contracts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-terminal-foreground border border-terminal-cyan/20 bg-terminal-darkGray rounded-sm p-6">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-30 text-terminal-cyan" />
              <p className="text-terminal-cyan">No contract drafts yet</p>
              <p className="text-sm opacity-70 mt-1">ID: j3kwugu2k</p>
            </div>
          ) : (
            contracts.map((contract) => (
              <DocumentCard 
                key={contract.id} 
                id={contract.id}
                title={contract.title}
                date={contract.date}
                status="completed"
                riskScore={contract.riskScore || 0}  // Ensure riskScore is always provided for completed status
                clauses={contract.riskAnalysis.length}
                keyFindings={contract.riskAnalysis}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DocumentTabs;
