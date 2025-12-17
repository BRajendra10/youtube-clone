import { useEffect, useState } from "react";
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
import { addVideoToWatchHistory, toggleSubscribtion } from "../features/userSlice.js";
import SubscriptionButton from "../components/SubscriptionButton.jsx";
import { toggleCommentLike, toggleVideoLike } from "../features/likeSlice.js";

import {
    addComment,
    getVideoComments
} from "../features/commentSlice.js";

export default function SingleVideoPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { videoId, playlistId } = useParams();

    const [comment, setComment] = useState("");

    const { videos, selectedVideo, reqStatus } = useSelector(state => state.video);
    const { selectedPlaylist, loading: playlistLoading } = useSelector(state => state.playlist);
    const { currentUser } = useSelector(state => state.user);

    const {
        comments,
        page,
        hasMore,
        fetchStatus
    } = useSelector(state => state.comment);

    // Playlist Videos
    const playlistVideos = playlistId ? selectedPlaylist?.videos || [] : [];

    // Fetch video + playlist + comments
    useEffect(() => {
        dispatch(fetchVideoById(videoId))
            .unwrap()
            .catch(() => toast.error("Failed to load video !!"));

        if (playlistId) {
            dispatch(fetchPlaylistById(playlistId))
                .unwrap()
                .catch(() => toast.error("Failed to load playlist"));
        }

        dispatch(getVideoComments({ videoId, page: 1 }));

        dispatch(addVideoToWatchHistory(videoId))

        window.scrollTo(0, 0);
    }, [dispatch, videoId, playlistId]);

    const handleSubscribeToggle = (channelId) => {
        dispatch(toggleSubscribtion(channelId))
            .unwrap()
            .then(() => toast.success("toggle subscrbtion successfully"))
            .catch(() => toast.error("Subscribtion button failed !!"));
    };

    const handleVideoLike = async () => {
        try {
            await dispatch(toggleVideoLike(videoId)).unwrap();
            toast.success("Toggle like successfully");
        } catch (error) {
            toast.error(error.message || "Failed to toggle like !!");
        }
    };

    const handleAddComment = async () => {
        try {
            await dispatch(addComment({ videoId, comment })).unwrap();
            setComment("");
        } catch (error) {
            toast.error(error?.message || "Failed to comment on video !!");
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            await dispatch(toggleCommentLike(commentId)).unwrap();
            toast.success("Toggle like successfully");
        } catch (error) {
            toast.error(error.message || "Failed to toggle like !!");
        }
    };

    const loadMoreComments = () => {
        if (hasMore && fetchStatus !== "loading") {
            dispatch(getVideoComments({ videoId, page: page + 1 }));
        }
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

    if (!selectedVideo) return null;

    const video = selectedVideo;
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
                            onClick={() => handleSubscribeToggle(video.owner?._id)}
                        >
                            Subscribe
                        </Button>
                    </div>

                    {/* LIKE / SHARE */}
                    <div className="flex items-center gap-3 bg-neutral-800 px-5 py-2 rounded-full">
                        <button onClick={handleVideoLike} className="flex items-center gap-1">
                            <ThumbsUp className={`h-5 w-5 ${video.isLiked ? "fill-white" : ""}`} />
                            <span className="text-sm">{video.likesCount}</span>
                        </button>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied 🔗");
                            }}
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
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Comments ({comments.length})
                    </h2>

                    {/* ADD COMMENT */}
                    <div className="flex gap-3 mb-6">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={currentUser?.avatar} />
                            <AvatarFallback>
                                {currentUser?.username?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={currentUser ? "Add a comment…" : "Login to add a comment"}
                                disabled={!currentUser}
                                rows={2}
                                className="w-full resize-none bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
                            />

                            {currentUser && (
                                <div className="flex justify-end gap-3 mt-2">
                                    <button
                                        onClick={() => setComment("")}
                                        className="text-sm text-neutral-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!comment.trim()}
                                        className="bg-white text-black px-4 py-1.5 rounded-full text-sm"
                                    >
                                        Comment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COMMENTS LIST */}
                    <div className="flex flex-col gap-5">
                        {comments.map((c) => (
                            <div
                                key={c._id}
                                className="flex gap-3 rounded-xl p-3 hover:bg-neutral-800/60 transition"
                            >
                                {/* AVATAR */}
                                <Avatar className="h-9 w-9 shrink-0">
                                    <AvatarImage src={c.owner?.avatar} />
                                    <AvatarFallback>
                                        {c.owner?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* CONTENT */}
                                <div className="flex-1">
                                    {/* HEADER */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            {c.owner?.username}
                                            <span className="ml-2 text-xs text-gray-400">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </span>
                                        </p>
                                    </div>

                                    {/* COMMENT TEXT */}
                                    <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                                        {c.content}
                                    </p>

                                    {/* ACTIONS */}
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                        <button onClick={handleCommentLike} className="flex items-center gap-1">
                                            <ThumbsUp className={`h-5 w-5 ${c.isLiked ? "fill-white" : ""}`} />
                                            <span className="text-sm">{c.likeCount}</span>
                                        </button>

                                        <button className="hover:text-white transition">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    {hasMore && (
                        <button
                            onClick={loadMoreComments}
                            className="mt-4 text-sm text-gray-400 hover:text-white"
                        >
                            Load more comments
                        </button>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-[340px] flex flex-col gap-4 sticky top-6">
                <h2 className="text-lg font-semibold mb-2">
                    {playlistId ? "Playlist Videos" : "Recommended"}
                </h2>

                {sidebarVideos?.map(item => (
                    <div
                        key={item._id}
                        className="flex gap-3 p-2 rounded-lg hover:bg-neutral-800 cursor-pointer"
                        onClick={() => navigate(`/video/${item._id}/${playlistId || ""}`)}
                    >
                        <img src={item.thumbnail} className="w-32 rounded-lg" />
                        <div>
                            <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                            <p className="text-xs text-gray-400">{item.owner?.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
