import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../features/postSlice";
import PostCard from "../components/PostCard";
import CreatePostBox from "../components/CreatePostBox";

export function PostCardSkeleton() {
    return (
        <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 animate-pulse">
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full bg-stone-800" />

                <div className="flex-1 space-y-3">
                    {/* Name + time */}
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-32 bg-stone-800 rounded" />
                        <div className="h-3 w-20 bg-stone-800 rounded" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-stone-800 rounded" />
                        <div className="h-4 w-5/6 bg-stone-800 rounded" />
                    </div>

                    {/* Like button */}
                    <div className="flex items-center gap-2 mt-3">
                        <div className="h-4 w-4 bg-stone-800 rounded-full" />
                        <div className="h-3 w-6 bg-stone-800 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}


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
        <div className="mx-auto max-w-2xl px-3 sm:px-4 md:px-0 py-5 md:py-10 space-y-6">
            <h2 className="text-lg font-semibold text-white m-2">Create new posts</h2>
            <CreatePostBox />

            <h2 className="text-lg font-semibold text-white m-2 mt-4">Latest Posts</h2>
            {isLoading &&
                Array.from({ length: 4 }).map((_, idx) => (
                    <PostCardSkeleton key={idx} />
                ))}

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
                        isOwner={post.owner?._id === currentUser?._id}
                    />
                ))}
        </div>
    );
}
