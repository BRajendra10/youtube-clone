import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChannel } from "../features/userSlice";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function UserChannel() {
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.user.currentUser);
  const channel = useSelector((state) => state.user.userChannel);

  useEffect(() => {
    if (username) dispatch(getUserChannel(username));
  }, [dispatch, username]);

  if (!channel)
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="w-full flex flex-col">

      {/* ================= COVER IMAGE ================= */}
      <div className="w-full py-2 sm:py-4">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="overflow-hidden rounded-lg sm:rounded-xl 
                          h-40 sm:h-52 md:h-60">
            <img
              src={channel.coverImage}
              alt="cover"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* ================= HEADER SECTION ================= */}
      <div className="w-full py-2 sm:py-4">
        <div className="w-full flex flex-row items-center gap-4 sm:gap-6 max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">

          {/* AVATAR */}
          <div className="shrink-0">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 shadow-sm">
              <AvatarImage src={channel.avatar} alt="avatar" />
              <AvatarFallback className="text-xl">CH</AvatarFallback>
            </Avatar>
          </div>

          {/* CHANNEL INFO */}
          <div className="flex flex-col justify-center mt-2 sm:mt-0">

            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight truncate">
              {channel.fullName}
            </h1>

            <p className="text-sm text-muted-foreground truncate">
              @{channel.username}
            </p>

            <p className="text-sm text-muted-foreground">
              {channel.subscribersCount} subscribers •{" "}
              {channel.channelsSubscribedToCount} subscribed
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3 items-center mt-4">
              <Button variant="outline" className="rounded-full px-5">
                Customize Channel
              </Button>

              <Button
                className="rounded-full px-6"
                variant={channel.isSubscribed ? "secondary" : "default"}
              >
                {channel.isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* ================= TABS SECTION ================= */}
      <div className="w-full pt-2 pb-10">

        <Tabs defaultValue="home" className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">

          {/* TAB HEADERS */}
          <TabsList
            className="w-full flex gap-6 sm:gap-10 border-b rounded-none 
                         h-auto bg-transparent px-0 mt-3"
          >
            {["home", "videos", "playlists", "about"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="pb-3 text-sm sm:text-base font-medium 
                             rounded-none data-[state=active]:border-b-2 
                             data-[state=active]:border-primary"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* HOME TAB */}
          <TabsContent value="home" className="py-8">
            <h2 className="text-lg font-semibold mb-3">Uploads</h2>
            <p className="text-sm text-muted-foreground">
              This channel has no videos.
            </p>
          </TabsContent>

          {/* VIDEOS TAB */}
          <TabsContent value="videos" className="py-8">
            <p className="text-sm text-muted-foreground">No videos yet.</p>
          </TabsContent>

          {/* PLAYLIST TAB */}
          <TabsContent value="playlists" className="py-8">
            <p className="text-sm text-muted-foreground">
              No playlists created.
            </p>
          </TabsContent>

          {/* ABOUT TAB */}
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
