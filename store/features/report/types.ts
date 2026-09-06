import type { Report, ReportStatus } from '@/types';

export interface ReportListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ReportsResponse {
  success: boolean;
  message: string;
  meta: ReportListMeta;
  data: Report[];
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data: Report;
}

export interface ReviewReportBody {
  reportId: string;
  status: Extract<ReportStatus, 'ACTION_TAKEN' | 'DISMISSED'>;
  resolutionNote?: string;
}
