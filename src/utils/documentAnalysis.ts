
interface AnalysisResult {
  documentTitle: string;
  riskScore: number;
  clauses: number;
  summary: string;
  jurisdiction: string;
  keyFindings: {
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    extractedText?: string;
    mitigationOptions?: string[];
  }[];
}

export const analyzeDocument = async (file: File): Promise<AnalysisResult> => {
  // This is a mock implementation
  // In a real application, this would call an external API
  
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const isFromContractForm = file.name.includes('generated_contract') || file.name.includes('contract');
      
      if (isFromContractForm) {
        // For generated contracts, always return low risk analysis (under 30%)
        resolve({
          documentTitle: file.name.split('.')[0],
          riskScore: 15, // Low risk score (under 30%)
          clauses: 15,
          summary: 'This is a well-drafted agreement with clear terms and balanced obligations. The document uses standard legal language and follows best practices for this type of agreement. All key sections are properly defined with specific obligations and rights for all parties. The contract includes comprehensive protections and is structured for maximum clarity and legal protection.',
          jurisdiction: 'United States',
          keyFindings: [
            {
              title: 'Well-Defined Terms',
              description: 'The agreement contains clearly defined terms with specific definitions that reduce ambiguity.',
              riskLevel: 'low',
              extractedText: 'For the purposes of this Agreement, "Confidential Information" means any information disclosed by one party (the "Disclosing Party") to the other party (the "Receiving Party") that is marked as "confidential" or would reasonably be understood to be confidential given the nature of the information and circumstances of disclosure.',
              mitigationOptions: ['No changes needed', 'Terms are clearly defined and protect both parties']
            },
            {
              title: 'Reasonable Limitation of Liability',
              description: 'The liability limitations are reasonable and balanced for both parties.',
              riskLevel: 'low',
              extractedText: 'Neither party shall be liable to the other for any indirect, incidental, consequential, special, punitive or exemplary damages, even if that party has been advised of the possibility of such damages.',
              mitigationOptions: ['No changes needed', 'The limitation is standard and protects both parties adequately']
            },
            {
              title: 'Clear Dispute Resolution Process',
              description: 'The agreement includes a well-defined dispute resolution process with reasonable steps.',
              riskLevel: 'low',
              extractedText: 'Any dispute arising out of or relating to this Agreement shall first be attempted to be resolved through good faith negotiation. If the dispute cannot be resolved through negotiation, the parties agree to attempt to resolve the dispute through mediation.',
              mitigationOptions: ['No changes needed', 'The dispute resolution process is clear and fair']
            },
            {
              title: 'Comprehensive Confidentiality Provisions',
              description: 'The document contains detailed and enforceable confidentiality provisions that protect all parties.',
              riskLevel: 'low',
              extractedText: 'Each party shall maintain the confidentiality of all Confidential Information received from the other party and shall not disclose such Confidential Information to any third party without prior written consent from the disclosing party.',
              mitigationOptions: ['No changes needed', 'The confidentiality provisions are robust and provide adequate protection']
            },
            {
              title: 'Balanced Termination Rights',
              description: 'The agreement provides fair and balanced termination rights to both parties.',
              riskLevel: 'low',
              extractedText: 'Either party may terminate this Agreement upon thirty (30) days written notice to the other party. Upon termination, all rights and licenses granted under this Agreement shall immediately terminate.',
              mitigationOptions: ['No changes needed', 'The termination provisions are equitable and protect both parties']
            }
          ]
        });
      } else {
        // For uploaded documents, generate a random analysis
        // In a real app, this would be the result of actual document analysis
        const randomRisk = Math.floor(Math.random() * 100);
        const riskLevel = randomRisk < 30 ? 'low' : (randomRisk < 70 ? 'medium' : 'high');
        
        resolve({
          documentTitle: file.name.split('.')[0],
          riskScore: randomRisk,
          clauses: Math.floor(Math.random() * 15) + 5,
          summary: 'This document appears to be a standard legal agreement with typical clauses and provisions.',
          jurisdiction: ['United States', 'United Kingdom', 'European Union'][Math.floor(Math.random() * 3)],
          keyFindings: [
            {
              title: 'Jurisdiction Clause',
              description: 'The agreement specifies the governing law and jurisdiction for disputes.',
              riskLevel: randomRisk < 30 ? 'low' : (randomRisk < 70 ? 'medium' : 'high'),
              extractedText: 'This Agreement shall be governed by and construed in accordance with the laws of the State of California.',
              mitigationOptions: ['Specify a neutral jurisdiction', 'Include arbitration clause']
            },
            {
              title: 'Termination Provisions',
              description: 'The agreement includes terms for early termination by either party.',
              riskLevel: randomRisk < 40 ? 'low' : (randomRisk < 75 ? 'medium' : 'high'),
              extractedText: 'Either party may terminate this Agreement with 30 days written notice to the other party.',
              mitigationOptions: ['Extend notice period', 'Add specific conditions for termination']
            },
            {
              title: 'Confidentiality Clause',
              description: 'The agreement includes provisions for handling confidential information.',
              riskLevel: randomRisk < 50 ? 'low' : (randomRisk < 80 ? 'medium' : 'high'),
              extractedText: 'Each party agrees to maintain the confidentiality of any proprietary information received from the other party.',
              mitigationOptions: ['Define "confidential information" more precisely', 'Add specific security measures']
            }
          ]
        });
      }
    }, 2000);
  });
};
