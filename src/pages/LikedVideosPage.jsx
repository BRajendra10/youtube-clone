import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikedVideos, removeLikedVideo } from "../features/likeSlice";
import { toast } from "sonner";

import VideoListItem from "../components/VideoList";

export default function LikedVideosPage() {
    const dispatch = useDispatch();
    const { likedVideos, fetchStatus } = useSelector((state) => state.like);

    const handleRemoveVideo = async (videoId) => {
        try {
            await dispatch(removeLikedVideo(videoId)).unwrap();
            toast.success("Remove video successfully");
        } catch (error) {
            console.log(error);
            toast.error(error?.message || "Failed to remove video from liked videos !!")
        }
    }

    useEffect(() => {
        dispatch(fetchLikedVideos())
            .unwrap()
            .catch(() => toast.error("Failed to fetch liked videos"));
    }, [dispatch]);

    const isLoading = fetchStatus === "pending";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-neutral-400">
                Loading liked videos...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-400">
                Failed to load liked videos
            </div>
        );
    }

    if (!isSuccess) return null;

    // 🔑 Extract videos safely
    const videos = likedVideos?.map((like) => like.video) || [];

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-5 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* LEFT — INFO */}
                <div className="flex flex-col gap-4 md:sticky md:top-24 h-fit">
                    <img
                        src={
                            videos.length > 0
                                ? videos[0]?.thumbnail
                                : "https://picsum.photos/500/300"
                        }
                        className="w-full h-56 object-cover rounded-xl shadow-lg"
                        alt="liked videos thumbnail"
                    />

                    <h1 className="text-3xl font-bold">Liked Videos</h1>

                    <p className="text-gray-400 text-sm">
                        Videos you’ve liked
                    </p>

                    <p className="text-gray-500 text-sm">
                        {videos.length} Videos
                    </p>
                </div>

                {/* RIGHT — VIDEO LIST */}
                <div className="md:col-span-2 flex flex-col gap-4">
                    {videos.length === 0 && (
                        <p className="text-gray-400">
                            You haven’t liked any videos yet.
                        </p>
                    )}

                    {videos.map((video, index) => (
                        <VideoListItem key={index} video={video} isLikedVideo={true}>
                            <button
                                onClick={() => handleRemoveVideo(video._id)}
                                className="self-start mt-1 px-5 py-1 text-sm bg-red-600 rounded-lg text-white"
                            >
                                Unlike video
                            </button>
                        </VideoListItem>
                    ))}
                </div>
            </div>
        </div>
    );
}
