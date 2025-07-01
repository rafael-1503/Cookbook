import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState:{
        userId: localStorage.getItem("userId") || null,
        isLoggedIn: !!localStorage.getItem("userId"),
        email: localStorage.getItem("email") || "",
    },
    reducers:{
        login: (state, action) => {
            state.userId = action.payload.userId;
            state.email = action.payload.email;
            state.isLoggedIn = true;
            localStorage.setItem("userId", action.payload.userId);
            localStorage.setItem("email", action.payload.email);
        },
        logout:(state) => {
            state.userId = null;
            state.email = "";
            state.isLoggedIn = false;
            localStorage.removeItem("userId");
            localStorage.removeItem("email");
        }
    }
});

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;