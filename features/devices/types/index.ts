
export enum DeviceStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE'
}

export enum ProcessStage {
    PANEL_ASSEMBLY = "MONTAGEM PAINEL",
    BENCH_ASSEMBLY = "MONTAGEM BANCADA",
    SOLDERING = "SOLDA",
    QUALITY_CONTROL = "CONTROLE DE QUALIDADE",
    PACKAGING = "EMBALAGEM",
    TESTING = "TESTES"
}

export enum ProcessStatus {
    IDLE = 'PARADO',
    RUNNING = 'PRODUZINDO',
    PAUSED = 'PAUSADO',
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

export interface UpdateDeviceDTO {
  name?: string;
  processStage?: string;
  processStatus?: string;
  order?: string;
}