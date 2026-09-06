import { baseQuery } from '@/store/baseQuery';
import type { ReportStatus } from '@/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ReportResponse, ReportsResponse, ReviewReportBody } from './types';

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery,
  tagTypes: ['Reports', 'Report'],
  endpoints: (builder) => ({
    getReports: builder.query<
      ReportsResponse,
      { page?: number; limit?: number; status?: ReportStatus | 'ALL' }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status && status !== 'ALL') params.set('status', status);
        return `/reports?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Report' as const, id })),
              { type: 'Reports', id: 'LIST' },
            ]
          : [{ type: 'Reports', id: 'LIST' }],
    }),

    getReport: builder.query<ReportResponse, { reportId: string }>({
      query: ({ reportId }) => `/reports/${reportId}`,
      providesTags: (result, error, { reportId }) => [{ type: 'Report', id: reportId }],
    }),

    reviewReport: builder.mutation<ReportResponse, ReviewReportBody>({
      query: ({ reportId, status, resolutionNote }) => ({
        url: `/reports/${reportId}/review`,
        method: 'PATCH',
        body: { status, resolutionNote },
      }),
      invalidatesTags: (result, error, { reportId }) => [
        { type: 'Reports', id: 'LIST' },
        { type: 'Report', id: reportId },
      ],
    }),
  }),
});

export const { useGetReportsQuery, useGetReportQuery, useReviewReportMutation } = reportApi;
