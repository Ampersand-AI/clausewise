
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
  className?: string;
}

export function HeroGeometric({
  badge = "Lawbit AI",
  title1 = "AI for Legal Contracts",
  title2 = "and Analysis",
  description = "Simplify legal document creation and analysis with powerful AI, making complex legal processes accessible to everyone.",
  className,
}: HeroGeometricProps) {
  return (
    <div className={cn("relative overflow-hidden py-20 md:py-32", className)}>
      {/* Geometric shapes background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-60 w-60 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-60 w-60 rounded-full bg-gray-800/30 blur-3xl" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          {badge && (
            <div className="inline-block">
              <Badge variant="dark" className="rounded-full px-4 py-1.5 text-sm font-medium">
                {badge}
              </Badge>
            </div>
          )}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              <span className="startup-gradient-text block">{title1}</span>
              <span className="text-white block">{title2}</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">{description}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="startup-button">
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <button className="startup-button-outline">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
