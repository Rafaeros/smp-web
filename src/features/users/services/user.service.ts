import { api } from "@/src/core/api/client";
import { SortState } from "@/src/core/components/data-display/datatable/DataTable";
import { CreateUser, UpdatePassword, UpdateUser, User, UserResponse } from "../types/user";

export interface UserFilters {
  username?: string;
  email?: string;
  role?: string;
}

export const userService = {
  create: async (dto: CreateUser): Promise<User> => {
    const response = await api.post("/users", dto);
    return response as unknown as User;
  },

  getAll: async (
    page: number,
    size: number,
    filters: UserFilters,
    sort?: SortState,
  ): Promise<UserResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters.username) params.append("username", filters.username);
    if (filters.email) params.append("email", filters.email);
    if (filters.role) params.append("role", filters.role);

    if (sort) {
      params.append("sort", `${sort.field},${sort.direction}`);
    }
    const data = await api.get<UserResponse>(`/users?${params.toString()}`);

    return data as unknown as UserResponse;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response as unknown as User;
  },

  update: async (id: number, dto: UpdateUser): Promise<User> => {
    const response = await api.patch(`/users/${id}`, dto);
    return response as unknown as User;
  },

  updatePassword: async (id: number, dto: UpdatePassword): Promise<void> => {
    await api.patch(`/users/${id}/change-password`, dto);
  },

  delete: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
