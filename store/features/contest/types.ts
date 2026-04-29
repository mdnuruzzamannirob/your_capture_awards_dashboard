export interface GetContestsResponse {
  contests: any[];
  count: number;
  page: number;
  limit: number;
}

export interface ContestStats {
  running: number;
  upcoming: number;
  completed: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
