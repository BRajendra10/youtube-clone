import React from "react";

export default function Videos() {
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
        </div>
    )
}

export function VideoSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            {/* Thumbnail */}
            <div className="w-full h-68 bg-muted rounded-lg"></div>

            {/* Video Info */}
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-muted rounded-full"></div>

                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
}