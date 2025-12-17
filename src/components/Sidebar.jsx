import * as React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Home,
  TvMinimalPlay,
  History,
  ListVideo,
  ThumbsUp,
  Clock4,
  Menu,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export default function AppSidebar() {
  const { state, setOpen, toggleSidebar } = useSidebar();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setOpen(true)
      } else {
        setOpen(false);
      }

    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [setOpen])


  return (
    <Sidebar collapsible="icon" className="bg-background text-foreground">
      {/* Logo / Title */}
      <SidebarHeader className="flex flex-row items-center py-4 font-semibold text-lg">
        <button
          onClick={toggleSidebar}
          className="hidden md:block p-2 rounded-md hover:bg-muted transition"
        >
          <Menu className="h-5 w-5" />
        </button>
        {state === "expanded" && "My App"}
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                {
                  icon: <Home className="w-5 h-5" />,
                  label: "Home",
                  path: "/"
                },
                {
                  icon: <ListVideo className="w-5 h-5" />,
                  label: "Posts",
                  path: "/posts"
                },
                {
                  icon: <TvMinimalPlay className="w-5 h-5" />,
                  label: "Subscriptions",
                  path: "/Subscriptions"
                },
                {
                  icon: <History className="w-5 h-5" />,
                  label: "History",
                  path: "/History"
                },
                {
                  icon: <ListVideo className="w-5 h-5" />,
                  label: "Playlists",
                  path: "/Playlists"
                },
                {
                  icon: <ThumbsUp className="w-5 h-5" />,
                  label: "Liked Videos",
                  path: "/liked-videos"
                }
              ].map((item, index) => (
                <SidebarMenuItem key={index}>
                  <NavLink to={item.path} end>
                    {({ isActive }) => (
                      <SidebarMenuButton className="flex gap-3" isActive={isActive} size="large">
                        <span>
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rail (auto-collapsed mode indicator) */}
      <SidebarRail />
    </Sidebar>
  );
}
