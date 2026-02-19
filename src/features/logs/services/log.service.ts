import { api } from "@/src/core/api/client";
import { SortState } from "@/src/core/components/data-display/datatable/DataTable";
import { APP_ROUTES } from "@/src/core/config/routes";
import { Page } from "@/src/core/types/pagination";
import { OrderStats } from "../../orders/types/orders";
import { ProductStats } from "../../products/types/product";
import { Log } from "../types/logs";

export interface LogFilters {
  orderId?: string;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
}

export const logService = {
  getAll: async (
    page = 0,
    size = 20,
    filters?: LogFilters,
    sort?: SortState,
  ): Promise<Page<Log>> => {
    const params: Record<string, any> = {
      page,
      size,
    };

    if (filters?.orderId) params.orderId = filters.orderId;
    if (filters?.deviceId) params.deviceId = filters.deviceId;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;

    if (sort && sort.field) {
      params.sort = `${sort.field},${sort.direction}`;
    } else {
      params.sort = "createdAt,desc";
    }

    const response = await api.get(APP_ROUTES.logs.list, { params });
    return response as unknown as Page<Log>;
  },

  getByOrder: async (
    orderId: number,
    page = 0,
    size = 20,
    sort?: SortState,
  ): Promise<Page<Log>> => {
    const params: any = { page, size };
    if (sort?.field) {
      params.sort = `${sort.field},${sort.direction}`;
    } else {
      params.sort = "createdAt,desc";
    }

    const response = await api.get(`/logs/order/${orderId}`, { params });
    return response as unknown as Page<Log>;
  },

  getOrderStats: async (orderId: number): Promise<OrderStats> => {
    const response = await api.get(`/logs/stats/order/${orderId}`);
    return response as unknown as OrderStats;
  },

  getByProduct: async (
    productId: number,
    page = 0,
    size = 20,
    sort?: SortState,
  ): Promise<Page<Log>> => {
    const params: any = { page, size };
    if (sort?.field) {
      params.sort = `${sort.field},${sort.direction}`;
    } else {
      params.sort = "createdAt,desc";
    }

    const response = await api.get(`/logs/product/${productId}`, { params });
    return response as unknown as Page<Log>;
  },

  getProductStats: async (productId: number): Promise<ProductStats> => {
    const response = await api.get(`/logs/stats/product/${productId}`);
    return response as unknown as ProductStats;
  },

  exportToCsv: async (): Promise<void> => {
    const response = await api.get('/logs/export', {
      responseType: 'blob',
    });

    const fileData = response.data !== undefined ? response.data : response;
    const url = window.URL.createObjectURL(new Blob([fileData], { type: 'text/csv;charset=utf-8;' }));
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_logs_producao.csv'); 
    
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
