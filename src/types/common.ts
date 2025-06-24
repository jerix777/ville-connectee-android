
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ListResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  success: boolean;
}
