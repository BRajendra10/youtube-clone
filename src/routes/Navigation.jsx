import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from '../pages/Layout';
import Login from "../pages/Login";
import Logout from "../pages/Signup";

import Videos from "../components/Videos";
import PrivateRoute from "./PrivateRoute";
import UserChannel from "../pages/UserChannel";
import { Subscriptions } from "../pages/Subscriptions";


export default function Navigation() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Logout />} />

            {/* Protected Layout */}
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Videos />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/channel" element={<UserChannel />} />
            </Route>
        </Routes>
    )
}