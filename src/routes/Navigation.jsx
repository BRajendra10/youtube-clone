import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../pages/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup"; // fixed import name
import PrivateRoute from "./PrivateRoute";
import UserChannel from "../pages/UserChannel";
import Subscriptions from "../pages/Subscriptions";
import UploadVideo from "../components/UploadVideo";
import HomePage from "../pages/Home";
import SingleVideoPage from "../pages/SingleVideoPage"; // new component
import PlaylistPage from "../pages/Playlists";
import SinglePlaylistPage from "../pages/SinglePlaylistPage";
import PostsPage from "../pages/PostsPage";
import LikedVideosPage from "../pages/LikedVideosPage";
import WatchHistoryPage from "../pages/WatchHistory";

export default function Navigation() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/:username" element={<UserChannel />} />
        <Route path="/edit/:videoId" element={<UploadVideo />} />
        <Route path="/playlists" element={<PlaylistPage />} />
        <Route path="/playlist/:playlistId/video/:videoId" element={<SingleVideoPage />} />
        <Route path="/my-playlist/:playlistId" element={<SinglePlaylistPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/liked-videos" element={<LikedVideosPage />} />
        <Route path="/history" element={<WatchHistoryPage />} />

        {/* Single Video Route */}
        <Route path="/video/:videoId" element={<SingleVideoPage />} />
      </Route>

      {/* Fallback route for unknown URLs */}
      <Route path="*" element={<p className="text-white text-center mt-20">404 - Page Not Found</p>} />
    </Routes>
  );
}
