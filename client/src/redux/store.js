import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Userslice";

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;