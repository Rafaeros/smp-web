import { api } from "@/src/core/api/client";
import { AvailableDevice } from "../types";

export const deviceService = {
  getAvailableDevices: async (): Promise<AvailableDevice[]> => {
    const response = await api.get<AvailableDevice[]>("/devices/available");
    return response as unknown as AvailableDevice[];
  },
};
