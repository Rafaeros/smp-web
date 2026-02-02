import { api } from "@/core/api/client";
import { AvailableDevice } from "@/features/userdevices/types";

export const deviceService = {
  getAvailableDevices: async (): Promise<AvailableDevice[]> => {
    const { data } = await api.get<AvailableDevice[]>("/devices/available");
    return data;
  },
};
