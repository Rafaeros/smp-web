import { api } from "@/src/core/api/client";
import { SortState } from "@/src/core/components/data-display/datatable/DataTable";
import { Page } from "@/src/core/types/api";
import {
  DeviceBindingDTO,
  UpdateUserDeviceDTO,
  UserDeviceDetails,
  UserDeviceMap,
} from "../types";

export const userDeviceService = {
  getMyMap: async (): Promise<UserDeviceMap[]> => {
    const response = await api.get("/user-devices/map");
    return response as unknown as UserDeviceMap[];
  },

  bindDevice: async (dto: DeviceBindingDTO): Promise<UserDeviceMap> => {
    const response = await api.post("/user-devices", dto);
    return response as unknown as UserDeviceMap;
  },

  getDetails: async (id: number): Promise<UserDeviceDetails> => {
    const response = await api.get(`/user-devices/${id}`);
    return response as unknown as UserDeviceDetails;
  },

  getAllUserDevicesById: async (
    userId: number,
    page = 0,
    size = 10,
    sort?: SortState,
  ): Promise<Page<UserDeviceDetails>> => {
    const params: any = {
      page,
      size,
    };

    if (sort?.field) {
      params.sort = `${sort.field},${sort.direction}`;
    } else {
      params.sort = "id,desc";
    }
    const response = await api.get<Page<UserDeviceDetails>>(
      `/user-devices/${userId}/devices`,
      { params },
    );

    return response as unknown as Page<UserDeviceDetails>;
  },

  update: async (
    id: number,
    dto: UpdateUserDeviceDTO,
  ): Promise<UserDeviceDetails> => {
    const response = await api.patch(`/user-devices/${id}`, dto);
    return response as unknown as UserDeviceDetails;
  },

  async updateCoordinates(id: number, x: number, y: number): Promise<void> {
    await api.patch(`/user-devices/${id}`, {
      coordinateX: x,
      coordinateY: y,
    });
  },

  unbind: async (id: number): Promise<void> => {
    await api.delete(`/user-devices/${id}`);
  },
};
