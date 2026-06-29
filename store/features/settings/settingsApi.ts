import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiSuccessResponse, ChangePasswordBody, User } from '../user/types';

export interface SitePolicy {
  id: string;
  type: 'ABOUT' | 'TERMS' | 'POLICY';
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileBody {
  firstName: string;
  lastName: string;
  location: string;
}

export interface UpdateSitePolicyBody {
  content: string;
  type: 'ABOUT' | 'TERMS' | 'POLICY';
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery,
  tagTypes: ['Auth', 'SitePolicy', 'Users', 'User'],
  endpoints: (builder) => ({
    updateProfile: builder.mutation<ApiSuccessResponse<User>, UpdateProfileBody>({
      query: (body) => ({
        url: '/users',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Auth', { type: 'Users', id: 'LIST' }],
    }),

    uploadAvatar: builder.mutation<ApiSuccessResponse<string>, FormData>({
      query: (body) => ({
        url: '/users/avatar',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth', { type: 'Users', id: 'LIST' }],
    }),

    changePassword: builder.mutation<ApiSuccessResponse<string>, ChangePasswordBody>({
      query: (body) => ({
        url: '/users/change-password',
        method: 'PUT',
        body,
      }),
    }),

    getSitePolicy: builder.query<ApiSuccessResponse<SitePolicy[]>, { type: string }>({
      query: ({ type }) => `/site-policies?type=${type}`,
      providesTags: (result, error, { type }) => [{ type: 'SitePolicy', id: type }],
    }),

    updateSitePolicy: builder.mutation<ApiSuccessResponse<SitePolicy>, UpdateSitePolicyBody>({
      query: (body) => ({
        url: '/site-policies',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { type }) => [{ type: 'SitePolicy', id: type }],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useGetSitePolicyQuery,
  useUpdateSitePolicyMutation,
} = settingsApi;
