import { api } from "@/src/core/api/client";
import { AvailableDevice } from "../types";

export const deviceService = {
  getAvailableDevices: async (): Promise<AvailableDevice[]> => {
    const { data } = await api.get<AvailableDevice[]>("/devices/available");
    return data;
  },
};
