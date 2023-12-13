import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/signup`,
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),
        getUserProfiles: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/dashboard/`,
                method: "GET",
                body: data,
            }),
        }),
        blockUsers: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/dashboard/block`,
                method: "POST",
                body: data,
            }),
        }),
        unblockUsers: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/dashboard/unblock`,
                method: "POST",
                body: data,
            }),
        }),
        deleteUsers: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/dashboard/delete`,
                method: "DELETE",
                body: data,
            }),
        }),
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetUserProfilesMutation,
    useBlockUsersMutation,
    useUnblockUsersMutation,
    useDeleteUsersMutation
} = userApiSlice;