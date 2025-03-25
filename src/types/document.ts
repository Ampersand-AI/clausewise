export interface Document {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
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
  }[];
}

export interface DocumentCreateInput {
  title: string;
  description?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
}

export interface DocumentUpdateInput {
  title?: string;
  description?: string;
  status?: 'pending' | 'processing' | 'completed' | 'error';
  analysis_result?: any;
} 