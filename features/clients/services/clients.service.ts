import { api } from "@/core/api/client";
import { Page } from "@/core/types/pagination";
import { Client, CreateClient } from "../types/client";

export const clientService = {
  create: async (client: CreateClient): Promise<Client> => {
    const { data } = await api.post<Client>("/clients", client);
    return data;
  },

  getAll: async (page = 0, size = 10, name = ""): Promise<Page<Client>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    const response = await api.get<Page<Client>>(`/clients?${params}`);
    return response.data;
  },

  getDetails: async (id: number): Promise<Client> => {
    const { data } = await api.get<Client>(`/clients/${id}`);
    return data;
  },
};
