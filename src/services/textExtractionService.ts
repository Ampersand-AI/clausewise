import * as pdfjsLib from 'pdfjs-dist';
import { Document } from '@/types/document';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const textExtractionService = {
  async extractText(document: Document): Promise<{ text: string | null; error: Error | null }> {
    try {
      const fileType = document.file_type.toLowerCase();
      
      if (fileType === 'application/pdf') {
        return await this.extractPdfText(document.file_path);
      } else if (fileType.includes('word') || fileType.includes('docx')) {
        return await this.extractWordText(document.file_path);
      } else if (fileType === 'text/plain') {
        return await this.extractPlainText(document.file_path);
      } else {
        throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      return { text: null, error: error as Error };
    }
  },

  async extractPdfText(filePath: string): Promise<{ text: string | null; error: Error | null }> {
    try {
      const loadingTask = pdfjsLib.getDocument(filePath);
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return { text: fullText.trim(), error: null };
    } catch (error) {
      return { text: null, error: error as Error };
    }
  },

  async extractWordText(filePath: string): Promise<{ text: string | null; error: Error | null }> {
    try {
      // TODO: Implement Word document text extraction
      // This would require a server-side component or a library like mammoth.js
      throw new Error('Word document extraction not yet implemented');
    } catch (error) {
      return { text: null, error: error as Error };
    }
  },

  async extractPlainText(filePath: string): Promise<{ text: string | null; error: Error | null }> {
    try {
      const response = await fetch(filePath);
      const text = await response.text();
      return { text: text.trim(), error: null };
    } catch (error) {
      return { text: null, error: error as Error };
    }
  }
}; 