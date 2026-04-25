import { authApi } from '@/store/features/auth/authApi';
import authReducer from '@/store/features/auth/authSlice';
import { contestApi } from '@/store/features/contest/contestApi';
import { dashboardApi } from '@/store/features/dashboard/dashboardApi';
import { userApi } from '@/store/features/user/userApi';
import { configureStore } from '@reduxjs/toolkit';

export const store = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [contestApi.reducerPath]: contestApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        authApi.middleware,
        userApi.middleware,
        contestApi.middleware,
        dashboardApi.middleware,
      ),

    devTools: process.env.NODE_ENV !== 'production',
  });
};
