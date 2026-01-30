import { api } from "@/core/api/client";
import { DeviceDetails, UpdateDeviceDTO } from "../types";


export const deviceService = {
    getById: async (id: number): Promise<DeviceDetails> => {
        const { data } = await api.get<DeviceDetails>(`/devices/${id}`);
        return data;
    },

    update: async (id: number, dto: UpdateDeviceDTO): Promise<DeviceDetails> => {
        const { data } = await api.patch<DeviceDetails>(`/devices/${id}`, dto);
        return data;
    }
}