import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../pages/Layout";
import PrivateRoute from "./PrivateRoute";
import UpdateVideo from "../components/UpdateVideo";

// Lazy load components
const Login = React.lazy(() => import("../pages/Login"));
const Signup = React.lazy(() => import("../pages/Signup"));
const EmailVerification = React.lazy(() => import("../pages/EmailVerification"));
const UserChannel = React.lazy(() => import("../pages/UserChannel"));
const Subscriptions = React.lazy(() => import("../pages/Subscriptions"));
const UploadVideo = React.lazy(() => import("../components/UploadVideo"));
const updateVideo = React.lazy(() => import("../components/UpdateVideo"))
const HomePage = React.lazy(() => import("../pages/Home"));
const SingleVideoPage = React.lazy(() => import("../pages/SingleVideoPage"));
const PlaylistPage = React.lazy(() => import("../pages/Playlists"));
const SinglePlaylistPage = React.lazy(() => import("../pages/SinglePlaylistPage"));
const PostsPage = React.lazy(() => import("../pages/Posts"));
const LikedVideosPage = React.lazy(() => import("../pages/LikedVideos"));
const WatchHistoryPage = React.lazy(() => import("../pages/WatchHistory"));

export default function Navigation() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>} />
      <Route path="/register" element={<Suspense fallback={<div>Loading...</div>}><Signup /></Suspense>} />
      <Route path="/verify-email" element={<Suspense fallback={<div>Loading...</div>}><EmailVerification /></Suspense>} />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>} />
        <Route path="/subscriptions" element={<Suspense fallback={<div>Loading...</div>}><Subscriptions /></Suspense>} />
        <Route path="/upload-video" element={<Suspense fallback={<div>Loading...</div>}><UploadVideo /></Suspense>} />
        <Route path="/:username" element={<Suspense fallback={<div>Loading...</div>}><UserChannel /></Suspense>} />
        <Route path="/edit/:videoId" element={<Suspense fallback={<div>Loading...</div>}><UpdateVideo /></Suspense>} />
        <Route path="/playlists" element={<Suspense fallback={<div>Loading...</div>}><PlaylistPage /></Suspense>} />
        <Route path="/playlist/:playlistId/video/:videoId" element={<Suspense fallback={<div>Loading...</div>}><SingleVideoPage /></Suspense>} />
        <Route path="/my-playlist/:playlistId" element={<Suspense fallback={<div>Loading...</div>}><SinglePlaylistPage /></Suspense>} />
        <Route path="/posts" element={<Suspense fallback={<div>Loading...</div>}><PostsPage /></Suspense>} />
        <Route path="/liked-videos" element={<Suspense fallback={<div>Loading...</div>}><LikedVideosPage /></Suspense>} />
        <Route path="/history" element={<Suspense fallback={<div>Loading...</div>}><WatchHistoryPage /></Suspense>} />

        {/* Single Video Route */}
        <Route path="/video/:videoId" element={<Suspense fallback={<div>Loading...</div>}><SingleVideoPage /></Suspense>} />
      </Route>

      {/* Fallback route for unknown URLs */}
      <Route path="*" element={<p className="text-white text-center mt-20">404 - Page Not Found</p>} />
    </Routes>
  );
}
