import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchVideoById } from "../features/videoSlice.js";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SingleVideoPage() {
    const { videoId } = useParams();
    const dispatch = useDispatch();

    const { selectedVideo, reqStatus, videos } = useSelector(
        (state) => state.video
    );

    useEffect(() => {
        dispatch(fetchVideoById(videoId));
    }, [videoId]);

    // Loader
    if (reqStatus === "pending") {
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
        <div className="min-h-screen w-full bg-neutral-900 text-white p-6 flex flex-col lg:flex-row gap-8">

            {/* LEFT SIDE */}
            <div className="flex-1 flex flex-col gap-5">

                {/* PLAYER */}
                <AspectRatio ratio={16 / 9} className="rounded-xl overflow-hidden">
                    <video src={video.videoFile} controls className="w-full h-full bg-black" />
                </AspectRatio>

                {/* TITLE */}
                <h1 className="text-xl font-semibold">{video.title}</h1>

                {/* OWNER INFO */}
                <Link
                    to={`/${video.owner?.username}`}
                    className="flex items-center gap-3 hover:opacity-80 transition"
                >
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={video.owner?.avatar} />
                        <AvatarFallback>
                            {video.owner?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className="font-medium">{video.owner?.username}</p>
                        <p className="text-xs text-gray-400">{video.owner.email}</p>
                    </div>
                </Link>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                    <Button variant="secondary">👍 Like</Button>
                    <Button variant="secondary">👎 Dislike</Button>
                    <Button variant="secondary">🔗 Share</Button>
                </div>

                {/* DESCRIPTION */}
                <div className="bg-neutral-800 p-4 rounded-xl text-sm leading-relaxed">
                    {video.description || "No description provided."}
                </div>

            </div>

            {/* RIGHT SIDE — RECOMMENDED */}
            <div className="w-full lg:w-[340px] flex flex-col gap-4 max-h-[85vh] overflow-y-auto">

                <h2 className="text-lg font-semibold">Recommended</h2>

                {videos
                    ?.filter((v) => v._id !== video._id)
                    .map((item) => (
                        <Link
                            key={item._id}
                            to={`/video/${item._id}`}
                            className="flex gap-3 hover:bg-neutral-800 p-2 rounded-lg transition"
                        >
                            <div className="w-42 rounded overflow-hidden">
                                <img src={item.thumbnail} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    ))}
            </div>

        </div>
    );
}
