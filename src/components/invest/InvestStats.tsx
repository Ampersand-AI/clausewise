
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, BarChart, PieChart } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface InvestStatsProps {
  isReturns?: boolean;
}

export const InvestStats = ({ isReturns = false }: InvestStatsProps) => {
  // Sample data
  const monthlyData = [
    { name: "Jan", value: isReturns ? 2400 : 4000 },
    { name: "Feb", value: isReturns ? 2700 : 3000 },
    { name: "Mar", value: isReturns ? 3900 : 2000 },
    { name: "Apr", value: isReturns ? 2780 : 2780 },
    { name: "May", value: isReturns ? 4800 : 1890 },
    { name: "Jun", value: isReturns ? 3908 : 2390 },
    { name: "Jul", value: isReturns ? 4800 : 3490 },
    { name: "Aug", value: isReturns ? 3800 : 3490 },
    { name: "Sep", value: isReturns ? 4300 : 3490 },
    { name: "Oct", value: isReturns ? 5300 : 3490 },
    { name: "Nov", value: isReturns ? 5800 : 3490 },
    { name: "Dec", value: isReturns ? 6100 : 3490 },
  ];

  const categoryData = [
    { name: "AI & Automation", value: 40 },
    { name: "Blockchain", value: 15 },
    { name: "Practice Management", value: 20 },
    { name: "Legal Services", value: 10 },
    { name: "Compliance", value: 15 },
  ];

  const performanceData = [
    { name: "LegalFlow AI", value: 15.8 },
    { name: "Juris Protocol", value: 12.3 },
    { name: "CaseTrack Pro", value: 10.5 },
    { name: "LexConnect", value: 11.2 },
    { name: "JuryInsight", value: 13.7 },
    { name: "ComplySphere", value: 9.8 },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-bento-gray-900 dark:text-white mb-2">
          {isReturns ? "Investment Returns" : "Portfolio Analytics"}
        </h2>
        <p className="text-bento-gray-600 dark:text-bento-gray-300">
          {isReturns 
            ? "Track your investment returns and performance"
            : "View your portfolio allocation and performance metrics"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="card-shine">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              {isReturns ? "Monthly Returns" : "Portfolio Value"}
              {isReturns ? (
                <Badge variant="success" className="ml-2 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +12.7%
                </Badge>
              ) : null}
            </CardTitle>
            <CardDescription>
              {isReturns 
                ? "Your monthly investment returns"
                : "Value of your investments over time"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <AreaChart
              data={monthlyData}
              categories={["value"]}
              index="name"
              colors={["#f97316"]}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              className="h-72"
              showLegend={false}
              showGridLines={false}
              startEndOnly={true}
            />
          </CardContent>
        </Card>

        <Card className="card-shine">
          <CardHeader>
            <CardTitle className="text-xl">
              {isReturns ? "Performance by Investment" : "Portfolio Allocation"}
            </CardTitle>
            <CardDescription>
              {isReturns 
                ? "Annual returns by investment"
                : "How your investments are distributed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {isReturns ? (
              <BarChart
                data={performanceData}
                categories={["value"]}
                index="name"
                colors={["#eab308"]}
                valueFormatter={(value) => `${value}%`}
                className="h-72"
                showLegend={false}
              />
            ) : (
              <PieChart
                data={categoryData}
                category="value"
                index="name"
                valueFormatter={(value) => `${value}%`}
                className="h-72"
                colors={["#eab308", "#f97316", "#78716c", "#ea580c", "#ca8a04"]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title={isReturns ? "Total Returns" : "Total Invested"}
          value={isReturns ? "$12,580" : "$45,750"}
          description={isReturns ? "Since inception" : "Across 6 investments"}
          trend={isReturns ? 18.7 : undefined}
          icon={isReturns ? <TrendingUp className="w-4 h-4" /> : undefined}
        />
        <StatsCard
          title={isReturns ? "Annual Return" : "Average Investment"}
          value={isReturns ? "12.7%" : "$7,625"}
          description={isReturns ? "Annualized rate" : "Per investment"}
          trend={isReturns ? 2.3 : undefined}
          icon={isReturns ? <TrendingUp className="w-4 h-4" /> : undefined}
        />
        <StatsCard
          title={isReturns ? "Monthly Dividend" : "Risk Level"}
          value={isReturns ? "$420" : "Medium"}
          description={isReturns ? "Average monthly" : "Overall portfolio risk"}
          trend={isReturns ? -0.8 : undefined}
          icon={isReturns ? <TrendingDown className="w-4 h-4 text-destructive" /> : <AlertCircle className="w-4 h-4 text-warning" />}
        />
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend?: number;
  icon?: React.ReactNode;
}

const StatsCard = ({ title, value, description, trend, icon }: StatsCardProps) => {
  return (
    <Card className="card-shine">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {description}
          {trend !== undefined && (
            <Badge variant={trend > 0 ? "success" : "destructive"} className="ml-2 text-xs">
              {trend > 0 ? "+" : ""}{trend}%
            </Badge>
          )}
        </p>
      </CardContent>
    </Card>
  );
};
