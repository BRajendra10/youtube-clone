import React, { useEffect } from "react";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import { getSubscribedTo } from "../features/subscriptionSlice";
import SubscriptionCard from "../components/SubscriptionCard";

export function SubscriptionCardSkeleton() {
    return (
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-neutral-800 shrink-0" >
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-neutral-800 shrink-0" />

                {/* Right Side */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 gap-3">
                    {/* Text */}
                    <div className="space-y-2">
                        <div className="h-4 w-32 sm:w-40 bg-neutral-800 rounded" />
                        <div className="h-3 w-24 bg-neutral-800 rounded" />
                        <div className="h-3 w-36 bg-neutral-800 rounded mt-1" />
                    </div>

                    {/* Button */}
                    <div className="h-8 w-28 bg-neutral-800 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default function Subscriptions() {
    const dispatch = useDispatch();

    const { subscribers, fetchStatus } = useSelector((state) => state.subscription);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (!currentUser?._id) return;

        dispatch(getSubscribedTo({ subscriberId: currentUser._id }))
            .unwrap()
            .catch(() => toast.error("Failed to fetch user subscribers !!"));
    }, [dispatch, currentUser]);

    const isLoading = fetchStatus === "pending";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    return (
        <div className="w-full flex">
            <div className="max-w-4xl mx-auto min-h-screen w-full bg-neutral-950 text-white px-3 sm:px-4 md:px-6 py-6">

                {/* Title */}
                <h1 className="text-4xl text-center font-semibold mb-6">
                    Subscriptions
                </h1>

                {isLoading && (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <SubscriptionCardSkeleton key={idx} />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="flex justify-center text-red-400">
                        Failed to load subscriptions
                    </div>
                )}

                {isSuccess && subscribers.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {subscribers.map((channel, index) => (
                            <SubscriptionCard
                                key={index}
                                data={channel}
                            />
                        ))}
                    </div>
                )}

                {isSuccess && subscribers?.length === 0 && (
                    <p className="text-gray-300 text-center">
                        No subscriptions found.
                    </p>
                )}
            </div>
        </div>
    );
}
