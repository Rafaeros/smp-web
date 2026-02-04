import { Page } from "@/core/types/pagination";
import { Product } from "../types/product";
import { api } from "@/core/api/client";

export const productService = {
  getAll: async (page = 0, size = 10, searchTerm = ""): Promise<Page<Product>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    const response = await api.get<Page<Product>>(`/products?${params}`);
    return response.data;
  },
};
