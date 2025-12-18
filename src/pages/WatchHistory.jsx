// React
import React, { useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchHistory } from "../features/userSlice";

// Router
import { Link } from "react-router-dom";

// UI
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

/* =======================
   Skeleton Component
======================= */
function WatchHistorySkeleton() {
    return (
        <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-xl border border-neutral-800 bg-neutral-900/60 animate-pulse">
            {/* Thumbnail */}
            <div className="w-full h-44 sm:w-48 sm:h-28 rounded-lg bg-neutral-800 shrink-0" />

            {/* Info */}
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-3/4 bg-neutral-800 rounded" />
                <div className="h-3 w-1/3 bg-neutral-800 rounded" />
                <div className="h-3 w-full bg-neutral-800 rounded" />
                <div className="h-3 w-5/6 bg-neutral-800 rounded" />
            </div>
        </div>
    );
}

/* =======================
   Page Component
======================= */
export default function WatchHistoryPage() {
    const dispatch = useDispatch();

    const { watchHistory, fetchStatus } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        dispatch(fetchWatchHistory())
            .unwrap()
            .catch((err) => toast.error(err?.message || "Failed to fetch watch history !!"))

    }, [dispatch]);

    const isLoading = fetchStatus === "pending";
    const isSuccess = fetchStatus === "success";
    const isError = fetchStatus === "error";

    return (
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-6 text-white">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-semibold mb-6">
                Watch History
            </h1>

            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <WatchHistorySkeleton key={idx} />
                    ))}
                </div>
            )}

            {isError && (
                <div className="flex flex-col items-center justify-center py-20 text-red-400">
                    <p className="text-lg font-medium">
                        Failed to load watch history
                    </p>
                    <p className="text-sm text-neutral-400 mt-1">
                        Please refresh the page or try again later
                    </p>
                </div>
            )}

            {isSuccess && (!watchHistory || watchHistory.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                    <p className="text-lg">No watch history yet</p>
                    <p className="text-sm">
                        Start watching videos to see them here
                    </p>
                </div>
            )}

            {isSuccess && watchHistory?.length > 0 && (
                <div className="space-y-4">
                    {watchHistory.map((video) => (
                        <Link
                            to={`/video/${video._id}`}
                            key={video._id}
                            className="
                                flex flex-col sm:flex-row gap-4 p-3
                                rounded-xl border border-neutral-800
                                bg-neutral-900/60 hover:bg-neutral-900
                                transition
                            "
                        >
                            {/* Thumbnail */}
                            <div className="w-full h-44 sm:w-48 sm:h-28 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-2 flex-1">
                                <h2 className="font-medium text-sm sm:text-base line-clamp-2">
                                    {video.title}
                                </h2>

                                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={video.owner?.avatar} />
                                        <AvatarFallback>
                                            {video.owner?.username?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{video.owner?.username}</span>
                                </div>

                                <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2">
                                    {video.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
