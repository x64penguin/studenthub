import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: {},
    auth: false,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.auth = true;
            state.user = action.payload.user;
        },

        logout: (state, action) => {
            state.auth = false;
            state.user = {};
        },

        update: (state, action) => {
            state.auth = action.payload.auth;
            state.user = action.payload.user;
        }
    }
})