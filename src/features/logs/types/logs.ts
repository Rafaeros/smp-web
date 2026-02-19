
export interface Log {
    id: number;
    createdAt: string;
    cycleTime: number;
    quantityProduced: number;
    quantityPaused: number;
    pausedTime: number;
    totalTime: number;
    processStage: string;
    device?: {id: number; macAddress: string}
    order?: {id: number; code: string},
}