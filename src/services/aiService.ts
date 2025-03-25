import { retry } from '@/lib/utils';
import { AnalysisResult } from '@/api/ai';

export const aiService = {
  async analyzeText(text: string): Promise<AnalysisResult> {
    try {
      const response = await retry(
        async () => {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
          });

          if (!res.ok) {
            throw new Error('Failed to analyze document');
          }

          return res.json();
        },
        3,
        1000
      );

      return response as AnalysisResult;
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error('Failed to analyze document. Please try again.');
    }
  }
}; 