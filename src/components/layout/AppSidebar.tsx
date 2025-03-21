
import { FileText, Home, Plus, Settings, Upload } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

type RecentDocument = {
  id: string;
  title: string;
  date: string;
  status: "analyzing" | "completed" | "error";
};

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Upload Document",
    icon: Upload,
    path: "/upload",
  },
  {
    title: "Recent Documents",
    icon: FileText,
    path: "/documents",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);

  // Load recent documents from localStorage
  useEffect(() => {
    const loadRecentDocuments = () => {
      try {
        const storedDocs = localStorage.getItem('documents');
        if (storedDocs) {
          const allDocs = JSON.parse(storedDocs);
          // Only show completed documents, limit to 5 most recent
          const recent = allDocs
            .filter((doc: any) => doc.status === 'completed')
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((doc: any) => ({
              id: doc.id,
              title: doc.title,
              date: doc.date,
              status: doc.status
            }));
          
          setRecentDocuments(recent);
        }
      } catch (error) {
        console.error('Error loading recent documents:', error);
      }
    };

    loadRecentDocuments();
    
    // Listen for storage events to update the sidebar when documents change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'documents') {
        loadRecentDocuments();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Also refresh documents when navigating back to dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      try {
        const storedDocs = localStorage.getItem('documents');
        if (storedDocs) {
          const allDocs = JSON.parse(storedDocs);
          const recent = allDocs
            .filter((doc: any) => doc.status === 'completed')
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((doc: any) => ({
              id: doc.id,
              title: doc.title,
              date: doc.date,
              status: doc.status
            }));
          
          setRecentDocuments(recent);
        }
      } catch (error) {
        console.error('Error loading recent documents:', error);
      }
    }
  }, [location.pathname]);

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <Link to="/dashboard">
            <Button className="w-full justify-start gap-2 bg-primary-gradient hover:bg-primary-gradient-hover">
              <Plus className="h-4 w-4" />
              <span>New Analysis</span>
            </Button>
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className={location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {recentDocuments.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent Documents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentDocuments.map(doc => (
                  <SidebarMenuItem key={doc.id}>
                    <SidebarMenuButton asChild>
                      <Link to={`/document/${doc.id}`} className="flex items-center gap-3">
                        <FileText className="h-4 w-4" />
                        <div className="flex flex-col items-start">
                          <span className="text-sm truncate w-32">{doc.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
