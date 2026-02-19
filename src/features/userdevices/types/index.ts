import {
  DeviceStatus,
  ProcessStage,
  ProcessStatus,
} from "@/src/features/devices/types";

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
  process: ProcessStatus;
}

export interface UserDeviceDetails {
  id: number;
  name: string;
  macAddress: string;
  ipAddress: string;
  status: DeviceStatus;
  process: ProcessStatus;
  stage?: ProcessStage;
  code?: string;
  orderId?: number;
  lastSeen: string;
  coordinateX: number;
  coordinateY: number;
}

export interface UpdateUserDeviceDTO {
  name?: string;
  processStage?: ProcessStage;
  orderId?: number;
}
