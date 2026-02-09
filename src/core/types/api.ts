export type Severity = "SUCCESS" | "INFO" | "WARNING" | "ERROR";

export interface ApiResponse<T = any> {
  timestamp: string;
  message?: string;
  severity: Severity;
  data?: T;
  errors?: Record<string, string>;
}

export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}