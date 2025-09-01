import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/admin`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminStats', 'SystemHealth', 'Users', 'AdminJobs', 'AdminApplications'],
  endpoints: (builder) => ({
    // Dashboard Statistics
    getDashboardStats: builder.query({
      query: () => '/dashboard-stats',
      providesTags: ['AdminStats'],
      keepUnusedDataFor: 30, // Keep data for 30 seconds
    }),

    // System Health
    getSystemHealth: builder.query({
      query: () => '/system-health',
      providesTags: ['SystemHealth'],
      keepUnusedDataFor: 30,
    }),

    // User Management
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, role, search, sortBy = 'createdAt', sortOrder = 'desc' } = {}) => ({
        url: '/users',
        params: {
          page,
          limit,
          ...(role && { role }),
          ...(search && { search }),
          sortBy,
          sortOrder,
        },
      }),
      providesTags: ['Users'],
    }),

    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Users', 'AdminStats'],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'AdminStats'],
    }),

    // Job Management
    getAdminJobs: builder.query({
      query: ({ page = 1, limit = 10, category, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = {}) => ({
        url: '/jobs',
        params: {
          page,
          limit,
          ...(category && { category }),
          ...(status && { status }),
          ...(search && { search }),
          sortBy,
          sortOrder,
        },
      }),
      providesTags: ['AdminJobs'],
    }),

    updateJobStatus: builder.mutation({
      query: ({ jobId, status }) => ({
        url: `/jobs/${jobId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['AdminJobs', 'AdminStats'],
    }),

    deleteJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminJobs', 'AdminStats'],
    }),

    // Application Management
    getAdminApplications: builder.query({
      query: ({ page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = {}) => ({
        url: '/applications',
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(search && { search }),
          sortBy,
          sortOrder,
        },
      }),
      providesTags: ['AdminApplications'],
    }),

    updateApplicationStatus: builder.mutation({
      query: ({ applicationId, status, feedback }) => ({
        url: `/applications/${applicationId}/status`,
        method: 'PATCH',
        body: { status, ...(feedback && { feedback }) },
      }),
      invalidatesTags: ['AdminApplications', 'AdminStats'],
    }),

    deleteApplication: builder.mutation({
      query: (applicationId) => ({
        url: `/applications/${applicationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminApplications', 'AdminStats'],
    }),

    // System Messages
    broadcastMessage: builder.mutation({
      query: ({ message, type = 'info', targetRole }) => ({
        url: '/broadcast-message',
        method: 'POST',
        body: {
          message,
          type,
          ...(targetRole && { targetRole }),
        },
      }),
    }),

    // Analytics Queries
    getUserAnalytics: builder.query({
      query: ({ period = '30d' } = {}) => ({
        url: '/analytics/users',
        params: { period },
      }),
      providesTags: ['AdminStats'],
    }),

    getJobAnalytics: builder.query({
      query: ({ period = '30d' } = {}) => ({
        url: '/analytics/jobs',
        params: { period },
      }),
      providesTags: ['AdminStats'],
    }),

    getApplicationAnalytics: builder.query({
      query: ({ period = '30d' } = {}) => ({
        url: '/analytics/applications',
        params: { period },
      }),
      providesTags: ['AdminStats'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSystemHealthQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetAdminJobsQuery,
  useUpdateJobStatusMutation,
  useDeleteJobMutation,
  useGetAdminApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
  useBroadcastMessageMutation,
  useGetUserAnalyticsQuery,
  useGetJobAnalyticsQuery,
  useGetApplicationAnalyticsQuery,
} = adminApi;
