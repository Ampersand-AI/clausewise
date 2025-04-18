
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentCard } from "@/components/document/DocumentCard";
import { ListFilter } from "lucide-react";
import { GeneratedContract } from "@/components/contract/ContractForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  filterOptions: {
    status: {
      analyzing: boolean;
      completed: boolean;
      error: boolean,
    };
    risk: {
      low: boolean;
      medium: boolean;
      high: boolean;
    };
  };
  onFilterChange: (type: 'status' | 'risk', key: string, checked: boolean) => void;
};

const DocumentTabs: React.FC<DocumentTabsProps> = ({ 
  documents, 
  contracts, 
  onDelete, 
  filterOptions,
  onFilterChange
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Documents</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ListFilter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.analyzing}
                  onCheckedChange={(checked) => onFilterChange('status', 'analyzing', checked)}
                >
                  Analyzing
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.completed}
                  onCheckedChange={(checked) => onFilterChange('status', 'completed', checked)}
                >
                  Completed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.error}
                  onCheckedChange={(checked) => onFilterChange('status', 'error', checked)}
                >
                  Error
                </DropdownMenuCheckboxItem>
              </div>
              
              <div className="p-2 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-1">Risk Level</p>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.low}
                  onCheckedChange={(checked) => onFilterChange('risk', 'low', checked)}
                >
                  Low Risk
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.medium}
                  onCheckedChange={(checked) => onFilterChange('risk', 'medium', checked)}
                >
                  Medium Risk
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.high}
                  onCheckedChange={(checked) => onFilterChange('risk', 'high', checked)}
                >
                  High Risk
                </DropdownMenuCheckboxItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {documents.length === 0 && contracts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-bento-textSecondary border border-border bg-white rounded-xl p-6">
            <p className="text-bento-text">No documents yet</p>
            <p className="text-sm opacity-70 mt-1">Upload a document or create a contract to get started</p>
          </div>
        ) : (
          <>
            {documents.map((doc) => {
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
            })}
            
            {contracts.map((contract) => (
              <DocumentCard 
                key={contract.id} 
                id={contract.id}
                title={contract.title}
                date={contract.date}
                status="completed"
                riskScore={contract.riskScore || 0}
                clauses={contract.riskAnalysis.length}
                keyFindings={contract.riskAnalysis}
                onDelete={onDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentTabs;
