import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/job`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const jobApi = createApi({
  reducerPath: 'jobApi',
  baseQuery,
  tagTypes: ['Job', 'MyJobs'],
  endpoints: (builder) => ({
    getAllJobs: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/getall?${searchParams.toString()}`;
      },
      providesTags: ['Job'],
      transformResponse: (response) => ({
        jobs: response.jobs || [],
        totalJobs: response.totalJobs || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.currentPage || 1,
      }),
    }),
    getJobById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    searchJobs: builder.query({
      query: ({ query, filters = {}, page = 1, limit = 10 }) => ({
        url: '/search',
        params: {
          q: query,
          page,
          limit,
          ...filters,
        },
      }),
      providesTags: ['Job'],
    }),
    getJobsByCategory: builder.query({
      query: (category) => `/category/${category}`,
      providesTags: ['Job'],
    }),
    getFeaturedJobs: builder.query({
      query: () => '/featured',
      providesTags: ['Job'],
    }),
    getRecentJobs: builder.query({
      query: (limit = 5) => `/recent?limit=${limit}`,
      providesTags: ['Job'],
    }),
    postJob: builder.mutation({
      query: (jobData) => ({
        url: '/post',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job', 'MyJobs'],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...jobData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: jobData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Job', id },
        'MyJobs',
      ],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Job', id },
        'MyJobs',
      ],
    }),
    getMyJobs: builder.query({
      query: () => '/me',
      providesTags: ['MyJobs'],
    }),
    toggleJobStatus: builder.mutation({
      query: (id) => ({
        url: `/toggle-status/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Job', id },
        'MyJobs',
      ],
    }),
    getJobStats: builder.query({
      query: () => '/stats',
      providesTags: ['Job'],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useSearchJobsQuery,
  useGetJobsByCategoryQuery,
  useGetFeaturedJobsQuery,
  useGetRecentJobsQuery,
  usePostJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetMyJobsQuery,
  useToggleJobStatusMutation,
  useGetJobStatsQuery,
} = jobApi;
