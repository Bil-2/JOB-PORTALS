import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/notifications`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/?${searchParams.toString()}`;
      },
      providesTags: ['Notification'],
      transformResponse: (response) => ({
        notifications: response.notifications || [],
        unreadCount: response.unreadCount || 0,
        totalNotifications: response.totalNotifications || 0,
      }),
    }),
    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/mark-read/${notificationId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    clearAllNotifications: builder.mutation({
      query: () => ({
        url: '/clear-all',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    updatePreferences: builder.mutation({
      query: (preferences) => ({
        url: '/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['Notification'],
    }),
    getPreferences: builder.query({
      query: () => '/preferences',
      providesTags: ['Notification'],
    }),
    subscribeToJobAlerts: builder.mutation({
      query: (alertData) => ({
        url: '/job-alerts/subscribe',
        method: 'POST',
        body: alertData,
      }),
      invalidatesTags: ['Notification'],
    }),
    unsubscribeFromJobAlerts: builder.mutation({
      query: (alertId) => ({
        url: `/job-alerts/unsubscribe/${alertId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    getJobAlerts: builder.query({
      query: () => '/job-alerts',
      providesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  useUpdatePreferencesMutation,
  useGetPreferencesQuery,
  useSubscribeToJobAlertsMutation,
  useUnsubscribeFromJobAlertsMutation,
  useGetJobAlertsQuery,
} = notificationApi;
