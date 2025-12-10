import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// UI Components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Redux Actions
import { fetchingUserChannel, toggleSubscribtion } from "../features/userSlice";
import { deleteVideo, fetchAllVideos } from "../features/videoSlice";
import { updateUserProfile } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";

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
          <Label>Cover Image</Label>
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

function UserChannelSkeleton() {
  return (
    <div className="w-full flex flex-col animate-pulse">
      {/* COVER IMAGE */}
      <div className="w-full py-2 sm:py-4">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          <Skeleton className="w-full h-40 sm:h-52 md:h-60 rounded-xl bg-neutral-800" />
        </div>
      </div>

      {/* HEADER */}
      <div className="w-full py-2 sm:py-4">
        <div className="w-full flex items-center gap-4 sm:gap-6 max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full bg-neutral-800" />

          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="h-6 w-48 bg-neutral-800" />
            <Skeleton className="h-4 w-32 bg-neutral-800" />
            <Skeleton className="h-4 w-40 bg-neutral-800" />

            <div className="flex gap-3 mt-2">
              <Skeleton className="h-9 w-32 bg-neutral-800 rounded-full" />
              <Skeleton className="h-9 w-28 bg-neutral-800 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* TABS + VIDEO GRID */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex gap-3 my-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 bg-neutral-800 rounded" />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-36 w-full bg-neutral-800 rounded-lg" />
              <Skeleton className="h-4 w-3/4 bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UserChannel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useParams();

  const { userChannel, currentUser } = useSelector((state) => state.user);
  const { videos, fetchStatus } = useSelector((state) => state.video);

  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchingUserChannel({ username }));
  }, [dispatch, username]);

  useEffect(() => {
    if (!userChannel?._id) return;

    dispatch(
      fetchAllVideos({
        page: 1,
        limit: 20,
        query: "",
        sortBy: "createdAt",
        sortType: "desc",
        userId: userChannel._id,
      })
    );
  }, [dispatch, userChannel?._id]);

  const handleDelete = async (videoId) => {
    if (!confirm("Delete this video permanently?")) return;

    try {
      await dispatch(deleteVideo(videoId)).unwrap();
      toast.success("Video deleted successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to delete video.");
    }
  };

  const handleSubscribeToggle = async (channelId) => {
    try {
      await dispatch(toggleSubscribtion({ channelId })).unwrap();

      toast.success(
        userChannel.isSubscribed
          ? "Unsubscribed successfully"
          : "Subscribed successfully"
      );
    } catch (error) {
      toast.error(error?.message || "Action failed");
    }
  };

  if (!userChannel || userChannel.username !== username) {
    return <UserChannelSkeleton />;
  }

  return (
    <div className="w-full flex flex-col">
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />

      {/* COVER IMAGE */}
      <div className="w-full py-2 sm:py-4">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="overflow-hidden rounded-xl h-40 sm:h-52 md:h-60">
            <img
              src={userChannel.coverImage}
              alt="cover"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="w-full py-2 sm:py-4">
        <div className="w-full max-w-6xl mx-auto flex items-center gap-4 sm:gap-6 px-3 sm:px-4 lg:px-8">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 shadow-sm">
            <AvatarImage src={userChannel.avatar} alt="avatar" />
            <AvatarFallback className="text-xl">CH</AvatarFallback>
          </Avatar>

          <div className="flex flex-col justify-center mt-2 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-semibold truncate">
              {userChannel.fullName}
            </h1>

            <p className="text-sm text-muted-foreground truncate">
              @{userChannel.username}
            </p>

            <p className="text-sm text-muted-foreground">
              {userChannel.subscribersCount} subscribers •{" "}
              {userChannel.channelsSubscribedToCount} subscribed
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {/* Own Channel */}
              {username === currentUser.username && (
                <Button
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={() => setEditOpen(true)}
                >
                  Customize Channel
                </Button>
              )}

              {/* Subscribe Button */}
              {username !== currentUser.username && (
                <Button
                  className="rounded-full px-6"
                  variant={userChannel.isSubscribed ? "secondary" : "default"}
                  onClick={() => handleSubscribeToggle(userChannel._id)}
                >
                  {userChannel.isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="w-full pt-2 pb-10">
        <Tabs
          defaultValue="videos"
          className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8"
        >
          {/* TAB BUTTONS */}
          <TabsList className="flex gap-3 bg-transparent p-0 mt-3">
            {["videos", "posts", "about"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="
                  px-4 py-2 text-sm sm:text-base font-medium
                  bg-stone-900 text-stone-700 hover:bg-stone-700
                  data-[state=active]:bg-stone-950 
                  data-[state=active]:text-white
                "
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <hr className="border border-stone-800" />

          {/* ==================== VIDEOS TAB ==================== */}
          <TabsContent value="videos" className="py-8">
            {fetchStatus === "loading" && (
              <p className="text-sm text-muted-foreground">Loading videos...</p>
            )}

            {fetchStatus === "success" && videos.length === 0 && (
              <p className="text-sm text-muted-foreground">No videos yet.</p>
            )}

            {fetchStatus === "success" && videos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <div key={video._id} className="relative group space-y-2">
                    {/* THUMBNAIL */}
                    <Link to={`/video/${video._id}`}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="rounded-lg w-full h-36 object-cover"
                      />
                    </Link>

                    <h3 className="text-sm font-medium line-clamp-2">
                      {video.title}
                    </h3>

                    {/* ACTION BUTTONS (ONLY OWNER) */}
                    {currentUser._id === userChannel._id && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-2">
                        <button
                          onClick={() => navigate(`/edit/${video._id}`)}
                          className="bg-black/60 px-2 py-1 text-xs rounded hover:bg-black/80"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(video._id)}
                          className="bg-red-600 px-2 py-1 text-xs rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ==================== POSTS TAB ==================== */}
          <TabsContent value="posts" className="py-8">
            <p className="text-sm text-muted-foreground">No posts available.</p>
          </TabsContent>

          {/* ==================== ABOUT TAB ==================== */}
          <TabsContent value="about" className="py-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              This channel has no description yet.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
