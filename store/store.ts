import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/features/auth/authSlice';
import { authApi } from '@/store/features/auth/authApi';
import { userApi } from '@/store/features/user/userApi';
import { contestApi } from '@/store/features/contest/contestApi';

export const store = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [contestApi.reducerPath]: contestApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(authApi.middleware, userApi.middleware, contestApi.middleware),

    devTools: process.env.NODE_ENV !== 'production',
  });
};
