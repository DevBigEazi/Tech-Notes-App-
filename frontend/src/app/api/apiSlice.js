import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8500" }),
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
