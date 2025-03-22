
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
import { Link } from "react-router-dom";

export function UserButton() {
  const { user, signOut, loading } = useAuth();
  
  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }
  
  if (!user) {
    return (
      <Button variant="glass" size="sm" asChild className="text-lawbit-orange-500">
        <Link to="/auth">Sign In</Link>
      </Button>
    );
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "??";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full glow-effect">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
            <AvatarFallback className="bg-orange-brown-gradient text-white">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
