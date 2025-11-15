import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from '../pages/Layout';
import Login from "../pages/Login";
import Logout from "../pages/Logout";

import Videos from "../components/Videos";


export default function Navigation() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected Layout */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Videos />} />
                <Route path="/subscriptions" element={<Videos />} />  {/* same as path="/" */}
            </Route>
        </Routes>
    )
}