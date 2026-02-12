export type UserRole = "ADMIN" | "MANAGER" | "OPERATOR" | "USER";

export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string | null;
  role: UserRole;
}

export interface UserResponse {
  content: User[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}