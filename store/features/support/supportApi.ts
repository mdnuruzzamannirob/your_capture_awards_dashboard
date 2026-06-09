import { baseQuery } from '@/store/baseQuery';
import type { SupportTicket, SupportTicketStatus } from '@/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  SupportTicketResponse,
  SupportTicketsResponse,
  UpdateSupportStatusBody,
} from './types';

const normalizeStatus = (status: string): SupportTicketStatus =>
  status.toLowerCase() as SupportTicketStatus;

const normalizeTicket = (ticket: Record<string, any>): SupportTicket => ({
  id: ticket.id,
  ticketNumber: ticket.ticket_no ?? ticket.ticketNumber ?? '',
  subject: ticket.subject ?? '',
  email: ticket.email ?? '',
  priority: ticket.priority ?? 'low',
  status: normalizeStatus(ticket.status ?? 'pending'),
  message: ticket.message ?? '',
  createdAt: ticket.createdAt ?? '',
  updatedAt: ticket.updatedAt ?? '',
  userName: ticket.name ?? ticket.userName,
  assignedTo: ticket.assignedTo,
});

export const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery,
  tagTypes: ['SupportTickets', 'SupportTicket'],
  endpoints: (builder) => ({
    getSupportTickets: builder.query<SupportTicketsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/support?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => ({
        ...response,
        meta: response.meta,
        data: Array.isArray(response.data) ? response.data.map(normalizeTicket) : [],
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'SupportTicket' as const, id })),
              { type: 'SupportTickets', id: 'LIST' },
            ]
          : [{ type: 'SupportTickets', id: 'LIST' }],
    }),

    getSupportTicket: builder.query<SupportTicketResponse, { ticketId: string }>({
      query: ({ ticketId }) => `/support/${ticketId}`,
      transformResponse: (response: any) => ({
        ...response,
        data: normalizeTicket(response.data),
      }),
      providesTags: (result, error, { ticketId }) => [{ type: 'SupportTicket', id: ticketId }],
    }),

    updateSupportTicketStatus: builder.mutation<SupportTicketResponse, UpdateSupportStatusBody>({
      query: ({ ticketId, status }) => ({
        url: `/support/${ticketId}/status`,
        method: 'PATCH',
        body: { status: status.toUpperCase() },
      }),
      transformResponse: (response: any) => ({
        ...response,
        data: normalizeTicket(response.data),
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: 'SupportTickets', id: 'LIST' },
        { type: 'SupportTicket', id: ticketId },
      ],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketQuery,
  useUpdateSupportTicketStatusMutation,
} = supportApi;
