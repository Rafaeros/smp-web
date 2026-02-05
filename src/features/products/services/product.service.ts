import { api } from "@/src/core/api/client";
import { Page } from "@/src/core/types/pagination";
import { Product } from "../types/product";

export interface ProductFilters {
  code?: string;
  description?: string;
}

export interface SortState {
  field: string;
  direction: "asc" | "desc";
}

export const productService = {
  getAll: async (
    page = 0,
    size = 10,
    filters?: ProductFilters,
    sort?: SortState,
  ): Promise<Page<Product>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters?.code) params.append("code", filters.code);
    if (filters?.description) params.append("description", filters.description);
    if (sort && sort.field) {
      params.append("sort", `${sort.field},${sort.direction}`);
    } else {
      params.append("sort", "id,desc");
    }

    const response = await api.get<Page<Product>>(
      `/products?${params.toString()}`,
    );
    return response.data;
  },
};
