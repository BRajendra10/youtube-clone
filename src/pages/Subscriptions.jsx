import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getSubscribedTo } from "../features/subscriptionSlice";
import { toggleSubscribtion } from "../features/userSlice";

import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

// =========================
// Main Component
// =========================
export default function Subscriptions() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { subscribers } = useSelector((state) => state.subscription);
    const { currentUser } = useSelector((state) => state.user);

    // Fetch Subscriptions
    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getSubscribedTo({ subscriberId: currentUser._id }))
                .unwrap()
                .catch(() => toast.error("Failed to fetch user subscribers !!"))
        }
    }, [dispatch, currentUser._id]);

    // Navigate to channel
    const openChannel = (username) => navigate(`/${username}`);

    // Unsubscribe button handler
    const handleUnsubscribe = (channelId) => {
        dispatch(toggleSubscribtion(channelId))
            .unwrap()
            .then(() => toast.success("toggle subscription successfully"))
            .catch(() => toast.error("Failed to toggle subscription !!"))
    };

    // Loading State
    if (!subscribers) {
        return <div className="w-full flex justify-center">Loading...</div>;
    }

    const isEmpty = subscribers.length === 0;

    return (
        <div className="w-full flex">
            <div className="max-w-4xl mx-auto min-h-screen w-full bg-neutral-950 text-white p-6">

                {/* Page Title */}
                <h1 className="text-4xl text-center font-semibold mb-6">
                    {isEmpty ? "No Subscriptions" : "All Subscriptions"}
                </h1>

                {/* List */}
                <div className="flex flex-col gap-4">
                    {subscribers.map((channel) => (
                        <Card
                            key={channel.channelId}
                            className="bg-neutral-900/70 border border-neutral-800 rounded-2xl backdrop-blur-sm p-4 cursor-pointer"
                            onClick={() => openChannel(channel.username)}
                        >
                            {/* {console.log(channel.channelId)} */}
                            <CardContent className="flex items-center gap-4 sm:gap-6">
                                {/* Avatar */}
                                <img
                                    src={channel.avatar}
                                    alt={channel.username}
                                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-neutral-800 shrink-0"
                                />

                                {/* Right Side Container */}
                                <div className="flex flex-col flex-1 gap-2">
                                    {/* User Info */}
                                    <div>
                                        <h3 className="text-base sm:text-xl font-semibold leading-tight">
                                            {channel.username}
                                        </h3>

                                        <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Subscribed on{" "}
                                            {new Date(channel.subscribedAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Button */}
                                    <button
                                        className="self-start mt-1 px-4 py-1.5 rounded-full border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnsubscribe(channel.channelId);
                                        }}
                                    >
                                        Unsubscribe
                                    </button>
                                </div>
                            </CardContent>

                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
