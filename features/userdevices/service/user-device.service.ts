import { api } from "@/core/api/client";
import { UserDevice, AvailableDevice, DeviceBindingDTO } from "../types";

export const userDeviceService = {
  getMyMap: async (): Promise<UserDevice[]> => {
    const { data } = await api.get<UserDevice[]>('/user-devices/my-map');
    return data;
  },

  getAvailableDevices: async (): Promise<AvailableDevice[]> => {
    const { data } = await api.get<AvailableDevice[]>('/devices/available');
    return data;
  },

  bindDevice: async (dto: DeviceBindingDTO): Promise<UserDevice> => {
    const { data } = await api.post<UserDevice>('/user-devices/bind', dto);
    return data;
  }
};