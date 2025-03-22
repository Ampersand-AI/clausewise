
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, BarChart, TrendingUp, Users, Timer, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const opportunities = [
  {
    id: 1,
    name: "LegalFlow AI",
    description: "AI-powered legal document automation for small law firms",
    category: "AI & Automation",
    raisedAmount: 850000,
    targetAmount: 1000000,
    annualReturn: "14-16%",
    minInvestment: 100,
    investorsCount: 432,
    daysLeft: 12,
    riskLevel: "Medium",
    trending: true,
  },
  {
    id: 2,
    name: "Juris Protocol",
    description: "Blockchain-based platform for secure legal agreements and smart contracts",
    category: "Blockchain",
    raisedAmount: 1250000,
    targetAmount: 2000000,
    annualReturn: "11-13%",
    minInvestment: 250,
    investorsCount: 789,
    daysLeft: 24,
    riskLevel: "High",
    trending: false,
  },
  {
    id: 3,
    name: "CaseTrack Pro",
    description: "Case management platform with integrated billing and analytics",
    category: "Practice Management",
    raisedAmount: 420000,
    targetAmount: 600000,
    annualReturn: "9-11%",
    minInvestment: 150,
    investorsCount: 287,
    daysLeft: 8,
    riskLevel: "Low",
    trending: true,
  },
  {
    id: 4,
    name: "LexConnect",
    description: "Client communication platform for secure document sharing and messaging",
    category: "Legal Services",
    raisedAmount: 750000,
    targetAmount: 1200000,
    annualReturn: "10-12%",
    minInvestment: 200,
    investorsCount: 356,
    daysLeft: 18,
    riskLevel: "Medium",
    trending: false,
  },
  {
    id: 5,
    name: "JuryInsight",
    description: "Data analytics platform for jury selection and trial strategy",
    category: "Legal Analytics",
    raisedAmount: 380000,
    targetAmount: 500000,
    annualReturn: "12-14%",
    minInvestment: 125,
    investorsCount: 195,
    daysLeft: 7,
    riskLevel: "Medium",
    trending: true,
  },
  {
    id: 6,
    name: "ComplySphere",
    description: "Regulatory compliance management solution for legal departments",
    category: "Compliance",
    raisedAmount: 920000,
    targetAmount: 1500000,
    annualReturn: "8-10%",
    minInvestment: 175,
    investorsCount: 412,
    daysLeft: 21,
    riskLevel: "Low",
    trending: false,
  },
];

export const InvestOpportunities = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  const filteredOpportunities = opportunities.filter(opportunity => 
    (!selectedCategory || opportunity.category === selectedCategory) &&
    (!selectedRisk || opportunity.riskLevel === selectedRisk)
  );

  const categories = [...new Set(opportunities.map(o => o.category))];
  const riskLevels = [...new Set(opportunities.map(o => o.riskLevel))];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-bento-gray-900 dark:text-white mb-2">Investment Opportunities</h2>
          <p className="text-bento-gray-600 dark:text-bento-gray-300">Explore curated legal tech startups seeking funding</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-bento-gray-300 dark:border-bento-gray-600"
              onClick={() => setSelectedCategory(null)}
            >
              <Filter className="w-4 h-4" /> 
              Category: {selectedCategory || "All"}
            </Button>
            <div className="absolute z-50 hidden group-hover:block mt-2 right-0 bg-white dark:bg-bento-brown-800 shadow-lg rounded-lg border border-bento-gray-200 dark:border-bento-gray-700 p-2 min-w-48">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md ${!selectedCategory ? 'bg-bento-gray-100 dark:bg-bento-brown-700' : 'hover:bg-bento-gray-50 dark:hover:bg-bento-brown-700'}`}
              >
                All
              </button>
              {categories.map(category => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md ${selectedCategory === category ? 'bg-bento-gray-100 dark:bg-bento-brown-700' : 'hover:bg-bento-gray-50 dark:hover:bg-bento-brown-700'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-bento-gray-300 dark:border-bento-gray-600"
              onClick={() => setSelectedRisk(null)}
            >
              <Filter className="w-4 h-4" /> 
              Risk: {selectedRisk || "All"}
            </Button>
            <div className="absolute z-50 hidden group-hover:block mt-2 right-0 bg-white dark:bg-bento-brown-800 shadow-lg rounded-lg border border-bento-gray-200 dark:border-bento-gray-700 p-2 min-w-36">
              <button 
                onClick={() => setSelectedRisk(null)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md ${!selectedRisk ? 'bg-bento-gray-100 dark:bg-bento-brown-700' : 'hover:bg-bento-gray-50 dark:hover:bg-bento-brown-700'}`}
              >
                All
              </button>
              {riskLevels.map(risk => (
                <button 
                  key={risk}
                  onClick={() => setSelectedRisk(risk)}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md ${selectedRisk === risk ? 'bg-bento-gray-100 dark:bg-bento-brown-700' : 'hover:bg-bento-gray-50 dark:hover:bg-bento-brown-700'}`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
};

interface OpportunityCardProps {
  opportunity: typeof opportunities[0];
}

const OpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  const progress = (opportunity.raisedAmount / opportunity.targetAmount) * 100;
  
  return (
    <Card className="overflow-hidden hover-scale transition-all duration-500 card-shine">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant={opportunity.riskLevel === "Low" ? "success" : opportunity.riskLevel === "Medium" ? "warning" : "destructive"} className="mb-2">
              {opportunity.riskLevel} Risk
            </Badge>
            {opportunity.trending && (
              <Badge variant="secondary" className="ml-2 mb-2">
                <TrendingUp className="w-3 h-3 mr-1" /> Trending
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="bg-white/50 dark:bg-bento-brown-800/50 backdrop-blur-sm">
            {opportunity.category}
          </Badge>
        </div>
        <CardTitle className="text-xl">{opportunity.name}</CardTitle>
        <CardDescription>{opportunity.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-bento-gray-600 dark:text-bento-gray-400">Raised: ${opportunity.raisedAmount.toLocaleString()}</span>
              <span className="font-medium">${opportunity.targetAmount.toLocaleString()}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-bento-gray-500 dark:text-bento-gray-400">Annual Return</span>
              <span className="font-medium text-bento-orange-600 dark:text-bento-orange-400">{opportunity.annualReturn}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-bento-gray-500 dark:text-bento-gray-400">Min Investment</span>
              <span className="font-medium">${opportunity.minInvestment}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-bento-gray-500 dark:text-bento-gray-400">Investors</span>
              <div className="flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-bento-gray-400" />
                <span className="font-medium">{opportunity.investorsCount}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-bento-gray-500 dark:text-bento-gray-400">Time Left</span>
              <div className="flex items-center">
                <Timer className="w-3.5 h-3.5 mr-1 text-bento-gray-400" />
                <span className="font-medium">{opportunity.daysLeft} days</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-bento-yellow-500 hover:bg-bento-yellow-600 text-white dark:bg-bento-yellow-600 dark:hover:bg-bento-yellow-700 gap-1">
          Invest Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
