import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Bookmark, Clock, Share2, MoreVertical, Pencil, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { deleteVideo } from "../features/videoSlice";
import { formatDuration } from "../store/formate";
import { toast } from "sonner";

export default function Video({ id, data, onSave }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const handleDelete = async (videoId) => {
        try {
            await dispatch(deleteVideo(videoId)).unwrap();
            toast.success("Video deleted successfully!");
        } catch (error) {
            toast.error(error?.message || "Failed to delete video.");
        }
    };

    const isOwner = currentUser?._id === data?.owner?._id;

    return <div
        className="group cursor-pointer rounded-xl overflow-hidden hover:bg-neutral-700 transition-colors relative"
    >

        {/* CLICKABLE AREA */}
        <Link to={`/video/${id}`}>
            {/* Thumbnail */}
            <AspectRatio ratio={16 / 9} className="relative w-full">
                <img
                    src={data.thumbnail}
                    alt={data.title}
                    className="w-full h-full object-cover rounded-t-xl transform group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md">
                    {formatDuration(data.duration)}
                </Badge>
            </AspectRatio>

            {/* Info */}
            <div className="flex p-3 gap-2">
                <Avatar>
                    <AvatarImage src={data.owner?.avatar || ""} alt="owner" />
                    <AvatarFallback>
                        {data.owner?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <h2 className="text-sm font-medium line-clamp-2">
                        {data.title}
                    </h2>
                    {/* {console.log(data.owner.username)} */}

                    <p className="text-sm font-semibold text-gray-400 line-clamp-2">
                        {data.owner.username}
                    </p>

                    <p className="text-[11px] text-gray-500 mt-1">
                        Uploaded{" "}
                        {new Date(data.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>
        </Link>

        {/* MENU */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-11 right-1 p-2 rounded-full hover:bg-black/80 z-20"
                >
                    <MoreVertical size={18} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-40 bg-[#1f1f1f] text-white border border-neutral-700"
            >
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        onSave();
                    }}
                >
                    <Bookmark className="h-4 w-4 text-neutral-300" />
                    Save to Playlist
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Clock className="h-4 w-4 text-neutral-300" />
                    Watch latter
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Share2 className="h-4 w-4 text-neutral-300" />
                    Share
                </DropdownMenuItem>

                {isOwner && (
                    <DropdownMenuItem
                        onClick={() => {
                            navigate(`/edit/${data._id}`);
                        }}
                        className="flex items-center gap-2"
                    >
                        <Pencil className="h-5 text-neutral-300" />
                        Edit
                    </DropdownMenuItem>
                )}

                {isOwner && (
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(data._id);
                        }}
                        className="flex items-center gap-2 text-neutral-300"
                    >
                        <Trash className="h-5" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}