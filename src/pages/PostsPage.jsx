import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, updatePost, deletePost } from "../features/postSlice";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Heart, MoreVertical, Pencil, Share2, ThumbsUp, Trash } from "lucide-react";
import { togglePostLike } from "../features/likeSlice";

export default function PostsPage() {
    const dispatch = useDispatch();

    const { posts, fetchStatus } = useSelector((state) => state.post);
    const { currentUser } = useSelector((state) => state.user);

    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch]);

    const isLoading = fetchStatus === "loading";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    const handleUpdate = async () => {
        if (!editedContent.trim()) return;

        try {
            await dispatch(
                updatePost({ postId: editingPostId, content: editedContent })
            ).unwrap();

            setEditingPostId(null);
            setEditedContent("");
            toast.success("Post updated");
        } catch {
            toast.error("Failed to update post");
        }
    };

    const handleDelete = async (postId) => {
        try {
            await dispatch(deletePost({ postId })).unwrap();
            toast.success("Post deleted");
        } catch {
            toast.error("Failed to delete post");
        }
    };

    const handlePostLike = async (postId) => {
        try{
            await dispatch(togglePostLike(postId)).unwrap();
            toast.success("Toggle post like successfully")
        } catch (error) {
            toast.error(error?.message || "Failed to toggle post like !!")
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <h2 className="text-lg font-semibold text-white">Latest Posts</h2>

            {/* Loading */}
            {isLoading && posts.length === 0 && (
                <p className="text-sm text-stone-400">Loading posts...</p>
            )}

            {/* Empty */}
            {isSuccess && posts.length === 0 && (
                <p className="text-sm text-stone-400">No posts available.</p>
            )}

            {/* Error */}
            {isError && (
                <p className="text-sm text-red-400">Failed to load posts.</p>
            )}

            {/* Posts */}
            {isSuccess &&
                posts.map((post) => {
                    const isOwner = post.user?._id === currentUser?._id;
                    const isEditing = editingPostId === post._id;

                    return (
                        <div
                            key={post._id}
                            className="bg-stone-950 border border-stone-800 rounded-2xl p-4"
                        >
                            <div className="flex gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={post.user?.avatar} />
                                    <AvatarFallback>
                                        {post.user?.fullName?.[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 relative">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold">
                                            {post.user?.fullName}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                            • {new Date(post.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    {/* CONTENT / EDIT */}
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
                                            onClick={() => handlePostLike(post?._id)}
                                            className={`flex items-center gap-1 transition-colors
                                                ${post.isLiked ? "text-white" : "text-gray-300 hover:text-white"}
                                            `}
                                        >
                                            <Heart
                                                className={`h-4 w-4 transition-transform
                                                    ${post.isLiked ? "fill-white scale-105" : ""}
                                                    `}
                                            />

                                            <span className="text-sm select-none">
                                                {post.likesCount}
                                            </span>
                                        </button>
                                    </div>

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
                                                <Share2 className="h-5 w-5 text-neutral-300" />
                                                Share
                                            </DropdownMenuItem>
                                            {isOwner && (
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditingPostId(post._id);
                                                        setEditedContent(post.content);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                            )}

                                            {isOwner && (
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(post._id)}
                                                >
                                                    <Trash className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* SAVE BUTTON */}
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
                })}
        </div>
    );
}
