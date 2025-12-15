import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaylistById } from "../features/playlistSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import PlaylistVideoCard from "../components/PlaylistVideoCard";

export default function SinglePlaylistPage() {
    const { playlistId } = useParams();
    const dispatch = useDispatch();

    const { selectedPlaylist, fetchStatus } = useSelector(
        (state) => state.playlist
    );

    useEffect(() => {
        dispatch(fetchPlaylistById(playlistId))
            .unwrap()
            .catch(() => toast.error("Failed to fetch playlist by id !!"));
    }, [dispatch, playlistId]);

    const isLoading = fetchStatus === "pending";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    /* 🔄 Loading */
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-neutral-400">
                Loading playlist...
            </div>
        );
    }

    /* ❌ Error */
    if (isError) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-400">
                Failed to load playlist
            </div>
        );
    }

    /* 🚨 Safety check */
    if (!isSuccess || !selectedPlaylist) {
        return null;
    }

    const playlist = selectedPlaylist;

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-5 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* LEFT — PLAYLIST INFO */}
                <div className="flex flex-col gap-4 md:sticky md:top-24 h-fit">
                    <img
                        src={
                            playlist?.videos[0]?.thumbnail ||
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
                <div className="md:col-span-2 flex flex-col gap-4">
                    {playlist.videos.length === 0 && (
                        <p className="text-gray-400">
                            No videos in this playlist.
                        </p>
                    )}

                    {playlist.videos.map((video, index) => (
                        <PlaylistVideoCard 
                            key={index}
                            data={video}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
