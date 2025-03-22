
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the minimum amount I can invest?",
    answer: "The minimum investment amount varies by opportunity, but typically starts at $100. This allows investors of all sizes to participate in legal tech startups.",
  },
  {
    question: "How are returns generated and distributed?",
    answer: "Returns are generated through equity appreciation, revenue sharing, or dividend payments, depending on the specific investment. Distributions typically occur quarterly, but this can vary by opportunity.",
  },
  {
    question: "What fees does LawBit charge?",
    answer: "LawBit charges a 2% management fee on invested capital and a 10% carry fee on profits. There are no hidden fees, and we only succeed when you succeed.",
  },
  {
    question: "How are investment opportunities vetted?",
    answer: "Our team conducts rigorous due diligence on all potential opportunities, including legal compliance, market analysis, team evaluation, financial projection validation, and technical assessment.",
  },
  {
    question: "Can I sell my investment before the exit?",
    answer: "Some investments offer secondary market liquidity after a lock-up period, typically 12 months. However, these are primarily designed as long-term investments.",
  },
  {
    question: "What happens if a startup fails?",
    answer: "Investment in startups carries inherent risk, including the possibility of losing your investment. We recommend diversifying across multiple opportunities to mitigate risk.",
  },
  {
    question: "Are non-accredited investors allowed to participate?",
    answer: "Yes, we offer Regulation Crowdfunding opportunities that are open to all investors, regardless of accreditation status, subject to investment limits based on income and net worth.",
  },
  {
    question: "How is my data and personal information protected?",
    answer: "We implement bank-level security measures and encryption to protect your data. We never sell your personal information to third parties and maintain strict privacy controls.",
  },
];

export const InvestFAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    setOpenItems(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-bento-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <p className="text-bento-gray-600 dark:text-bento-gray-300 max-w-2xl mx-auto">
          Everything you need to know about investing in legal tech startups
        </p>
      </div>
      
      <Accordion type="multiple" value={openItems} className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-white/80 dark:bg-bento-brown-800/80 backdrop-blur-sm rounded-lg border border-bento-gray-200 dark:border-bento-gray-700 overflow-hidden"
          >
            <AccordionTrigger 
              onClick={() => toggleItem(`item-${index}`)}
              className="px-6 py-4 text-left font-medium text-bento-gray-900 dark:text-white hover:no-underline hover:bg-bento-gray-50 dark:hover:bg-bento-brown-700/50"
            >
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0 text-bento-gray-600 dark:text-bento-gray-300">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
