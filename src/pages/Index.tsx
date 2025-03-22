import { Link } from "react-router-dom";
import { ArrowRight, Brain, FileText, ListChecks, Shield, Scale, BookOpen, Sparkles, Star, Check } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ModeToggle } from "@/components/mode-toggle";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Index = () => {
  return (
    <div className="bg-black text-gray-200 min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="startup-nav fixed top-0 left-0 right-0 z-50 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-orange-500/90 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Lawbit</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
          </div>
          
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link to="/dashboard">
              <button className="startup-button">
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section - Replaced with HeroGeometric */}
      <HeroGeometric 
        badge="AI-Powered Legal Documents"
        title1="Transform Legal Documents"
        title2="with AI Intelligence"
        description="Lawbit simplifies legal document creation and analysis with powerful AI, making complex legal processes accessible to everyone."
      />
      
      {/* Features Section */}
      <section id="features" className="startup-section bg-black/95">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 rounded-full bg-gray-800 px-3 py-1 text-sm font-medium text-orange-500">
              Features
            </div>
            <h2 className="text-4xl font-bold mb-4">Legal Intelligence at Your Fingertips</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Create, analyze, and understand legal documents with our AI-powered platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="startup-card">
              <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-5 border border-gray-700">
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intelligent Contract Generation</h3>
              <p className="text-gray-400">Create customized legal agreements with our AI, tailored to your specific requirements.</p>
            </div>
            
            <div className="startup-card">
              <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-5 border border-gray-700">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
              <p className="text-gray-400">Identify potential issues with color-coded risk scores for all contract terms.</p>
            </div>
            
            <div className="startup-card">
              <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-5 border border-gray-700">
                <ListChecks className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Clause Identification</h3>
              <p className="text-gray-400">Automatically detect important clauses and categorize them for easy review.</p>
            </div>
            
            <div className="startup-card">
              <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-5 border border-gray-700">
                <Brain className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Contract Simplification</h3>
              <p className="text-gray-400">Translate legal jargon into clear, plain language everyone can understand.</p>
            </div>
            
            <div className="startup-card">
              <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-5 border border-gray-700">
                <Scale className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compliance Checking</h3>
              <p className="text-gray-400">Ensure your documents meet legal requirements across different jurisdictions.</p>
            </div>
            
            <div className="startup-card">
              <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-5 border border-gray-700">
                <BookOpen className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Contract Library</h3>
              <p className="text-gray-400">Access and manage all your documents in one secure, organized place.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="startup-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 rounded-full bg-gray-800 px-3 py-1 text-sm font-medium text-orange-500">
              Process
            </div>
            <h2 className="text-4xl font-bold mb-4">How Lawbit Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform simplifies legal document creation and analysis in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl border border-gray-700">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Input Requirements</h3>
              <p className="text-gray-400">Simply describe what you need or upload an existing document for analysis.</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl border border-gray-700">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-gray-400">Our AI analyzes your input, generating contracts or providing detailed document insights.</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl border border-gray-700">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Review & Download</h3>
              <p className="text-gray-400">Review the results, make adjustments if needed, and export in your preferred format.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="startup-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 rounded-full bg-gray-800 px-3 py-1 text-sm font-medium text-orange-500">
              Pricing
            </div>
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that's right for your needs
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="startup-card p-8">
              <div className="mb-4 text-lg font-medium text-gray-300">Free Plan</div>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Generate up to 2 contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Analyze up to 5 documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Basic risk assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Contract library</span>
                </li>
              </ul>
              
              <button className="startup-button-outline w-full">Get Started</button>
            </div>
            
            <div className="startup-card p-8 border-orange-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-semibold px-4 py-1">
                POPULAR
              </div>
              
              <div className="mb-4 text-lg font-medium text-gray-300">Premium Plan</div>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">10,000 tokens per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Generate unlimited contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Analyze unlimited documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Advanced risk assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Custom templates</span>
                </li>
              </ul>
              
              <button className="startup-button w-full">Upgrade Now</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="startup-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 rounded-full bg-gray-800 px-3 py-1 text-sm font-medium text-orange-500">
              Testimonials
            </div>
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of professionals who trust Lawbit for their legal document needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="startup-card">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">Lawbit has saved our legal team countless hours reviewing contracts. The risk assessment feature is particularly valuable.</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                  <span className="text-orange-500 font-medium">SJ</span>
                </div>
                <div>
                  <p className="font-medium">Sarah J.</p>
                  <p className="text-sm text-gray-500">Legal Counsel</p>
                </div>
              </div>
            </div>
            
            <div className="startup-card">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">As a small business owner, I couldn't afford expensive legal services. Lawbit makes creating solid contracts accessible.</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                  <span className="text-orange-500 font-medium">MT</span>
                </div>
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-sm text-gray-500">Startup Founder</p>
                </div>
              </div>
            </div>
            
            <div className="startup-card">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">The ability to analyze complex documents and highlight potential issues has been a game-changer for our compliance team.</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                  <span className="text-orange-500 font-medium">ER</span>
                </div>
                <div>
                  <p className="font-medium">Elena R.</p>
                  <p className="text-sm text-gray-500">Compliance Officer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden startup-card p-12 bg-gradient-to-r from-gray-900 to-black">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your legal workflow?</h2>
                <p className="text-xl text-gray-400">
                  Join thousands of professionals who use Lawbit to streamline their legal document processes.
                </p>
              </div>
              
              <Link to="/dashboard">
                <button className="startup-button">
                  Try It Now 
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="h-8 w-8 rounded bg-orange-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-lg">Lawbit</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Lawbit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
