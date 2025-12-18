// React & Router
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchingUserChannel } from "../features/userSlice";
import { fetchAllVideos } from "../features/videoSlice";
import { fetchUserPlaylists } from "../features/playlistSlice";

// UI Components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Utilities
// import { toast } from "sonner";

// Local Components
import Video from "../components/VideoCard";
import PlaylistCard from "../components/PlaylistCard";
import SaveToPlaylistDialog from "../components/SaveToPlaylistDialog";
import SubscriptionButton from "../components/SubscriptionButton";
import PostCard from "../components/PostCard";
import CreatePostBox from "../components/CreatePostBox";
import Tabs from "./Tabs";

import { EditProfileModal } from "../components/EditProfileModal";
import { EditPlaylistModal } from "../components/EditPlaylistModal";
import { getUserPosts } from "../features/postSlice";

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
  const { username } = useParams();

  // // Dialog state
  // const [selectedVideo, setSelectedVideo] = useState(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  // // Playlist modal
  // const [openModal, setOpenModal] = useState(false);
  // const [editPlaylist, setEditPlaylist] = useState(null);

  // Profile modal
  const [editOpen, setEditOpen] = useState(false);

  const { userChannel, currentUser } = useSelector((state) => state.user);

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

    dispatch(fetchUserPlaylists(userChannel._id))
    dispatch(getUserPosts({ userId: userChannel._id }))
  }, [dispatch, userChannel]);

  if (!userChannel || userChannel.username !== username) {
    return <UserChannelSkeleton />;
  }

  return (
    <div className="w-full flex flex-col">

      {/* COVER IMAGE */}
      <div className="w-full py-2 sm:py-4">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
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
        <div className="w-full max-w-7xl mx-auto flex items-center gap-4 sm:gap-6 px-3 sm:px-4 lg:px-8">
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

              <SubscriptionButton
                channelId={userChannel._id}
                isSubscribed={userChannel.isSubscribed}
              />

            </div>
          </div>
        </div>
      </div>

      <Tabs />

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}