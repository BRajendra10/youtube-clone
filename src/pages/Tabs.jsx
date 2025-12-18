import React, { useState } from "react";
import { useSelector } from "react-redux";

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SaveToPlaylistDialog from "../components/SaveToPlaylistDialog";
import { EditPlaylistModal } from "../components/EditPlaylistModal";
import Video from "../components/VideoCard";
import PostCard from "../components/PostCard";
import PlaylistCard from "../components/PlaylistCard";

export default function TabsComponent() {
    const [openModal, setOpenModal] = useState(false);
    const [editPlaylist, setEditPlaylist] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { videos, fetchStatus: videoFetchStatus } = useSelector((state) => state.video);
    const { posts, fetchStatus: postFetchStatus } = useSelector((state) => state.post);
    const { playlists, fetchStatus: playlistFetchStatus } = useSelector((state) => state.playlist);
    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className="w-full pt-2 pb-10">
            <Tabs defaultValue="videos" className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                {/* TAB BUTTONS */}
                <TabsList className="flex gap-3 bg-transparent p-0 mt-3">
                    {["videos", "posts", "playlists"].map((tab) => (
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

                <TabsContent value="videos" className="py-8">
                    {videoFetchStatus === "loading" && <p className="text-sm text-muted-foreground">Loading videos...</p>}

                    {videoFetchStatus === "success" && videos.length === 0 && <p className="text-sm text-muted-foreground">No videos yet.</p>}

                    {videoFetchStatus === "success" && videos.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {videos.map((video, index) => (
                                <Video
                                    key={index}
                                    id={video._id}
                                    data={video}
                                    onSave={() => {
                                        setSelectedVideo(video._id);
                                        setIsDialogOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="posts" className="py-8 space-y-6">
                    {postFetchStatus === "loading" && <p className="text-sm text-muted-foreground">Loading posts...</p>}

                    {postFetchStatus === "success" && posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}

                    {postFetchStatus === "success" && posts.length > 0 && (
                        <div className="max-w-2xl space-y-4">
                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    isOwner={post.user?._id === currentUser?._id}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="playlists" className="py-8">
                    {playlistFetchStatus === "loading" && <p className="text-sm text-muted-foreground">Loading playlists...</p>}

                    {playlistFetchStatus === "success" && playlists.length === 0 && <p className="text-sm text-muted-foreground">No playlists yet.</p>}

                    {playlistFetchStatus === "success" && playlists.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {playlists.map((item) => (
                                <PlaylistCard
                                    key={item._id}
                                    data={item}
                                    onSelect={(data) => {
                                        setOpenModal(true);
                                        setEditPlaylist(data);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <SaveToPlaylistDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                videoId={selectedVideo}
            />

            <EditPlaylistModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditPlaylist(null);
                }}
                initialData={editPlaylist || {}}
            />
        </div>
    );
}
