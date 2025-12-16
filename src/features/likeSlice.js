import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios";

/* ----------------------------------
   ASYNC THUNKS
---------------------------------- */

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

/* ----------------------------------
   SLICE
---------------------------------- */

const initialState = {
    likedVideos: [],
    loading: false,
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
            // Toggle like (video / comment / post)
            .addCase(toggleVideoLike.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleCommentLike.pending, (state) => {
                state.loading = true;
            })
            .addCase(togglePostLike.pending, (state) => {
                state.loading = true;
            })

            .addCase(toggleVideoLike.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(toggleCommentLike.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(togglePostLike.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(toggleVideoLike.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleCommentLike.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(togglePostLike.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch liked videos
            .addCase(fetchLikedVideos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLikedVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.likedVideos = action.payload;
            })
            .addCase(fetchLikedVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearLikeError } = likeSlice.actions;
export default likeSlice.reducer;
