import { api } from "@/src/core/api/client";
import { Page } from "@/src/core/types/pagination";
import { SortState } from "@/src/core/components/shared/datatable/DataTable";
import { Client, CreateClient } from "../types/client";

export interface ClientFilters {
  name?: string;
}

export const clientService = {
  create: async (client: CreateClient): Promise<Client> => {
    const { data } = await api.post<Client>("/clients", client);
    return data;
  },

  getAll: async (
    page = 0, 
    size = 10, 
    filters?: ClientFilters, 
    sort?: SortState
  ): Promise<Page<Client>> => {
    
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    if (filters?.name) {
      params.append("name", filters.name);
    }

    if (sort && sort.field) {
      params.append("sort", `${sort.field},${sort.direction}`);
    } else {
      params.append("sort", "name,asc");
    }

    const response = await api.get<Page<Client>>(`/clients?${params.toString()}`);
    return response.data;
  },

  getDetails: async (id: number): Promise<Client> => {
    const { data } = await api.get<Client>(`/clients/${id}`);
    return data;
  },

  deleteBatch: async (ids: number[]) => {
    await api.delete("/clients/batch", { data: ids });
  }
};