import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaylistById, removeVideoFromPlaylist } from "../features/playlistSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SinglePlaylistPage() {
    const { playlistId } = useParams();
    const dispatch = useDispatch();
    const { selectedPlaylist, loading } = useSelector((state) => state.playlist);

    useEffect(() => {
        dispatch(fetchPlaylistById(playlistId))
            .unwrap()
            .catch(() => toast.error("Failed to fetch playlist by id !!"));
    }, [dispatch, playlistId]);

    if (loading || !selectedPlaylist) {
        return <div className="text-white p-10">Loading...</div>;
    }

    const handleRemoveVideo = async (videoId) => {
        if (!window.confirm("Remove this video from playlist?")) return;

        const action = await dispatch(removeVideoFromPlaylist({ videoId, playlistId }));

        if (removeVideoFromPlaylist.fulfilled.match(action)) {
            toast.success("Video removed from playlist");
        } else {
            toast.error("Failed to remove video");
        }
    };

    const playlist = selectedPlaylist;

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-5 md:p-10">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* LEFT SIDE — PLAYLIST INFO */}
                <div className="flex flex-col gap-4 md:sticky md:top-24 h-fit">
                    <img
                        src={playlist?.videos[0]?.thumbnail || "https://picsum.photos/500/300"}
                        className="w-full h-56 object-cover rounded-xl shadow-lg"
                    />

                    <h1 className="text-3xl font-bold">{playlist.name}</h1>
                    <p className="text-gray-400 text-sm">{playlist.description || "No description."}</p>

                    <p className="text-gray-500 text-sm">
                        {playlist.videos.length} Videos
                    </p>
                </div>

                {/* RIGHT SIDE — VIDEO LIST */}
                <div className="md:col-span-2 flex flex-col gap-4">

                    {playlist.videos.length === 0 && (
                        <p className="text-gray-400">No videos in this playlist.</p>
                    )}

                    {playlist.videos.map((video) => (
                        <div
                            key={video._id}
                            className="flex gap-4 bg-neutral-800 hover:bg-neutral-700 p-3 rounded-xl transition border border-transparent hover:border-neutral-600"
                        >
                            <Link to={`/video/${video._id}`} className="flex gap-4 flex-1">
                                <div className="w-48 rounded-lg overflow-hidden">
                                    <img src={video.thumbnail} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex flex-col justify-start py-1">
                                    <h3 className="text-base font-semibold line-clamp-2">{video.title}</h3>
                                    <p className="text-sm text-gray-400">{video.owner?.username}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(video.createdAt).toDateString()}
                                    </p>
                                </div>
                            </Link>

                            <Button
                                variant="destructive"
                                size="sm"
                                className="self-start"
                                onClick={() => handleRemoveVideo(video._id)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
