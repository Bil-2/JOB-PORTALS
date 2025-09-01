import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { jobApi } from './api/jobApi';
import { applicationApi } from './api/applicationApi';
import { notificationApi } from './api/notificationApi';
import { adminApi } from './api/adminApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    notifications: notificationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PURGE',
        ],
      },
    }).concat(
      authApi.middleware,
      jobApi.middleware,
      applicationApi.middleware,
      notificationApi.middleware,
      adminApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});
