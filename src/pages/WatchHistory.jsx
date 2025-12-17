// React
import React, { useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchHistory } from "../features/userSlice";

// Router
import { Link } from "react-router-dom";

// UI (adjust imports based on your setup)
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function WatchHistoryPage() {
    const dispatch = useDispatch();

    const { watchHistory, fetchStatus } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        dispatch(fetchWatchHistory());
    }, [dispatch]);

    // Loading state
    if (fetchStatus === "pending") {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                Loading watch history...
            </div>
        );
    }

    // Empty state
    if (!watchHistory || watchHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p className="text-lg">No watch history yet</p>
                <p className="text-sm">Start watching videos to see them here</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold mb-6">
                Watch History
            </h1>

            <div className="space-y-4">
                {watchHistory.map((video) => (
                    <Link
                        to={`/watch/${video._id}`}
                        key={video._id}
                        className="flex gap-4 p-3 rounded-lg hover:bg-muted transition"
                    >
                        {/* Thumbnail */}
                        <div className="w-48 h-28 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Video Info */}
                        <div className="flex flex-col gap-2">
                            <h2 className="font-medium line-clamp-2">
                                {video.title}
                            </h2>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={video.owner?.avatar} />
                                    <AvatarFallback>
                                        {video.owner?.username?.[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <span>{video.owner?.username}</span>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {video.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
