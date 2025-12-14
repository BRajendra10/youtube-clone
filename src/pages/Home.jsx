import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchAllVideos } from "../features/videoSlice.js";

// UI Components
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Bookmark, Clock, Share2, MoreVertical } from "lucide-react";
import SaveToPlaylistDialog from "../components/SaveToPlaylistDialog.jsx";
import { toast } from "sonner";


function formatDuration(seconds) {
    if (!seconds) return "00:00";

    const total = Math.floor(seconds);
    const mins = Math.floor(total / 60);
    const secs = (total % 60).toString().padStart(2, "0");

    return `${mins}:${secs}`;
}

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
                        <div
                            key={index}
                            className="group cursor-pointer rounded-xl overflow-hidden hover:bg-neutral-700 transition-colors relative"
                        >

                            {/* CLICKABLE AREA */}
                            <Link to={`/video/${video._id}`}>
                                {/* Thumbnail */}
                                <AspectRatio ratio={16 / 9} className="relative w-full">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover rounded-t-xl transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md">
                                        {formatDuration(video.duration)}
                                    </Badge>
                                </AspectRatio>

                                {/* Info */}
                                <div className="flex p-3 gap-2">
                                    <Avatar>
                                        <AvatarImage src={video.owner?.avatar || ""} alt="owner" />
                                        <AvatarFallback>
                                            {video.owner?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <h2 className="text-sm font-medium line-clamp-2">
                                            {video.title}
                                        </h2>
                                        {/* {console.log(video.owner.username)} */}

                                        <p className="text-sm font-semibold text-gray-400 line-clamp-2">
                                            {video.owner.username}
                                        </p>

                                        <p className="text-[11px] text-gray-500 mt-1">
                                            Uploaded{" "}
                                            {new Date(video.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* MENU */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute bottom-11 right-1 p-2 rounded-full hover:bg-black/80 z-20"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    className="w-40 bg-[#1f1f1f] text-white border border-neutral-700"
                                >
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedVideo(video._id);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Bookmark className="h-4 w-4 text-neutral-300" />
                                        Save to Playlist
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Clock className="h-4 w-4 text-neutral-300" />
                                        Watch latter
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Share2 className="h-4 w-4 text-neutral-300" />
                                        Share
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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
