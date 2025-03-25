import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Send, Download, Copy, Check, RefreshCw, ChevronDown, ChevronUp, Menu, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Progress } from "@/components/ui/progress";
import { useExpandedPreview } from "@/hooks/use-expanded-preview";
import { motion, AnimatePresence } from "framer-motion";

type ContractFormProps = {
  onGenerate: (contract: GeneratedContract) => void;
  popularAgreements?: { label: string; value: string; }[];
};

export type ContractFormData = {
  gist: string;
  contractType: string;
  party1: {
    name: string;
    address: string;
    showAddress: boolean;
  };
  party2: {
    name: string;
    address: string;
    showAddress: boolean;
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

// Reorganized contract types with popular ones at the top
const contractTypes = [
  // Most popular agreements first
  "Non-Disclosure Agreement (NDA)",
  "Employment Agreement",
  "Service Agreement",
  "Consulting Agreement",
  "Sales Contract",
  "Lease Agreement",
  "Term Sheet",
  "SAFE Note Agreement",
  "Convertible Note Agreement",
  "Equity Vesting Agreement",
  "Partnership Agreement",
  // Less common agreements
  "Distribution Agreement",
  "Licensing Agreement",
  "Software License Agreement",
  "Freelancer Contract",
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
    gist: "",
    contractType: "",
    party1: { name: "", address: "", showAddress: false },
    party2: { name: "", address: "", showAddress: false },
    termsHighlights: "",
    intensity: "moderate",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [contract, setContract] = useState<GeneratedContract | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev, 
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string | boolean>),
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

  const handleCheckboxChange = (parent: string, child: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, string | boolean>),
        [child]: checked
      }
    }));
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
    
    try {
      // TODO: Implement actual contract generation API call
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate contract');
      }

      const generatedContract = await response.json();
      setContract(generatedContract);
      onGenerate(generatedContract);
      setIsExpanded(true);
      
      if (window.innerWidth < 768) {
        setFormCollapsed(true);
      }

      toast({
        title: "Contract generated",
        description: "Your contract has been successfully created.",
      });
    } catch (error) {
      console.error('Contract generation error:', error);
      toast({
        title: "Generation error",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
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
    
    toast({
      title: "Text copied",
      description: "Contract text has been copied to clipboard.",
    });
  };

  const getIntensityValue = () => {
    const intensityMap: Record<'simple' | 'moderate' | 'watertight', number> = {
      simple: 0,
      moderate: 50,
      watertight: 100
    };
    return intensityMap[formData.intensity] || 50;
  };

  const toggleFormCollapse = () => {
    setFormCollapsed(!formCollapsed);
  };

  // Add validation function
  const isFormValid = () => {
    return (
      formData.contractType.trim() !== '' &&
      formData.party1.name.trim() !== '' &&
      formData.party2.name.trim() !== '' &&
      formData.gist.trim() !== ''
    );
  };

  return (
    <div className={`w-full max-w-6xl grid grid-cols-1 gap-6 relative ${isExpanded ? 'lg:grid-cols-5' : 'md:grid-cols-2'}`}>
      {/* Form side */}
      <AnimatePresence>
        {(!formCollapsed || !contract) && (
          <motion.div 
            className={`space-y-4 ${isExpanded ? 'lg:col-span-2' : 'md:col-span-1'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <Label htmlFor="contractType">Contract Type</Label>
              <Select value={formData.contractType} onValueChange={(value) => handleSelectChange('contractType', value)}>
                <SelectTrigger className="w-full bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {contractTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label htmlFor="party1.name">First Party Name</Label>
              <Input
                id="party1.name"
                name="party1.name"
                placeholder="Enter name of first party"
                value={formData.party1.name}
                onChange={handleChange}
                className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
              />
              
              <div className="flex items-center space-x-2 mt-1.5">
                <Checkbox 
                  id="party1AddressCheckbox" 
                  checked={formData.party1.showAddress}
                  onCheckedChange={(checked) => handleCheckboxChange('party1', 'showAddress', checked as boolean)}
                />
                <label 
                  htmlFor="party1AddressCheckbox" 
                  className="text-sm text-bento-gray-600 dark:text-bento-gray-400 cursor-pointer"
                >
                  Add address details
                </label>
              </div>
              
              <AnimatePresence>
                {formData.party1.showAddress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <Label htmlFor="party1.address">First Party Address</Label>
                      <Input
                        id="party1.address"
                        name="party1.address"
                        placeholder="Enter address"
                        value={formData.party1.address}
                        onChange={handleChange}
                        className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="party2.name">Second Party Name</Label>
              <Input
                id="party2.name"
                name="party2.name"
                placeholder="Enter name of second party"
                value={formData.party2.name}
                onChange={handleChange}
                className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
              />
              
              <div className="flex items-center space-x-2 mt-1.5">
                <Checkbox 
                  id="party2AddressCheckbox" 
                  checked={formData.party2.showAddress}
                  onCheckedChange={(checked) => handleCheckboxChange('party2', 'showAddress', checked as boolean)}
                />
                <label 
                  htmlFor="party2AddressCheckbox" 
                  className="text-sm text-bento-gray-600 dark:text-bento-gray-400 cursor-pointer"
                >
                  Add address details
                </label>
              </div>
              
              <AnimatePresence>
                {formData.party2.showAddress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <Label htmlFor="party2.address">Second Party Address</Label>
                      <Input
                        id="party2.address"
                        name="party2.address"
                        placeholder="Enter address"
                        value={formData.party2.address}
                        onChange={handleChange}
                        className="bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Label htmlFor="gist">Contract Description</Label>
              <Textarea
                id="gist"
                name="gist"
                placeholder="Briefly describe what this contract should cover..."
                value={formData.gist}
                onChange={handleChange}
                className="min-h-[100px] bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Label htmlFor="termsHighlights">Key Terms (Optional)</Label>
              <Textarea
                id="termsHighlights"
                name="termsHighlights"
                placeholder="List any specific terms you want to include..."
                value={formData.termsHighlights}
                onChange={handleChange}
                className="min-h-[80px] bg-bento-gray-50 text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-900/50 dark:text-bento-gray-100 dark:border-bento-gray-700"
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
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
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={generateContract}
                disabled={isGenerating || !isFormValid()}
                className="w-full bg-gradient-to-r from-bento-yellow-500 via-bento-orange-500 to-bento-brown-600 hover:from-bento-yellow-600 hover:via-bento-orange-600 hover:to-bento-brown-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>Generating... <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /></>
                ) : (
                  <><FileText className="h-4 w-4 mr-2" /> Generate Contract</>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preview side */}
      <motion.div 
        className={`space-y-4 ${isExpanded && !formCollapsed ? 'lg:col-span-3' : formCollapsed ? 'col-span-1' : 'md:col-span-1'}`}
        layout
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        {isGenerating && (
          <div className="relative w-full mb-2">
            <Progress value={generationProgress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground text-center mt-1">Generating your contract...</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Contract Preview</h3>
          <div className="flex space-x-2">
            {contract && formCollapsed && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFormCollapse}
                className="text-xs flex items-center"
              >
                <Menu className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            
            {contract && !formCollapsed && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFormCollapse}
                className="text-xs hidden sm:flex items-center"
              >
                <X className="h-4 w-4 mr-1" /> Hide form
              </Button>
            )}
            
            {contract && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleExpanded}
                className="text-xs"
              >
                {isExpanded ? "Reduce preview" : "Expand preview"}
              </Button>
            )}
          </div>
        </div>
        
        <motion.div 
          className="relative overflow-auto h-[500px] border border-bento-gray-200 rounded-lg p-4 bg-white/80 dark:bg-bento-gray-800/80 dark:border-bento-gray-700 text-sm backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {contract ? (
            <motion.div 
              id="contract-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-bold mb-4">{contract.title}</h2>
              <div className="whitespace-pre-line">{contract.content}</div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <motion.div 
                className="text-center text-bento-gray-600 dark:text-bento-gray-200"
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
              >
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-base">Fill in the required information to see the contract preview</p>
                {!isFormValid() && (
                  <div className="mt-4 text-sm text-bento-gray-600 dark:text-bento-gray-300">
                    <p className="font-medium mb-2">Required fields:</p>
                    <ul className="text-left space-y-1">
                      {!formData.contractType.trim() && <li>• Contract Type</li>}
                      {!formData.party1.name.trim() && <li>• First Party Name</li>}
                      {!formData.party2.name.trim() && <li>• Second Party Name</li>}
                      {!formData.gist.trim() && <li>• Contract Description</li>}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
        
        {contract && (
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button 
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex-1 border border-bento-gray-200 dark:border-bento-gray-700 hover-scale"
            >
              <Download className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownloadWord}
              className="flex-1 border border-bento-gray-200 dark:border-bento-gray-700 hover-scale"
            >
              <Download className="h-4 w-4 mr-1" /> Word
            </Button>
            <Button 
              variant="outline"
              onClick={handleCopyText}
              className="border border-bento-gray-200 dark:border-bento-gray-700 hover-scale"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              onClick={regenerateContract}
              className="border border-bento-gray-200 dark:border-bento-gray-700 hover-scale"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
            </Button>
          </motion.div>
        )}
        
        {contract && (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h3 className="font-medium">Risk Analysis</h3>
            {contract.riskAnalysis.map((item, index) => (
              <motion.div 
                key={index} 
                className={`p-3 rounded-lg text-sm ${
                  item.riskLevel === 'low' 
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                    : item.riskLevel === 'medium'
                    ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-xs mt-1">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ContractForm;
