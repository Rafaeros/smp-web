
export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export interface AvailableDevice {
  id: number;
  macAddress: string;
  ipAddress: string;
}

export interface DeviceBindingDTO {
  id: number;
  name: string;
  coordinateX: number;
  coordinateY: number;
}

export interface UserDevice {
  deviceId: number;
  name: string;
  macAddress: string;
  ipAddress: string;
  lastSeen: string;
  coordinateX: number;
  coordinateY: number;
  status: DeviceStatus;
}