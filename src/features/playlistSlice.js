import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios"; // your axios instance

// Create Playlist
export const createPlaylist = createAsyncThunk(
    "playlist/create",
    async ({ name, description, videoId }, { rejectWithValue }) => {
        try {
            const res = await api.post("/playlist/create", { name, description, videoId });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create playlist");
        }
    }
);

// Get all playlists of a user
export const fetchUserPlaylists = createAsyncThunk(
    "playlist/fetchUserPlaylists",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/playlist/user/${userId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load playlists");
        }
    }
);

// Get playlist by ID
export const fetchPlaylistById = createAsyncThunk(
    "playlist/fetchById",
    async (playlistId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/playlist/${playlistId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load playlist");
        }
    }
);

// Add video to playlist
export const addVideoToPlaylist = createAsyncThunk(
    "playlist/addVideo",
    async ({ videoId, playlistId }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/playlist/add/${videoId}/${playlistId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to add video");
        }
    }
);

// Remove video from playlist
export const removeVideoFromPlaylist = createAsyncThunk(
    "playlist/removeVideo",
    async ({ videoId, playlistId }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to remove video");
        }
    }
);

// Update playlist
export const updatePlaylist = createAsyncThunk(
    "playlist/update",
    async ({ playlistId, name, description }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/playlist/${playlistId}`, { name, description });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update playlist");
        }
    }
);

// Delete playlist
export const deletePlaylist = createAsyncThunk(
    "playlist/delete",
    async (playlistId, { rejectWithValue }) => {
        try {
            await api.delete(`/playlist/${playlistId}`);
            return playlistId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete playlist");
        }
    }
);

// ---------------------- SLICE ----------------------

const playlistSlice = createSlice({
    name: "playlist",
    initialState: {
        playlists: [],
        selectedPlaylist: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Create
            .addCase(createPlaylist.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists.push(action.payload);
            })
            .addCase(createPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch User Playlists
            .addCase(fetchUserPlaylists.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload;
            })
            .addCase(fetchUserPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Playlist By ID
            .addCase(fetchPlaylistById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPlaylistById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlaylist = action.payload;
            })
            .addCase(fetchPlaylistById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Video
            .addCase(addVideoToPlaylist.pending, (state) => {
                state.loading = true;
            })
            .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload);
            })
            .addCase(addVideoToPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            // Remove Video
            .addCase(removeVideoFromPlaylist.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload);
            })
            .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            // Update Playlist
            .addCase(updatePlaylist.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePlaylist.fulfilled, (state, action) => {
                state.selectedPlaylist = action.payload;
                state.playlists = state.playlists.map((p) =>
                    p._id === action.payload._id ? action.payload : p
                );
            })
            .addCase(updatePlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            // Delete Playlist
            .addCase(deletePlaylist.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.playlists = state.playlists.filter(
                    (p) => p._id !== action.payload
                );
            })
            .addCase(deletePlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    },
});

export default playlistSlice.reducer;
