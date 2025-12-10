import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar.jsx";

export default function Layout() {

    return (
        <SidebarProvider className="flex bg-background text-foreground">
            <AppSidebar />

            <SidebarInset className="flex-1 flex flex-col">
                <Navbar />

                <main>
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
