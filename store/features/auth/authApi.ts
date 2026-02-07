import { createApi } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { baseQuery } from '@/store/baseQuery';
import { setTempEmail, setTempToken, setUser } from './authSlice';
import { AuthUser, SigninData } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    signin: builder.mutation<{ data: { token: string; user: AuthUser } }, SigninData>({
      query: (credentials) => ({
        url: 'auth/admin/signin',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data?.user));
          Cookies.set('token', data?.token, {
            expires: 7,
            secure: true,
            sameSite: 'Strict',
            path: '/',
          });
        } catch {}
      },
    }),

    getMe: builder.query<{ data: AuthUser }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {}
      },
    }),

    forgotPassword: builder.mutation<{ success: boolean; message?: string }, { email: string }>({
      query: (body) => ({ url: '/users/forget-password', method: 'POST', body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setTempEmail(arg.email));
        } catch {}
      },
    }),

    verifyOTP: builder.mutation<
      { data: { reset_password_token: string } },
      { email: string; code: string }
    >({
      query: (body) => ({ url: '/users/verify-otp', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setTempToken(data?.reset_password_token));
        } catch {}
      },
    }),

    resetPassword: builder.mutation<
      { success: boolean; message?: string },
      { token?: string; email?: string; password: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/users/reset-password', method: 'PATCH', body }),
    }),
  }),
});

export const {
  useSigninMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useLazyGetMeQuery,
} = authApi;
