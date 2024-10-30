import { configureStore } from "@reduxjs/toolkit";
import vacationsReducer from "./vacationsSlice"; 
import authReducer from "./authSlice";
import followsReducer from "./followsSlice"; 


// Main store (global state) object
export const store = configureStore({
    reducer: {
        vacations: vacationsReducer,
        follows: followsReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
