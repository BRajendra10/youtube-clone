import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { subscribe } from "diagnostics_channel";

const url = 'http://localhost:8000/api/v1/subscriptions'

export const toggleSubscribtion = createAsyncThunk("user/toggle/subscribtion", async ({channelId, accessToken}) => {
    console.log(accessToken)
    const response = await axios.post(`${url}/c/${channelId}`, {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    console.log(response)

    return response.data.data;
})

export const getSubscribedTo = createAsyncThunk("user/subscribers", async ({subscriberId, accessToken}) => {
    const response = await axios.get(`${url}/u/${subscriberId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

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

        builder
            .addCase(toggleSubscribtion.pending, (state) => {
                state.reqStatus = "Error";
            })
            .addCase(toggleSubscribtion.fulfilled, (state) => {
                state.reqStatus = true;
                // state.subscribers = action.payload
            })
            .addCase(toggleSubscribtion.rejected, (state) => {
                state.reqStatus = "Error";
            })
    }
})

export default subscriptionSlice.reducer