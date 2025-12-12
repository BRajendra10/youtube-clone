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
            console.log(channelId)
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
    reqStatus: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder

            // LOGIN
            .addCase(LoginUser.pending, (state) => {
                state.reqStatus = "pending";
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.reqStatus = "success";
                state.currentUser = action.payload.user;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(LoginUser.rejected, (state) => {
                state.reqStatus = "error";
            })


            // REGISTER
            .addCase(RegisterUser.pending, (state) => {
                state.reqStatus = "pending";
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.reqStatus = "success";
            })
            .addCase(RegisterUser.rejected, (state) => {
                state.reqStatus = "error";
            })


            // FETCH CHANNEL
            .addCase(fetchingUserChannel.pending, (state) => {
                state.reqStatus = "pending";
            })
            .addCase(fetchingUserChannel.fulfilled, (state, action) => {
                state.reqStatus = "success";
                state.userChannel = action.payload;
            })
            .addCase(fetchingUserChannel.rejected, (state) => {
                state.reqStatus = "error";
            })


            // TOGGLE SUBSCRIPTION
            .addCase(toggleSubscribtion.pending, (state) => {
                state.reqStatus = "pending";
            })
            .addCase(toggleSubscribtion.fulfilled, (state, action) => {
                state.reqStatus = "success";

                if (state.userChannel) {
                    state.userChannel.isSubscribed = action.payload.isSubscribed;
                    state.userChannel.subscribersCount = action.payload.subscribersCount;
                }
            })
            .addCase(toggleSubscribtion.rejected, (state) => {
                state.reqStatus = "error";
            })


            // LOGOUT
            .addCase(Logout.pending, (state) => {
                state.reqStatus = "pending";
            })
            .addCase(Logout.fulfilled, (state) => {
                state.reqStatus = "success";
                state.currentUser = null;
                state.userChannel = null;
            })
            .addCase(Logout.rejected, (state) => {
                state.reqStatus = "error";
            })


            // UPDATE PROFILE
            .addCase(updateUserProfile.pending, (state) => {
                state.reqStatus = "pending";
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.reqStatus = "success";
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.reqStatus = "error";
            });
    },
});

export default userSlice.reducer;
