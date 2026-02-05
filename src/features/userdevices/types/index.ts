import { DeviceStatus, ProcessStage, ProcessStatus } from "@/src/features/devices/types";

export interface DeviceBindingDTO {
  id: number;
  name: string;
  coordinateX: number;
  coordinateY: number;
}

export interface UserDeviceMap {
  id: number;
  name: string;
  macAddress: string;
  x: number;
  y: number;
  status: DeviceStatus;
}

export interface UserDeviceDetails {
  id: number;
  name: string;
  macAddress: string;
  ipAddress: string;
  status: DeviceStatus;
  process: ProcessStatus;
  stage: ProcessStage;
  lastSeen: string;
  coordinateX: number;
  coordinateY: number;
}

export interface UpdateUserDeviceDTO {
  name?: string;
  stage?: ProcessStage;
  order?: string;
}