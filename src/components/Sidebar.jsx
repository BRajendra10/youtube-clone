import * as React from "react"
import {
    Sidebar,
    SidebarProvider,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Menu, Home, History, ListVideo, ThumbsUp, Clock4, ChevronRight, TvMinimalPlay } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "./ui/sidebar"

export default function AppSidebar() {
    const [collapsed, setCollapsed] = React.useState(false)

    return (
        <SidebarProvider className={"w-fit"}>
            {/* Sidebar */}
            <Sidebar
                className={`h-screen border-r bg-background text-foreground transition-all duration-300 ease-in-out flex flex-col justify-between
                    ${collapsed ? "w-20" : "w-64"}`}
            >
                {/* Sidebar Header */}
                <SidebarHeader className={`flex flex-row items-center ${collapsed ? "justify-center" : "justify-start"} p-3`}>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    {!collapsed && (
                        <h2 className="font-semibold text-lg whitespace-nowrap">
                            My App
                        </h2>
                    )}
                </SidebarHeader>

                {/* Sidebar Content */}
                <SidebarContent className="flex-1">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <ul className="space-y-2 px-1">
                                {[
                                    { icon: <Home className="w-6 h-6" />, label: "Home" },
                                    { icon: <TvMinimalPlay className="w-6 h-6" />, label: "Subscriptions" },
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted focus:bg-muted cursor-pointer
                                            ${collapsed ? "justify-center" : ""}`}
                                    >
                                        {item.icon}
                                        {!collapsed && <span>{item.label}</span>}
                                    </li>
                                ))}

                            </ul>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {!collapsed && <div className="h-px w-full bg-sidebar-border"></div>}

                    <SidebarGroup>
                        <SidebarGroupContent>
                            <ul className="space-y-2 px-1">
                                <li
                                    className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer
                                        ${collapsed ? "justify-center" : ""}`}
                                >
                                    {!collapsed && <span className="flex items-center text-lg font-semibold gap-3 ">You <ChevronRight className="w-4 h-4" /></span>}
                                </li>
                                
                                {[
                                    { icon: <History className="w-6 h-6" />, label: "History" },
                                    { icon: <ListVideo className="w-6 h-6" />, label: "Playlists" },
                                    { icon: <Clock4 className="w-6 h-6" />, label: "Watch Later" },
                                    { icon: <ThumbsUp className="w-6 h-6" />, label: "Liked videos" },
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer
                                            ${collapsed ? "justify-center" : ""}`}
                                    >
                                        {item.icon}
                                        {!collapsed && <span>{item.label}</span>}
                                    </li>
                                ))}
                            </ul>
                        </SidebarGroupContent>
                    </SidebarGroup>

                </SidebarContent>

            </Sidebar>
        </SidebarProvider>
    )
}
