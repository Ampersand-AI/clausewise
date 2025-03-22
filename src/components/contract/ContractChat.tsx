
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Download, Copy, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { GeneratedContract } from './ContractForm';

type Message = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  options?: string[];
  field?: string;
};

type ContractChatProps = {
  onGenerate: (contract: GeneratedContract) => void;
};

type ContractData = {
  contractType: string;
  party1: string;
  party2: string;
  jurisdiction: string;
  gist: string;
  intensity: 'simple' | 'moderate' | 'watertight';
};

const ContractChat: React.FC<ContractChatProps> = ({ onGenerate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentField, setCurrentField] = useState<keyof ContractData | null>(null);
  const [contractData, setContractData] = useState<Partial<ContractData>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [contract, setContract] = useState<GeneratedContract | null>(null);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initial message on component mount
  useEffect(() => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Hello! I'll help you create a legal contract. Let's get started. What type of contract do you need?",
      field: 'contractType'
    };
    setMessages([initialMessage]);
    setCurrentField('contractType');
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      // Using scrollIntoView with a slight delay to ensure DOM updates are complete
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [messages]);

  const handleUserInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim() || !currentField) return;
    
    // Save current scroll position
    const currentScrollPos = chatContainerRef.current?.scrollTop || 0;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Update contract data with user input
    setContractData(prev => ({
      ...prev,
      [currentField]: input
    }));
    
    // Process to next field based on current field
    processNextField(currentField);
    
    // Restore scroll position
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = currentScrollPos;
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!currentField) return;
    
    // Add user selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: option,
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Update contract data with selected option
    setContractData(prev => ({
      ...prev,
      [currentField]: option
    }));
    
    // Process to next field
    processNextField(currentField);
  };

  const processNextField = (field: keyof ContractData) => {
    let nextField: keyof ContractData | null = null;
    let nextPrompt = '';
    let options: string[] = [];
    
    // Determine the next field and prompt based on current field
    switch (field) {
      case 'contractType':
        nextField = 'party1';
        nextPrompt = "Great! Now, who is the first party in this contract?";
        break;
        
      case 'party1':
        nextField = 'party2';
        nextPrompt = "Who is the second party in this contract?";
        break;
        
      case 'party2':
        nextField = 'jurisdiction';
        nextPrompt = "What jurisdiction will this contract be governed under? (e.g., California, UK, etc.)";
        break;
        
      case 'jurisdiction':
        nextField = 'gist';
        nextPrompt = "Please provide a brief description of what this contract should cover:";
        break;
        
      case 'gist':
        nextField = 'intensity';
        nextPrompt = "Finally, how comprehensive should this contract be?";
        options = ['simple', 'moderate', 'watertight'];
        break;
        
      case 'intensity':
        nextField = null;
        nextPrompt = "Thank you! I have all the information I need. Generating your contract now...";
        break;
    }
    
    // Add assistant message for next field
    if (nextPrompt) {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: nextPrompt,
        field: nextField || undefined,
        options: options.length > 0 ? options : undefined
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentField(nextField);
        
        // If we've collected all data, generate the contract
        if (nextField === null) {
          generateContract();
        }
      }, 600);
    }
  };

  const generateContract = async () => {
    if (!contractData.contractType || !contractData.party1 || !contractData.party2 || 
        !contractData.jurisdiction || !contractData.gist || !contractData.intensity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Add a message to indicate contract generation is in progress
    const genMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Generating your contract. This may take a moment...",
    };
    setMessages(prev => [...prev, genMessage]);

    try {
      // Simulate contract generation - would be an API call in production
      setTimeout(() => {
        // Mock contract generation with more elaborate drafting
        const mockContract: GeneratedContract = {
          id: `contract-${Date.now()}`,
          title: `${contractData.contractType} between ${contractData.party1} and ${contractData.party2}`,
          content: generateElaborateContractContent(contractData as ContractData),
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

        // Add completion message with the contract
        const completionMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I've completed your contract! You can review it below.",
        };
        
        setMessages(prev => [...prev, completionMessage]);

        toast({
          title: "Contract generated",
          description: "Your contract has been successfully created.",
        });
      }, 3000);
    } catch (error) {
      console.error("Error generating contract:", error);
      setIsGenerating(false);
      
      toast({
        title: "Generation failed",
        description: "There was an error generating your contract. Please try again.",
        variant: "destructive",
      });
    }
  };

  const regenerateContract = () => {
    setIsGenerating(true);
    
    // Add regeneration message
    const regenMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Regenerating your contract with adjustments...",
    };
    setMessages(prev => [...prev, regenMessage]);
    
    // Similar to generate but with a different result
    setTimeout(() => {
      const updatedContract: GeneratedContract = {
        ...contract!,
        id: `contract-${Date.now()}`,
        content: generateElaborateContractContent(contractData as ContractData, true), // Pass true for variation
        riskScore: Math.max(10, Math.min(90, (contract?.riskScore || 30) + (Math.random() * 20 - 10))),
      };
      
      setContract(updatedContract);
      onGenerate(updatedContract);
      setIsGenerating(false);
      
      const completionMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've regenerated your contract with some variations. You can review the updated version below.",
      };
      
      setMessages(prev => [...prev, completionMessage]);
      
      toast({
        title: "Contract regenerated",
        description: "Your contract has been updated with new language.",
      });
    }, 2000);
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
      // Create a rich format Word document with proper styling
      const preface = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${contract.title}</title>
