import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const LoginUser = createAsyncThunk("user/login", async ({email, password}) => {
    const response = await axios.post("/api/v1/users/login", {
        email,
        password
    });

    return response.data.data;
})

const initialState = {
    currentUser: null,
    accessToken: null,
    reqStatus: null
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
                const {user, accessToken } = action.payload;

                state.reqStatus = true;
                state.currentUser = user;
                state.accessToken = accessToken;
            })
            .addCase(LoginUser.rejected, (state) => {
                state.reqStatus = "error"
            })
    }
})

export default userSlice.reducer;