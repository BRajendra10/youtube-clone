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
        <div className="max-w-2xl bg-stone-950 rounded-2xl p-4 border border-stone-800">
            <div className="flex gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={currentUser.avatar} />
                </Avatar>

                <div className="flex-1">
                    <textarea
                        placeholder="Share an update with your community..."
                        className="w-full bg-transparent p-2 text-sm text-white placeholder:text-stone-500 focus:outline-none"
                        rows={2}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="flex justify-end mt-3">
                        <Button size="sm" className="rounded-full px-5" onClick={handleCreate}>
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
