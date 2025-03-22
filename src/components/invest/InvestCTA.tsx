
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const InvestCTA = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Card className="relative overflow-hidden bg-gradient-to-br from-bento-yellow-500/90 to-bento-orange-600/90 border-none rounded-2xl shadow-xl card-shine">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBhNiA2IDAgMSAxLTEyIDAgNiA2IDAgMCAxIDEyIDB6TTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 px-6 py-12 md:py-16 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Invest in Legal Innovation?</h2>
            <p className="text-white/90 text-lg md:text-xl mb-6">
              Join thousands of investors building wealth while supporting the future of legal technology. Start with as little as $100 today.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-white text-bento-orange-600 hover:bg-bento-gray-100 transition-all gap-2">
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 transition-all">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 space-y-4 w-full max-w-xs">
            <div className="text-white text-center">
              <h3 className="text-xl font-bold mb-1">Investment Highlights</h3>
              <p className="text-white/80 text-sm">Why investors choose LawBit</p>
            </div>
            
            <div className="space-y-3">
              <HighlightItem text="Curated legal tech startups" />
              <HighlightItem text="Low $100 minimum investment" />
              <HighlightItem text="12.7% average annual return" />
              <HighlightItem text="Transparent fee structure" />
              <HighlightItem text="Detailed investment analysis" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const HighlightItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <span className="text-white text-sm">{text}</span>
  </div>
);
