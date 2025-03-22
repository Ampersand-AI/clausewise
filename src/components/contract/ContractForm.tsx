
import React, { useState } from 'react';
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
import { Progress } from "@/components/ui/progress";

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
  "Employment Agreement",
  "Non-Disclosure Agreement (NDA)",
  "Service Agreement",
  "Sales Contract",
  "Lease Agreement",
  "Partnership Agreement",
  "Consulting Agreement",
  "Distribution Agreement",
  "Licensing Agreement",
  "Software License Agreement",
  "Freelancer Contract",
  "Equity Vesting Agreement",
  "Intellectual Property Assignment",
  "Co-Founder Agreement",
  "Stock Option Agreement",
  "Investment Agreement",
  "Terms of Service",
  "Privacy Policy",
  "Data Processing Agreement",
  "SAAS Agreement"
];

const ContractForm: React.FC<ContractFormProps> = ({ onGenerate }) => {
  const [formData, setFormData] = useState<ContractFormData>({
    gist: '',
    contractType: '',
    party1: {
      name: '',
      address: ''
    },
    party2: {
      name: '',
      address: ''
    },
    termsHighlights: '',
    intensity: 'moderate',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [contract, setContract] = useState<GeneratedContract | null>(null);
  const [copied, setCopied] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [expandedPreview, setExpandedPreview] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev, 
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value 
        }
      }));
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
    if (!formData.gist || !formData.contractType || !formData.party1.name || !formData.party2.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Start the progress animation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    // This would be a real API call in production
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Mock contract generation with more detailed content
      const mockContract: GeneratedContract = {
        id: `contract-${Date.now()}`,
        title: `${formData.contractType} between ${formData.party1.name} and ${formData.party2.name}`,
        content: generateMockContractContent(formData),
        riskScore: Math.floor(Math.random() * 50) + 10, // 10-60 range for moderate risk
        date: new Date().toISOString(),
        riskAnalysis: generateMockRiskAnalysis(formData),
      };

      setContract(mockContract);
      onGenerate(mockContract);
      setIsGenerating(false);
      setExpandedPreview(true);

      toast({
        title: "Contract generated",
        description: "Your contract has been successfully created.",
      });
    }, 3000);
  };

  const regenerateContract = () => {
    if (contract) {
      generateContract();
      
      toast({
        title: "Regenerating contract",
        description: "Creating a new version of your contract...",
      });
    }
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

  const toggleExpandPreview = () => {
    setExpandedPreview(!expandedPreview);
  };

  return (
    <div className={`w-full max-w-4xl grid grid-cols-1 ${expandedPreview ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
      {/* Form side */}
      <div className={`space-y-4 ${expandedPreview ? 'col-span-1' : 'md:col-span-1'}`}>
        <div>
          <Label htmlFor="contractType">Contract Type</Label>
          <Select value={formData.contractType} onValueChange={(value) => handleSelectChange('contractType', value)}>
            <SelectTrigger className="w-full bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700">
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
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
              className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="party1.address">First Party Address (Optional)</Label>
            <Input
              id="party1.address"
              name="party1.address"
              placeholder="Enter address or leave blank"
              value={formData.party1.address}
              onChange={handleChange}
              className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
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
              className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="party2.address">Second Party Address (Optional)</Label>
            <Input
              id="party2.address"
              name="party2.address"
              placeholder="Enter address or leave blank"
              value={formData.party2.address}
              onChange={handleChange}
              className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
            />
          </div>
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
          className="w-full bg-gradient-to-r from-bento-yellow-500 via-bento-orange-500 to-bento-brown-600 hover:from-bento-yellow-600 hover:via-bento-orange-600 hover:to-bento-brown-700 text-white"
        >
          {isGenerating ? (
            <>Generating... <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /></>
          ) : (
            <><FileText className="h-4 w-4 mr-2" /> Generate Contract</>
          )}
        </Button>
      </div>
      
      {/* Preview side */}
      <div className={`space-y-4 ${expandedPreview ? 'col-span-2' : 'md:col-span-1'}`}>
        {isGenerating && (
          <div className="relative w-full mb-2">
            <Progress value={generationProgress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground text-center mt-1">Generating your contract...</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Contract Preview</h3>
          {contract && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleExpandPreview} 
              className="text-xs"
            >
              {expandedPreview ? "Reduce preview" : "Expand preview"}
            </Button>
          )}
        </div>
        
        <div className="relative overflow-auto h-[500px] border border-bento-gray-200 rounded-lg p-4 bg-white dark:bg-bento-gray-800 dark:border-bento-gray-700 text-sm">
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
          <div className="flex flex-wrap gap-2">
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
            <Button 
              variant="outline"
              onClick={regenerateContract}
              className="border border-bento-gray-200 dark:border-bento-gray-700"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
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

// Helper function to generate more detailed contract content based on form data
function generateMockContractContent(formData: ContractFormData): string {
  const { contractType, party1, party2, intensity } = formData;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Format addresses with placeholders if empty
  const party1Address = party1.address.trim() || "___________________________";
  const party2Address = party2.address.trim() || "___________________________";
  
  let content = `${contractType.toUpperCase()}\n\nThis Agreement (the "Agreement") is made and entered into as of ${today}, by and between ${party1.name} ("Party A"), located at ${party1Address}, and ${party2.name} ("Party B"), located at ${party2Address}.\n\n`;
  
  // Add clauses based on contract type and intensity with more detailed content
  content += `1. PURPOSE AND SCOPE\n`;
  
  if (contractType.includes('Employment')) {
    content += `Party A agrees to employ Party B in the position of [Job Title], and Party B accepts such employment, subject to the terms and conditions of this Agreement. Party B shall perform duties as described in Exhibit A attached hereto and such other duties as may be assigned from time to time by Party A.\n\n`;
    
    content += `2. TERM AND TERMINATION\n`;
    if (intensity === 'simple') {
      content += `This Agreement shall commence on [Start Date] and continue until terminated by either party with 30 days' written notice.\n\n`;
    } else if (intensity === 'moderate') {
      content += `This Agreement shall commence on [Start Date] and continue for a period of one (1) year thereafter (the "Initial Term"), unless earlier terminated in accordance with Section 8. Upon expiration of the Initial Term, this Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least 60 days prior to the end of the then-current term.\n\n`;
    } else {
      content += `This Agreement shall commence on [Start Date] (the "Effective Date") and continue for an initial period of three (3) years thereafter (the "Initial Term"), unless earlier terminated pursuant to Section 8. Following the Initial Term, this Agreement shall automatically renew for successive two-year terms (each, a "Renewal Term"), unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the Initial Term or any Renewal Term. The Initial Term and all Renewal Terms shall collectively be referred to as the "Term."\n\n
      8. TERMINATION\n
      8.1 Termination for Convenience. Either party may terminate this Agreement for any reason upon ninety (90) days' prior written notice to the other party.\n
      8.2 Termination for Cause. Either party may terminate this Agreement immediately upon written notice if the other party: (a) commits a material breach of this Agreement that is not cured within thirty (30) days after receipt of written notice of such breach; (b) becomes insolvent or files for bankruptcy; or (c) violates any applicable law in connection with its performance under this Agreement.\n
      8.3 Effect of Termination. Upon termination of this Agreement for any reason: (a) Party B shall immediately cease all work under this Agreement; (b) Party A shall pay Party B for all services properly performed up to the effective date of termination; and (c) each party shall return or destroy all Confidential Information of the other party in its possession.\n\n`;
    }
    
    content += `3. COMPENSATION AND BENEFITS\n`;
    content += `3.1 Base Salary. Party A shall pay Party B a base salary of $[Amount] per [year/month], payable in accordance with Party A's standard payroll practices.\n
    3.2 Bonuses. Party B may be eligible to receive bonuses as determined by Party A in its sole discretion.\n
    3.3 Benefits. Party B shall be entitled to participate in all employee benefit plans and programs offered by Party A to its employees, subject to the terms and conditions of such plans and programs.\n
    3.4 Expenses. Party A shall reimburse Party B for all reasonable business expenses incurred in connection with the performance of Party B's duties, subject to Party A's expense reimbursement policies.\n\n`;
    
    content += `4. DUTIES AND RESPONSIBILITIES\n`;
    content += `4.1 Duties. Party B shall perform the duties and responsibilities as outlined in Job Description attached as Exhibit A, as well as any other duties reasonably assigned by Party A.\n
    4.2 Performance Standard. Party B shall perform all duties and responsibilities in a professional manner and in accordance with all reasonable standards, policies, and guidelines established by Party A.\n
    4.3 Work Schedule. Party B shall work [full-time/part-time] and shall devote [number] hours per week to the performance of duties for Party A.\n
    4.4 Location. Party B shall primarily perform duties at [location], with occasional travel as required.\n\n`;
    
    if (intensity === 'moderate' || intensity === 'watertight') {
      content += `5. CONFIDENTIALITY\n`;
      content += `5.1 Definition. "Confidential Information" means all non-public information, in any form, related to the business, operations, products, services, or technology of Party A, including but not limited to business plans, financial information, customer information, marketing strategies, proprietary software, trade secrets, and any other information that would reasonably be considered confidential.\n
      5.2 Obligations. Party B shall: (a) maintain the confidentiality of all Confidential Information; (b) not disclose Confidential Information to any third party without Party A's prior written consent; (c) use Confidential Information solely for the purpose of performing duties under this Agreement; and (d) return or destroy all Confidential Information upon termination of this Agreement or upon Party A's request.\n
      5.3 Exceptions. The obligations in Section 5.2 shall not apply to information that: (a) is or becomes publicly available through no fault of Party B; (b) was known to Party B prior to disclosure by Party A; (c) is independently developed by Party B without use of Confidential Information; or (d) is required to be disclosed by law or court order, provided that Party B gives Party A prompt notice of such requirement.\n\n`;
      
      content += `6. INTELLECTUAL PROPERTY\n`;
      content += `6.1 Work Product. Party B acknowledges and agrees that all work product, including but not limited to inventions, discoveries, developments, improvements, works of authorship, and ideas, whether or not patentable or copyrightable, that are conceived, created, developed, or reduced to practice by Party B, either alone or with others, during the term of this Agreement and in connection with Party B's employment with Party A (collectively, "Work Product"), shall be the sole and exclusive property of Party A.\n
      6.2 Assignment. Party B hereby irrevocably assigns to Party A all right, title, and interest in and to the Work Product, including all intellectual property rights therein.\n
      6.3 Waiver of Moral Rights. Party B hereby waives any and all moral rights in the Work Product, including but not limited to the right to be identified as the author and the right to object to derogatory treatment of the Work Product.\n
      6.4 Assistance. Party B shall assist Party A, at Party A's expense, in obtaining and enforcing intellectual property rights in the Work Product, including executing any documents that Party A may reasonably request.\n\n`;
    }
    
    if (intensity === 'watertight') {
      content += `7. NON-COMPETITION AND NON-SOLICITATION\n`;
      content += `7.1 Non-Competition. During the term of this Agreement and for a period of [time period] thereafter, Party B shall not, directly or indirectly, engage in or have any interest in any business that competes with Party A's business in any geographic area where Party A conducts business.\n
      7.2 Non-Solicitation of Customers. During the term of this Agreement and for a period of [time period] thereafter, Party B shall not, directly or indirectly, solicit or attempt to solicit any customer of Party A for the purpose of providing products or services that are competitive with those provided by Party A.\n
      7.3 Non-Solicitation of Employees. During the term of this Agreement and for a period of [time period] thereafter, Party B shall not, directly or indirectly, solicit or attempt to solicit any employee of Party A to leave Party A's employment.\n
      7.4 Acknowledgment. Party B acknowledges that the restrictions contained in this Section 7 are reasonable and necessary to protect Party A's legitimate business interests.\n\n`;
      
      content += `9. REPRESENTATIONS AND WARRANTIES\n`;
      content += `9.1 Party B represents and warrants that: (a) Party B has the full right and authority to enter into and perform this Agreement; (b) Party B's performance under this Agreement will not violate any agreement or obligation between Party B and any third party; and (c) Party B will comply with all applicable laws, rules, and regulations in performing duties under this Agreement.\n\n`;
      
      content += `10. LIMITATION OF LIABILITY\n`;
      content += `10.1 IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n
      10.2 EITHER PARTY'S TOTAL LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY PARTY A TO PARTY B DURING THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.\n\n`;
      
      content += `11. INDEMNIFICATION\n`;
      content += `11.1 Party B shall indemnify, defend, and hold harmless Party A and its officers, directors, employees, agents, successors, and assigns from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) Party B's breach of this Agreement; (b) Party B's negligence or willful misconduct; or (c) Party B's violation of any law, rule, or regulation.\n\n`;
      
      content += `12. DISPUTE RESOLUTION\n`;
      content += `12.1 Negotiation. The parties shall attempt to resolve any dispute arising out of or relating to this Agreement through good faith negotiation.\n
      12.2 Mediation. If the parties are unable to resolve the dispute through negotiation, either party may require the other to submit to non-binding mediation with the assistance of a neutral mediator.\n
      12.3 Arbitration. If the dispute is not resolved through negotiation or mediation, the dispute shall be settled by binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. The arbitration shall take place in [location], and the arbitrator's decision shall be final and binding on the parties.\n
      12.4 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of [State], without regard to its conflict of laws principles.\n\n`;
      
      content += `13. MISCELLANEOUS\n`;
      content += `13.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether oral or written.\n
      13.2 Amendment. This Agreement may only be amended by a written instrument signed by both parties.\n
      13.3 Assignment. Party B may not assign this Agreement or any rights or obligations hereunder without Party A's prior written consent. Party A may assign this Agreement without Party B's consent.\n
      13.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.\n
      13.5 Waiver. The waiver by either party of a breach of any provision of this Agreement shall not operate or be construed as a waiver of any subsequent breach.\n
      13.6 Notices. All notices required or permitted under this Agreement shall be in writing and shall be delivered personally, sent by certified mail (return receipt requested), or sent by overnight courier to the addresses set forth below.\n
      13.7 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.\n
      13.8 Survival. The provisions of Sections 5, 6, 7, 10, 11, 12, and 13 shall survive the termination of this Agreement.\n\n`;
    }
  } else if (contractType.includes('NDA')) {
    content += `The parties wish to exchange confidential information for the purpose of [business purpose]. This Agreement sets forth the terms and conditions under which such exchange shall occur and such information shall be protected.\n\n`;
    
    content += `2. DEFINITION OF CONFIDENTIAL INFORMATION\n`;
    content += `"Confidential Information" means any non-public information that relates to the actual or anticipated business, research, or development of the Disclosing Party and any proprietary information, trade secrets, know-how, and technical data disclosed by the Disclosing Party to the Receiving Party, either directly or indirectly, in writing, orally, or by inspection of tangible objects.\n\n`;
    
    content += `3. OBLIGATIONS OF RECEIVING PARTY\n`;
    content += `The Receiving Party shall:\n
    (a) maintain the confidentiality of the Disclosing Party's Confidential Information;\n
    (b) not disclose any Confidential Information to any person or entity without the prior written consent of the Disclosing Party, except to the Receiving Party's employees, officers, directors, agents, consultants, and advisors who need to know the Confidential Information for the purpose of evaluating, negotiating, or consummating the business relationship between the parties, provided that such persons and entities are bound by confidentiality obligations no less restrictive than those contained herein;\n
    (c) not use the Confidential Information for any purpose other than evaluating, negotiating, or consummating the business relationship between the parties;\n
    (d) use at least the same degree of care to protect the Confidential Information as it uses to protect its own confidential information of a similar nature, but in no case less than reasonable care; and\n
    (e) promptly notify the Disclosing Party upon discovery of any unauthorized use or disclosure of the Confidential Information.\n\n`;
    
    content += `4. EXCLUSIONS\n`;
    content += `The obligations in Section 3 shall not apply to information that:\n
    (a) was known to the Receiving Party prior to disclosure by the Disclosing Party;\n
    (b) is or becomes publicly known through no fault of the Receiving Party;\n
    (c) is rightfully obtained by the Receiving Party from a third party without restriction on use or disclosure;\n
    (d) is independently developed by the Receiving Party without use of the Confidential Information; or\n
    (e) is required to be disclosed by law or court order, provided that the Receiving Party gives the Disclosing Party prompt notice of such requirement and cooperates with the Disclosing Party in seeking a protective order or other appropriate remedy.\n\n`;
    
    content += `5. TERM AND TERMINATION\n`;
    if (intensity === 'simple') {
      content += `This Agreement shall remain in effect for a period of [time period] from the Effective Date, unless earlier terminated by either party with written notice.\n\n`;
    } else if (intensity === 'moderate') {
      content += `This Agreement shall remain in effect for a period of [time period] from the Effective Date. The parties' obligations with respect to Confidential Information shall survive for a period of [time period] following the termination or expiration of this Agreement.\n\n`;
    } else {
      content += `This Agreement shall remain in effect for a period of [time period] from the Effective Date. Notwithstanding the foregoing, the parties' obligations with respect to Confidential Information that constitutes a trade secret shall continue until such information no longer qualifies as a trade secret under applicable law, and the parties' obligations with respect to all other Confidential Information shall survive for a period of [time period] following the termination or expiration of this Agreement.\n\n`;
    }
    
    if (intensity === 'moderate' || intensity === 'watertight') {
      content += `6. RETURN OF MATERIALS\n`;
      content += `Upon the Disclosing Party's request or upon termination of this Agreement, the Receiving Party shall promptly return to the Disclosing Party or destroy all materials containing Confidential Information, including all copies, notes, summaries, and derivatives thereof. Upon the Disclosing Party's request, the Receiving Party shall certify in writing that it has complied with this Section 6.\n\n`;
      
      content += `7. NO LICENSE\n`;
      content += `Nothing in this Agreement shall be construed as granting any rights, licenses, or ownership interests in the Confidential Information to the Receiving Party. All Confidential Information shall remain the property of the Disclosing Party.\n\n`;
      
      content += `8. NO WARRANTY\n`;
      content += `ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS OR IMPLIED. THE DISCLOSING PARTY SHALL NOT BE LIABLE FOR ANY DAMAGES ARISING OUT OF THE USE OF THE CONFIDENTIAL INFORMATION BY THE RECEIVING PARTY.\n\n`;
    }
    
    if (intensity === 'watertight') {
      content += `9. REMEDIES\n`;
      content += `The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party for which monetary damages may be inadequate. Accordingly, the Disclosing Party shall be entitled to seek injunctive relief and specific performance, in addition to any other remedies available at law or in equity, without the necessity of proving actual damages or posting a bond.\n\n`;
      
      content += `10. GOVERNING LAW AND JURISDICTION\n`;
      content += `This Agreement shall be governed by and construed in accordance with the laws of [jurisdiction], without regard to its conflict of laws principles. Any dispute arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the courts of [jurisdiction], and the parties hereby consent to the personal jurisdiction of such courts.\n\n`;
      
      content += `11. MISCELLANEOUS\n`;
      content += `11.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether oral or written.\n
      11.2 Amendment. This Agreement may only be amended by a written instrument signed by both parties.\n
      11.3 Assignment. Neither party may assign this Agreement or any rights or obligations hereunder without the prior written consent of the other party.\n
      11.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.\n
      11.5 Waiver. The waiver by either party of a breach of any provision of this Agreement shall not operate or be construed as a waiver of any subsequent breach.\n
      11.6 Notices. All notices required or permitted under this Agreement shall be in writing and shall be delivered personally, sent by certified mail (return receipt requested), or sent by overnight courier to the addresses set forth below.\n
      11.7 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.\n\n`;
    }
  } else {
    content += `The purpose of this Agreement is to establish the terms and conditions under which the parties will [describe purpose].\n\n`;
    
    content += `2. TERM\n`;
    if (intensity === 'simple') {
      content += `This Agreement shall commence on [Start Date] and continue until terminated by either party with 30 days' written notice.\n\n`;
    } else if (intensity === 'moderate') {
      content += `This Agreement shall commence on [Start Date] and continue for a period of one (1) year thereafter, unless earlier terminated in accordance with Section 8. Upon expiration, this Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least 60 days prior to the end of the then-current term.\n\n`;
    } else {
      content += `This Agreement shall commence on [Start Date] (the "Effective Date") and continue for an initial period of three (3) years thereafter (the "Initial Term"), unless earlier terminated pursuant to Section 8. Following the Initial Term, this Agreement shall automatically renew for successive two-year terms (each, a "Renewal Term"), unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the Initial Term or any Renewal Term. The Initial Term and all Renewal Terms shall collectively be referred to as the "Term."\n\n`;
    }
    
    content += `3. COMPENSATION\n`;
    if (contractType.includes('Service') || contractType.includes('Consulting')) {
      content += `3.1 Fees. Party B shall pay Party A the fees set forth in Exhibit A attached hereto.\n
      3.2 Expenses. Party B shall reimburse Party A for all reasonable out-of-pocket expenses incurred by Party A in connection with the performance of the Services, provided that such expenses are approved in advance by Party B.\n
      3.3 Invoicing. Party A shall submit invoices to Party B on a [monthly/quarterly] basis. Payment shall be due within thirty (30) days of receipt of a proper invoice.\n
      3.4 Taxes. All fees are exclusive of taxes. Party B shall be responsible for all sales, use, and excise taxes, and any other similar taxes, duties, and charges imposed by any governmental authority on the Services provided under this Agreement.\n\n`;
    } else {
      content += `3.1 Payment. Party B shall pay Party A the amounts set forth in Exhibit A attached hereto.\n
      3.2 Payment Terms. Payment shall be due within thirty (30) days of receipt of a proper invoice.\n
      3.3 Late Payments. Any amounts not paid when due shall bear interest at the rate of 1.5% per month or the maximum rate permitted by applicable law, whichever is less.\n
      3.4 Taxes. All fees are exclusive of taxes. Party B shall be responsible for all sales, use, and excise taxes, and any other similar taxes, duties, and charges imposed by any governmental authority on the products or services provided under this Agreement.\n\n`;
    }
    
    content += `4. RESPONSIBILITIES\n`;
    content += `4.1 Party A Responsibilities. Party A shall:\n
    (a) [List Party A's responsibilities]\n
    (b) [List Party A's responsibilities]\n
    (c) [List Party A's responsibilities]\n
    4.2 Party B Responsibilities. Party B shall:\n
    (a) [List Party B's responsibilities]\n
    (b) [List Party B's responsibilities]\n
    (c) [List Party B's responsibilities]\n\n`;
    
    if (intensity === 'moderate' || intensity === 'watertight') {
      content += `5. CONFIDENTIALITY\n`;
      content += `5.1 Definition. "Confidential Information" means all non-public information, in any form, related to the business, operations, products, services, or technology of the disclosing party, including but not limited to business plans, financial information, customer information, marketing strategies, proprietary software, trade secrets, and any other information that would reasonably be considered confidential.\n
      5.2 Obligations. Each party shall: (a) maintain the confidentiality of the other party's Confidential Information; (b) not disclose Confidential Information to any third party without the disclosing party's prior written consent; (c) use Confidential Information solely for the purpose of performing its obligations under this Agreement; and (d) return or destroy all Confidential Information upon termination of this Agreement or upon the disclosing party's request.\n
      5.3 Exceptions. The obligations in Section 5.2 shall not apply to information that: (a) is or becomes publicly available through no fault of the receiving party; (b) was known to the receiving party prior to disclosure by the disclosing party; (c) is independently developed by the receiving party without use of Confidential Information; or (d) is required to be disclosed by law or court order, provided that the receiving party gives the disclosing party prompt notice of such requirement.\n\n`;
      
      content += `6. INTELLECTUAL PROPERTY\n`;
      content += `6.1 Ownership. Each party shall retain all rights, title, and interest in and to its own intellectual property, including but not limited to patents, trademarks, copyrights, trade secrets, and proprietary information, that exists as of the Effective Date or that is developed independently of this Agreement.\n
      6.2 License. Each party grants to the other party a non-exclusive, non-transferable license to use its intellectual property solely for the purpose of performing its obligations under this Agreement.\n
      6.3 No Other Rights. Except as expressly set forth in this Agreement, neither party grants to the other party any license or right, by implication, estoppel, or otherwise, to any intellectual property rights.\n\n`;
    }
    
    if (intensity === 'watertight') {
      content += `7. REPRESENTATIONS AND WARRANTIES\n`;
      content += `7.1 Mutual Representations and Warranties. Each party represents and warrants that: (a) it has the full right and authority to enter into and perform this Agreement; (b) its performance under this Agreement will not violate any agreement or obligation between it and any third party; and (c) it will comply with all applicable laws, rules, and regulations in performing its obligations under this Agreement.\n
      7.2 Party A Representations and Warranties. Party A represents and warrants that: (a) it has the necessary skills, experience, and qualifications to perform its obligations under this Agreement; (b) it will perform its obligations in a professional and workmanlike manner in accordance with industry standards; and (c) its performance will not infringe or misappropriate any third party's intellectual property rights.\n
      7.3 Party B Representations and Warranties. Party B represents and warrants that: (a) it has the necessary resources and authority to perform its obligations under this Agreement; and (b) it will provide Party A with all information, materials, and assistance reasonably required for Party A to perform its obligations under this Agreement.\n
      7.4 Disclaimer. EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, NEITHER PARTY MAKES ANY REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.\n\n`;
      
      content += `8. LIMITATION OF LIABILITY\n`;
      content += `8.1 Exclusion of Damages. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n
      8.2 Limitation of Liability. EITHER PARTY'S TOTAL LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY PARTY B TO PARTY A DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.\n
      8.3 Exceptions. The limitations and exclusions in this Section 8 shall not apply to: (a) either party's indemnification obligations under Section 9; (b) either party's breach of its confidentiality obligations under Section 5; (c) Party A's breach of its intellectual property obligations under Section 6; or (d) damages arising from either party's gross negligence, willful misconduct, or fraud.\n\n`;
      
      content += `9. INDEMNIFICATION\n`;
      content += `9.1 Party A Indemnification. Party A shall indemnify, defend, and hold harmless Party B and its officers, directors, employees, agents, successors, and assigns from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) Party A's breach of this Agreement; (b) Party A's negligence or willful misconduct; or (c) Party A's violation of any law, rule, or regulation.\n
      9.2 Party B Indemnification. Party B shall indemnify, defend, and hold harmless Party A and its officers, directors, employees, agents, successors, and assigns from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) Party B's breach of this Agreement; (b) Party B's negligence or willful misconduct; or (c) Party B's violation of any law, rule, or regulation.\n
      9.3 Procedure. The indemnified party shall: (a) promptly notify the indemnifying party in writing of any claim for which indemnification is sought; (b) give the indemnifying party sole control over the defense and settlement of such claim; and (c) provide the indemnifying party with all reasonable assistance, at the indemnifying party's expense, in defending or settling such claim.\n\n`;
      
      content += `10. TERMINATION\n`;
      content += `10.1 Termination for Convenience. Either party may terminate this Agreement for any reason upon sixty (60) days' prior written notice to the other party.\n
      10.2 Termination for Cause. Either party may terminate this Agreement immediately upon written notice if the other party: (a) commits a material breach of this Agreement that is not cured within thirty (30) days after receipt of written notice of such breach; (b) becomes insolvent or files for bankruptcy; or (c) violates any applicable law in connection with its performance under this Agreement.\n
      10.3 Effect of Termination. Upon termination of this Agreement for any reason: (a) Party A shall immediately cease all work under this Agreement; (b) Party B shall pay Party A for all products delivered or services properly performed up to the effective date of termination; (c) each party shall return or destroy all Confidential Information of the other party in its possession; and (d) any provision of this Agreement that, by its nature, should survive termination shall survive termination, including but not limited to Sections 5, 6, 7, 8, 9, and 11.\n\n`;
      
      content += `11. GENERAL PROVISIONS\n`;
      content += `11.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether oral or written.\n
      11.2 Amendment. This Agreement may only be amended by a written instrument signed by both parties.\n
      11.3 Assignment. Neither party may assign this Agreement or any rights or obligations hereunder without the prior written consent of the other party, which consent shall not be unreasonably withheld.\n
      11.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.\n
      11.5 Waiver. The waiver by either party of a breach of any provision of this Agreement shall not operate or be construed as a waiver of any subsequent breach.\n
      11.6 Notices. All notices required or permitted under this Agreement shall be in writing and shall be delivered personally, sent by certified mail (return receipt requested), or sent by overnight courier to the addresses set forth below.\n
      11.7 Relationship of the Parties. The parties are independent contractors. Nothing in this Agreement shall be construed to create a partnership, joint venture, agency, or employment relationship between the parties.\n
      11.8 Force Majeure. Neither party shall be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, earthquakes, or strikes.\n
      11.9 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of [State], without regard to its conflict of laws principles.\n
      11.10 Dispute Resolution. Any dispute arising out of or relating to this Agreement shall be resolved through binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. The arbitration shall take place in [location], and the arbitrator's decision shall be final and binding on the parties.\n
      11.11 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.\n\n`;
    }
  }
  
  content += `IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.\n\n`;
  content += `${party1.name.toUpperCase()}\n\n`;
  content += `By: ________________________\nName: [Authorized Representative]\nTitle: [Title]\n\n`;
  content += `${party2.name.toUpperCase()}\n\n`;
  content += `By: ________________________\nName: [Authorized Representative]\nTitle: [Title]`;
  
  return content;
}

