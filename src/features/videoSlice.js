import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios";

// -------------------- ASYNC THUNKS --------------------

export const fetchAllVideos = createAsyncThunk(
    "video/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get("/videos", { params });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Unable to fetch videos");
        }
    }
);

export const uploadVideo = createAsyncThunk(
    "video/upload",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/videos", formData, { timeout: 0 });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Upload failed");
        }
    }
);

export const fetchVideoById = createAsyncThunk(
    "video/fetchById",
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/videos/${videoId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Video not found");
        }
    }
);

export const updateVideo = createAsyncThunk(
    "video/update",
    async ({ videoId, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/videos/${videoId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 0
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Update failed");
        }
    }
);

export const deleteVideo = createAsyncThunk(
    "video/delete",
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/videos/${videoId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Delete failed");
        }
    }
);

// -------------------- INITIAL STATE --------------------

const initialState = {
    videos: [],
    selectedVideoId: null,
    fetchStatus: null,
    uploadStatus: null,
    updateStatus: null,
    deleteStatus: null,
    error: null
};

// -------------------- SLICE --------------------

const videoSlice = createSlice({
    name: "video",
    initialState,
    extraReducers: (builder) => {
        builder
            // Fetch all videos
            .addCase(fetchAllVideos.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(fetchAllVideos.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                state.videos = action.payload?.docs || [];
            })
            .addCase(fetchAllVideos.rejected, (state, action) => {
                state.fetchStatus = "error";
                state.error = action.payload;
            })

            // Upload video
            .addCase(uploadVideo.pending, (state) => {
                state.uploadStatus = "pending";
            })
            .addCase(uploadVideo.fulfilled, (state) => {
                state.uploadStatus = "success";
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.uploadStatus = "error";
                state.error = action.payload;
            })

            // Fetch video by id
            .addCase(fetchVideoById.pending, (state) => {
                state.reqStatus = "pending";
            })
            .addCase(fetchVideoById.fulfilled, (state, action) => {
                state.reqStatus = "success";
                state.selectedVideo = action.payload?.data || null;
            })
            .addCase(fetchVideoById.rejected, (state, action) => {
                state.reqStatus = "error";
                state.error = action.payload;
            })

            // Update video
            .addCase(updateVideo.pending, (state) => {
                state.updateStatus = "pending";
            })
            .addCase(updateVideo.fulfilled, (state) => {
                state.updateStatus = "success";
            })
            .addCase(updateVideo.rejected, (state, action) => {
                state.updateStatus = "error";
                state.error = action.payload;
            })

            // Delete video
            .addCase(deleteVideo.pending, (state) => {
                state.deleteStatus = "pending";
            })
            .addCase(deleteVideo.fulfilled, (state, action) => {
                state.deleteStatus = "success";
                console.log(action.payload)
            })
            .addCase(deleteVideo.rejected, (state, action) => {
                state.deleteStatus = "error";
                state.error = action.payload;
            });
    }
});

export default videoSlice.reducer;
