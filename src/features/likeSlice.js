import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios";

// Toggle video like
export const toggleVideoLike = createAsyncThunk(
    "likes/toggleVideoLike",
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/likes/toggle/v/${videoId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to toggle video like");
        }
    }
);

// Toggle comment like
export const toggleCommentLike = createAsyncThunk(
    "likes/toggleCommentLike",
    async (commentId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/likes/toggle/c/${commentId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to toggle comment like");
        }
    }
);

// Toggle post like
export const togglePostLike = createAsyncThunk(
    "likes/togglePostLike",
    async (postId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/likes/toggle/p/${postId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to toggle post like");
        }
    }
);

// Fetch liked videos
export const fetchLikedVideos = createAsyncThunk(
    "likes/fetchLikedVideos",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/likes/videos");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch liked videos");
        }
    }
);

// Remove video from liked videos
export const removeLikedVideo = createAsyncThunk(
    "like/removeLikedVideo",
    async (videoId, { rejectWithValue }) => {
        try {
            await api.delete(`/likes/remove-video/${videoId}`);
            return videoId; // return videoId for state update
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to remove liked video"
            );
        }
    }
);

const initialState = {
    likedVideos: [],
    fetchStatus: false,
    error: null,
};

const likeSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {
        clearLikeError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Toggle like video
            .addCase(toggleVideoLike.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(toggleVideoLike.fulfilled, (state) => {
                state.fetchStatus = "success";
            })
            .addCase(toggleVideoLike.rejected, (state, action) => {
                state.fetchStatus = "error";
                state.error = action.payload;
            })

            // Toggle like comment
            .addCase(toggleCommentLike.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(toggleCommentLike.fulfilled, (state) => {
                state.fetchStatus = "success";
            })
            .addCase(toggleCommentLike.rejected, (state, action) => {
                state.fetchStatus = "error";
                state.error = action.payload;
            })

            // Toggle like post
            .addCase(togglePostLike.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(togglePostLike.fulfilled, (state) => {
                state.fetchStatus = "success";
            })
            .addCase(togglePostLike.rejected, (state, action) => {
                state.fetchStatus = "error";
                state.error = action.payload;
            })

            // Fetch liked videos
            .addCase(fetchLikedVideos.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchLikedVideos.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                state.likedVideos = action.payload;
            })
            .addCase(fetchLikedVideos.rejected, (state, action) => {
                state.fetchStatus = "error";
                state.error = action.payload;
            })

            // remove video form liked videos
            .addCase(removeLikedVideo.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(removeLikedVideo.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                state.likedVideos = state.likedVideos.filter(
                    (like) => like.video._id !== action.payload
                );
            })
            .addCase(removeLikedVideo.rejected, (state) => {
                state.fetchStatus = "error";
            });
    },
});

export const { clearLikeError } = likeSlice.actions;
export default likeSlice.reducer;
