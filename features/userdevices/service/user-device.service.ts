import { api } from "@/core/api/client";
import { UserDeviceMap, DeviceBindingDTO, UserDeviceDetails, UpdateUserDeviceDTO } from "../types";

export const userDeviceService = {
  getMyMap: async (): Promise<UserDeviceMap[]> => {
    const { data } = await api.get<UserDeviceMap[]>('/user-devices/my-map');
    return data;
  },

  bindDevice: async (dto: DeviceBindingDTO): Promise<UserDeviceMap> => {
    const { data } = await api.post<UserDeviceMap>('/user-devices/bind', dto);
    return data;
  },

  getDetails: async (id: number): Promise<UserDeviceDetails> => {
    const { data } = await api.get<UserDeviceDetails>(`/user-devices/${id}`);
    return data;
  },

  update: async (id: number, dto: UpdateUserDeviceDTO): Promise<UserDeviceDetails> => {
    const { data } = await api.patch<UserDeviceDetails>(`/user-devices/${id}`, dto);
    return data;
  },

  unbind: async (id: number): Promise<void> => {
    await api.delete(`/user-devices/${id}`);
  }

};