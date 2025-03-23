
import { cn } from "@/lib/utils";
import { QuotaDisplay, QuotaData } from "../quota/QuotaDisplay";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  // Quota data (would come from a real API in production)
  const quota: QuotaData = {
    contractsUsed: 1,
    contractsLimit: 2,
    analysesUsed: 3,
    analysesLimit: 5,
  };

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col relative bg-[#E0E0E0]",
      )}
    >
      <main className="flex-1 flex items-start justify-center py-2 px-4">
        <div className={cn("w-full max-w-5xl mx-auto", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
