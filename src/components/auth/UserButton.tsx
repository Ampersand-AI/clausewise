
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
      <Button variant="ghost" size="sm" className="gap-2 text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }
  
  if (!user) {
    return (
      <Button variant="ghost" size="sm" asChild className="orange-button text-white glow-button">
        <Link to="/auth">Sign In</Link>
      </Button>
    );
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "??";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
            <AvatarFallback className="bg-orange-gradient text-white">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-900/95 border border-zinc-700 backdrop-blur-md" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-200">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem onClick={() => navigate('/profile')} className="text-gray-300 hover:text-white hover:bg-zinc-800">
          <User className="mr-2 h-4 w-4 text-orange-500" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')} className="text-gray-300 hover:text-white hover:bg-zinc-800">
          <Settings className="mr-2 h-4 w-4 text-orange-500" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/subscription')} className="text-gray-300 hover:text-white hover:bg-zinc-800">
          <CreditCard className="mr-2 h-4 w-4 text-orange-500" />
          <span>Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/support')} className="text-gray-300 hover:text-white hover:bg-zinc-800">
          <HelpCircle className="mr-2 h-4 w-4 text-orange-500" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem onClick={() => signOut()} className="text-red-400 hover:text-red-300 hover:bg-zinc-800 focus:text-red-300">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
