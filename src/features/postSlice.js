import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios";

// CREATE POST
export const createPost = createAsyncThunk(
    "posts/create",
    async ({ content }, { rejectWithValue }) => {
        try {
            const res = await api.post("/posts", { content });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// GET ALL POSTS (HOME FEED)
export const getAllPosts = createAsyncThunk(
    "posts/getAllPosts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/posts");
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// GET USER POSTS
export const getUserPosts = createAsyncThunk(
    "posts/getUserPosts",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/posts/user/${userId}`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// UPDATE POST
export const updatePost = createAsyncThunk(
    "posts/update",
    async ({ postId, content }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/posts/update_post/${postId}`, { content });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// DELETE POST
export const deletePost = createAsyncThunk(
    "posts/delete",
    async ({ postId }, { rejectWithValue }) => {
        try {
            await api.delete(`/posts/${postId}`);
            return postId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        loading: false,
        fetchStatus: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createPost.pending, (state) => {
                state.fetchStatus = "loading"
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.fetchStatus = "success"
                state.posts.unshift(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.fetchStatus = "error"
                state.error = action.payload;
            })

            // GET USER POSTS
            .addCase(getUserPosts.pending, (state) => {
                state.fetchStatus = "loading"
            })
            .addCase(getUserPosts.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                state.posts = action.payload;
            })
            .addCase(getUserPosts.rejected, (state, action) => {
                state.fetchStatus = "error"
                state.error = action.payload;
            })

            // GET ALL POSTS (HOME FEED)
            .addCase(getAllPosts.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                state.posts = action.payload;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.fetchStatus = "error";
                state.error = action.payload;
            })


            // UPDATE
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(
                    (post) => post._id === action.payload._id
                );
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })

            // DELETE
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(
                    (post) => post._id !== action.payload
                );
            });
    },
});

export default postSlice.reducer;
