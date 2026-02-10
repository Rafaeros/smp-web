import { api } from "@/src/core/api/client";
import { UserDeviceMap, DeviceBindingDTO, UserDeviceDetails, UpdateUserDeviceDTO } from "../types";

export const userDeviceService = {
  getMyMap: async (): Promise<UserDeviceMap[]> => {
    const response = await api.get('/user-devices/map');
    return response as unknown as UserDeviceMap[];
  },

  bindDevice: async (dto: DeviceBindingDTO): Promise<UserDeviceMap> => {
    const response = await api.post('/user-devices', dto);
    return response as unknown as UserDeviceMap;
  },

  getDetails: async (id: number): Promise<UserDeviceDetails> => {
    const response = await api.get(`/user-devices/${id}`);
    return response as unknown as UserDeviceDetails;
  },

  update: async (id: number, dto: UpdateUserDeviceDTO): Promise<UserDeviceDetails> => {
    const response = await api.patch(`/user-devices/${id}`, dto);
    return response as unknown as UserDeviceDetails;
  },

  unbind: async (id: number): Promise<void> => {
    await api.delete(`/user-devices/${id}`);
  }
};