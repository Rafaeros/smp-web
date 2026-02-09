import { api } from "@/src/core/api/client";
import { SortState } from "@/src/core/components/shared/datatable/DataTable";
import { Page } from "@/src/core/types/pagination";
import { Client, CreateClient } from "../types/client";

export interface ClientFilters {
  name?: string;
}

export const clientService = {
  create: async (client: CreateClient): Promise<Client> => {
    const response = await api.post("/clients", client, { flash: true });
    return response as unknown as Client;
  },

  getAll: async (
    page = 0,
    size = 10,
    filters?: ClientFilters,
    sort?: SortState,
  ): Promise<Page<Client>> => {
    const params: Record<string, any> = {
      page,
      size,
    };

    if (filters?.name) {
      params.name = filters.name;
    }

    if (sort && sort.field) {
      params.sort = `${sort.field},${sort.direction}`;
    } else {
      params.sort = "name,asc";
    }

    const response = await api.get("/clients", { params });
    return response as unknown as Page<Client>;
  },

  getDetails: async (id: number): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response as unknown as Client;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  }
};
