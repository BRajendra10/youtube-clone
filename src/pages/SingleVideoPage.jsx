import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchVideoById } from "../features/videoSlice.js";
import { fetchPlaylistById } from "../features/playlistSlice.js";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { toggleSubscribtion } from "../features/userSlice.js";

export default function SingleVideoPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { videoId, playlistId } = useParams();

    const { videos, selectedVideo, reqStatus } = useSelector(state => state.video);
    const { selectedPlaylist, loading: playlistLoading } = useSelector(state => state.playlist);

    // Playlist Videos
    const playlistVideos = playlistId ? selectedPlaylist?.videos || [] : [];

    // Fetch video + playlist
    useEffect(() => {
        dispatch(fetchVideoById(videoId))
            .unwrap()
            .catch(() => toast.error("Failed to load video !!"));

        if (playlistId) {
            dispatch(fetchPlaylistById(playlistId))
                .unwrap()
                .catch(() => toast.error("Failed to load playlist"));
        }

        window.scrollTo(0, 0);
    }, [dispatch, videoId, playlistId]);

    const handleSubscribeToggle = (channelId) => {
        dispatch(toggleSubscribtion(channelId))
            .unwrap()
            .then(() => toast.success("toggle subscrbtion successfully"))
            .catch(() => toast.error("Subscribtion button failed !!"))
    };

    // Show loading skeleton
    if (reqStatus === "pending" || (playlistId && playlistLoading)) {
        return (
            <div className="p-6 text-white w-full">
                <Skeleton className="w-full h-[350px] rounded-xl mb-6" />
                <Skeleton className="w-1/2 h-6 mb-3" />
                <Skeleton className="w-40 h-10" />
            </div>
        );
    }

    if (!selectedVideo) {
        return null;
    }

    const video = selectedVideo;

    const comments = [
        { id: 1, name: "Alex Carter", text: "Amazing video! Very well explained!", time: "2 days ago" },
        { id: 2, name: "John Doe", text: "The UI looks so clean bro 🔥", time: "5 days ago" },
        { id: 3, name: "Michael", text: "Subscribed! Waiting for more content.", time: "1 week ago" }
    ];

    const sidebarVideos = playlistId ? playlistVideos : videos;

    return (
        <div className="min-h-screen w-full text-white p-6 flex flex-col lg:flex-row gap-8">

            {/* LEFT SIDE */}
            <div className="flex-1 flex flex-col gap-5">

                {/* PLAYER */}
                <AspectRatio ratio={16 / 9} className="rounded-2xl overflow-hidden shadow-xl">
                    <video
                        src={video.videoFile}
                        autoPlay
                        playsInline
                        controls
                        className="w-full h-full bg-black"
                        onError={() => toast.error("Video failed to play")}
                    />
                </AspectRatio>

                {/* TITLE */}
                <h1 className="text-xl font-bold leading-snug">{video.title}</h1>

                {/* CHANNEL HEADER */}
                <div className="flex items-center justify-between pb-2">

                    <div className="flex items-center gap-5">
                        <Link to={`/${video.owner?.username}`} className="flex items-center gap-3">
                            <Avatar className="h-14 w-14">
                                <AvatarImage src={video.owner?.avatar} />
                                <AvatarFallback>{video.owner?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-semibold text-lg">{video.owner?.username}</p>
                                <p className="text-xs text-gray-400">{video.owner.fullName}</p>
                            </div>
                        </Link>

                        <Button
                            className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full font-semibold"
                            onClick={() => handleSubscribeToggle(selectedVideo?.owner?._id)}
                        >
                            Subscribe
                        </Button>
                    </div>

                    {/* LIKE / DISLIKE / SHARE */}
                    <div className="flex items-center gap-3 bg-neutral-800 px-5 py-2 rounded-full w-fit shadow-md">

                        <button className="flex items-center gap-1 text-gray-300 hover:text-white"
                            onClick={() => toast.success("You liked the video 👍")}
                        >
                            <ThumbsUp className="h-5 w-5" />
                        </button>

                        <div className="w-px h-5 bg-neutral-700"></div>

                        <button className="flex items-center gap-1 text-gray-300 hover:text-white"
                            onClick={() => toast("You disliked the video 👎")}
                        >
                            <ThumbsDown className="h-5 w-5" />
                        </button>

                        <div className="w-px h-5 bg-neutral-700"></div>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard 🔗");
                            }}
                            className="flex items-center gap-1 text-gray-300 hover:text-white"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="bg-neutral-800/70 p-4 rounded-xl text-sm leading-relaxed shadow-md">
                    {video.description || "No description provided."}
                </div>

                {/* COMMENTS */}
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-4">Comments</h2>

                    <div className="flex items-start gap-3 mb-6">
                        <Avatar className="h-10 w-10"><AvatarFallback>U</AvatarFallback></Avatar>
                        <input
                            placeholder="Add a comment..."
                            className="bg-neutral-800 w-full px-4 py-2 rounded-lg outline-none border border-neutral-700 text-sm"
                            onFocus={() => toast("Commenting coming soon 💬")}
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <div>
                                    <p className="font-semibold text-sm">
                                        {c.name} <span className="text-xs text-gray-500">• {c.time}</span>
                                    </p>
                                    <p className="text-sm text-gray-300">{c.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* RIGHT SIDE — PLAYLIST VIDEOS */}
            <div className="w-full lg:w-[340px] flex flex-col gap-4 max-h-[85vh] overflow-y-auto sticky top-6">

                <h2 className="text-lg font-semibold mb-2">
                    {playlistId ? "Playlist Videos" : "Recommended"}
                </h2>

                {sidebarVideos?.map(item => (
                    <div
                        key={item._id}
                        className={`flex gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-800/60 hover:scale-[1.01] transition ${item._id === video._id ? "bg-neutral-800" : ""
                            }`}
                        onClick={() => {
                            toast.success(`Playing: ${item.title}`);
                            navigate(`/video/${item._id}/${playlistId ? playlistId : ""}`);
                        }}
                    >
                        <div className="w-42 aspect-video rounded-lg overflow-hidden">
                            <img src={item.thumbnail} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.owner?.username}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
