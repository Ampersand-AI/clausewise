
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Send, Download, Copy, Check, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type ContractFormProps = {
  onGenerate: (contract: GeneratedContract) => void;
};

export type ContractFormData = {
  gist: string;
  contractType: string;
  party1: {
    name: string;
    address: string;
  };
  party2: {
    name: string;
    address: string;
  };
  termsHighlights: string;
  intensity: 'simple' | 'moderate' | 'watertight';
};

export type GeneratedContract = {
  title: string;
  content: string;
  riskScore: number;
  date: string;
  id: string;
  riskAnalysis: {
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
};

const contractTypes = [
  "Custom Agreement (Describe Below)",
  "Employment Agreement",
  "Non-Disclosure Agreement (NDA)",
  "Service Agreement",
  "SaaS Agreement",
  "Software License Agreement",
  "Consulting Agreement",
  "Independent Contractor Agreement",
  "Equity Vesting Agreement",
  "IP Assignment Agreement",
  "Data Processing Agreement",
  "Terms of Service",
  "Privacy Policy",
  "Joint Venture Agreement",
  "Partnership Agreement",
  "Distribution Agreement",
  "Licensing Agreement",
  "Freelancer Contract"
];

const ContractForm: React.FC<ContractFormProps> = ({ onGenerate }) => {
  const [formData, setFormData] = useState<ContractFormData>({
    gist: '',
    contractType: '',
    party1: {
      name: '',
      address: '',
    },
    party2: {
      name: '',
      address: '',
    },
    termsHighlights: '',
    intensity: 'moderate',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [contract, setContract] = useState<GeneratedContract | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const contractPreviewRef = useRef<HTMLDivElement>(null);

  // Expand preview when contract is generated
  useEffect(() => {
    if (contract) {
      // Scroll to the preview
      if (contractPreviewRef.current) {
        contractPreviewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [contract]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        // Fix the TypeScript error by explicitly typing and handling the nested object
        if (parent === 'party1' || parent === 'party2') {
          return {
            ...prev,
            [parent]: {
              ...prev[parent as keyof typeof prev] as Record<string, string>,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIntensityChange = (value: number) => {
    const intensityMap: Record<number, 'simple' | 'moderate' | 'watertight'> = {
      0: 'simple',
      50: 'moderate',
      100: 'watertight'
    };
    setFormData(prev => ({ ...prev, intensity: intensityMap[value] }));
  };

  const generateContract = async () => {
    if (!formData.contractType || !formData.party1.name || !formData.party2.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // This would be a real API call in production
    setTimeout(() => {
      // Mock contract generation
      const mockContract: GeneratedContract = {
        id: `contract-${Date.now()}`,
        title: `${formData.contractType} between ${formData.party1.name} and ${formData.party2.name}`,
        content: generateMockContractContent(formData),
        riskScore: Math.floor(Math.random() * 50) + 10, // 10-60 range for moderate risk
        date: new Date().toISOString(),
        riskAnalysis: [
          {
            title: 'Term Definition',
            description: 'The contract includes well-defined terms that clearly outline the scope of the agreement.',
            riskLevel: 'low',
          },
          {
            title: 'Payment Terms',
            description: 'Payment terms are somewhat ambiguous and could lead to disputes over timing and amounts.',
            riskLevel: 'medium',
          },
          {
            title: 'Termination Clause',
            description: 'The termination clause is too restrictive for one party and may not be enforceable in some jurisdictions.',
            riskLevel: 'high',
          },
          {
            title: 'Intellectual Property Rights',
            description: 'The IP rights assignment is comprehensive and clearly defined.',
            riskLevel: 'low',
          },
          {
            title: 'Liability Limitations',
            description: 'The liability limitations are properly addressed with clear caps on potential damages.',
            riskLevel: 'low',
          },
        ],
      };

      setContract(mockContract);
      onGenerate(mockContract);
      setIsGenerating(false);

      toast({
        title: "Contract generated",
        description: "Your contract has been successfully created.",
      });
    }, 3000);
  };

  const regenerateContract = () => {
    toast({
      title: "Regenerating contract",
      description: "Creating a new version of your contract...",
    });
    generateContract();
  };

  const handleDownloadPDF = async () => {
    if (!contract) return;
    
    const contractElement = document.getElementById('contract-preview');
    if (!contractElement) return;
    
    toast({
      title: "Preparing document",
      description: "Generating PDF...",
    });
    
    try {
      const canvas = await html2canvas(contractElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${contract.title.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "Download complete",
        description: "Your contract has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadWord = () => {
    if (!contract) return;
    
    toast({
      title: "Preparing document",
      description: "Generating Word document...",
    });
    
    try {
      // Create a blob with the content
      const preface = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${contract.title}</title>
</head>
<body>
<h2>${contract.title}</h2>
`;
      
      const postface = `</body></html>`;
      const fullHtml = preface + contract.content.replace(/\n/g, '<br>') + postface;
      
      const blob = new Blob([fullHtml], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contract.title.replace(/\s+/g, '_')}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete",
        description: "Your contract has been downloaded as a Word document.",
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast({
        title: "Download failed",
        description: "There was an error generating the Word document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyText = () => {
    if (!contract) return;
    
    navigator.clipboard.writeText(contract.content);
    setCopied(true);
    
    toast({
      title: "Text copied",
      description: "Contract text has been copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getIntensityValue = () => {
    const intensityMap: Record<'simple' | 'moderate' | 'watertight', number> = {
      simple: 0,
      moderate: 50,
      watertight: 100
    };
    return intensityMap[formData.intensity] || 50;
  };

  return (
    <div className="w-full max-w-2xl grid grid-cols-1 gap-6">
      {/* Form side */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="contractType">Agreement Type</Label>
          <Select value={formData.contractType} onValueChange={(value) => handleSelectChange('contractType', value)}>
            <SelectTrigger className="w-full bg-orange-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-700">
              <SelectValue placeholder="Select agreement type" />
            </SelectTrigger>
            <SelectContent>
              {contractTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="party1.name">First Party Name</Label>
            <Input
              id="party1.name"
              name="party1.name"
              placeholder="Enter name of first party"
              value={formData.party1.name}
              onChange={handleChange}
              className="bg-orange-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="party1.address">First Party Address (Optional)</Label>
            <Input
              id="party1.address"
              name="party1.address"
              placeholder="Enter address of first party"
              value={formData.party1.address}
              onChange={handleChange}
              className="bg-orange-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-700"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="party2.name">Second Party Name</Label>
            <Input
              id="party2.name"
              name="party2.name"
              placeholder="Enter name of second party"
              value={formData.party2.name}
              onChange={handleChange}
              className="bg-orange-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="party2.address">Second Party Address (Optional)</Label>
            <Input
              id="party2.address"
              name="party2.address"
              placeholder="Enter address of second party"
              value={formData.party2.address}
              onChange={handleChange}
              className="bg-orange-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-700"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gist">Description or Requirements</Label>
          <Textarea
            id="gist"
            name="gist"
            placeholder="Describe key requirements for this agreement. For custom agreements, please provide detailed information."
            value={formData.gist}
            onChange={handleChange}
            className="min-h-[100px] bg-orange-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="termsHighlights">Specific Terms to Include (Optional)</Label>
          <Textarea
            id="termsHighlights"
            name="termsHighlights"
            placeholder="List any specific terms, clauses, or points you want to include in this agreement..."
            value={formData.termsHighlights}
            onChange={handleChange}
            className="min-h-[80px] bg-orange-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Contract Thoroughness: {formData.intensity.charAt(0).toUpperCase() + formData.intensity.slice(1)}</Label>
          <Slider
            value={[getIntensityValue()]}
            min={0}
            max={100}
            step={50}
            onValueChange={(value) => handleIntensityChange(value[0])}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-amber-600 dark:text-amber-400 pt-1">
            <span>Simple</span>
            <span>Moderate</span>
            <span>Watertight</span>
          </div>
        </div>
        
        <Button 
          onClick={generateContract}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
        >
          {isGenerating ? (
            <>Generating... <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /></>
          ) : (
            <><FileText className="h-4 w-4 mr-2" /> Generate Contract</>
          )}
        </Button>
      </div>
      
      {/* Preview side */}
      <div ref={contractPreviewRef} className={`space-y-4 transition-all duration-500 ${contract ? 'col-span-1 md:col-span-1' : ''}`}>
        <div className={`relative overflow-auto ${contract ? 'h-[500px]' : 'h-[400px]'} border border-amber-200 rounded-lg p-4 bg-white dark:bg-amber-900/10 dark:border-amber-700 text-sm`}>
          {contract ? (
            <div id="contract-preview">
              <h2 className="text-lg font-bold mb-4">{contract.title}</h2>
              <div className="whitespace-pre-line">{contract.content}</div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-amber-500">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Contract preview will appear here</p>
                {isGenerating && (
                  <div className="mt-4">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-4 text-amber-600">Generating a comprehensive legal agreement...</p>
                    <p className="mt-2 text-amber-500 text-xs">This may take a few moments</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {contract && (
          <>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={regenerateContract}
                className="flex-1 border border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
              </Button>
              <Button 
                variant="outline"
                onClick={handleDownloadPDF}
                className="flex-1 border border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
              >
                <Download className="h-4 w-4 mr-1" /> PDF
              </Button>
              <Button 
                variant="outline"
                onClick={handleDownloadWord}
                className="flex-1 border border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
              >
                <Download className="h-4 w-4 mr-1" /> Word
              </Button>
              <Button 
                variant="outline"
                onClick={handleCopyText}
                className="border border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Risk Analysis</h3>
              {contract.riskAnalysis.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg text-sm ${
                    item.riskLevel === 'low' 
                      ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                      : item.riskLevel === 'medium'
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                      : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}
                >
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-xs mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper function to generate mock contract content based on form data
function generateMockContractContent(formData: ContractFormData): string {
  const { contractType, party1, party2, intensity, gist, termsHighlights } = formData;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  let content = `${contractType.toUpperCase()}\n\nThis Agreement (the "Agreement") is made and entered into as of ${today}, by and between:\n\n`;
  
  // Add party details with blank placeholders for missing addresses
  content += `${party1.name} ${party1.address ? `with an address at ${party1.address}` : "(with an address at ___________________)"} (hereinafter referred to as "Party A")\n\nand\n\n`;
  content += `${party2.name} ${party2.address ? `with an address at ${party2.address}` : "(with an address at ___________________)"} (hereinafter referred to as "Party B")\n\n`;
  
  content += `WHEREAS, the parties wish to enter into this Agreement to define their respective rights and obligations;\n\n`;
  
  if (gist) {
    content += `WHEREAS, ${gist};\n\n`;
  }
  
  content += `NOW, THEREFORE, in consideration of the mutual covenants, terms, and conditions set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:\n\n`;
  
  // Add clauses based on contract type and intensity
  content += `1. DEFINITIONS\n\n`;
  content += `   1.1. "Effective Date" means ${today}.\n`;
  
  if (contractType.includes('Employment')) {
    content += `   1.2. "Employment Period" means the period of the Party B's employment under this Agreement.\n`;
    content += `   1.3. "Confidential Information" means all non-public, proprietary information relating to the Party A, whether oral, written, or in electronic form, including but not limited to business plans, customer lists, financial information, marketing strategies, and trade secrets.\n`;
    content += `   1.4. "Intellectual Property" means all patents, trademarks, copyrights, trade secrets, and other intellectual property rights owned by or licensed to Party A.\n\n`;
    
    content += `2. EMPLOYMENT\n\n`;
    content += `   2.1. Party A hereby employs Party B, and Party B hereby accepts employment with Party A, subject to the terms and conditions set forth in this Agreement.\n`;
    content += `   2.2. Party B shall serve as [Job Title] and shall perform duties as assigned by Party A from time to time.\n`;
    content += `   2.3. Party B shall devote full business time, attention, and efforts to the performance of duties and responsibilities for Party A.\n\n`;
    
    content += `3. COMPENSATION\n\n`;
    content += `   3.1. Base Salary. Party A shall pay Party B an annual base salary of $________, payable in accordance with Party A's regular payroll practices.\n`;
    content += `   3.2. Benefits. Party B shall be eligible to participate in the employee benefit plans and programs maintained by Party A for its employees, subject to the terms and conditions of such plans and programs.\n`;
    content += `   3.3. Equity. Party B may be eligible to receive equity grants in the form of stock options or restricted stock units, subject to approval by Party A's Board of Directors.\n\n`;
    
    content += `4. TERM AND TERMINATION\n\n`;
    content += `   4.1. This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with the provisions of this Agreement.\n`;
    content += `   4.2. Party A may terminate Party B's employment at any time, with or without Cause (as defined below).\n`;
    content += `   4.3. Party B may terminate employment at any time, with or without Good Reason (as defined below), by giving Party A not less than __ days' prior written notice.\n`;
    content += `   4.4. "Cause" shall mean: (a) Party B's material breach of this Agreement; (b) Party B's conviction of, or plea of guilty or nolo contendere to, a felony; (c) Party B's willful misconduct or gross negligence in the performance of duties; or (d) Party B's fraud, embezzlement, or misappropriation relating to Party A.\n`;
    content += `   4.5. "Good Reason" shall mean: (a) a material diminution in Party B's base salary; (b) a material diminution in Party B's authority, duties, or responsibilities; or (c) any action or inaction that constitutes a material breach by Party A of this Agreement.\n\n`;
  } else if (contractType.includes('NDA') || contractType.includes('Non-Disclosure')) {
    content += `   1.2. "Confidential Information" means all non-public, proprietary information relating to the Disclosing Party (the party disclosing Confidential Information), whether oral, written, or in electronic form.\n`;
    content += `   1.3. "Disclosing Party" means the party disclosing Confidential Information.\n`;
    content += `   1.4. "Receiving Party" means the party receiving Confidential Information.\n\n`;
    
    content += `2. CONFIDENTIALITY OBLIGATIONS\n\n`;
    content += `   2.1. The Receiving Party shall maintain the confidentiality of all Confidential Information received from the Disclosing Party.\n`;
    content += `   2.2. The Receiving Party shall use Confidential Information solely for the purpose of [business purpose].\n`;
    content += `   2.3. The Receiving Party shall not disclose any Confidential Information to any third party without the prior written consent of the Disclosing Party.\n`;
    content += `   2.4. The Receiving Party shall protect Confidential Information with at least the same degree of care that it uses to protect its own confidential information, but in no case less than reasonable care.\n\n`;
    
    content += `3. EXCLUSIONS\n\n`;
    content += `   3.1. The obligations under this Agreement shall not apply to information that:\n`;
    content += `      (a) is or becomes publicly available through no fault of the Receiving Party;\n`;
    content += `      (b) was in the Receiving Party's possession prior to receipt from the Disclosing Party;\n`;
    content += `      (c) is independently developed by the Receiving Party without use of Confidential Information;\n`;
    content += `      (d) is obtained by the Receiving Party from a third party without restriction on disclosure; or\n`;
    content += `      (e) is required to be disclosed by law, provided that the Receiving Party gives the Disclosing Party prompt notice of such requirement.\n\n`;
    
    content += `4. TERM AND TERMINATION\n\n`;
    content += `   4.1. This Agreement shall commence on the Effective Date and shall continue for a period of [Term] years.\n`;
    content += `   4.2. The obligations under this Agreement shall survive any termination or expiration of this Agreement for a period of [Survival Period] years.\n\n`;
  } else if (contractType.includes('Service')) {
    content += `   1.2. "Services" means the services to be provided by Party B as described in Exhibit A attached hereto.\n`;
    content += `   1.3. "Deliverables" means the deliverables to be provided by Party B as described in Exhibit A attached hereto.\n`;
    content += `   1.4. "Fees" means the fees to be paid by Party A to Party B for the Services as described in Exhibit A attached hereto.\n\n`;
    
    content += `2. SERVICES\n\n`;
    content += `   2.1. Party B shall provide the Services to Party A in accordance with the terms and conditions of this Agreement and Exhibit A.\n`;
    content += `   2.2. Party B shall perform the Services in a professional manner, with the level of skill and care generally exercised by other professionals in performing services of a similar nature.\n`;
    content += `   2.3. Party B shall provide the Deliverables to Party A in accordance with the schedule set forth in Exhibit A.\n\n`;
    
    content += `3. FEES AND PAYMENT\n\n`;
    content += `   3.1. Party A shall pay Party B the Fees for the Services in accordance with the payment schedule set forth in Exhibit A.\n`;
    content += `   3.2. Party B shall submit invoices to Party A for the Fees, and Party A shall pay such invoices within [Payment Term] days of receipt.\n`;
    content += `   3.3. All amounts payable under this Agreement are exclusive of applicable taxes, which shall be the responsibility of Party A.\n\n`;
    
    content += `4. TERM AND TERMINATION\n\n`;
    content += `   4.1. This Agreement shall commence on the Effective Date and shall continue until the Services are completed, unless earlier terminated in accordance with the provisions of this Agreement.\n`;
    content += `   4.2. Either party may terminate this Agreement upon written notice to the other party if the other party materially breaches this Agreement and fails to cure such breach within [Cure Period] days of receipt of such notice.\n`;
    content += `   4.3. Upon termination, Party A shall pay Party B for all Services performed and Deliverables provided up to the date of termination.\n\n`;
  } else {
    content += `   1.2. "Business Purpose" means ${gist || '[describe business purpose]'}.\n`;
    content += `   1.3. Additional terms may be defined within the body of this Agreement.\n\n`;
    
    content += `2. PURPOSE AND SCOPE\n\n`;
    content += `   2.1. The parties enter into this Agreement for the purpose of ${gist || '[describe purpose]'}.\n`;
    content += `   2.2. The scope of this Agreement includes ${gist || '[describe scope]'}.\n\n`;
    
    content += `3. TERM\n\n`;
    if (intensity === 'simple') {
      content += `   3.1. This Agreement shall commence on the Effective Date and continue until terminated by either party with 30 days' written notice.\n\n`;
    } else if (intensity === 'moderate') {
      content += `   3.1. This Agreement shall commence on the Effective Date and continue for a period of one (1) year thereafter (the "Initial Term"), unless earlier terminated in accordance with Section 9.\n`;
      content += `   3.2. Upon expiration of the Initial Term, this Agreement shall automatically renew for successive one-year terms (each, a "Renewal Term") unless either party provides written notice of non-renewal at least 60 days prior to the end of the then-current term.\n`;
      content += `   3.3. The Initial Term and all Renewal Terms shall collectively be referred to as the "Term."\n\n`;
    } else {
      content += `   3.1. This Agreement shall commence on the Effective Date and continue for an initial period of three (3) years thereafter (the "Initial Term"), unless earlier terminated pursuant to Section 9.\n`;
      content += `   3.2. Following the Initial Term, this Agreement shall automatically renew for successive two-year terms (each, a "Renewal Term"), unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the Initial Term or any Renewal Term.\n`;
      content += `   3.3. The Initial Term and all Renewal Terms shall collectively be referred to as the "Term."\n\n`;
    }
  }
  
  content += `5. CONFIDENTIALITY\n\n`;
  content += `   5.1. Each party shall maintain the confidentiality of all proprietary or confidential information disclosed to it by the other party.\n`;
  content += `   5.2. Each party shall use the confidential information solely for the purpose of performing its obligations under this Agreement.\n`;
  content += `   5.3. Each party shall protect confidential information with at least the same degree of care that it uses to protect its own confidential information, but in no case less than reasonable care.\n\n`;
  
  content += `6. INTELLECTUAL PROPERTY\n\n`;
  content += `   6.1. All intellectual property rights owned by a party prior to the Effective Date shall remain the sole property of that party.\n`;
  content += `   6.2. All intellectual property rights arising out of or in connection with this Agreement shall be owned by Party A, and Party B hereby assigns all such rights to Party A.\n`;
  content += `   6.3. Party B shall execute all documents and take all actions necessary to perfect Party A's ownership of intellectual property rights.\n\n`;
  
  // Add more clauses based on intensity
  if (intensity === 'moderate' || intensity === 'watertight') {
    content += `7. REPRESENTATIONS AND WARRANTIES\n\n`;
    content += `   7.1. Each party represents and warrants that:\n`;
    content += `      (a) it has the full right and authority to enter into and perform this Agreement;\n`;
    content += `      (b) its performance under this Agreement will not conflict with any other obligation; and\n`;
    content += `      (c) it will comply with all applicable laws and regulations in performing its obligations under this Agreement.\n\n`;
    
    content += `8. LIMITATION OF LIABILITY\n\n`;
    content += `   8.1. NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT.\n`;
    content += `   8.2. EACH PARTY'S TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE FEES PAID OR PAYABLE UNDER THIS AGREEMENT.\n`;
    content += `   8.3. The limitations of liability in this Section shall not apply to:\n`;
    content += `      (a) breaches of confidentiality obligations;\n`;
    content += `      (b) intellectual property infringement claims;\n`;
    content += `      (c) indemnification obligations; or\n`;
    content += `      (d) willful misconduct or gross negligence.\n\n`;
  }
  
  if (intensity === 'watertight') {
    content += `9. INDEMNIFICATION\n\n`;
    content += `   9.1. Each party shall indemnify, defend, and hold harmless the other party from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:\n`;
    content += `      (a) the indemnifying party's breach of this Agreement;\n`;
    content += `      (b) the indemnifying party's negligence or willful misconduct; or\n`;
    content += `      (c) the indemnifying party's violation of applicable laws or regulations.\n`;
    content += `   9.2. The indemnified party shall: (a) promptly notify the indemnifying party of any claim; (b) give the indemnifying party sole control of the defense and settlement of the claim; and (c) provide reasonable cooperation to the indemnifying party.\n\n`;
    
    content += `10. DISPUTE RESOLUTION\n\n`;
    content += `    10.1. The parties shall attempt to resolve any dispute arising out of or related to this Agreement through good faith negotiations.\n`;
    content += `    10.2. If the parties are unable to resolve the dispute through negotiations within 30 days, the dispute shall be submitted to mediation in accordance with the rules of the American Arbitration Association.\n`;
    content += `    10.3. If the dispute is not resolved through mediation within 60 days, the dispute shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.\n`;
    content += `    10.4. The arbitration shall be conducted by a single arbitrator in [Arbitration Location], and the decision of the arbitrator shall be final and binding on the parties.\n`;
    content += `    10.5. Each party shall bear its own costs and expenses, including attorneys' fees, in connection with the arbitration.\n\n`;
    
    content += `11. GOVERNING LAW AND JURISDICTION\n\n`;
    content += `    11.1. This Agreement shall be governed by and construed in accordance with the laws of the State of [State], without regard to its conflict of laws principles.\n`;
    content += `    11.2. The parties hereby submit to the exclusive jurisdiction of the state and federal courts located in [County], [State] for any action or proceeding that is not subject to arbitration.\n\n`;
    
    content += `12. FORCE MAJEURE\n\n`;
    content += `    12.1. Neither party shall be liable for any failure or delay in performance of its obligations under this Agreement to the extent such failure or delay is caused by a force majeure event.\n`;
    content += `    12.2. A "force majeure event" means any event beyond the reasonable control of the affected party, including but not limited to acts of God, war, terrorism, civil unrest, fire, flood, earthquake, pandemic, epidemic, or governmental action.\n`;
    content += `    12.3. The affected party shall promptly notify the other party of the force majeure event and shall use reasonable efforts to resume performance as soon as possible.\n`;
    content += `    12.4. If a force majeure event continues for more than 90 days, either party may terminate this Agreement upon written notice to the other party.\n\n`;
  }
  
  // Add miscellaneous section
  content += `${intensity === 'watertight' ? '13' : intensity === 'moderate' ? '10' : '7'}. MISCELLANEOUS\n\n`;
  content += `    ${intensity === 'watertight' ? '13.1' : intensity === 'moderate' ? '10.1' : '7.1'}. Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether oral or written.\n\n`;
  content += `    ${intensity === 'watertight' ? '13.2' : intensity === 'moderate' ? '10.2' : '7.2'}. Amendment. This Agreement may only be amended by a written instrument executed by both parties.\n\n`;
  content += `    ${intensity === 'watertight' ? '13.3' : intensity === 'moderate' ? '10.3' : '7.3'}. Assignment. Neither party may assign this Agreement without the prior written consent of the other party.\n\n`;
  content += `    ${intensity === 'watertight' ? '13.4' : intensity === 'moderate' ? '10.4' : '7.4'}. Severability. If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.\n\n`;
  content += `    ${intensity === 'watertight' ? '13.5' : intensity === 'moderate' ? '10.5' : '7.5'}. Waiver. The failure of either party to enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision.\n\n`;
  content += `    ${intensity === 'watertight' ? '13.6' : intensity === 'moderate' ? '10.6' : '7.6'}. Notices. All notices under this Agreement shall be in writing and shall be delivered by hand, certified mail, or email to the addresses specified by the parties.\n\n`;
  content += `    ${intensity === 'watertight' ? '13.7' : intensity === 'moderate' ? '10.7' : '7.7'}. Relationship of Parties. The parties are independent contractors, and nothing in this Agreement shall be construed as creating a partnership, joint venture, agency, or employment relationship.\n\n`;
  content += `    ${intensity === 'watertight' ? '13.8' : intensity === 'moderate' ? '10.8' : '7.8'}. Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.\n\n`;
  
  // Add specific terms if provided
  if (termsHighlights) {
    content += `ADDITIONAL TERMS:\n\n${termsHighlights}\n\n`;
  }
  
  content += `IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.\n\n`;
  content += `${party1.name.toUpperCase()}\n\n`;
  content += `By: ________________________\nName: [Authorized Representative]\nTitle: [Title]\nDate: ${today}\n\n`;
  content += `${party2.name.toUpperCase()}\n\n`;
  content += `By: ________________________\nName: [Authorized Representative]\nTitle: [Title]\nDate: ${today}`;
  
  return content;
}

export default ContractForm;
