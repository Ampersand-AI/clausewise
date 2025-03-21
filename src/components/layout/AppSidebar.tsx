
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

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <Button className="w-full justify-start gap-2 bg-primary-gradient hover:bg-primary-gradient-hover">
            <Plus className="h-4 w-4" />
            <span>New Analysis</span>
          </Button>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className={location.pathname === item.path ? "active" : ""}>
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
        <SidebarGroup>
          <SidebarGroupLabel>Recent Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/document/1" className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm">Service Agreement</span>
                      <span className="text-xs text-muted-foreground">Updated 2 days ago</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/document/2" className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm">NDA Contract</span>
                      <span className="text-xs text-muted-foreground">Updated 1 week ago</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
