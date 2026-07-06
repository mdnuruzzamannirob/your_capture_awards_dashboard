import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiSuccessResponse, NotificationListResponse } from './types';

const notificationTag = { type: 'Notifications' as const, id: 'LIST' };

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery,
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getUserNotifications: builder.query<
      ApiSuccessResponse<NotificationListResponse>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `/notifications/users?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => ({
        success: response.success,
        message: response.message,
        data: {
          notifications: Array.isArray(response.data) ? response.data : [],
          meta: response.meta ?? {
            page: 1,
            limit: 10,
            total: 0,
            totalPage: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      }),
      providesTags: [notificationTag],
    }),

    getAdminNotifications: builder.query<
      ApiSuccessResponse<NotificationListResponse>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `/notifications/admins?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => ({
        success: response.success,
        message: response.message,
        data: {
          notifications: Array.isArray(response.data) ? response.data : [],
          meta: response.meta ?? {
            page: 1,
            limit: 10,
            total: 0,
            totalPage: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      }),
      providesTags: [notificationTag],
    }),

    markAllNotificationsRead: builder.mutation<ApiSuccessResponse<{ count: number }>, void>({
      query: () => ({
        url: '/notifications/read',
        method: 'PATCH',
      }),
      invalidatesTags: [notificationTag],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useGetAdminNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
