import React from "react";
import Sidebar from '../components/Sidebar.jsx'
import Navbar from "../components/Navbar.jsx";

export default function Home() {
    return (
        <div className="flex dark bg-background">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="p-4">
                    {/* <Outlet /> */}
                </main>
            </div>
        </div>
    )
}