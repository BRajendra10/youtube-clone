import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getSubscribedTo } from "../features/subscriptionSlice";
import { toggleSubscribtion } from "../features/userSlice";

import { Card, CardContent } from "@/components/ui/card";

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
            dispatch(getSubscribedTo({ subscriberId: currentUser._id }));
        }
    }, [dispatch, currentUser]);

    // Navigate to channel
    const openChannel = (username) => navigate(`/${username}`);

    // Unsubscribe button handler
    const handleUnsubscribe = (channelId) => {
        dispatch(toggleSubscribtion(channelId));
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
                            <CardContent className="flex items-center gap-6">

                                {/* Avatar */}
                                <img
                                    src={channel.avatar}
                                    alt={channel.username}
                                    className="w-20 h-20 rounded-full object-cover ring-2 ring-neutral-800"
                                />

                                {/* Channel Info */}
                                <div className="flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold">
                                        {channel.username}
                                    </h3>

                                    <span className="text-sm text-neutral-400">
                                        {channel.email}
                                    </span>

                                    <span className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                                        <span>📅</span>
                                        Subscribed on{" "}
                                        {new Date(channel.subscribedAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Unsubscribe Button */}
                                <button
                                    className="px-5 py-2 rounded-full border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all duration-150"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnsubscribe(channel.channelId);
                                    }}
                                >
                                    unsubscribe
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