<style>
  body {
    font-family: 'Calibri', sans-serif;
    margin: 1in;
    line-height: 1.5;
  }
  h1, h2, h3, h4 {
    margin-top: 20px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }
  p {
    margin-bottom: 10px;
    text-align: justify;
  }
  .section {
    margin-top: 20px;
  }
  .signature-line {
    border-top: 1px solid black;
    width: 250px;
    margin-top: 50px;
    margin-bottom: 5px;
  }
  @page Section1 {
    size: 8.5in 11.0in;
    margin: 1.0in 1.0in 1.0in 1.0in;
    mso-header-margin: .5in;
    mso-footer-margin: .5in;
    mso-paper-source: 0;
  }
  div.Section1 {
    page: Section1;
  }
</style>
</head>
<body>
<div class="Section1">
<h1 style="text-align:center;margin-bottom:30px;">${contract.title}</h1>
`;
      
      // Format the contract content with proper paragraphs and headings
      const formattedContent = contract.content
        .replace(/\n{2,}/g, '</p><p>') // Convert double line breaks to paragraphs
        .replace(/^([A-Z0-9][A-Za-z0-9\s]+:)/gm, '<h3>$1</h3><p>') // Convert section headings
        .replace(/^(\d+\.\s+[A-Z][A-Za-z0-9\s]+)/gm, '<h4>$1</h4><p>'); // Convert numbered sections
        
      const postface = `</p></div></body></html>`;
      const fullHtml = preface + formattedContent + postface;
      
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

  return (
    <div className="w-full grid grid-cols-1 gap-6">
      {/* Chat area */}
      <div className="relative border rounded-lg shadow-sm bg-white dark:bg-bento-gray-800 overflow-hidden flex flex-col">
        {/* Messages container */}
        <div 
          ref={chatContainerRef}
          className="h-[360px] overflow-y-auto p-4 space-y-4 scrollbar-none"
        >
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-lovable-gradient text-white' 
                    : 'bg-bento-gray-100 dark:bg-bento-gray-700 text-bento-gray-900 dark:text-bento-gray-100'
                }`}
              >
                <p>{message.content}</p>
                
                {message.options && message.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map((option) => (
                      <Button 
                        key={option}
                        size="sm"
                        variant={message.role === 'user' ? 'secondary' : 'outline'}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-3 border-t border-bento-gray-200 dark:border-bento-gray-700 bg-bento-gray-50 dark:bg-bento-gray-800">
          <form onSubmit={handleUserInput} className="flex gap-2">
            <Textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none bg-white text-bento-gray-900 border-bento-gray-200 dark:bg-bento-gray-700 dark:text-bento-gray-100 dark:border-bento-gray-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleUserInput();
                }
              }}
              disabled={isGenerating || !currentField}
            />
            <Button
              type="submit"
              className="shrink-0 bg-lovable-gradient hover:bg-lovable-gradient-hover transition-all duration-300"
              size="icon"
              disabled={isGenerating || !input.trim() || !currentField}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
      
      {/* Contract preview */}
      {contract && (
        <div className="space-y-4">
          <div className="relative overflow-auto max-h-[600px] border border-bento-gray-200 rounded-lg p-6 bg-white dark:bg-bento-gray-800 dark:border-bento-gray-700 text-sm shadow-inner">
            <div id="contract-preview" className="min-h-[200px]">
              <h2 className="text-xl font-bold mb-4">{contract.title}</h2>
              <div className="whitespace-pre-line text-bento-gray-900 dark:text-bento-gray-100">{contract.content}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={regenerateContract}
              disabled={isGenerating}
              className="bg-white border-bento-gray-200 hover:bg-bento-gray-50 text-bento-gray-600 dark:bg-bento-gray-800 dark:border-bento-gray-700 dark:hover:bg-bento-gray-700 dark:text-bento-gray-400"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Redraft
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownloadPDF}
              className="bg-white border-bento-gray-200 hover:bg-bento-gray-50 text-bento-gray-600 dark:bg-bento-gray-800 dark:border-bento-gray-700 dark:hover:bg-bento-gray-700 dark:text-bento-gray-400"
            >
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownloadWord}
              className="bg-white border-bento-gray-200 hover:bg-bento-gray-50 text-bento-gray-600 dark:bg-bento-gray-800 dark:border-bento-gray-700 dark:hover:bg-bento-gray-700 dark:text-bento-gray-400"
            >
              <Download className="h-4 w-4 mr-2" /> Word
            </Button>
            <Button 
              variant="outline"
              onClick={handleCopyText}
              className="bg-white border-bento-gray-200 hover:bg-bento-gray-50 text-bento-gray-600 dark:bg-bento-gray-800 dark:border-bento-gray-700 dark:hover:bg-bento-gray-700 dark:text-bento-gray-400"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Risk Analysis */}
          <div className="space-y-3">
            <h3 className="font-medium text-bento-gray-900 dark:text-bento-gray-100">Risk Analysis</h3>
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
        </div>
      )}
    </div>
  );
};

