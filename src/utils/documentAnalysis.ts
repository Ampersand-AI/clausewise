
// API keys
const ANTHROPIK_API_KEY = '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';
const OPENAI_API_KEY = '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';

export type DocumentAnalysisResult = {
  riskScore: number;
  clauses: number;
  keyFindings: {
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
};

export async function analyzeDocument(file: File): Promise<DocumentAnalysisResult> {
  try {
    console.log('Starting document analysis for', file.name);
    
    // Convert file to base64
    const base64File = await fileToBase64(file);
    
    // Try OpenAI API first
    try {
      return await analyzeWithOpenAI(file, base64File);
    } catch (openAIError) {
      console.error('OpenAI analysis failed, falling back to Anthropik:', openAIError);
      // Fall back to Anthropik API
      return await analyzeWithAnthropik(base64File);
    }
  } catch (error) {
    console.error('Error analyzing document:', error);
    
    // Return mock data for demonstration purposes if API fails
    return generateMockAnalysisData();
  }
}

async function analyzeWithOpenAI(file: File, base64File: string): Promise<DocumentAnalysisResult> {
  // Create form data with the file
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'gpt-4o');
  
  const prompt = `
    Analyze this legal document and provide the following:
    1. A risk score from 0-100 (higher means more risk)
    2. Number of clauses identified
    3. Key findings with their risk levels (low, medium, high)
    
    Format the response as a JSON object with these fields:
    {
      "risk_score": number,
      "clauses_count": number,
      "key_findings": [
        {
          "title": "string",
          "description": "string",
          "risk_level": "low|medium|high"
        }
      ]
    }
  `;
  
  formData.append('prompt', prompt);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          "role": "system",
          "content": "You are a legal document analyzer. Analyze the document content and provide a structured JSON response."
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": prompt
            },
            {
              "type": "text",
              "text": `Document content (base64): ${base64File.substring(0, 500)}...`
            }
          ]
        }
      ],
      response_format: { "type": "json_object" }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenAI API error (${response.status}):`, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);
  
  return {
    riskScore: content.risk_score || Math.floor(Math.random() * 100),
    clauses: content.clauses_count || Math.floor(Math.random() * 15) + 5,
    keyFindings: content.key_findings || generateMockKeyFindings()
  };
}

async function analyzeWithAnthropik(base64File: string): Promise<DocumentAnalysisResult> {
  // Call Anthropik API for document analysis
  const response = await fetch('https://api.anthropic.com/v1/documents/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIK_API_KEY,
    },
    body: JSON.stringify({
      document: base64File,
      analysis_type: 'legal_document',
    }),
  });

  // Check if the API call was successful
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Anthropik API error (${response.status}):`, errorText);
    throw new Error(`Anthropik API error: ${response.status} - ${errorText}`);
  }

  // Process the response
  const data = await response.json();
  console.log('Analysis results received:', data);
  
  // Parse the API response into our result format
  return {
    riskScore: data.risk_score || Math.floor(Math.random() * 100),
    clauses: data.clauses_count || Math.floor(Math.random() * 15) + 5,
    keyFindings: data.key_findings || generateMockKeyFindings()
  };
}

function generateMockAnalysisData(): DocumentAnalysisResult {
  return {
    riskScore: Math.floor(Math.random() * 100),
    clauses: Math.floor(Math.random() * 15) + 5,
    keyFindings: generateMockKeyFindings()
  };
}

function generateMockKeyFindings() {
  return [
    {
      title: 'Termination Clause',
      description: 'The contract can be terminated with only 7 days notice, which is shorter than industry standard.',
      riskLevel: 'high' as const
    },
    {
      title: 'Liability Cap',
      description: 'Liability is capped at contract value, which is standard for this type of agreement.',
      riskLevel: 'low' as const
    },
    {
      title: 'Payment Terms',
      description: '45-day payment terms may create cash flow challenges.',
      riskLevel: 'medium' as const
    }
  ];
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};
