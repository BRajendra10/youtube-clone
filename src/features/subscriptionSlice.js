import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./axios.js";

export const getSubscribedTo = createAsyncThunk(
    "user/subscribers",
    async ({ subscriberId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/subscriptions/u/${subscriberId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);


const initialState = {
    subscribers: null,
    fetchStatus: false,
    error: null
}

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getSubscribedTo.pending, (state) => {
                state.fetchStatus = "pending";
            })
            .addCase(getSubscribedTo.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                state.subscribers = action.payload;
            })
            .addCase(getSubscribedTo.rejected, (state, action) => {
                state.fetchStatus = "error";
                state.error = action.payload;
            })
    }
})

export default subscriptionSlice.reducer