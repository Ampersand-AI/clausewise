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
    <div className="w-full animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Recent Documents
        </h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40">
                <ListFilter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border-primary/20">
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Status</p>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.analyzing}
                  onCheckedChange={(checked) => onFilterChange('status', 'analyzing', checked)}
                  className="hover:bg-primary/10"
                >
                  Analyzing
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.completed}
                  onCheckedChange={(checked) => onFilterChange('status', 'completed', checked)}
                  className="hover:bg-primary/10"
                >
                  Completed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.status.error}
                  onCheckedChange={(checked) => onFilterChange('status', 'error', checked)}
                  className="hover:bg-primary/10"
                >
                  Error
                </DropdownMenuCheckboxItem>
              </div>
              
              <div className="p-2 border-t border-primary/10">
                <p className="text-xs font-medium text-muted-foreground mb-2">Risk Level</p>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.low}
                  onCheckedChange={(checked) => onFilterChange('risk', 'low', checked)}
                  className="hover:bg-primary/10"
                >
                  Low Risk
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.medium}
                  onCheckedChange={(checked) => onFilterChange('risk', 'medium', checked)}
                  className="hover:bg-primary/10"
                >
                  Medium Risk
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.risk.high}
                  onCheckedChange={(checked) => onFilterChange('risk', 'high', checked)}
                  className="hover:bg-primary/10"
                >
                  High Risk
                </DropdownMenuCheckboxItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.length === 0 && contracts.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-xl border bg-background/50 backdrop-blur-sm border-primary/20">
            <p className="text-lg font-medium">No documents yet</p>
            <p className="text-sm text-muted-foreground mt-2">Upload a document or create a contract to get started</p>
          </div>
        ) : (
          <>
            {documents.map((doc, index) => {
              const baseProps = {
                key: doc.id,
                ...doc,
                onDelete,
                className: `animate-fade-in hover-scale [animation-delay:${index * 50}ms]`
              };

              if (doc.status === "analyzing" && doc.progress !== undefined) {
                return (
                  <DocumentCard 
                    {...baseProps}
                    status="analyzing"
                    progress={doc.progress}
                  />
                );
              } else if (doc.status === "completed" && doc.riskScore !== undefined) {
                return (
                  <DocumentCard 
                    {...baseProps}
                    status="completed"
                    riskScore={doc.riskScore}
                  />
                );
              } else {
                return (
                  <DocumentCard 
                    {...baseProps}
                    status="error"
                  />
                );
              }
            })}
            
            {contracts.map((contract, index) => (
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
                className={`animate-fade-in hover-scale [animation-delay:${(documents.length + index) * 50}ms]`}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentTabs;
