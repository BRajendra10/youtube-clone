import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addVideoToPlaylist, createPlaylist, fetchUserPlaylists } from "../features/playlistSlice";
import { toast } from "sonner";

export default function SaveToPlaylistDialog({
    open,
    onClose,
    videoId,
}) {
    const dispatch = useDispatch();
    const { playlists } = useSelector((state) => state.playlist);
    const { currentUser } = useSelector((state) => state.user);

    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [newPlaylistDescription, setNewPlaylistDescription] = useState("");

    const handleCreate = () => {
        if (!newPlaylistName.trim()) return;

        dispatch(
            createPlaylist({
                name: newPlaylistName,
                description: newPlaylistDescription,
                videoId
            })
        ).unwrap()
            .then(() => toast.success("Playlist created successfully"))
            .catch(() => toast.error("Failed to create playlist !!"))

        setNewPlaylistName("");
        setNewPlaylistDescription("");
    };

    const handleVideoSaveToPlaylist = (playlistId) => {
        dispatch(addVideoToPlaylist({ videoId, playlistId }))
            .unwrap()
            .then(() => toast.success("Video added to playlist successfully"))
            .catch(() => toast.error("Failed to add video !!"))
    };

    useEffect(() => {
        dispatch(fetchUserPlaylists(currentUser._id))
            .unwrap()
            .then(() => toast.success("Fetched user playlists successfully"))
            .catch(() => toast.error("Failed to fetch user playlists !!"))
    }, [dispatch, currentUser]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 border-neutral-700 text-white">
                <DialogHeader>
                    <DialogTitle>Save to Playlist</DialogTitle>
                </DialogHeader>

                <div className="max-h-60 overflow-y-auto space-y-3 my-3">
                    {playlists.map((p) => (
                        <div
                            key={p._id}
                            onClick={() => handleVideoSaveToPlaylist(p._id)}
                            className="flex items-center justify-between px-3 py-2 bg-neutral-800 rounded-md hover:bg-neutral-700 cursor-pointer"
                        >
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-neutral-700">
                    <Label>Create New Playlist</Label>

                    <Input
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Playlist name..."
                        className="bg-neutral-800 text-white"
                    />

                    <Input
                        value={newPlaylistDescription}
                        onChange={(e) => setNewPlaylistDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="bg-neutral-800 text-white"
                    />

                    <div className="flex justify-end">
                        <Button onClick={handleCreate}>Create</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
