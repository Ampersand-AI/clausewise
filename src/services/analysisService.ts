import { supabase } from '@/lib/supabase';
import { Document } from '@/types/document';
import { textExtractionService } from './textExtractionService';
import { aiService } from './aiService';

interface AnalysisResult {
  summary: string;
  key_points: string[];
  risks: Array<{
    level: 'low' | 'medium' | 'high';
    description: string;
    recommendation?: string;
  }>;
  recommendations: string[];
  metadata: Record<string, any>;
}

export const analysisService = {
  async analyzeDocument(documentId: string): Promise<{ data: AnalysisResult | null; error: Error | null }> {
    try {
      // Get the document
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (docError) throw docError;

      // Update document status to processing
      await supabase
        .from('documents')
        .update({ status: 'processing' })
        .eq('id', documentId);

      // Extract text from the document
      const { text, error: extractError } = await textExtractionService.extractText(document);
      if (extractError) throw extractError;
      if (!text) throw new Error('Failed to extract text from document');

      // Analyze the extracted text
      const { data: analysis, error: aiError } = await aiService.analyzeText(text);
      if (aiError) throw aiError;
      if (!analysis) throw new Error('Failed to analyze document');

      // Update document with analysis results
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          status: 'completed',
          analysis_result: analysis
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      return { data: analysis, error: null };
    } catch (error) {
      // Update document status to error
      await supabase
        .from('documents')
        .update({ status: 'error' })
        .eq('id', documentId);

      return { data: null, error: error as Error };
    }
  },

  async getAnalysisStatus(documentId: string): Promise<{ status: Document['status'] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('status')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return { status: data.status, error: null };
    } catch (error) {
      return { status: null, error: error as Error };
    }
  }
}; 