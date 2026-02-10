import { api } from "@/src/core/api/client";
import { SortState } from "@/src/core/components/shared/datatable/DataTable";
import { Page } from "@/src/core/types/pagination";
import { Log } from "../types/logs";
import { APP_ROUTES } from "@/src/core/config/routes";

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
};
