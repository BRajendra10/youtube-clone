import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios.js";

// REGISTER
export const RegisterUser = createAsyncThunk(
    "user/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/users/register', formData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Registration failed");
        }
    }
);


// LOGIN
export const LoginUser = createAsyncThunk(
    "user/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/users/login', { email, password });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Login failed");
        }
    }
);


// LOGOUT
export const Logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/logout");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Logout failed");
        }
    }
);


// FETCH USER CHANNEL
export const fetchingUserChannel = createAsyncThunk(
    "user/channel",
    async ({ username }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/users/c/${username}`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load channel");
        }
    }
);


// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
    "user/profile/update",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.patch("/users/update-profile", formData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Profile update failed");
        }
    }
);


// TOGGLE SUBSCRIPTION
export const toggleSubscribtion = createAsyncThunk(
    "user/toggle/subscribtion",
    async ( channelId , { rejectWithValue }) => {
        try {
            const res = await api.post(`/subscriptions/c/${channelId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to toggle subscription");
        }
    }
);



// SLICE
const initialState = {
    currentUser: null,
    userChannel: null,
    accessToken: null,
    fetchStatus: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder

            // LOGIN
            .addCase(LoginUser.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                state.currentUser = action.payload.user;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(LoginUser.rejected, (state) => {
                state.fetchStatus = "error";
            })


            // REGISTER
            .addCase(RegisterUser.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.fetchStatus = "success";
            })
            .addCase(RegisterUser.rejected, (state) => {
                state.fetchStatus = "error";
            })


            // FETCH CHANNEL
            .addCase(fetchingUserChannel.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(fetchingUserChannel.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                state.userChannel = action.payload;
            })
            .addCase(fetchingUserChannel.rejected, (state) => {
                state.fetchStatus = "error";
            })


            // TOGGLE SUBSCRIPTION
            .addCase(toggleSubscribtion.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(toggleSubscribtion.fulfilled, (state, action) => {
                state.fetchStatus = "success";

                if (state.userChannel) {
                    state.userChannel.isSubscribed = action.payload.isSubscribed;
                    state.userChannel.subscribersCount = action.payload.subscribersCount;
                }
            })
            .addCase(toggleSubscribtion.rejected, (state) => {
                state.fetchStatus = "error";
            })


            // LOGOUT
            .addCase(Logout.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(Logout.fulfilled, (state) => {
                state.fetchStatus = "success";
                state.currentUser = null;
                state.userChannel = null;
            })
            .addCase(Logout.rejected, (state) => {
                state.fetchStatus = "error";
            })


            // UPDATE PROFILE
            .addCase(updateUserProfile.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.fetchStatus = "success";
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.fetchStatus = "error";
            });
    },
});

export default userSlice.reducer;
