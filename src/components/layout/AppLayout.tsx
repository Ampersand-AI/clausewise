import { cn } from "@/lib/utils";
import { QuotaDisplay, QuotaData } from "../quota/QuotaDisplay";
import { ModeToggle } from "@/components/mode-toggle";
import { Brain, ChevronDown, FileText, Settings, User, Menu, X, Command, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuthContext();
  const { toast } = useToast();
  const quota: QuotaData = {
    contractsUsed: 1,
    contractsLimit: 2,
    analysesUsed: 3,
    analysesLimit: 5,
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add mouse move effect for cards
  useEffect(() => {
    const cards = document.querySelectorAll('.ai-card');
    
    const handleMouseMove = (e: MouseEvent) => {
      const card = (e.currentTarget as HTMLElement);
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };
    
    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
    });
    
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "You have been signed out.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while signing out.",
      });
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col relative",
      "bg-gradient-to-b from-background via-background to-background/80",
      "dark:from-background dark:via-background/95 dark:to-background/90"
    )}>
      {/* Professional Legal Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,hsl(var(--primary)/0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_800px,hsl(var(--ai-accent)/0.15),transparent)]" />
        <div className="absolute inset-0 legal-pattern opacity-30" />
      </div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "sticky top-0 z-50 w-full border-b",
          "legal-glass",
          "transition-all duration-300",
          isScrolled && "shadow-lg"
        )}
      >
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 mx-auto">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden legal-hover">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 legal-glass">
              <SheetHeader className="mb-4">
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <span className="font-bold legal-gradient-text">LawBit</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8 legal-focus-ring" />
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start gap-2 legal-hover">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </div>
                <div className="mt-2 p-3 rounded-lg bg-muted legal-depth">
                  <QuotaDisplay data={quota} compact />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo & Nav */}
          <div className="flex items-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 legal-hover"
              href="/"
            >
              <div className="relative">
                <Brain className="h-6 w-6 text-primary" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              </div>
              <span className="hidden font-bold text-lg sm:inline-block legal-gradient-text">
                LawBit
              </span>
            </motion.a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                className="pl-8 w-[200px] lg:w-[300px] h-9 legal-focus-ring"
              />
            </div>
            <div className="hidden md:flex items-center gap-6 px-4 py-1.5 rounded-full legal-glass">
              <QuotaDisplay data={quota} compact />
              <div className="h-4 w-px bg-border" />
              <ModeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full legal-hover">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 legal-glass">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="legal-hover">Profile</DropdownMenuItem>
                <DropdownMenuItem className="legal-hover">Settings</DropdownMenuItem>
                <DropdownMenuItem className="legal-hover">Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="legal-hover text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 flex-1 container max-w-screen-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "max-w-6xl mx-auto py-8 space-y-6",
            className
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-xl bg-primary/10 legal-border">
                <Command className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight legal-gradient-text">
                AI-Driven Precision in Contract Analysis
              </h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-xl border bg-card p-4 sm:p-6 md:p-8 legal-card"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            {children}
          </motion.div>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10 border-t legal-glass"
      >
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between h-16 gap-4">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-medium legal-gradient-text">AI</span> • Built with ❤️ by LawBit Team
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors legal-hover">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors legal-hover">Terms</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
