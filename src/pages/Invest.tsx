
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InvestHero } from "@/components/invest/InvestHero";
import { InvestOpportunities } from "@/components/invest/InvestOpportunities";
import { InvestStats } from "@/components/invest/InvestStats";
import { InvestTestimonials } from "@/components/invest/InvestTestimonials";
import { InvestFAQ } from "@/components/invest/InvestFAQ";
import { InvestCTA } from "@/components/invest/InvestCTA";

const Invest = () => {
  const [selectedTab, setSelectedTab] = useState<"opportunities" | "portfolio" | "returns">("opportunities");

  return (
    <AppLayout className="px-0">
      <div className="w-full overflow-x-hidden">
        <InvestHero 
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
        
        {selectedTab === "opportunities" && <InvestOpportunities />}
        {selectedTab === "portfolio" && <InvestStats />}
        {selectedTab === "returns" && <InvestStats isReturns />}
        
        <InvestTestimonials />
        <InvestFAQ />
        <InvestCTA />
      </div>
    </AppLayout>
  );
};

export default Invest;
