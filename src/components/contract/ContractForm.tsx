
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Send, Download, Copy, Check } from "lucide-react";
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
  party1: string;
  party2: string;
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
  "Employment Agreement",
  "Non-Disclosure Agreement (NDA)",
  "Service Agreement",
  "Sales Contract",
  "Lease Agreement",
  "Partnership Agreement",
  "Consulting Agreement",
  "Distribution Agreement",
  "Licensing Agreement",
  "Freelancer Contract"
];

const ContractForm: React.FC<ContractFormProps> = ({ onGenerate }) => {
  const [formData, setFormData] = useState<ContractFormData>({
    gist: '',
    contractType: '',
    party1: '',
    party2: '',
    termsHighlights: '',
    intensity: 'moderate',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [contract, setContract] = useState<GeneratedContract | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.gist || !formData.contractType || !formData.party1 || !formData.party2) {
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
        title: `${formData.contractType} between ${formData.party1} and ${formData.party2}`,
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
      const blob = new Blob([contract.content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contract.title.replace(/\s+/g, '_')}.docx`;
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
    <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form side */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="contractType">Contract Type</Label>
          <Select value={formData.contractType} onValueChange={(value) => handleSelectChange('contractType', value)}>
            <SelectTrigger className="w-full bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700">
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              {contractTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="party1">First Party</Label>
          <Input
            id="party1"
            name="party1"
            placeholder="Enter name of first party"
            value={formData.party1}
            onChange={handleChange}
            className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
          />
        </div>
        
        <div>
          <Label htmlFor="party2">Second Party</Label>
          <Input
            id="party2"
            name="party2"
            placeholder="Enter name of second party"
            value={formData.party2}
            onChange={handleChange}
            className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
          />
        </div>
        
        <div>
          <Label htmlFor="gist">Contract Description</Label>
          <Textarea
            id="gist"
            name="gist"
            placeholder="Briefly describe what this contract should cover..."
            value={formData.gist}
            onChange={handleChange}
            className="min-h-[100px] bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
          />
        </div>
        
        <div>
          <Label htmlFor="termsHighlights">Key Terms (Optional)</Label>
          <Textarea
            id="termsHighlights"
            name="termsHighlights"
            placeholder="List any specific terms you want to include..."
            value={formData.termsHighlights}
            onChange={handleChange}
            className="min-h-[80px] bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Contract Intensity: {formData.intensity.charAt(0).toUpperCase() + formData.intensity.slice(1)}</Label>
          <Slider
            value={[getIntensityValue()]}
            min={0}
            max={100}
            step={50}
            onValueChange={(value) => handleIntensityChange(value[0])}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-bento-gray-500 dark:text-bento-gray-400 pt-1">
            <span>Simple</span>
            <span>Moderate</span>
            <span>Watertight</span>
          </div>
        </div>
        
        <Button 
          onClick={generateContract}
          disabled={isGenerating}
          className="w-full bg-lovable-gradient hover:bg-lovable-gradient-hover text-white"
        >
          {isGenerating ? (
            <>Generating... <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /></>
          ) : (
            <><FileText className="h-4 w-4 mr-2" /> Generate Contract</>
          )}
        </Button>
      </div>
      
      {/* Preview side */}
      <div className="space-y-4">
        <div className="relative overflow-auto h-[400px] border border-bento-gray-200 rounded-lg p-4 bg-white dark:bg-bento-gray-800 dark:border-bento-gray-700 text-sm">
          {contract ? (
            <div id="contract-preview">
              <h2 className="text-lg font-bold mb-4">{contract.title}</h2>
              <div className="whitespace-pre-line">{contract.content}</div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-bento-gray-400">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>Contract preview will appear here</p>
              </div>
            </div>
          )}
        </div>
        
        {contract && (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex-1 border border-bento-gray-200 dark:border-bento-gray-700"
            >
              <Download className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownloadWord}
              className="flex-1 border border-bento-gray-200 dark:border-bento-gray-700"
            >
              <Download className="h-4 w-4 mr-1" /> Word
            </Button>
            <Button 
              variant="outline"
              onClick={handleCopyText}
              className="border border-bento-gray-200 dark:border-bento-gray-700"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
        
        {contract && (
          <div className="space-y-3">
            <h3 className="font-medium">Risk Analysis</h3>
            {contract.riskAnalysis.map((item, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg text-sm ${
                  item.riskLevel === 'low' 
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                    : item.riskLevel === 'medium'
                    ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-xs mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate mock contract content based on form data
function generateMockContractContent(formData: ContractFormData): string {
  const { contractType, party1, party2, intensity } = formData;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  let content = `${contractType.toUpperCase()}\n\nThis Agreement (the "Agreement") is made and entered into as of ${today}, by and between ${party1} ("Party A") and ${party2} ("Party B").\n\n`;
  
  // Add clauses based on contract type and intensity
  content += `1. PURPOSE AND SCOPE\n`;
  
  if (contractType.includes('Employment')) {
    content += `Party A agrees to employ Party B in the position of [Job Title], and Party B accepts such employment, subject to the terms and conditions of this Agreement.\n\n`;
  } else if (contractType.includes('NDA')) {
    content += `The parties wish to exchange confidential information for the purpose of [business purpose]. This Agreement sets forth the terms and conditions under which such exchange shall occur and such information shall be protected.\n\n`;
  } else {
    content += `The purpose of this Agreement is to establish the terms and conditions under which the parties will [describe purpose].\n\n`;
  }
  
  content += `2. TERM\n`;
  if (intensity === 'simple') {
    content += `This Agreement shall commence on [Start Date] and continue until terminated by either party with 30 days' written notice.\n\n`;
  } else if (intensity === 'moderate') {
    content += `This Agreement shall commence on [Start Date] and continue for a period of one (1) year thereafter, unless earlier terminated in accordance with Section 8. Upon expiration, this Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least 60 days prior to the end of the then-current term.\n\n`;
  } else {
    content += `This Agreement shall commence on [Start Date] (the "Effective Date") and continue for an initial period of three (3) years thereafter (the "Initial Term"), unless earlier terminated pursuant to Section 8. Following the Initial Term, this Agreement shall automatically renew for successive two-year terms (each, a "Renewal Term"), unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the Initial Term or any Renewal Term. The Initial Term and all Renewal Terms shall collectively be referred to as the "Term."\n\n`;
  }
  
  content += `3. COMPENSATION\n`;
  content += `[Details of payment, fees, or other consideration]\n\n`;
  
  content += `4. RESPONSIBILITIES\n`;
  content += `[Outline of the parties' respective obligations and responsibilities]\n\n`;
  
  // Add more clauses based on intensity
  if (intensity === 'moderate' || intensity === 'watertight') {
    content += `5. CONFIDENTIALITY\n`;
    content += `Both parties shall maintain the confidentiality of all proprietary or confidential information disclosed to it by the other party.\n\n`;
    
    content += `6. INTELLECTUAL PROPERTY\n`;
    content += `All intellectual property rights shall remain with their respective owners.\n\n`;
  }
  
  if (intensity === 'watertight') {
    content += `7. REPRESENTATIONS AND WARRANTIES\n`;
    content += `Each party represents and warrants that it has the full right and authority to enter into and perform this Agreement.\n\n`;
    
    content += `8. LIMITATION OF LIABILITY\n`;
    content += `Neither party shall be liable for any indirect, incidental, special, consequential or punitive damages.\n\n`;
    
    content += `9. INDEMNIFICATION\n`;
    content += `Each party shall indemnify and hold harmless the other party from and against any and all claims, damages, liabilities, costs, and expenses.\n\n`;
    
    content += `10. GOVERNING LAW AND DISPUTE RESOLUTION\n`;
    content += `This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any dispute arising out of or in connection with this Agreement shall be resolved through arbitration.\n\n`;
  }
  
  content += `IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.\n\n`;
  content += `${party1.toUpperCase()}\n\n`;
  content += `By: ________________________\nName: [Authorized Representative]\nTitle: [Title]\n\n`;
  content += `${party2.toUpperCase()}\n\n`;
  content += `By: ________________________\nName: [Authorized Representative]\nTitle: [Title]`;
  
  return content;
}

export default ContractForm;
