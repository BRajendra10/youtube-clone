import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../features/postSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreatePostBox() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const [content, setContent] = useState("");

    const MAX_LENGTH = 200;
    const isAtLimit = content.length >= MAX_LENGTH;

    const handleCreate = async () => {
        if (!content.trim()) return;

        try {
            await dispatch(createPost({ content })).unwrap();

            setContent("");
            toast.success("Post created");
        } catch (err) {
            toast.error(err?.message || "Failed to create post");
        }
    };

    return (
        <div className="max-w-2xl rounded-2xl border border-stone-800 bg-stone-950 m-2 p-4 shadow-sm transition">
            <div className="flex gap-4">
                {/* Avatar */}
                <Avatar className="h-10 w-10 border border-stone-700">
                    <AvatarImage src={currentUser.avatar} />
                </Avatar>

                <div className="flex-1">
                    {/* Textarea */}
                    <textarea
                        placeholder="Share an update with your community..."
                        className="w-full resize-none rounded-xl bg-stone-900/60 p-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-600"
                        maxLength={MAX_LENGTH}
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between">
                        {/* Left actions (future ready) */}
                        <div className="flex items-center gap-2 text-stone-500">
                            <span className="text-xs">
                                {content.length}/200
                            </span>
                        </div>

                        {isAtLimit && (
                            <span className="text-[11px] text-red-400">
                                You’ve reached the maximum character limit
                            </span>
                        )}

                        {/* Post button */}
                        <Button
                            size="sm"
                            disabled={!content.trim()}
                            className="rounded-full px-6 bg-white text-stone-950 hover:bg-stone-200 disabled:opacity-40"
                            onClick={handleCreate}
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
}
