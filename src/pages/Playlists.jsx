import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, ListVideo, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deletePlaylist, fetchUserPlaylists, updatePlaylist } from "../features/playlistSlice";
import { toast } from "sonner";

export function EditPlaylistModal({ open, onClose, initialData = {} }) {
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [playlistId, setPlaylistId] = useState("");

    // 🔥 Fill modal fields when opened
    useEffect(() => {
        if (open && initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
            setPlaylistId(initialData._id || "");
        }
    }, [open, initialData]);

    const handleSubmit = () => {
        if (!name.trim() || !description.trim()) return;

        dispatch(updatePlaylist({ playlistId, name, description }))
            .unwrap()
            .then(() => toast.success("Playlist updated successfully"))
            .catch(() => toast.error("Playlist update failed !!"))

        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#181818] text-white border border-neutral-700">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Playlist</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-2">

                    {/* Playlist Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-300">Playlist Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-[#0f0f0f] border-neutral-700 text-white"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-300">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-[#0f0f0f] border-neutral-700 text-white h-28"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-gray-300 hover:bg-neutral-800"
                        >
                            Cancel
                        </Button>

                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}



export default function PlaylistsPage() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { playlists } = useSelector((state) => state.playlist);

    const [openModal, setOpenModal] = useState(false);
    const [editPlaylist, setEditPlaylist] = useState(null);

    useEffect(() => {
        dispatch(fetchUserPlaylists(currentUser._id))
            .unwrap()
            .catch(() => toast.error("Failed to fetch users playlists !!"));

    }, [dispatch, currentUser])

    const handleDeletePlaylist = (playlistId) => {
        dispatch(deletePlaylist(playlistId))
            .unwrap()
            .then(() => toast.success("Playlist deleted successfully"))
            .catch(() => toast.error("Playlist delete failed !!"))
    }

    const tabs = ["Recently added", "Playlists", "Music", "Courses", "Owned", "Saved"];

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-6">

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">Playlists</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        className="px-4 py-2 bg-[#272727] rounded-full text-sm hover:bg-[#3a3a3a] whitespace-nowrap"
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Playlists Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {playlists.map((item, index) => (
                    <Link to={`/my-playlist/${item._id}`} key={index}>
                        <div
                            className="bg-[#181818] rounded-xl overflow-hidden hover:bg-[#202020] transition relative"
                        >

                            {/* Playlist Thumbnail */}
                            <div className="relative">
                                <img
                                    src={"https://picsum.photos/600/350?random=20"}
                                    className="w-full h-44 object-cover"
                                />

                                {/* Count Badge */}
                                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs flex items-center gap-1 rounded">
                                    <ListVideo size={14} />
                                    {item.count} videos
                                </div>
                            </div>

                            {/* Playlist Details */}
                            <div className="p-3">
                                <h2 className="text-base font-medium truncate">{item.name}</h2>

                                {item.updatedAt && (
                                    <p className="text-xs text-gray-500 mt-1">{item.updatedAt}</p>
                                )}
                            </div>

                            {/* Options Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80">
                                        <MoreVertical size={18} />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    className="w-40 bg-[#1f1f1f] text-white border border-neutral-700"
                                >
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setEditPlaylist(item);
                                            setOpenModal(true);
                                        }}
                                    >
                                        Edit Playlist
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>Share</DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-neutral-700" />

                                    <DropdownMenuItem
                                        className="text-red-400"
                                        onClick={() => handleDeletePlaylist(item._id)}
                                    >
                                        Delete Playlist
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Link>
                ))}
            </div>

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

