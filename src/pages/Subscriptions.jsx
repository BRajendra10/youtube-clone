import React, { useEffect } from "react";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import { getSubscribedTo } from "../features/subscriptionSlice";
import SubscriptionCard from "../components/SubscriptionCard";


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
            <div className="max-w-4xl mx-auto min-h-screen w-full bg-neutral-950 text-white p-6">

                {/* Title */}
                <h1 className="text-4xl text-center font-semibold mb-6">
                    Subscriptions
                </h1>

                {/* 🔄 Loading */}
                {isLoading && (
                    <div className="flex justify-center text-neutral-400">
                        Loading subscriptions...
                    </div>
                )}

                {/* ❌ Error */}
                {isError && (
                    <div className="flex justify-center text-red-400">
                        Failed to load subscriptions
                    </div>
                )}

                {/* ✅ Success */}
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
