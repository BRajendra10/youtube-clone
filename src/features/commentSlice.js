import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "./axios.js";

// GET COMMENTS (Paginated)
export const getVideoComments = createAsyncThunk(
    "comments/getVideoComments",
    async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/comments/${videoId}?page=${page}&limit=${limit}`
            );
            return res.data.data; // aggregatePaginate result
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// ADD COMMENT
export const addComment = createAsyncThunk(
    "comments/addComment",
    async ({ videoId, comment }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/comments/${videoId}`, { comment });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// UPDATE COMMENT
export const updateComment = createAsyncThunk(
    "comments/updateComment",
    async ({ commentId, comment }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/comments/${commentId}`, { comment });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// DELETE COMMENT
export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async (commentId, { rejectWithValue }) => {
        try {
            await api.delete(`/comments/${commentId}`);
            return commentId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ===================== SLICE ===================== */

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        comments: [],
        fetchStatus: "idle", // idle | loading | success | error
        error: null,

        page: 1,
        totalPages: 1,
        hasMore: true,
    },

    reducers: {
        resetComments: (state) => {
            state.comments = [];
            state.page = 1;
            state.totalPages = 1;
            state.hasMore = true;
            state.fetchStatus = "idle";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* -------- GET COMMENTS -------- */
            .addCase(getVideoComments.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(getVideoComments.fulfilled, (state, action) => {
                state.fetchStatus = "success";

                const { docs, page, totalPages } = action.payload;

                state.comments =
                    page === 1 ? docs : [...state.comments, ...docs];

                state.page = page;
                state.totalPages = totalPages;
                state.hasMore = page < totalPages;
            })
            .addCase(getVideoComments.rejected, (state, action) => {
                state.fetchStatus = "error";
                state.error = action.payload;
            })

            /* -------- ADD COMMENT -------- */
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.unshift(action.payload);
            })

            /* -------- UPDATE COMMENT -------- */
            .addCase(updateComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(
                    (c) => c._id === action.payload._id
                );
                if (index !== -1) {
                    state.comments[index] = action.payload;
                }
            })

            /* -------- DELETE COMMENT -------- */
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(
                    (c) => c._id !== action.payload
                );
            });
    },
});

export const { resetComments } = commentSlice.actions;
export default commentSlice.reducer;
