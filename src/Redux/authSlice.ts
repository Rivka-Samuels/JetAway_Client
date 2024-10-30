import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserModel from "../Models/UserModel";
import {jwtDecode} from "jwt-decode";


// 1. interface:
interface AuthState{
    token:string | null;
    userWithoutPassword:UserModel | null;
}

// 2. initial object:
const initialState:AuthState = {
    token: localStorage.getItem("token"),
    userWithoutPassword: null
}

if( initialState.token ){
    const container:{ userWithoutPassword:UserModel } = jwtDecode( initialState.token );
    initialState.userWithoutPassword = container.userWithoutPassword;  
}

// 3. create Slice:
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        register: (state, action:PayloadAction<string> ) => {

            // Decode the token:
            const container:{userWithoutPassword:UserModel } = jwtDecode( action.payload );

            // Save to storage:
            localStorage.setItem("token", action.payload );

            // Update to state:
            state.token = action.payload;
            state.userWithoutPassword = container.userWithoutPassword;
        },
        login: (state, action:PayloadAction<string> ) => {
            const container:{ userWithoutPassword:UserModel } = jwtDecode( action.payload );
            localStorage.setItem("token", action.payload );
            state.token = action.payload;
            state.userWithoutPassword = container.userWithoutPassword;
        },
        logout: (state ) => {
            state.token = null;
            state.userWithoutPassword = null;
            localStorage.removeItem("token")
        }
    }
})

// 4. exports:
export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;
