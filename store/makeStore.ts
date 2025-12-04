import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/features/auth/authSlice';
import { authApi } from './features/auth/authApi';
import { userApi } from './features/user/userApi';
import { contestApi } from './features/contest/contestApi';

export const makeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [contestApi.reducerPath]: contestApi.reducer,
      // [profileApi.reducerPath]: profileApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        authApi.middleware,
        userApi.middleware,
        contestApi.middleware,
        // profileApi.middleware,
      ),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
};
