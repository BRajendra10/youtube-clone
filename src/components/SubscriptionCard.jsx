import React from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { toggleSubscribtion } from "../features/userSlice";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

import { toast } from "sonner";

export default function SubscriptionCard({ data }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Navigate to channel
    const openChannel = (username) => navigate(`/${username}`);

    // Unsubscribe button handler
    const handleUnsubscribe = (channelId) => {
        dispatch(toggleSubscribtion(channelId))
            .unwrap()
            .then(() => toast.success("toggle subscription successfully"))
            .catch(() => toast.error("Failed to toggle subscription !!"))
    };

    return <Card
        className="bg-neutral-900/70 border border-neutral-800 rounded-2xl backdrop-blur-sm p-4 cursor-pointer"
        onClick={() => openChannel(data.username)}
    >
        {/* {console.log(channel.channelId)} */}
        <CardContent className="flex items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <img
                src={data.avatar}
                alt={data.username}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-neutral-800 shrink-0"
            />

            {/* Right Side Container */}
            <div className="flex flex-col  sm:flex-row sm:justify-between sm:items-center flex-1 gap-2">
                {/* User Info */}
                <div className="space-y-0.5">
                    <h3 className="text-base sm:text-xl font-semibold text-neutral-100 leading-tight">
                        {data.username}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400">
                        {data.fullName}
                    </p>

                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-neutral-500" />
                        Subscribed on{" "}
                        {new Date(data.subscribedAt).toLocaleDateString()}
                    </p>
                </div>


                {/* Button */}
                <button
                    className=" mt-1 px-4 py-1.5 rounded-full border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUnsubscribe(data.channelId);
                    }}
                >
                    Unsubscribe
                </button>
            </div>
        </CardContent>

    </Card>
}