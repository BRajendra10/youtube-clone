import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios.js";

export const getSubscribedTo = createAsyncThunk("user/subscribers", async ({ subscriberId }) => {
    const response = await api.get(`/subscriptions/u/${subscriberId}`);

    return response.data.data;
})

const initialState = {
    subscribers: null,
    reqStatus: false,
}

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getSubscribedTo.pending, (state) => {
                state.reqStatus = "Error";
            })
            .addCase(getSubscribedTo.fulfilled, (state, action) => {
                state.reqStatus = true;
                state.subscribers = action.payload;
            })
            .addCase(getSubscribedTo.rejected, (state) => {
                state.reqStatus = "Error";
            })
    }
})

export default subscriptionSlice.reducer