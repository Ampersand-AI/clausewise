
import { ArrowRight, TrendingUp, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvestHeroProps {
  selectedTab: "opportunities" | "portfolio" | "returns";
  onTabChange: (tab: "opportunities" | "portfolio" | "returns") => void;
}

export const InvestHero = ({ selectedTab, onTabChange }: InvestHeroProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-bento-yellow-50 to-bento-orange-50 dark:from-bento-brown-800 dark:to-bento-brown-700 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-30 dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-bento-yellow-500/10 dark:bg-bento-yellow-500/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-bento-orange-500/10 dark:bg-bento-orange-500/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm rounded-full bg-bento-orange-100/60 dark:bg-bento-orange-900/20 text-bento-orange-700 dark:text-bento-orange-300 backdrop-blur-sm animate-fade-in">
          <TrendingUp className="w-4 h-4" />
          <span>Average annual return of 12.7%</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-bento-gray-900 dark:text-white animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Invest in <span className="text-gradient">Legal Tech</span> Startups
        </h1>
        
        <p className="text-lg md:text-xl text-bento-gray-600 dark:text-bento-gray-300 max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          Access exclusive investment opportunities in the legal technology sector. 
          Start building your portfolio with as little as $100.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <Button size="lg" className="bg-bento-orange-600 hover:bg-bento-orange-700 dark:bg-bento-orange-500 dark:hover:bg-bento-orange-600 text-white gap-2">
            Start Investing Now
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-bento-gray-300 text-bento-gray-700 hover:bg-bento-gray-100 dark:border-bento-gray-600 dark:text-bento-gray-300 dark:hover:bg-bento-brown-700">
            Learn More
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-3xl mx-auto border border-bento-gray-200 dark:border-bento-brown-700 rounded-lg bg-white/90 dark:bg-bento-brown-800/90 backdrop-blur-sm shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="flex flex-wrap">
            <TabButton 
              isActive={selectedTab === "opportunities"} 
              onClick={() => onTabChange("opportunities")}
              icon={<TrendingUp className="w-4 h-4" />}
              label="Opportunities"
            />
            <TabButton 
              isActive={selectedTab === "portfolio"} 
              onClick={() => onTabChange("portfolio")}
              icon={<Briefcase className="w-4 h-4" />}
              label="Portfolio"
            />
            <TabButton 
              isActive={selectedTab === "returns"} 
              onClick={() => onTabChange("returns")}
              icon={<DollarSign className="w-4 h-4" />}
              label="Returns"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton = ({ isActive, onClick, icon, label }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors flex-1 ${
      isActive 
        ? "bg-gradient-to-r from-bento-yellow-500 to-bento-orange-500 text-white" 
        : "text-bento-gray-600 hover:text-bento-gray-900 hover:bg-bento-gray-50 dark:text-bento-gray-300 dark:hover:text-white dark:hover:bg-bento-brown-700"
    }`}
  >
    {icon}
    {label}
  </button>
);
