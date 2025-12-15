import React from "react";
import { useDispatch } from "react-redux";
import { removeVideoFromPlaylist } from "../features/playlistSlice";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash } from "lucide-react";

export default function PlaylistVideoCard({ data }) {
    const dispatch = useDispatch();

    const handleRemoveVideo = async (videoId) => {
        if (!window.confirm("Remove this video from playlist?")) return;

        dispatch(removeVideoFromPlaylist({ videoId, playlistId }))
            .unwrap()
            .then(() => toast.success("Video successfully removed from playlist"))
            .catch(() => toast.error("Failed to remove video from playlist !!"));
    };

    return (
        <div
            className="
                relative flex gap-4
                bg-neutral-900 hover:bg-neutral-800
                p-3 rounded-xl transition
                border border-neutral-800
            "
        >
            {/* CONTENT */}
            <Link
                to={`/video/${data._id}`}
                className="flex gap-4 flex-1 items-start"
            >
                {/* THUMBNAIL */}
                <div className="w-40 shrink-0 aspect-video rounded-lg overflow-hidden">
                    <img
                        src={data.thumbnail}
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* INFO */}
                <div className="flex flex-col justify-between py-0.5">
                    <div>
                        <h3 className="text-sm font-semibold line-clamp-2">
                            {data.title}
                        </h3>

                        <p className="text-xs text-neutral-400 mt-1">
                            {data.owner?.username}
                        </p>
                    </div>

                    <p className="text-xs text-neutral-500 mt-2">
                        {new Date(data.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </Link>

            {/* MENU */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="
                            self-start p-2
                            rounded-full
                            text-neutral-400
                            hover:text-white
                            hover:bg-black/40
                            transition
                        "
                    >
                        <MoreVertical size={18} />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="bg-[#1f1f1f] text-white border border-neutral-700"
                >
                    <DropdownMenuItem
                        onClick={() => handleRemoveVideo(data._id)}
                        className="group flex items-center gap-2"
                    >
                        <Trash className="h-4 w-4 text-neutral-400 group-hover:text-white" />
                        Remove from playlist
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
