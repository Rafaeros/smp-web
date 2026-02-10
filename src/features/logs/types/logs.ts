
export interface Log {
    id: number;
    createdAt: string;
    cycleTime: number;
    quantityProduced: number;
    pausedTime: number;
    order?: {id:number; code: string},
    device?: {id:number; macAdress:string}
}