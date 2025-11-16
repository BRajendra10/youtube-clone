import React, { useEffect } from "react";
import Sidebar from '../components/Sidebar.jsx'
import Navbar from "../components/Navbar.jsx";
import Navigation from "../routes/Navigation.jsx"
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


export default function Layout() {
    const navigate = useNavigate();
    const { reqStatus } = useSelector((state) => state.user);

    useEffect(() => {
        if(!reqStatus) {
            navigate("/login");
        }
        
    }, [reqStatus, navigate])

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