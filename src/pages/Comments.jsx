import React, { useEffect, useState } from "react";
import { formatDate } from "../store/formate";

import { useDispatch, useSelector } from "react-redux";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../features/commentSlice";
import { toggleCommentLike } from "../features/likeSlice";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, ThumbsUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Comments({ videoId }) {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { comments, page, hasMore, fetchStatus } = useSelector(
        (state) => state.comment
    );

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState("");
    const [comment, setComment] = useState("");

    const isLoading = fetchStatus === "loading";

    const handleAddComment = async () => {
        if (!comment.trim()) return;

        try {
            await dispatch(addComment({ videoId, comment })).unwrap();
            setComment("");
        } catch (error) {
            toast.error(error?.message || "Failed to comment on video");
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            await dispatch(toggleCommentLike(commentId)).unwrap();
        } catch (error) {
            toast.error(error?.message || "Failed to toggle like");
        }
    };

    const handleCommentUpdate = async (commentId, content) => {
        try {
            await dispatch(updateComment({ commentId, comment: content })).unwrap();
        } catch (error) {
            toast.error(error?.message || "Failed to update comment");
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await dispatch(deleteComment(commentId)).unwrap();
        } catch (error) {
            toast.error(error?.message || "Failed to delete comment");
        }
    };

    const loadMoreComments = () => {
        if (hasMore && !isLoading) {
            dispatch(getVideoComments({ videoId, page: page + 1 }));
        }
    };


    const startEdit = (comment) => {
        setEditingCommentId(comment._id);
        setEditedComment(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditedComment("");
    };

    const saveEdit = async (commentId) => {
        if (!editedComment.trim()) return;
        await handleCommentUpdate(commentId, editedComment);
        cancelEdit();
    };


    useEffect(() => {
        dispatch(getVideoComments({ videoId, page: 1 }));
    }, [dispatch, videoId]);

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">
                Comments ({comments.length})
            </h2>

            {/* ADD COMMENT */}
            <div className="flex gap-3 mb-6">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback>
                        {currentUser?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <textarea
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={
                            currentUser ? "Add a comment…" : "Login to add a comment"
                        }
                        disabled={!currentUser}
                        rows={2}
                        className="w-full resize-none bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
                    />

                    {currentUser && (
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={() => setComment("")}
                                className="text-sm text-neutral-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddComment}
                                disabled={!comment.trim()}
                                className="bg-white text-black px-4 py-1.5 rounded-full text-sm disabled:opacity-50"
                            >
                                Comment
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* LOADING SKELETON */}
            {isLoading && comments.length === 0 && (
                <div className="flex flex-col gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-3 p-3">
                            <div className="h-9 w-9 rounded-full bg-neutral-700 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-32 bg-neutral-700 rounded animate-pulse" />
                                <div className="h-3 w-full bg-neutral-700 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && comments.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">
                    No comments yet. Be the first to comment.
                </p>
            )}

            {/* COMMENTS LIST */}
            {comments.length > 0 && (
                <div className="flex flex-col gap-5">
                    {comments.map((c) => (
                        <div
                            key={c._id}
                            className="flex gap-3 rounded-xl p-3 hover:bg-neutral-800/60 transition"
                        >
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src={c.owner?.avatar} />
                                <AvatarFallback>
                                    {c.owner?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">
                                        {c.owner?.username}
                                        <span className="ml-2 text-xs text-gray-400">
                                            {formatDate(c.createdAt)}
                                        </span>
                                    </p>
                                </div>

                                {editingCommentId === c._id ? (
                                    <textarea
                                        name="edit comment"
                                        value={editedComment}
                                        onChange={(e) => setEditedComment(e.target.value)}
                                        rows={2}
                                        className="w-full resize-none bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm mt-1"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                                        {c.content}
                                    </p>
                                )}

                                {editingCommentId === c._id && (
                                    <div className="flex justify-end gap-3 mt-2">
                                        <button
                                            onClick={cancelEdit}
                                            className="text-sm text-gray-400 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => saveEdit(c._id)}
                                            className="bg-white text-black px-4 py-1 rounded-full text-sm"
                                        >
                                            Save
                                        </button>
                                    </div>
                                )}

                                {/* ACTIONS */}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <button
                                            onClick={() => handleCommentLike(c._id)}
                                            className="flex items-center gap-1 hover:text-white"
                                        >
                                            <ThumbsUp
                                                className={`h-4 w-4 ${c.isLiked ? "fill-white" : ""
                                                    }`}
                                            />
                                            <span>{c.likeCount}</span>
                                        </button>

                                        <button className="hover:text-white">Reply</button>
                                    </div>

                                    {currentUser?._id === c.owner?._id && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-1 rounded-full hover:bg-neutral-700">
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-28">
                                                <DropdownMenuItem onClick={() => startEdit(c)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleCommentDelete(c._id)}
                                                    className="text-red-500 focus:text-red-500"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            {hasMore && (
                <button
                    onClick={loadMoreComments}
                    disabled={isLoading}
                    className="mt-4 text-sm text-gray-400 hover:text-white disabled:opacity-50"
                >
                    {isLoading ? "Loading..." : "Load more comments"}
                </button>
            )}
        </div>
    );
}
