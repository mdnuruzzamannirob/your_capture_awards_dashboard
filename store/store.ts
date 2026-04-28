import { authApi } from '@/store/features/auth/authApi';
import authReducer from '@/store/features/auth/authSlice';
import { contestApi } from '@/store/features/contest/contestApi';
import { dashboardApi } from '@/store/features/dashboard/dashboardApi';
import { storeApi } from '@/store/features/store/storeApi';
import { subscriptionApi } from '@/store/features/subscription/subscriptionApi';
import { userApi } from '@/store/features/user/userApi';
import { walletApi } from '@/store/features/wallet/walletApi';
import { configureStore } from '@reduxjs/toolkit';

export const store = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [contestApi.reducerPath]: contestApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [storeApi.reducerPath]: storeApi.reducer,
      [subscriptionApi.reducerPath]: subscriptionApi.reducer,
      [walletApi.reducerPath]: walletApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        authApi.middleware,
        userApi.middleware,
        contestApi.middleware,
        dashboardApi.middleware,
        storeApi.middleware,
        subscriptionApi.middleware,
        walletApi.middleware,
      ),

    devTools: process.env.NODE_ENV !== 'production',
  });
};
