import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
export const store = configureStore({
    reducer: appReducer
})