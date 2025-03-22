
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, FileText, ListChecks, Shield, Scale, BookOpen, Sparkles, Star } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ModeToggle } from "@/components/mode-toggle";

const Index = () => {
  return (
    <AppLayout className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-lawbit-orange-500/5 to-transparent dark:from-lawbit-orange-500/10 dark:to-background" />
        
        {/* Orange-brown gradient blobs */}
        <div className="absolute h-40 w-40 bg-lawbit-orange-400/20 rounded-full blur-3xl -top-20 -right-20" />
        <div className="absolute h-60 w-60 bg-lawbit-brown-300/20 rounded-full blur-3xl -bottom-32 -left-32" />
        <div className="absolute h-32 w-32 bg-lawbit-orange-500/20 rounded-full blur-3xl bottom-40 right-20" />
        
        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-8">
              <div className="mb-6 relative">
                <div className="h-24 w-24 bg-gradient-to-br from-lawbit-orange-500 to-lawbit-brown-600 rounded-full flex items-center justify-center shadow-lg glow-effect">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in [animation-delay:200ms]">
                <span className="text-gradient">Law</span><span className="text-lawbit-orange-500">bit</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in [animation-delay:400ms]">
                AI-powered legal document creation and analysis that simplifies complex legal processes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:600ms]">
              <Link to="/dashboard">
                <Button size="lg" className="bg-orange-brown-gradient hover:bg-orange-brown-gradient-hover min-w-[180px] gap-2 text-white glow-effect">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-lawbit-orange-400/20 hover:border-lawbit-orange-400/40">
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
      <section className="py-24 border-y border-border bg-gradient-to-b from-lawbit-orange-50/50 to-transparent dark:from-lawbit-brown-900/10 dark:to-transparent">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Legal Intelligence at Your Fingertips</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create, analyze, and understand legal documents with our AI-powered platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText className="h-6 w-6 text-lawbit-orange-500" />}
              title="Intelligent Contract Generation"
              description="Create customized legal agreements with our AI, tailored to your specific requirements."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-lawbit-orange-500" />}
              title="Risk Assessment"
              description="Identify potential issues with color-coded risk scores for all contract terms."
            />
            <FeatureCard 
              icon={<ListChecks className="h-6 w-6 text-lawbit-orange-500" />}
              title="Clause Identification"
              description="Automatically detect important clauses and categorize them for easy review."
            />
            <FeatureCard 
              icon={<Brain className="h-6 w-6 text-lawbit-orange-500" />}
              title="Contract Simplification"
              description="Translate legal jargon into clear, plain language everyone can understand."
            />
            <FeatureCard 
              icon={<Scale className="h-6 w-6 text-lawbit-orange-500" />}
              title="Compliance Checking"
              description="Ensure your documents meet legal requirements across different jurisdictions."
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6 text-lawbit-orange-500" />}
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
      <section className="py-24 bg-gradient-to-b from-transparent to-lawbit-orange-50/50 dark:to-lawbit-brown-900/10">
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
      
      {/* Pricing Section - New */}
      <section className="py-24 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your legal document needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-6 rounded-xl hover-scale">
              <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="text-muted-foreground mb-6">Perfect for occasional use</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>Generate up to 2 contracts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>Analyze up to 5 documents</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>Basic risk assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>Contract library</span>
                </li>
              </ul>
              
              <Button className="w-full bg-lawbit-orange-500 hover:bg-lawbit-orange-600 text-white">
                Get Started
              </Button>
            </div>
            
            {/* Premium Plan */}
            <div className="premium-card p-6 rounded-xl hover-scale relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-brown-gradient text-white text-xs font-semibold px-3 py-1">
                POPULAR
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Premium Plan</h3>
              <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="text-muted-foreground mb-6">For professionals and businesses</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>10,000 tokens per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>Generate up to 5 agreements</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>Analyze up to 10 contracts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>Advanced risk assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-lawbit-orange-100 dark:bg-lawbit-orange-900/30 flex items-center justify-center">
                    <span className="text-xs text-lawbit-orange-700 dark:text-lawbit-orange-300">✓</span>
                  </div>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Button className="w-full bg-orange-brown-gradient hover:bg-orange-brown-gradient-hover text-white glow-effect">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="relative overflow-hidden glass-card rounded-2xl p-8 md:p-12 bg-gradient-to-r from-lawbit-orange-500/10 to-lawbit-brown-500/10">
            <div className="absolute inset-0 backdrop-blur-sm" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your legal workflow?</h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of professionals who use Lawbit to streamline their legal document processes.
                </p>
              </div>
              
              <Link to="/dashboard">
                <Button size="lg" className="bg-orange-brown-gradient hover:bg-orange-brown-gradient-hover min-w-[180px] gap-2 text-white glow-effect">
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
              <div className="h-8 w-8 rounded-md overflow-hidden bg-gradient-to-br from-lawbit-orange-500 to-lawbit-brown-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
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
    <div className="glass-card glass-card-hover p-6 rounded-xl hover-scale bg-white/80 dark:bg-gray-800/60 border border-lawbit-orange-200/40 dark:border-lawbit-orange-700/30">
      <div className="h-12 w-12 rounded-lg bg-lawbit-orange-50 dark:bg-lawbit-orange-900/30 flex items-center justify-center mb-4 border border-lawbit-orange-100 dark:border-lawbit-orange-800/50">
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
      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-lawbit-orange-400 to-lawbit-orange-500 flex items-center justify-center mb-4 text-white font-bold text-2xl">
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-lawbit-orange-100 dark:border-lawbit-orange-900/30">
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
