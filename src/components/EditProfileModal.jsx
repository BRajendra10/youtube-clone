import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../features/userSlice";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { toast } from "sonner";

export function EditProfileModal({ open, onClose }) {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const [fullName, setFullName] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // Prefill data when modal opens
    useEffect(() => {
        if (currentUser) {
            setFullName(currentUser.fullName);
            setAvatarPreview(currentUser.avatar);
            setCoverPreview(currentUser.coverImage);
        }
    }, [currentUser]);

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("fullName", fullName);

        if (avatar) formData.append("avatar", avatar);
        if (coverImage) formData.append("coverImage", coverImage);

        try {
            const res = await dispatch(updateUserProfile(formData));

            if (res.meta.requestStatus === "fulfilled") {
                toast.success("Profile updated successfully!");
                onClose();
            } else {
                toast.error(res.payload || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong!");
            console.log(error);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                {/* COVER IMAGE */}
                <div className="space-y-2">
                    <label>Cover Image</label>
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-muted">
                        <img
                            src={coverPreview}
                            alt="cover preview"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setCoverImage(file);
                            setCoverPreview(URL.createObjectURL(file));
                        }}
                    />
                </div>

                {/* AVATAR */}
                <div className="space-y-2 mt-4">
                    <Label>Avatar</Label>
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                        <img
                            src={avatarPreview}
                            alt="avatar preview"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setAvatar(file);
                            setAvatarPreview(URL.createObjectURL(file));
                        }}
                    />
                </div>

                {/* FULL NAME */}
                <div className="space-y-2 mt-4">
                    <Label>Full Name</Label>
                    <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}