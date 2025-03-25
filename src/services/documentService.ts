import { supabase } from '@/lib/supabase';
import { Document, DocumentCreateInput, DocumentUpdateInput } from '@/types/document';

export interface SearchFilters {
  searchTerm?: string;
  status?: 'pending' | 'processing' | 'completed' | 'error';
  riskLevel?: 'low' | 'medium' | 'high';
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'date' | 'risk' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const documentService = {
  async createDocument(input: DocumentCreateInput): Promise<{ data: Document | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async getDocuments(): Promise<{ data: Document[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async getDocument(id: string): Promise<{ data: Document | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async updateDocument(id: string, input: DocumentUpdateInput): Promise<{ data: Document | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async deleteDocument(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async uploadFile(file: File): Promise<{ path: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return { path: publicUrl, error: null };
    } catch (error) {
      return { path: null, error: error as Error };
    }
  },

  async searchDocuments(filters: SearchFilters): Promise<Document[]> {
    let query = supabase
      .from('documents')
      .select('*');

    // Apply search term filter
    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
    }

    // Apply status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply risk level filter
    if (filters.riskLevel) {
      query = query.eq('risk_level', filters.riskLevel);
    }

    // Apply date range filter
    if (filters.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.start.toISOString())
        .lte('created_at', filters.dateRange.end.toISOString());
    }

    // Apply sorting
    if (filters.sortBy) {
      const order = filters.sortOrder || 'desc';
      query = query.order(filters.sortBy, { ascending: order === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }

    return data || [];
  },

  async getDocumentAnalytics(): Promise<{
    totalDocuments: number;
    documentsByStatus: Record<string, number>;
    documentsByRisk: Record<string, number>;
    recentActivity: Document[];
  }> {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching document analytics:', error);
      throw new Error('Failed to fetch document analytics');
    }

    const analytics = {
      totalDocuments: documents.length,
      documentsByStatus: documents.reduce((acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      documentsByRisk: documents.reduce((acc, doc) => {
        if (doc.risk_level) {
          acc[doc.risk_level] = (acc[doc.risk_level] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      recentActivity: documents
    };

    return analytics;
  }
}; 