import React from "react";
import { Search, Plus, Bell, Settings, TvMinimalPlay, SquarePen, Menu } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export default function Navbar() {
    const { currentUser } = useSelector((state) => state.user);
    const { toggleSidebar } = useSidebar();

    return (
        <nav className="sticky top-0 w-full h-16 bg-background  flex items-center justify-between px-4 z-5">
            <span className="hidden md:flex"></span>
            <button
                onClick={toggleSidebar}
                className="block md:hidden p-2 rounded-md hover:bg-muted transition"
            >
                <Menu className="h-5 w-5" />
            </button>


            {/* Middle Section (Search Bar) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
                <div className="flex items-center w-full relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-10 border rounded-l-full px-4 outline-none"
                    />

                    <button
                        className="h-10 w-12 border border-l-0 rounded-r-full flex items-center justify-center"
                    >
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Right Section (create video or post / notification / Profile) */}
            <div className="flex items-center gap-4">
                {/* Example: upload / notifications / profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between gap-3 p-2 px-3 rounded-full bg-popover hover:bg-muted cursor-pointer">
                        <Plus className="w-5 h-5" /> Create
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="relative left-8 w-40 dark bg-muted">
                        <DropdownMenuItem className="flex items-center gap-3"> <TvMinimalPlay className="w-6 h-6" /> Upload video</DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3"> <SquarePen /> Create a post</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Popover >
                    <PopoverTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-muted transition">
                            <Search className="w-5 h-5" />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent className="relative right-18 w-100 dark p-2 rounded-lg shadow-lg bg-background border">

                        <div className="flex items-center w-full relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full h-10 border rounded-l-full px-4 outline-none"
                            />

                            <button
                                className="h-10 w-12 border border-l-0 rounded-r-full flex items-center justify-center"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-muted transition">
                            <Bell className="w-5 h-5" />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent className="relative right-18 w-100 dark p-0 rounded-lg shadow-lg bg-background border">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h3 className="font-semibold text-lg">Notifications</h3>
                            <Settings className="w-5 h-5 cursor-pointer hover:text-primary" />
                        </div>

                        {/* Notification List (Scrollable) */}
                        <div className="max-h-96 overflow-y-auto">

                            {/* Notification Item */}
                            <div className="flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer transition">

                                {/* Avatar */}
                                <img
                                    className="w-10 h-10 rounded-full"
                                    src="https://avatars.githubusercontent.com/u/182490144?v=4"
                                    alt=""
                                />

                                {/* Text Section */}
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm">
                                        <span className="font-semibold">Rajendra</span> liked your video:
                                        <span className="font-medium"> “How to build a Navbar”</span>
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        2 hours ago
                                    </p>
                                </div>

                                {/* Thumbnail (Optional) */}
                                <img
                                    className="w-16 h-9 rounded object-cover"
                                    src="https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg"
                                    alt=""
                                />
                            </div>

                            {/* Duplicate this block for more notifications */}
                            <div className="flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer transition">
                                <img
                                    className="w-10 h-10 rounded-full"
                                    src="https://i.pravatar.cc/100?img=12"
                                    alt=""
                                />

                                <div className="flex-1 space-y-1">
                                    <p className="text-sm">
                                        <span className="font-semibold">Arjun</span> commented:
                                        <span className="font-medium"> “Amazing work bro!”</span>
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        1 day ago
                                    </p>
                                </div>

                                <img
                                    className="w-16 h-9 rounded object-cover"
                                    src="https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg"
                                    alt=""
                                />
                            </div>

                        </div>
                    </PopoverContent>
                </Popover>


                <Popover>
                    <PopoverTrigger asChild>
                        <button className="w-9 h-9 rounded-full overflow-hidden">
                            <img
                                className="w-9 h-9 rounded-full"
                                src={currentUser?.avatar}
                            />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="end"
                        className="dark w-72 p-0 rounded-xl shadow-xl bg-background border"
                    >
                        {/* Top User Section */}
                        <div className="p-4 flex items-center gap-3">
                            <img
                                className="w-12 h-12 rounded-full"
                                src={currentUser?.avatar}
                                alt=""
                            />

                            <div>
                                <h3 className="font-semibold text-base">{currentUser?.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>

                                <button className="text-primary text-sm font-medium mt-1 hover:underline">
                                    Manage your account
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-border"></div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <NavLink className="block w-full text-left px-4 py-2 text-sm hover:bg-muted" to="/channel" >
                                Your channel
                            </NavLink>

                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                                YouTube Studio
                            </button>

                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                                Switch account
                            </button>

                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                                Sign out
                            </button>
                        </div>

                        <div className="h-px bg-border"></div>

                        {/* Bottom settings section */}
                        <div className="py-1">
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                                Appearance
                            </button>

                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                                Language
                            </button>

                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                                Keyboard shortcuts
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>

            </div>

        </nav>
    );
}
