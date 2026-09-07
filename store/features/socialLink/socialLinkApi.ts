import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiSuccessResponse,
  CreateSocialLinkBody,
  SocialLink,
  UpdateSocialLinkBody,
} from './types';

export const socialLinkApi = createApi({
  reducerPath: 'socialLinkApi',
  baseQuery,
  tagTypes: ['SocialLinks'],
  endpoints: (builder) => ({
    getAllSocialLinks: builder.query<ApiSuccessResponse<SocialLink[]>, void>({
      query: () => '/social-links/all',
      providesTags: [{ type: 'SocialLinks', id: 'LIST' }],
    }),

    createSocialLink: builder.mutation<ApiSuccessResponse<SocialLink>, CreateSocialLinkBody>({
      query: (body) => ({
        url: '/social-links',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SocialLinks', id: 'LIST' }],
    }),

    updateSocialLink: builder.mutation<ApiSuccessResponse<SocialLink>, UpdateSocialLinkBody>({
      query: ({ id, ...body }) => ({
        url: `/social-links/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'SocialLinks', id: 'LIST' }],
    }),

    deleteSocialLink: builder.mutation<ApiSuccessResponse<string>, { id: string }>({
      query: ({ id }) => ({
        url: `/social-links/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SocialLinks', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllSocialLinksQuery,
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
  useDeleteSocialLinkMutation,
} = socialLinkApi;
