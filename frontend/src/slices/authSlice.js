import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
        updateUserStatus: (state, action) => {
            state.userInfo.user.status = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
        },
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
        },
    },
});

export const { setCredentials, updateUserStatus, logout } = authSlice.actions;

export default authSlice.reducer;