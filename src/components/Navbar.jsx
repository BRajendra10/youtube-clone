import React, { useState } from "react";
import { Search, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const [search, setSearch] = useState(null);

    const handleClick = () => {
        if(search) {
            console.log(search)
        }
    }

    return (
        <nav className="dark w-full h-16 bg-background text-foreground flex items-center justify-between px-4">
            <span></span>

            {/* Middle Section (Search Bar) */}
            <div className="flex-1 max-w-xl mx-4">
                <div className="flex items-center w-full relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-10 border rounded-l-full px-4 outline-none"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        className="h-10 w-12 border border-l-0 rounded-r-full flex items-center justify-center"
                        onClick={handleClick}
                    >
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Right Section (Icons / Profile) */}
            <div className="flex items-center gap-4">
                {/* Example: upload / notifications / profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between gap-3 p-2 px-3 rounded-full bg-popover hover:bg-muted cursor-pointer">
                        <Plus className="w-5 h-5" /> Create
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem>Upload video</DropdownMenuItem>
                        <DropdownMenuItem>Create a post</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-9 h-9 rounded-full">
                    <img className="w-9 h-9 rounded-full" src="https://avatars.githubusercontent.com/u/182490144?s=400&u=6fe48aa6c2af9377489a8a06332d9bd62a44156c&v=4" alt="" />
                </div>
            </div>

        </nav>
    );
}
