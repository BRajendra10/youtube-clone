import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

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
import { updatePlaylist } from "../features/playlistSlice";

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