import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVideos } from "../features/videoSlice.js";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

import SaveToPlaylistDialog from "../components/SaveToPlaylistDialog.jsx";
import Video from "../components/VideoCard.jsx";

import { toast } from "sonner";

const VideoSkeleton = () => (
    <div className="group cursor-pointer rounded-xl overflow-hidden bg-neutral-900 animate-pulse">

        {/* Thumbnail */}
        <AspectRatio ratio={16 / 9} className="relative w-full">
            <Skeleton className="w-full h-full rounded-t-xl bg-neutral-700 transform group-hover:scale-105 transition-transform duration-300" />
            <Skeleton className="absolute bottom-2 right-2 w-12 h-5 rounded-md bg-neutral-800" />
        </AspectRatio>

        {/* Info */}
        <div className="flex p-3 gap-2">
            <Skeleton className="w-10 h-10 rounded-full bg-neutral-700 shrink-0" />

            <div className="flex-1 space-y-2">
                <Skeleton className="w-full h-4 rounded bg-neutral-600" />
                <Skeleton className="w-3/4 h-3 rounded bg-neutral-700" />
                <Skeleton className="w-1/2 h-3 rounded bg-neutral-700" />
            </div>
        </div>
    </div>
);


export default function HomePage() {
    const dispatch = useDispatch();
    const { videos, fetchStatus } = useSelector((state) => state.video);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(
            fetchAllVideos({
                page: 1,
                limit: 20,
                query: "",
                sortBy: "createdAt",
                sortType: "desc",
            })
        ).unwrap()
            .catch(() => toast.error("Failed to fetch videos !!"))
    }, [dispatch]);

    const isLoading = fetchStatus === "pending";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-6">

            {isError && <p className="text-red-400">Failed to load videos</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* Loader */}
                {isLoading &&
                    Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={i} />)}

                {/* Videos */}
                {!isLoading && videos?.length > 0 &&
                    videos.map((video, index) => (
                        <Video
                            key={index}
                            id={video._id}
                            data={video}
                            onSave={() => {
                                setSelectedVideo(video._id);
                                setIsDialogOpen(true);
                            }}
                        />
                    ))}

                {/* No Videos */}
                {isSuccess && videos?.length === 0 && (
                    <p className="text-gray-300">No videos found.</p>
                )}
            </div>

            <SaveToPlaylistDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                videoId={selectedVideo}
            />

        </div>
    );
}
