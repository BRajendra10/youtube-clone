import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { togglePostLike } from "../features/likeSlice";
import { deletePost, updatePost } from "../features/postSlice";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MoreVertical, Pencil, Share2, Trash } from "lucide-react";

export default function PostCard({ post, isOwner }) {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);

    const handleUpdate = async () => {
        if (!editedContent.trim()) return;

        try {
            await dispatch(
                updatePost({ postId: post._id, content: editedContent })
            ).unwrap();

            setIsEditing(false);
            toast.success("Post updated");
        } catch {
            toast.error("Failed to update post");
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deletePost({ postId: post._id })).unwrap();
            toast.success("Post deleted");
        } catch {
            toast.error("Failed to delete post");
        }
    };

    const handlePostLike = async () => {
        try {
            await dispatch(togglePostLike(post._id)).unwrap();
        } catch {
            toast.error("Failed to toggle like");
        }
    };

    return (
        <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4">
            <div className="flex gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={post.owner?.avatar} />
                    <AvatarFallback>
                        {post.owner?.fullName?.[0]}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 relative">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                            {post.owner?.fullName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                            • {new Date(post.createdAt).toLocaleTimeString()}
                        </span>
                    </div>

                    {/* CONTENT */}
                    {isEditing ? (
                        <textarea
                            className="w-full mt-2 bg-black/40 border border-stone-700 rounded-md p-2 text-sm text-white focus:outline-none"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                    ) : (
                        <p className="text-sm text-stone-300 mt-2">
                            {post.content}
                        </p>
                    )}

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4 mt-3 text-stone-400">
                        <button
                            onClick={handlePostLike}
                            className={`flex items-center gap-1 transition-colors ${
                                post.isLiked
                                    ? "text-white"
                                    : "hover:text-white"
                            }`}
                        >
                            <Heart
                                className={`h-4 w-4 ${
                                    post.isLiked ? "fill-white" : ""
                                }`}
                            />
                            <span className="text-sm">
                                {post.likesCount}
                            </span>
                        </button>
                    </div>

                    {/* MENU */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="absolute top-0 right-0 p-2 rounded-full hover:bg-black/80">
                                <MoreVertical size={18} />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-40 bg-[#1f1f1f] text-white border border-neutral-700"
                        >
                            <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </DropdownMenuItem>

                            {isOwner && (
                                <DropdownMenuItem
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                            )}

                            {isOwner && (
                                <DropdownMenuItem onClick={handleDelete}>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* SAVE */}
                    {isEditing && (
                        <div className="flex justify-end mt-2">
                            <Button size="sm" onClick={handleUpdate}>
                                Save
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
