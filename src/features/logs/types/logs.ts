
export interface Log {
    id: number;
    createdAt: string;
    cycleTime: number;
    quantityProduced: number;
    quantityPaused: number;
    pausedTime: number;
    totalTime: number;
    device?: {id: number; macAddress: string}
    order?: {id: number; code: string},
}