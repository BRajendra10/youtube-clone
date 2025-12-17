import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../features/postSlice";
import PostCard from "../components/PostCard";

export default function PostsPage() {
    const dispatch = useDispatch();

    const { posts, fetchStatus } = useSelector((state) => state.post);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch]);

    const isLoading = fetchStatus === "loading";
    const isError = fetchStatus === "error";
    const isSuccess = fetchStatus === "success";

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <h2 className="text-lg font-semibold text-white">Latest Posts</h2>

            {isLoading && posts.length === 0 && (
                <p className="text-sm text-stone-400">Loading posts...</p>
            )}

            {isError && (
                <p className="text-sm text-red-400">Failed to load posts.</p>
            )}

            {isSuccess && posts.length === 0 && (
                <p className="text-sm text-stone-400">No posts available.</p>
            )}

            {isSuccess &&
                posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        isOwner={post.user?._id === currentUser?._id}
                    />
                ))}
        </div>
    );
}