// Helper function to generate risk analysis based on form data
function generateMockRiskAnalysis(formData: ContractFormData) {
  const { contractType, intensity } = formData;
  
  let riskAnalysis = [];
  
  if (contractType.includes('Employment')) {
    riskAnalysis.push({
      title: 'Termination Clause',
      description: intensity === 'simple' ? 
        'The simple termination clause with only 30 days notice may be too short and could create business continuity issues.' : 
        'The termination clause provides adequate protection for both parties.',
      riskLevel: intensity === 'simple' ? 'high' : 'low',
    });
    
    riskAnalysis.push({
      title: 'Intellectual Property Rights',
      description: intensity === 'watertight' ? 
        'The IP clause provides comprehensive protection of company intellectual property.' : 
        'The intellectual property provisions may not adequately protect company assets created by the employee.',
      riskLevel: intensity === 'watertight' ? 'low' : 'medium',
    });
    
    riskAnalysis.push({
      title: 'Non-Compete Provisions',
      description: intensity === 'watertight' ? 
        'The non-compete clause is detailed but may be too restrictive in some jurisdictions.' : 
        'The agreement lacks adequate non-compete provisions which could expose the company to competitive risks.',
      riskLevel: intensity === 'watertight' ? 'medium' : 'high',
    });
  } else if (contractType.includes('NDA')) {
    riskAnalysis.push({
      title: 'Confidentiality Term',
      description: intensity === 'simple' ? 
        'The confidentiality obligations may end too soon after agreement termination.' : 
        'The extended confidentiality term provides adequate long-term protection.',
      riskLevel: intensity === 'simple' ? 'medium' : 'low',
    });
    
    riskAnalysis.push({
      title: 'Definition of Confidential Information',
      description: 'The definition of confidential information is appropriately broad and comprehensive.',
      riskLevel: 'low',
    });
    
    riskAnalysis.push({
      title: 'Remedies for Breach',
      description: intensity === 'watertight' ? 
        'The agreement includes strong remedies including injunctive relief for confidentiality breaches.' : 
        'The agreement lacks specific remedies for breach of confidentiality provisions.',
      riskLevel: intensity === 'watertight' ? 'low' : 'high',
    });
  } else {
    riskAnalysis.push({
      title: 'Payment Terms',
      description: 'Standard 30-day payment terms are included, but lacks clarity on late payment consequences.',
      riskLevel: 'medium',
    });
    
    riskAnalysis.push({
      title: 'Limitation of Liability',
      description: intensity === 'watertight' ? 
        'The limitation of liability clause provides adequate protection while excluding appropriate exceptions.' : 
        'The agreement lacks comprehensive liability limitations.',
      riskLevel: intensity === 'watertight' ? 'low' : 'high',
    });
    
    riskAnalysis.push({
      title: 'Termination Rights',
      description: intensity === 'simple' ? 
        'The simple termination clause with only 30 days notice may create business continuity issues.' : 
        'The termination provisions include both convenience and cause-based termination with appropriate notice periods.',
      riskLevel: intensity === 'simple' ? 'high' : 'low',
    });
  }
  
  // Add one more risk item based on intensity
  if (intensity === 'simple') {
    riskAnalysis.push({
      title: 'Dispute Resolution',
      description: 'The agreement lacks formal dispute resolution procedures, which could lead to costly litigation.',
      riskLevel: 'high',
    });
  } else if (intensity === 'moderate') {
    riskAnalysis.push({
      title: 'Governing Law',
      description: 'The governing law provision is present but jurisdiction selection may need review based on parties\' locations.',
      riskLevel: 'medium',
    });
  } else {
    riskAnalysis.push({
      title: 'Force Majeure',
      description: 'Comprehensive force majeure clause protects both parties from circumstances beyond their control.',
      riskLevel: 'low',
    });
  }
  
  return riskAnalysis;
}

export default ContractForm;
