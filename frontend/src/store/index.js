import { combineReducers, combineReducersm, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { userSlice } from "./User"

export const store = configureStore({
    reducer: combineReducers({
        user: userSlice.reducer
    }),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})