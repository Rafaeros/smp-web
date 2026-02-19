export enum ProcessStage {
  PANEL_ASSEMBLY = "PANEL_ASSEMBLY",
  BENCH_ASSEMBLY = "BENCH_ASSEMBLY",
  SOLDERING = "SOLDERING",
  QUALITY_CONTROL = "QUALITY_CONTROL",
  PACKAGING = "PACKAGING",
  TESTING = "TESTING",
}

export const ProcessStageLabels: Record<ProcessStage, string> = {
  [ProcessStage.PANEL_ASSEMBLY]: "Montagem Painel",
  [ProcessStage.BENCH_ASSEMBLY]: "Montagem Bancada",
  [ProcessStage.SOLDERING]: "Solda",
  [ProcessStage.QUALITY_CONTROL]: "Controle de Qualidade",
  [ProcessStage.PACKAGING]: "Embalagem",
  [ProcessStage.TESTING]: "Testes",
};

export enum DeviceStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}
export enum ProcessStatus {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
}

export const ProcessStatusLabels: Record<ProcessStatus, string> = {
  [ProcessStatus.IDLE]: "AGUARDANDO",
  [ProcessStatus.RUNNING]: "PRODUZINDO",
  [ProcessStatus.PAUSED]: "PAUSADO",
};


export interface AvailableDevice {
  id: number;
  macAddress: string;
  ipAddress: string;
}

export interface DeviceDetails {
  id: number;
  name: string;
  macAddress: string;
  ipAddress: string;
  lastSeen: string;
  status: DeviceStatus;
  processStage: string;
  processStatus: string;
  order?: string;
}
