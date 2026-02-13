export type UserRole = "ADMIN" | "MANAGER" | "SUPERVISOR" | "OPERATOR";

export const roleDisplayMap: Record<UserRole, string> = {
  ADMIN: "ADMINISTRADOR",
  MANAGER: "GERENTE",
  SUPERVISOR: "SUPERVISOR",
  OPERATOR: "OPERADOR",
};

export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string | null;
  role: UserRole;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
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

export interface UpdatePassword {
  currentPassword?: string;
  newPassword: string;
  confirmNewPassword?: string;
}