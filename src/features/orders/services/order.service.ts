import { api } from "@/src/core/api/client";
import { SortState } from "@/src/core/components/data-display/datatable/DataTable";
import { Page } from "@/src/core/types/pagination";
import { Order, OrderSummary, UpdateOrder } from "../types/orders";

export interface OrderFilters {
  code?: string;
  productCode?: string;
  clientId?: string;
  status?: string;
  startDeliveryDate?: string;
  endDeliveryDate?: string;
}

export const orderService = {

  create : async (order: Order): Promise<Order> => {
    const response = await api.post("/orders", order);
    return response as unknown as Order;
  },

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

  update: async (id: number, data: UpdateOrder): Promise<any> => {
    const cleanData = {
      deliveryDate: data.deliveryDate,
      totalQuantity: data.totalQuantity,
      producedQuantity: data.producedQuantity
    };
    
    return await api.patch(`/orders/${id}`, cleanData);
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

  exportToCsv: async (): Promise<void> => {
    const response = await api.get('/orders/export', {
      responseType: 'blob',
    });

    const fileData = response.data !== undefined ? response.data : response;
    const url = window.URL.createObjectURL(new Blob([fileData], { type: 'text/csv;charset=utf-8;' }));
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_ordens.csv'); 
    
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
