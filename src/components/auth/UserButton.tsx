
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Settings, User, CreditCard, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

export function UserButton() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="gap-2 text-lawbit-orange-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }
  
  if (!user) {
    return (
      <Button variant="glass" size="sm" asChild className="bg-orange-brown-gradient hover:bg-orange-brown-gradient-hover text-white glow-effect">
        <Link to="/auth">Sign In</Link>
      </Button>
    );
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "??";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass" className="relative h-9 w-9 rounded-full glow-effect p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
            <AvatarFallback className="bg-orange-brown-gradient text-white">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 backdrop-blur-md bg-glass border-glass-border shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="bg-glass-light rounded-t-lg">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-lawbit-orange-400">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-lawbit-orange-500/20" />
        <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-glass-light hover:text-lawbit-orange-400">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-glass-light hover:text-lawbit-orange-400">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/subscription')} className="hover:bg-glass-light hover:text-lawbit-orange-400">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/support')} className="hover:bg-glass-light hover:text-lawbit-orange-400">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-lawbit-orange-500/20" />
        <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive hover:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
