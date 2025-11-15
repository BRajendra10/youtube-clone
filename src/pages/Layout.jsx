import React from "react";
import Sidebar from '../components/Sidebar.jsx'
import Navbar from "../components/Navbar.jsx";
import Navigation from "../routes/Navigation.jsx"
import { Outlet } from "react-router-dom";


export default function Layout() {
    return (
        <div className="flex dark bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}