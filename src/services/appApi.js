import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001",
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
        credentials: 
        "include",
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/users/login",
        method: "POST",
        body: user,
        credentials: "include",
      }),
    }),
    logoutUser: builder.mutation({
      query: (payload) => ({
        url: "/logout",
        method: "DELETE",
        body: payload,
        // credentials: "include"
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = appApi;
export default appApi;
