import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios.js";

export const RegisterUser = createAsyncThunk("user/register", async (formData) => {
    const response = await api.post('/users/register', formData);
    return response.data.data;
})

export const LoginUser = createAsyncThunk("user/login", async ({ email, password }) => {
    const response = await api.post('/users/login', { email, password });
    return response.data.data;
})

export const Logout = createAsyncThunk("user/logout", async () => {
    const response = await api.post("/users/logout");
    return response.data;
})

export const fetchingUserChannel = createAsyncThunk("user/channel", async ({ username }) => {
    const response = await api.get(`/users/c/${username}`);
    return response.data.data;
})

export const updateUserProfile = createAsyncThunk("user/profile/update", async (formData) => {
    const response = await api.patch("/users/update-profile", formData);
    return response.data.data;
})

export const toggleSubscribtion = createAsyncThunk("user/toggle/subscribtion", async ({ channelId }) => {
    const response = await api.post(`/subscriptions/c/${channelId}`);
    return response.data;
})

const initialState = {
    currentUser: null,
    userChannel: null,
    accessToken: null,
    reqStatus: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(LoginUser.pending, (state) => {
                state.reqStatus = "pending"
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                const { user, accessToken } = action.payload;

                state.reqStatus = true;
                state.currentUser = user;
                state.accessToken = accessToken;
            })
            .addCase(LoginUser.rejected, (state) => {
                state.reqStatus = "error"
            })

        builder
            .addCase(RegisterUser.pending, (state) => {
                state.reqStatus = "pending"
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.reqStatus = true;
            })
            .addCase(RegisterUser.rejected, (state) => {
                state.reqStatus = "error"
            })

        builder
            .addCase(fetchingUserChannel.pending, (state) => {
                state.reqStatus = "pending"
            })
            .addCase(fetchingUserChannel.fulfilled, (state, action) => {
                state.reqStatus = true
                state.userChannel = action.payload;
            })
            .addCase(fetchingUserChannel.rejected, (state) => {
                state.reqStatus = "Rejected"
            })

        builder
            .addCase(toggleSubscribtion.pending, (state) => {
                state.reqStatus = "Error";
            })
            .addCase(toggleSubscribtion.fulfilled, (state, action) => {
                state.reqStatus = true;
                if (state.userChannel) {
                    state.userChannel.isSubscribed = action.payload.isSubscribed;
                    state.userChannel.subscribersCount = action.payload.subscribersCount;

                    console.log("hello world")
                }
            })
            .addCase(toggleSubscribtion.rejected, (state) => {
                state.reqStatus = "Rejected";
            })

        builder
            .addCase(Logout.pending, (state) => {
                state.reqStatus = "Error"
            })
            .addCase(Logout.fulfilled, (state) => {
                state.reqStatus = true;
                state.currentUser = null;
                state.userChannel = null;
            })
            .addCase(Logout.rejected, (state) => {
                state.reqStatus ="Rejected"
            })

        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.reqStatus = "pending"
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.reqStatus = true;
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.reqStatus = "error"
            })
    }
})

export default userSlice.reducer;