import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiSuccessResponse,
  ChangePasswordBody,
  GetUsersResponse,
  ToggleBlockBody,
  UpdateProfileBody,
  User,
} from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    getUsers: builder.query<
      ApiSuccessResponse<GetUsersResponse>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => `/users?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data?.users?.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    getUser: builder.query<User, { id: string }>({
      query: ({ id }) => `/users/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    toggleUserBlock: builder.mutation<ApiSuccessResponse<User>, ToggleBlockBody>({
      query: (body) => ({
        url: '/dashboard/toggle-block',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    updateUserProfile: builder.mutation<ApiSuccessResponse<User>, UpdateProfileBody>({
      query: ({ userId, ...body }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    uploadUserAvatar: builder.mutation<ApiSuccessResponse<User>, FormData>({
      query: (body) => ({
        url: '/users/avatar',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    changeUserPassword: builder.mutation<ApiSuccessResponse<string>, ChangePasswordBody>({
      query: (body) => ({
        url: '/users/change-password',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useToggleUserBlockMutation,
  useUpdateUserProfileMutation,
  useUploadUserAvatarMutation,
  useChangeUserPasswordMutation,
} = userApi;
