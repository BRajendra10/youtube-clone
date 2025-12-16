import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, deletePost, getUserPosts, updatePost } from "../features/postSlice";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, MoreVertical, Pencil, Share2, Trash, Heart } from "lucide-react";

export default function PostTab({ username, userChannel }) {
    const dispatch = useDispatch();

    const [postContent, setPostContent] = useState("");
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    const { currentUser } = useSelector((state) => state.user);
    const { posts, fetchStatus } = useSelector((state) => state.post);

    const handlePost = async () => {
        if (!postContent.trim()) return;

        try {
            await dispatch(createPost({ content: postContent })).unwrap();

            setPostContent("");
            toast.success("Post Create Susccessfully");
        } catch (error) {
            toast.error(error?.message || "Failed to create a post !!")
        }
    }

    const handlePostUpdate = async () => {
        if (!editedContent.trim()) return;

        try {
            await dispatch(updatePost({ postId: editingPostId, content: editedContent })).unwrap();

            setEditedContent("");
            setEditingPostId(null);
            toast.success("Post Update Susccessfully");
        } catch (error) {
            toast.error(error?.message || "Failed to Update a post !!")
        }
    }

    const handlePostDelete = async (postId) => {
        try {
            await dispatch(deletePost({ postId })).unwrap();

            setEditedContent("");
            setEditingPostId(null);
            toast.success("Post Delete Susccessfully");
        } catch (error) {
            toast.error(error?.message || "Failed to Delete a post !!")
        }
    }

    useEffect(() => {
        dispatch(getUserPosts({ userId: userChannel?._id }))
    }, [dispatch, userChannel])

    const isLoading = fetchStatus === "pending";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    return (
        <TabsContent value="posts" className="py-8 space-y-6">
            {/* CREATE POST */}
            {username === currentUser.username && (
                <div className="max-w-2xl bg-stone-950 rounded-2xl p-4 border border-stone-800">
                    <div className="flex gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={currentUser.avatar} />
                        </Avatar>

                        <div className="flex-1">
                            <textarea
                                placeholder="Share an update with your community..."
                                className=" w-full bg-transparent p-2 text-sm text-white placeholder:text-stone-500 focus:outline-none transition-all"
                                rows={2}
                                value={editedContent ? editedContent : postContent}
                                onChange={(e) => editedContent ? setEditedContent(e.target.value) : setPostContent(e.target.value)}
                            />

                            <div className="flex justify-end items-center mt-3">
                                <Button
                                    size="sm"
                                    className="rounded-full px-5"
                                    onClick={() => {
                                        if (editedContent) {
                                            handlePostUpdate()
                                        } else {
                                            handlePost()
                                        }
                                    }}
                                >
                                    {editedContent ? "Update" : "Create"} a post
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* POSTS LIST */}
            <div className="max-w-2xl space-y-4">
                {isLoading && posts?.length === 0 && (
                    <p className="text-sm text-stone-400">Loading posts...</p>
                )}

                {isSuccess && posts?.length === 0 && (
                    <p className="text-sm text-stone-400">No posts yet.</p>
                )}

                {isSuccess && posts?.length > 0 &&
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-stone-950 border border-stone-800 rounded-2xl p-4"
                        >
                            <div className="flex gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={userChannel.avatar} />
                                    <AvatarFallback>CH</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 relative">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold">{userChannel.fullName}</p>
                                        <span className="text-xs text-muted-foreground">
                                            • {new Date(post.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center gap-4 mt-3 text-stone-400">
                                        <button
                                            className="flex items-center gap-1 hover:text-red-400 transition"
                                        >
                                            <Heart
                                                size={18}
                                                className={
                                                    post.likes?.includes(currentUser._id)
                                                        ? "fill-red-500 text-red-500"
                                                        : ""
                                                }
                                            />
                                            <span className="text-xs">
                                                {0}
                                            </span>
                                        </button>
                                    </div>


                                    {/* OWNER ACTIONS */}
                                    {username === currentUser.username && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="absolute top-0 right-0 p-2 rounded-full hover:bg-black/80 z-20"
                                                >
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
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditingPostId(post._id);
                                                        setEditedContent(post.content);
                                                    }}
                                                >
                                                    <Pencil className="h-5 w-5 text-neutral-300" />
                                                    Edit post
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handlePostDelete(post._id)}
                                                >
                                                    <Trash className="h-5 w-5 text-neutral-300" />
                                                    Delete post
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                {isError && (
                    <p className="text-sm text-red-400">Failed to load posts!</p>
                )}
            </div>
        </TabsContent>
    )
}