import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { FaqPayload, FaqResponse, FaqsResponse } from './types';

const normalizeFaq = (faq: Record<string, any>) => ({
  id: faq.id,
  question: faq.question ?? '',
  answer: faq.answer ?? '',
  category: faq.category ?? null,
  order: Number(faq.order ?? 0),
  isActive: Boolean(faq.isActive),
  createdAt: faq.createdAt ?? '',
  updatedAt: faq.updatedAt ?? '',
});

export const faqApi = createApi({
  reducerPath: 'faqApi',
  baseQuery,
  tagTypes: ['Faqs', 'Faq'],
  endpoints: (builder) => ({
    getFaqs: builder.query<
      FaqsResponse,
      { page?: number; limit?: number; search?: string; isActive?: boolean }
    >({
      query: ({ page = 1, limit = 10, search, isActive }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search?.trim()) params.set('search', search.trim());
        if (isActive !== undefined) params.set('isActive', String(isActive));
        return `/faqs/all?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        ...response,
        data: Array.isArray(response.data) ? response.data.map(normalizeFaq) : [],
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Faq' as const, id })),
              { type: 'Faqs', id: 'LIST' },
            ]
          : [{ type: 'Faqs', id: 'LIST' }],
    }),

    createFaq: builder.mutation<FaqResponse, FaqPayload>({
      query: (body) => ({
        url: '/faqs',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => ({
        ...response,
        data: normalizeFaq(response.data),
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),

    updateFaq: builder.mutation<FaqResponse, { id: string; body: FaqPayload }>({
      query: ({ id, body }) => ({
        url: `/faqs/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => ({
        ...response,
        data: normalizeFaq(response.data),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Faqs', id: 'LIST' },
        { type: 'Faq', id },
      ],
    }),

    deleteFaq: builder.mutation<{ success: boolean; message: string; data: string }, string>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),
  }),
});

export const { useGetFaqsQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } =
  faqApi;
