import React from "react";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { deletePlaylist } from "../features/playlistSlice";
import { Link } from "react-router-dom";
import { ListVideo, MoreVertical, Pencil, Share2, Trash } from "lucide-react";

export default function PlaylistCard({ data, onSelect }) {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);

    const handleDeletePlaylist = (playlistId) => {
        dispatch(deletePlaylist(playlistId))
            .unwrap()
            .then(() => toast.success("Playlist deleted successfully"))
            .catch(() => toast.error("Playlist delete failed !!"))
    }

    const isOwner = currentUser?._id === data?.owner?._id;

    return <div
        className="rounded-xl overflow-hidden hover:bg-[#202020] transition relative"
    >
        <Link to={`/my-playlist/${data._id}`}>
            <div className="relative">
                <img
                    src={"https://picsum.photos/600/350?random=20"}
                    className="w-full h-44 object-cover"
                />

                {/* Count Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs flex items-center gap-1 rounded">
                    <ListVideo size={14} />
                    {data.videos.length} video
                </div>
            </div>

            {/* Playlist Details */}
            <div className="p-3">
                <h2 className="text-base font-medium truncate">{data.name}</h2>

                <p className="text-sm text-gray-500 mt-1">
                    Uploaded{" "}
                    {new Date(data.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </p>
            </div>
        </Link>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="absolute bottom-5 right-3 p-2 rounded-full hover:bg-black/50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical size={18} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-40 bg-[#1f1f1f] text-white border border-neutral-700"
            >
                <DropdownMenuItem className="group flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-neutral-400 group-hover:text-white" />
                    Share
                </DropdownMenuItem>
                
                {isOwner && (
                    <DropdownMenuItem
                        onClick={() => onSelect(data)}
                        className="group flex items-center gap-2"
                    >
                        <Pencil className="h-4 w-4 text-neutral-400 group-hover:text-white" />
                        Edit Playlist
                    </DropdownMenuItem>
                )}

                {isOwner && (
                    <DropdownMenuItem
                        className="group flex items-center gap-2"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePlaylist(data._id)
                        }}
                    >
                        <Trash className="h-4 w-4 text-neutral-400 group-hover:text-white" />
                        Delete Playlist
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}