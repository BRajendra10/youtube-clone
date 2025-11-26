import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = 'http://localhost:8000/api/v1/users'

export const RegisterUser = createAsyncThunk("user/register", async (formData) => {
    const response = await axios.post(`${url}/register`, formData);
    return response.data.data;
})

export const LoginUser = createAsyncThunk("user/login", async ({ email, password }) => {
    const response = await axios.post(`${url}/login`, {
        email,
        password
    });

    return response.data.data;
})

export const fetchingUserChannel = createAsyncThunk("user/channel", async ({ username, accessToken }) => {
    const response = await axios.get(`${url}/c/${username}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return response.data.data;
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
                state.reqStatus = "error"
            })
    }
})

export default userSlice.reducer;