import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

import { addVideoToWatchHistory, toggleSubscribtion } from "../features/userSlice.js";
import { toggleVideoLike } from "../features/likeSlice.js";
import { fetchVideoById } from "../features/videoSlice.js";

import Comments from "./Comments.jsx";

export default function SingleVideoPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { videoId } = useParams();

    const { videos, selectedVideo, fetchStatus } = useSelector(
        (state) => state.video
    );

    useEffect(() => {
        dispatch(fetchVideoById(videoId))
            .unwrap()
            .catch(() => toast.error("Failed to load video !!"));

        dispatch(addVideoToWatchHistory(videoId));
        window.scrollTo(0, 0);
    }, [dispatch, videoId]);

    const handleSubscribeToggle = (channelId) => {
        dispatch(toggleSubscribtion(channelId))
            .unwrap()
            .then(() => toast.success("Subscription toggled"))
            .catch(() => toast.error("Subscription failed !!"));
    };

    const handleVideoLike = async () => {
        try {
            await dispatch(toggleVideoLike(videoId)).unwrap();
            toast.success("Like toggled");
        } catch (error) {
            toast.error(error.message || "Failed to toggle like");
        }
    };

    // LOADING STATE
    if (fetchStatus === "pending") {
        return (
            <div className="p-6 text-white w-full">
                <Skeleton className="w-full h-[350px] rounded-xl mb-6" />
                <Skeleton className="w-1/2 h-6 mb-3" />
                <Skeleton className="w-40 h-10" />
            </div>
        );
    }

    if (!selectedVideo) return null;

    const video = selectedVideo;

    return (
        <div className="min-h-screen w-full text-white p-6 flex flex-col lg:flex-row gap-8">

            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-5">

                {/* PLAYER */}
                <AspectRatio ratio={16 / 9} className="rounded-2xl overflow-hidden shadow-xl">
                    <video
                        src={video.videoFile}
                        autoPlay
                        controls
                        playsInline
                        className="w-full h-full bg-black"
                        onError={() => toast.error("Video failed to play")}
                    />
                </AspectRatio>

                {/* TITLE */}
                <h1 className="text-xl font-bold leading-snug">
                    {video.title}
                </h1>

                {/* CHANNEL */}
                <div className="flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-5">
                        <Link
                            to={`/${video.owner?.username}`}
                            className="flex items-center gap-3"
                        >
                            <Avatar className="h-14 w-14">
                                <AvatarImage src={video.owner?.avatar} />
                                <AvatarFallback>
                                    {video.owner?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-semibold text-lg">
                                    {video.owner?.username}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {video.owner?.fullName}
                                </p>
                            </div>
                        </Link>

                        <Button
                            className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full font-semibold"
                            onClick={() => handleSubscribeToggle(video.owner?._id)}
                        >
                            Subscribe
                        </Button>
                    </div>

                    {/* LIKE / SHARE */}
                    <div className="flex items-center bg-neutral-800 px-4 py-2 rounded-full self-end md:self-auto">
                        <button
                            onClick={handleVideoLike}
                            className="flex items-center gap-1 pr-4"
                        >
                            <ThumbsUp
                                className={`h-5 w-5 ${
                                    video.isLiked ? "fill-white" : ""
                                }`}
                            />
                            <span className="text-sm">
                                {video.likesCount}
                            </span>
                        </button>

                        <span className="h-5 w-px bg-neutral-500" />

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                                toast.success("Link copied 🔗");
                            }}
                            className="pl-4"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="bg-neutral-800/70 p-4 rounded-xl text-sm">
                    {video.description || "No description provided."}
                </div>

                {/* COMMENTS */}
                <Comments videoId={videoId} />
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-[340px] flex flex-col gap-4 sticky top-6">
                <h2 className="text-lg font-semibold mb-2">
                    Recommended
                </h2>

                {videos?.map((item) => (
                    <div
                        key={item._id}
                        className="flex gap-3 p-2 rounded-lg hover:bg-neutral-800 cursor-pointer"
                        onClick={() => navigate(`/video/${item._id}`)}
                    >
                        <img
                            src={item.thumbnail}
                            className="w-32 rounded-lg"
                            alt={item.title}
                        />
                        <div>
                            <p className="text-sm font-medium line-clamp-2">
                                {item.title}
                            </p>
                            <p className="text-xs text-gray-400">
                                {item.owner?.username}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
