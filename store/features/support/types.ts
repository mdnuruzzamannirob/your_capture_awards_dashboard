import type { SupportTicket, SupportTicketStatus } from '@/types';

export interface SupportListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SupportTicketsResponse {
  success: boolean;
  message: string;
  meta: SupportListMeta;
  data: SupportTicket[];
}

export interface SupportTicketResponse {
  success: boolean;
  message: string;
  data: SupportTicket;
}

export interface UpdateSupportStatusBody {
  ticketId: string;
  status: SupportTicketStatus;
}
