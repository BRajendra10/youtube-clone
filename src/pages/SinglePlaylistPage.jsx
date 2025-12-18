import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPlaylistById,
    removeVideoFromPlaylist
} from "../features/playlistSlice";
import { toast } from "sonner";

import VideoListItem from "../components/VideoList";

function PlaylistInfoSkeleton() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-full h-56 bg-neutral-800 rounded-xl" />
            <div className="h-7 w-3/4 bg-neutral-800 rounded" />
            <div className="h-4 w-full bg-neutral-800 rounded" />
            <div className="h-4 w-1/3 bg-neutral-800 rounded" />
        </div>
    );
}

function VideoItemSkeleton() {
    return (
        <div className="flex gap-4 p-3 border border-neutral-800 rounded-lg animate-pulse">
            <div className="w-40 h-24 bg-neutral-800 rounded-lg shrink-0" />
            <div className="flex flex-col gap-3 flex-1">
                <div className="h-4 w-3/4 bg-neutral-800 rounded" />
                <div className="h-3 w-1/2 bg-neutral-800 rounded" />
                <div className="h-3 w-1/3 bg-neutral-800 rounded" />
            </div>
        </div>
    );
}


export default function SinglePlaylistPage() {
    const { playlistId } = useParams();
    const dispatch = useDispatch();

    const { selectedPlaylist, fetchStatus } = useSelector(
        (state) => state.playlist
    );

    const handleRemoveVideo = (videoId) => {
        if (!window.confirm("Remove this video from playlist?")) return;

        dispatch(removeVideoFromPlaylist({ videoId, playlistId }))
            .unwrap()
            .then(() => toast.success("Video successfully removed from playlist"))
            .catch(() =>
                toast.error("Failed to remove video from playlist !!")
            );
    };

    useEffect(() => {
        dispatch(fetchPlaylistById(playlistId))
            .unwrap()
            .catch(() =>
                toast.error("Failed to fetch playlist by id !!")
            );
    }, [dispatch, playlistId]);

    const isLoading = fetchStatus === "pending";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white p-5 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <PlaylistInfoSkeleton />

                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <VideoItemSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-400">
                Failed to load playlist
            </div>
        );
    }

    if (!isSuccess || !selectedPlaylist) return null;

    const playlist = selectedPlaylist;

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-5 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* LEFT — PLAYLIST INFO */}
                <div className="flex flex-col gap-4 md:sticky md:top-24 h-fit">
                    <img
                        src={
                            playlist.thumbnail ||
                            "https://picsum.photos/500/300"
                        }
                        className="w-full h-56 object-cover rounded-xl shadow-lg"
                        alt="playlist thumbnail"
                    />

                    <h1 className="text-3xl font-bold">{playlist.name}</h1>

                    <p className="text-gray-400 text-sm">
                        {playlist.description || "No description."}
                    </p>

                    <p className="text-gray-500 text-sm">
                        {playlist.videos.length} Videos
                    </p>
                </div>

                {/* RIGHT — VIDEO LIST */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {playlist.videos.length === 0 && (
                        <p className="text-gray-400">
                            No videos in this playlist.
                        </p>
                    )}

                    {playlist.videos.map((video, index) => (
                        <VideoListItem key={index} video={video}>
                            <button
                                onClick={() => handleRemoveVideo(video._id)}
                                className="self-start mt-1 px-5 py-1 text-sm bg-red-600 rounded-lg text-white"
                            >
                                Remove video
                            </button>
                        </VideoListItem>
                    ))}
                </div>
            </div>
        </div>
    );
}