// Helper function to generate more elaborate contract content based on form data
function generateElaborateContractContent(formData: ContractData, variation = false): string {
  const { contractType, party1, party2, jurisdiction, intensity } = formData;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Add some variation if regenerating
  const variationText = variation ? 
    `\n\nThis agreement supersedes and replaces any prior agreements between the parties related to the subject matter herein.` : '';
  
  let content = `${contractType.toUpperCase()}\n\nThis Agreement (the "Agreement") is made and entered into as of ${today}, by and between ${party1} ("Party A") and ${party2} ("Party B").\n\n`;
  content += `WHEREAS, the parties desire to enter into this Agreement to define their respective rights and obligations with respect to the subject matter herein; and\n\n`;
  content += `WHEREAS, each party represents that it has the full right, power, and authority to enter into and perform its obligations under this Agreement;\n\n`;
  content += `NOW, THEREFORE, in consideration of the mutual covenants, terms, and conditions set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:${variationText}\n\n`;
  
  // Add clauses based on contract type and intensity
  content += `1. DEFINITIONS\n`;
  content += `For purposes of this Agreement, the following terms shall have the meanings set forth below:\n\n`;
  content += `"Affiliate" means any entity that directly or indirectly controls, is controlled by, or is under common control with a party.\n\n`;
  content += `"Confidential Information" means all non-public, proprietary, or confidential information relating to the parties and their respective businesses, including, without limitation, business plans, technical data, trade secrets, or know-how.\n\n`;
  content += `"Intellectual Property Rights" means all patents, copyrights, trademarks, trade secrets, and other intellectual property rights.\n\n`;
  
  if (intensity === 'moderate' || intensity === 'watertight') {
    content += `"Force Majeure Event" means any act or event that (a) prevents a party from performing its obligations under this Agreement; (b) is beyond the reasonable control of and not the fault of the non-performing party; and (c) could not have been prevented by the non-performing party's reasonable diligence.\n\n`;
    content += `"Law" means any statute, law, ordinance, regulation, rule, code, constitution, treaty, common law, judgment, decree, or order of any federal, state, local, or foreign government or political subdivision thereof, or any arbitrator, court, or tribunal of competent jurisdiction.\n\n`;
  }
  
  content += `2. PURPOSE AND SCOPE\n`;
  
  if (contractType.includes('Employment')) {
    content += `Party A agrees to employ Party B in the position of [Job Title], and Party B accepts such employment, subject to the terms and conditions of this Agreement. Party B shall perform all duties and responsibilities as outlined in Exhibit A attached hereto, and such other duties as may be assigned from time to time by Party A.\n\n`;
  } else if (contractType.includes('NDA')) {
    content += `The parties wish to exchange Confidential Information for the purpose of [business purpose]. This Agreement sets forth the terms and conditions under which such exchange shall occur and such information shall be protected.\n\n`;
    content += `Each party may disclose certain Confidential Information to the other party for the purpose specified above. Each party shall limit the disclosure of Confidential Information to those of its employees, agents, or representatives with a need to know such information, and shall ensure that such individuals are bound by obligations of confidentiality at least as restrictive as those contained herein.\n\n`;
  } else if (contractType.includes('Service')) {
    content += `Party A agrees to provide the services set forth in Exhibit A attached hereto (the "Services") to Party B, and Party B agrees to pay for such Services in accordance with the terms of this Agreement.\n\n`;
    content += `Party A shall perform the Services in a professional and workmanlike manner, in accordance with industry standards and in compliance with all applicable laws and regulations.\n\n`;
  } else {
    content += `The purpose of this Agreement is to establish the terms and conditions under which the parties will [describe purpose]. The scope of this Agreement includes, but is not limited to, the following activities: [list activities].\n\n`;
  }
  
  content += `3. TERM\n`;
  if (intensity === 'simple') {
    content += `This Agreement shall commence on [Start Date] and continue until terminated by either party with 30 days' written notice to the other party.\n\n`;
  } else if (intensity === 'moderate') {
    content += `This Agreement shall commence on [Start Date] (the "Effective Date") and continue for a period of one (1) year thereafter (the "Initial Term"), unless earlier terminated in accordance with Section 8. Upon expiration of the Initial Term, this Agreement shall automatically renew for successive one-year terms (each, a "Renewal Term") unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term. The Initial Term and all Renewal Terms shall collectively be referred to as the "Term."\n\n`;
  } else {
    content += `This Agreement shall commence on [Start Date] (the "Effective Date") and continue for an initial period of three (3) years thereafter (the "Initial Term"), unless earlier terminated pursuant to Section 8. Following the Initial Term, this Agreement shall automatically renew for successive two-year terms (each, a "Renewal Term"), unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the Initial Term or any Renewal Term. The Initial Term and all Renewal Terms shall collectively be referred to as the "Term."\n\n`;
    content += `Notwithstanding anything to the contrary herein, all provisions of this Agreement that by their nature should survive termination shall survive the termination or expiration of this Agreement, including, without limitation, Sections [list applicable sections].\n\n`;
  }
  
  content += `4. COMPENSATION\n`;
  if (contractType.includes('Employment')) {
    content += `In consideration for the services to be performed by Party B, Party A agrees to pay Party B a base salary of $[Amount] per [period], subject to applicable tax withholdings and deductions. Salary shall be paid in accordance with Party A's regular payroll practices. Party B may be eligible for an annual performance bonus of up to [percentage]% of base salary, based on criteria established by Party A.\n\n`;
  } else if (contractType.includes('Service')) {
    content += `Party B shall pay Party A for the Services in accordance with the fee schedule set forth in Exhibit B attached hereto. Party A shall invoice Party B on a [frequency] basis, and Party B shall pay all undisputed amounts within thirty (30) days after receipt of each invoice. All fees are exclusive of taxes, duties, or other governmental charges, which shall be paid by Party B.\n\n`;
  } else {
    content += `[Details of payment, fees, or other consideration to be inserted here. Include payment terms, frequency, method of payment, and any conditions precedent to payment.]\n\n`;
  }
  
  content += `5. RESPONSIBILITIES\n`;
  content += `Party A Responsibilities:\n`;
  content += `(a) [List specific responsibilities of Party A]\n`;
  content += `(b) [Additional responsibilities as appropriate]\n\n`;
  content += `Party B Responsibilities:\n`;
  content += `(a) [List specific responsibilities of Party B]\n`;
  content += `(b) [Additional responsibilities as appropriate]\n\n`;
  
  // Add more clauses based on intensity
  if (intensity === 'moderate' || intensity === 'watertight') {
    content += `6. CONFIDENTIALITY\n`;
    content += `Each party acknowledges that it may have access to certain confidential and proprietary information of the other party. Each party shall maintain the confidentiality of all proprietary or confidential information disclosed to it by the other party ("Confidential Information") for a period of [number] years from the date of disclosure.\n\n`;
    content += `Confidential Information shall not include information that: (a) is or becomes publicly available through no fault of the receiving party; (b) was rightfully known to the receiving party without restriction before receipt from the disclosing party; (c) is rightfully obtained by the receiving party from a third party without restriction; or (d) is independently developed by the receiving party without access to the Confidential Information of the disclosing party.\n\n`;
    
    content += `7. INTELLECTUAL PROPERTY\n`;
    content += `All intellectual property rights existing prior to the Effective Date shall remain the exclusive property of the party owning such rights. Neither party shall acquire any right, title, or interest in or to the other party's pre-existing intellectual property by virtue of this Agreement.\n\n`;
    content += `Any intellectual property developed solely by one party during the Term shall be owned exclusively by that party. Any intellectual property jointly developed by the parties shall be jointly owned, and each party shall have the right to use such jointly owned intellectual property without accounting to the other party.\n\n`;
    
    if (intensity === 'watertight') {
      content += `8. REPRESENTATIONS AND WARRANTIES\n`;
      content += `Each party represents and warrants that: (a) it has the full right and authority to enter into and perform this Agreement; (b) its performance of this Agreement does not conflict with any other agreement or obligation of such party; and (c) it shall comply with all applicable laws, rules, and regulations in performing its obligations hereunder.\n\n`;
      content += `EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, NEITHER PARTY MAKES ANY REPRESENTATIONS OR WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, AND EACH PARTY SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, OR FITNESS FOR A PARTICULAR PURPOSE, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.\n\n`;
      
      content += `9. LIMITATION OF LIABILITY\n`;
      content += `IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATED TO THIS AGREEMENT, REGARDLESS OF THE THEORY OF LIABILITY AND EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\n`;
      content += `EXCEPT FOR BREACHES OF CONFIDENTIALITY OBLIGATIONS OR INTELLECTUAL PROPERTY RIGHTS, IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT, OR UNDER ANY OTHER THEORY OF LIABILITY, EXCEED $[AMOUNT].\n\n`;
      
      content += `10. INDEMNIFICATION\n`;
      content += `Each party shall indemnify, defend, and hold harmless the other party, its affiliates, and their respective officers, directors, employees, agents, successors, and assigns from and against any and all losses, damages, liabilities, costs (including reasonable attorneys' fees) arising out of or relating to any claim, action, or proceeding by a third party to the extent arising from: (a) the negligence, willful misconduct, or breach of this Agreement by the indemnifying party; or (b) any allegation that materials provided by the indemnifying party infringe, misappropriate, or otherwise violate any intellectual property rights, privacy rights, or other rights of any third party.\n\n`;
      
      content += `11. INSURANCE\n`;
      content += `During the Term, each party shall maintain in force adequate insurance coverage to enable it to meet its obligations under this Agreement, including but not limited to commercial general liability insurance with limits of not less than $[Amount] per occurrence and $[Amount] in the aggregate.\n\n`;
      
      content += `12. COMPLIANCE WITH LAWS\n`;
      content += `Each party shall comply with all applicable laws, regulations, and ordinances in connection with its performance under this Agreement, including but not limited to those relating to data privacy, export control, and anti-corruption.\n\n`;
    }
  }
  
  content += `${intensity === 'watertight' ? '13' : intensity === 'moderate' ? '8' : '6'}. GOVERNING LAW AND DISPUTE RESOLUTION\n`;
  content += `This Agreement shall be governed by and construed in accordance with the laws of ${jurisdiction}, without giving effect to any choice or conflict of law provision or rule.\n\n`;
  
  if (intensity === 'simple') {
    content += `Any dispute arising out of or in connection with this Agreement shall be resolved through friendly consultations between the parties. If no agreement can be reached, either party may submit the dispute to the competent court in ${jurisdiction}.\n\n`;
  } else if (intensity === 'moderate') {
    content += `Any controversy or claim arising out of or relating to this Agreement shall first be addressed by the parties through good faith negotiations. If such negotiations do not resolve the dispute within thirty (30) days, either party may submit the dispute to mediation under the rules of [Mediation Organization]. If mediation is unsuccessful, either party may initiate legal proceedings in the courts of ${jurisdiction}, and the parties consent to the exclusive jurisdiction of such courts.\n\n`;
  } else {
    content += `Any dispute, controversy, or claim arising out of or relating to this Agreement, including the formation, interpretation, breach, or termination thereof, shall be resolved through the following progressive dispute resolution process:\n\n`;
    content += `(a) The parties shall first attempt in good faith to resolve any dispute by negotiation between executives who have authority to settle the dispute and who are at a higher level of management than the persons with direct responsibility for administration of this Agreement.\n\n`;
    content += `(b) If the dispute has not been resolved by negotiation within forty-five (45) days, the parties shall attempt to settle the dispute by mediation under the rules of [Mediation Organization], with the mediation to be held in [Location].\n\n`;
    content += `(c) If the dispute has not been resolved by mediation within ninety (90) days of the initiation of the mediation, the dispute shall be finally resolved by arbitration administered by [Arbitration Organization] in accordance with its rules. The arbitration shall be conducted by three arbitrators, with each party appointing one arbitrator and those two arbitrators selecting the third. The arbitration shall be held in [Location], and the proceedings shall be conducted in English. The award rendered by the arbitrators shall be final and binding on the parties, and judgment on the award may be entered in any court having jurisdiction thereof.\n\n`;
    content += `(d) Notwithstanding the foregoing, either party may seek injunctive or other equitable relief to protect its intellectual property rights and confidential information in any court of competent jurisdiction.\n\n`;
  }
  
  content += `${intensity === 'watertight' ? '14' : intensity === 'moderate' ? '9' : '7'}. MISCELLANEOUS\n`;
  content += `a. Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, and understandings of the parties, whether written or oral.\n\n`;
  content += `b. Amendments. No amendment to or modification of this Agreement shall be effective unless in writing and signed by both parties.\n\n`;
  content += `c. Severability. If any provision of this Agreement is held invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired.\n\n`;
  content += `d. No Waiver. No waiver by either party of any breach of any provision of this Agreement shall constitute a waiver of any prior, concurrent, or subsequent breach of the same or any other provision hereof.\n\n`;
  content += `e. Notice. All notices, requests, consents, claims, demands, waivers, and other communications hereunder shall be in writing and shall be deemed to have been given: (i) when delivered by hand; (ii) when received by the addressee if sent by a nationally recognized overnight courier; (iii) on the date sent by email if sent during normal business hours of the recipient, and on the next business day if sent after normal business hours of the recipient; or (iv) on the third day after the date mailed, by certified or registered mail, return receipt requested, postage prepaid.\n\n`;
  
  if (intensity === 'watertight') {
    content += `f. Relationship of the Parties. The relationship between the parties is that of independent contractors. Nothing contained in this Agreement shall be construed as creating any agency, partnership, joint venture, or other form of joint enterprise, employment, or fiduciary relationship between the parties, and neither party shall have authority to contract for or bind the other party in any manner whatsoever.\n\n`;
    content += `g. Assignment. Neither party may assign any of its rights or delegate any of its obligations hereunder without the prior written consent of the other party, which consent shall not be unreasonably withheld, conditioned, or delayed; provided, however, that either party may assign this Agreement without consent of the other party to an affiliate or in connection with a merger, acquisition, corporate reorganization, or sale of all or substantially all of its assets.\n\n`;
    content += `h. Force Majeure. Neither party shall be liable or responsible to the other party, nor be deemed to have defaulted under or breached this Agreement, for any failure or delay in fulfilling or performing any term of this Agreement, when and to the extent such failure or delay is caused by a Force Majeure Event, provided that the affected party: (i) promptly notifies the other party of the occurrence of the Force Majeure Event; (ii) uses commercially reasonable efforts to mitigate the effects of the Force Majeure Event; and (iii) resumes performance of its obligations as soon as reasonably practicable after the removal of the Force Majeure Event.\n\n`;
    content += `i. Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall be deemed to be one and the same agreement. A signed copy of this Agreement delivered by facsimile, email, or other means of electronic transmission shall be deemed to have the same legal effect as delivery of an original signed copy of this Agreement.\n\n`;
    content += `j. Third-Party Beneficiaries. This Agreement is for the sole benefit of the parties hereto and their respective successors and permitted assigns and nothing herein, express or implied, is intended to or shall confer upon any other person or entity any legal or equitable right, benefit, or remedy of any nature whatsoever under or by reason of this Agreement.\n\n`;
  }
  
  content += `IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.\n\n`;
  content += `${party1.toUpperCase()}\n\n`;
  content += `By: ________________________\nName: [Authorized Representative]\nTitle: [Title]\nDate: ________________________\n\n`;
  content += `${party2.toUpperCase()}\n\n`;
  content += `By: ________________________\nName: [Authorized Representative]\nTitle: [Title]\nDate: ________________________`;
  
  return content;
}

export default ContractChat;
