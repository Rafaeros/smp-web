import { api } from "@/src/core/api/client";
import { Page } from "@/src/core/types/pagination";
import { CreateProduct, Product, UpdateProduct } from "../types/product";

export interface ProductFilters {
  code?: string;
  description?: string;
}

export interface SortState {
  field: string;
  direction: "asc" | "desc";
}

export const productService = {
  create: async (data: CreateProduct): Promise<Product> => {
    const response = await api.post("/products", data);
    return response as unknown as Product;
  },

  getAll: async (
    page = 0,
    size = 10,
    filters?: ProductFilters,
    sort?: SortState,
  ): Promise<Page<Product>> => {
    const params: any = {
      page,
      size,
    };
    if (filters?.code) params.code = filters.code;
    if (filters?.description) params.description = filters.description;
    if (sort?.field) {
      params.sort = `${sort.field},${sort.direction}`;
    } else {
      params.sort = "id,desc";
    }
    const response = await api.get<Page<Product>>("/products", { params });

    return response as unknown as Page<Product>;
  },

  getSummary: async (text: string): Promise<Page<Product>> => {
    const params = {
      query: text,
      page: 0,
      size: 20,
    };

    const response = await api.get("/products/summary", { params });
    return response as unknown as Page<Product>;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response as unknown as Product;
  },

  update: async (id: number, data: UpdateProduct): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response as unknown as Product;
  },

  delete: async (id: number): Promise<any> => {
    await api.delete(`/products/${id}`);
  },

exportToCsv: async (): Promise<void> => {
    const response = await api.get('/products/export', {
      responseType: 'blob',
    });
    const fileData = response.data !== undefined ? response.data : response;
    const url = window.URL.createObjectURL(new Blob([fileData], { type: 'text/csv;charset=utf-8;' }));
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_produtos.csv'); 
    
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
