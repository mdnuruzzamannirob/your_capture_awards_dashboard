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

export interface RemoveReportedPhotoBody {
  reportId: string;
  reason?: string;
}

export interface RemoveReportedPhotoResponse {
  success: boolean;
  message: string;
  data: {
    userPhotoId: string;
    ownerId: string;
    affectedContestIds: string[];
    affectedContestPhotoIds: string[];
    resetBannerContestIds: string[];
    resolvedReportCount: number;
  };
}

export interface ReviewReportBody {
  reportId: string;
  status: Extract<ReportStatus, 'ACTION_TAKEN' | 'DISMISSED'>;
  resolutionNote?: string;
}
