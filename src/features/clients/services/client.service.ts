import { api } from "@/src/core/api/client";
import { Page } from "@/src/core/types/pagination";
import { SortState } from "@/src/core/components/shared/datatable/DataTable"; // Importe o SortState
import { Client, CreateClient } from "../types/client";

// Definimos e Exportamos a interface de filtros aqui para o componente usar
export interface ClientFilters {
  name?: string;
}

export const clientService = {
  // Criação (Mantido)
  create: async (client: CreateClient): Promise<Client> => {
    const { data } = await api.post<Client>("/clients", client);
    return data;
  },

  // Listagem (Atualizado para aceitar filters e sort)
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

    // Filtro por nome (se existir)
    if (filters?.name) {
      params.append("name", filters.name);
    }

    // Ordenação dinâmica
    if (sort && sort.field) {
      params.append("sort", `${sort.field},${sort.direction}`);
    } else {
      // Ordenação padrão caso o usuário não clique em nada
      params.append("sort", "name,asc");
    }

    const response = await api.get<Page<Client>>(`/clients?${params.toString()}`);
    return response.data;
  },

  // Detalhes (Mantido)
  getDetails: async (id: number): Promise<Client> => {
    const { data } = await api.get<Client>(`/clients/${id}`);
    return data;
  },

  // Exclusão em Massa (Adicionado para funcionar com o botão de excluir da lista)
  deleteBatch: async (ids: number[]) => {
    // Envia os IDs no corpo da requisição DELETE
    await api.delete("/clients/batch", { data: ids });
  }
};