import { api } from "@/src/core/api/client";
import { SortState } from "@/src/core/components/data-display/datatable/DataTable";
import { Page } from "@/src/core/types/pagination";
import { Order, OrderSummary } from "../types/orders";

export interface OrderFilters {
  code?: string;
  productCode?: string;
  clientId?: string;
  status?: string;
  startDeliveryDate?: string;
  endDeliveryDate?: string;
}

export const orderService = {
  getAll: async (
    page: number,
    size: number,
    filters?: OrderFilters,
    sort?: SortState,
  ): Promise<Page<Order>> => {
    const params: Record<string, any> = {
      page,
      size,
    };

    if (filters) {
      if (filters.code) params.code = filters.code;
      if (filters.productCode) params.productCode = filters.productCode;
      if (filters.clientId) params.clientId = filters.clientId;
      if (filters.status && filters.status !== "ALL") {
        params.status = filters.status;
      }
      if (filters.startDeliveryDate)
        params.startDeliveryDate = filters.startDeliveryDate;
      if (filters.endDeliveryDate)
        params.endDeliveryDate = filters.endDeliveryDate;
    }

    if (sort?.field) {
      params.sort = `${sort.field},${sort.direction}`;
    }

    const response = await api.get<Page<Order>>("/orders", { params });
    return response as unknown as Page<Order>;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response as unknown as Order;
  },

  getSummary: async (query: string): Promise<Page<OrderSummary>> => {
    const params = {
      page: 0,
      size: 10,
      code: query 
    };
    
    const response = await api.get<Page<OrderSummary>>("/orders/summary", { params });
    return response as unknown as Page<OrderSummary>;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },

  syncFromErp: async (filter: any, force: boolean = false) => {
    const response = await api.post("/orders/sync", null, {
      params: { ...filter, force },
    });

    return response;
  },
};
