import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowRight, Brain, FileText, Shield, Zap, BarChart, Lock, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI-Powered Analysis",
    description: "Advanced AI algorithms analyze contracts for risks, compliance, and opportunities."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Risk Assessment",
    description: "Comprehensive risk scoring and detailed analysis of potential issues."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Smart Recommendations",
    description: "Get actionable insights and suggestions for contract improvements."
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: "Analytics Dashboard",
    description: "Visual insights and trends for better decision-making."
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Secure & Private",
    description: "Enterprise-grade security with end-to-end encryption."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Work together seamlessly with your legal team."
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container px-4 mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">
              <span className="legal-gradient-text">Law</span>
              <span className="text-primary">Bit</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
        
        {/* Animated Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-ai-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        
        {/* Neural Network Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_1px_1px,currentColor_1px,transparent_0)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Content */}
        <div className="container px-4 mx-auto text-center relative z-10">
          {/* Logo with enhanced animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto w-24 h-24 mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="legal-gradient-text">Law</span>
                <span className="text-primary">Bit</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              >
                AI-powered legal document analysis that simplifies complex legal processes and reduces risks.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/signup">
                <Button size="lg" className="legal-button min-w-[180px] gap-2">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary/20 hover:border-primary/40">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze and manage legal documents efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="legal-card p-6 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden legal-card rounded-2xl p-8 md:p-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,hsl(var(--primary)/0.15),transparent)]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your legal workflow?</h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of professionals who use LawBit to streamline their legal document processes.
                </p>
              </div>
              
              <Link to="/dashboard">
                <Button size="lg" className="legal-button min-w-[180px] gap-2">
                  <span>Try It Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
        <div className="container px-4 mx-auto relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-medium legal-gradient-text">AI</span> • Built with ❤️ by LawBit Team
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors legal-hover">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors legal-hover">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 