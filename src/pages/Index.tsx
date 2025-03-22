
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, FileText, ListChecks, Shield, Star, BookOpen, Scale, LucideCode } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ModeToggle } from "@/components/mode-toggle";

const Index = () => {
  return (
    <AppLayout className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent dark:from-primary/10 dark:to-background" />
        
        {/* Green gradient blobs */}
        <div className="absolute h-40 w-40 bg-green-400/20 rounded-full blur-3xl -top-20 -right-20" />
        <div className="absolute h-60 w-60 bg-teal-300/20 rounded-full blur-3xl -bottom-32 -left-32" />
        <div className="absolute h-32 w-32 bg-emerald-400/20 rounded-full blur-3xl bottom-40 right-20" />
        
        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-8">
              <div className="h-24 w-24 mb-4 relative">
                <img 
                  src="/lovable-uploads/685f9d8f-3d98-458c-82d3-043a700e63d0.png" 
                  alt="Lawbit Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in [animation-delay:200ms]">
                <span className="text-gradient">Law</span><span className="text-teal-500">bit</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in [animation-delay:400ms]">
                AI-powered legal document creation and analysis that simplifies complex legal processes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:600ms]">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 min-w-[180px] gap-2 text-white">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-teal-400/20 hover:border-teal-400/40">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Choose theme</span>
          <ModeToggle />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 border-y border-border bg-gradient-to-b from-teal-50/50 to-transparent dark:from-teal-950/10 dark:to-transparent">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Legal Intelligence at Your Fingertips</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create, analyze, and understand legal documents with our AI-powered platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText className="h-6 w-6 text-teal-500" />}
              title="Intelligent Contract Generation"
              description="Create customized legal agreements with our AI, tailored to your specific requirements."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-teal-500" />}
              title="Risk Assessment"
              description="Identify potential issues with color-coded risk scores for all contract terms."
            />
            <FeatureCard 
              icon={<ListChecks className="h-6 w-6 text-teal-500" />}
              title="Clause Identification"
              description="Automatically detect important clauses and categorize them for easy review."
            />
            <FeatureCard 
              icon={<Brain className="h-6 w-6 text-teal-500" />}
              title="Contract Simplification"
              description="Translate legal jargon into clear, plain language everyone can understand."
            />
            <FeatureCard 
              icon={<Scale className="h-6 w-6 text-teal-500" />}
              title="Compliance Checking"
              description="Ensure your documents meet legal requirements across different jurisdictions."
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6 text-teal-500" />}
              title="Contract Library"
              description="Access and manage all your documents in one secure, organized place."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Lawbit Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies legal document creation and analysis in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard 
              number={1}
              title="Input Your Requirements"
              description="Simply describe what you need or upload an existing document for analysis."
            />
            <StepCard 
              number={2}
              title="AI Processing"
              description="Our AI analyzes your input, generating contracts or providing detailed document insights."
            />
            <StepCard 
              number={3}
              title="Review and Download"
              description="Review the results, make adjustments if needed, and export in your preferred format."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-teal-50/50 dark:to-teal-950/10">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who trust Lawbit for their legal document needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard 
              quote="Lawbit has saved our legal team countless hours reviewing contracts. The risk assessment feature is particularly valuable."
              author="Sarah J., Legal Counsel"
              role="Tech Company"
            />
            <TestimonialCard 
              quote="As a small business owner, I couldn't afford expensive legal services. Lawbit makes creating solid contracts accessible."
              author="Michael T."
              role="Startup Founder"
            />
            <TestimonialCard 
              quote="The ability to analyze complex documents and highlight potential issues has been a game-changer for our compliance team."
              author="Elena R."
              role="Compliance Officer"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="relative overflow-hidden glass-card rounded-2xl p-8 md:p-12 bg-gradient-to-r from-teal-500/10 to-emerald-500/10">
            <div className="absolute inset-0 backdrop-blur-sm" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your legal workflow?</h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of professionals who use Lawbit to streamline their legal document processes.
                </p>
              </div>
              
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 min-w-[180px] gap-2 text-white">
                  Try It Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md overflow-hidden">
                <img 
                  src="/lovable-uploads/685f9d8f-3d98-458c-82d3-043a700e63d0.png" 
                  alt="Lawbit Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-medium text-lg">Lawbit</span>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lawbit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-xl hover-scale bg-white/80 dark:bg-gray-800/60 border border-teal-200/40 dark:border-teal-700/30">
      <div className="h-12 w-12 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4 border border-teal-100 dark:border-teal-800/50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center mb-4 text-white font-bold text-2xl">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-100 dark:border-teal-900/30">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="italic mb-4 text-gray-700 dark:text-gray-300">"{quote}"</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

export default Index;
