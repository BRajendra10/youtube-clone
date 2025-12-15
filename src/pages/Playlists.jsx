import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPlaylists } from "../features/playlistSlice";
import { EditPlaylistModal } from "../components/EditPlaylistModal";
import { toast } from "sonner";
import PlaylistCard from "../components/PlaylistCard";

export default function PlaylistsPage() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { playlists, fetchStatus } = useSelector((state) => state.playlist);

    const [openModal, setOpenModal] = useState(false);
    const [editPlaylist, setEditPlaylist] = useState(null);

    useEffect(() => {
        if (!currentUser?._id) return;

        dispatch(fetchUserPlaylists(currentUser._id))
            .unwrap()
            .catch(() => toast.error("Failed to fetch users playlists !!"));
    }, [dispatch, currentUser]);

    const isLoading = fetchStatus === "pending";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    return (
        <div className="min-h-screen text-white p-6">

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Playlists</h1>
            </div>

            {/* 🔄 Loading */}
            {isLoading && (
                <div className="flex mt-20 text-neutral-400">
                    Loading playlists...
                </div>
            )}

            {/* ❌ Error */}
            {isError && (
                <div className="flex mt-20 text-red-400">
                    Failed to load playlists
                </div>
            )}

            {/* ✅ Success */}
            {isSuccess && playlists?.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                    {playlists.map((playlist, index) => (
                        <PlaylistCard
                            key={playlist._id || index}
                            data={playlist}
                            onSelect={(data) => {
                                setOpenModal(true);
                                setEditPlaylist(data);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* 📭 Empty State */}
            {isSuccess && playlists?.length === 0 && (
                <div className="flex justify-center mt-20 text-neutral-400">
                    You haven’t created any playlists yet.
                </div>
            )}

            {/* Edit Modal */}
            <EditPlaylistModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditPlaylist(null);
                }}
                initialData={editPlaylist || {}}
            />
        </div>
    );
}
