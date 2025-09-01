import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/application`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  baseQuery,
  tagTypes: ['Application', 'MyApplications'],
  endpoints: (builder) => ({
    submitApplication: builder.mutation({
      query: (applicationData) => ({
        url: '/post',
        method: 'POST',
        body: applicationData,
      }),
      invalidatesTags: ['Application', 'MyApplications'],
    }),
    getMyApplications: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/jobseeker/getall?${searchParams.toString()}`;
      },
      providesTags: ['MyApplications'],
      transformResponse: (response) => ({
        applications: response.applications || [],
        totalApplications: response.totalApplications || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.currentPage || 1,
      }),
    }),
    getEmployerApplications: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/employer/getall?${searchParams.toString()}`;
      },
      providesTags: ['Application'],
      transformResponse: (response) => ({
        applications: response.applications || [],
        totalApplications: response.totalApplications || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.currentPage || 1,
      }),
    }),
    getApplicationById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Application', id }],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, status, feedback }) => ({
        url: `/status/${id}`,
        method: 'PATCH',
        body: { status, feedback },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Application', id },
        'Application',
        'MyApplications',
      ],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Application', id },
        'MyApplications',
      ],
    }),
    getApplicationStats: builder.query({
      query: () => '/stats',
      providesTags: ['Application'],
    }),
    downloadResume: builder.query({
      query: (applicationId) => `/resume/${applicationId}`,
      providesTags: (result, error, applicationId) => [
        { type: 'Application', id: applicationId },
      ],
    }),
    scheduleInterview: builder.mutation({
      query: ({ applicationId, interviewData }) => ({
        url: `/interview/${applicationId}`,
        method: 'POST',
        body: interviewData,
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: 'Application', id: applicationId },
      ],
    }),
    getApplicationsByJob: builder.query({
      query: (jobId) => `/job/${jobId}`,
      providesTags: ['Application'],
    }),
  }),
});

export const {
  useSubmitApplicationMutation,
  useGetMyApplicationsQuery,
  useGetEmployerApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
  useGetApplicationStatsQuery,
  useDownloadResumeQuery,
  useScheduleInterviewMutation,
  useGetApplicationsByJobQuery,
} = applicationApi;
